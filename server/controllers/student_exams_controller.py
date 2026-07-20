from datetime import datetime, timedelta, timezone
import threading
from sqlalchemy.orm import Session
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.dtos.student_exam_dto import StudentExamDTO
from server.exceptions.exceptions import CleverCheckBaseError
from server.services.jwt_student_service import get_student_data
from server.services.student_exam_service import StudentExamService
from server.services.update_grades_service import UpdateGradesService
from server.repositories.student_exam_repository import StudentExamRepository
from server.repositories.student_answer_repository import StudentAnswerRepository
from server.repositories.question_repository import QuestionRepository
from server.repositories.teacher_answer_repository import TeacherAnswerRepository
from server.models.student_exams import Base
from server.services.exam_service import ExamService
from server.repositories.exam_repository import ExamRepository
from server.models import StudentExam
from server.db_connection import SessionLocal


from server.db_connection import SessionLocal

session = SessionLocal()

repo = StudentExamRepository(session)
student_answer_repo = StudentAnswerRepository(session)
question_repo = QuestionRepository(session)
teacher_answer_repo = TeacherAnswerRepository(session)


#  שינוי סטטוס מיידי ל-Submitted — בלי ציונים
#  הפעלת חישוב ציונים ברקע (thread נפרד)

def submit_student_exam(student_exam_id: int) -> bool:
    session = SessionLocal()

    try:
        # שינוי סטטוס בצורה אטומית:
        # רק מבחן שעדיין InProgress יעבור ל-Submitted
        updated_rows = session.query(StudentExam).filter(
            StudentExam.id == student_exam_id,
            StudentExam.status == "InProgress"
        ).update(
            {
                StudentExam.status: "Submitted"
            },
            synchronize_session=False
        )

        session.commit()

        # אם לא השתנה כלום:
        # המבחן כבר Submitted או לא קיים
        if updated_rows == 0:
            return False

        # רק מי שביצע את שינוי הסטטוס מפעיל חישוב
        threading.Thread(
            target=_calculate_grades_async,
            args=(student_exam_id,),
            daemon=True
        ).start()

        return True

    except Exception as e:
        print("submit_student_exam error:", e)
        session.rollback()
        raise

    finally:
        session.close()


def _build_grades_service(new_session):
    """יוצר UpdateGradesService עם session עצמאי (thread-safe)"""
    return UpdateGradesService(
        student_answer_repo=StudentAnswerRepository(new_session),
        question_repo=QuestionRepository(new_session),
        teacher_answer_repo=TeacherAnswerRepository(new_session),
        student_exam_repo=StudentExamRepository(new_session),
        session=new_session,
    )


def _calculate_grades_async(student_exam_id: int):
    """חישוב ציונים ברקע — רץ ב-thread נפרד עם session משלו"""
    bg_session = SessionLocal()
    try:
        grades_service = _build_grades_service(bg_session)
        student_exam_service = StudentExamService(StudentExamRepository(bg_session))

        # 1. חישוב ציונים
        student_exam_service.update_exam_grades(student_exam_id, grades_service)

        # 2. שינוי סטטוס ל-Checked (נבדק)
        exam = bg_session.get(StudentExam, student_exam_id)
        if exam:
            exam.status = 'Checked'
            bg_session.commit()
            print(f"[GRADES BG] מבחן {student_exam_id} נבדק בהצלחה")
    except Exception as e:
        print(f"[GRADES BG] שגיאה בחישוב ציונים למבחן {student_exam_id}: {e}")
        bg_session.rollback()
    finally:
        bg_session.close()


service = StudentExamService(repo)
grades_service = _build_grades_service(session)
exam_service = ExamService(ExamRepository(session))

student_exams_blueprint = Blueprint('student_exams', __name__)


def _to_utc_iso(dt):
    """Convert a datetime to ISO string with Z suffix for consistent frontend parsing."""
    if not dt:
        return None
    if dt.tzinfo is None:
        # Naive datetime was stored — treat as UTC
        return dt.isoformat() + 'Z'
    # Aware datetime — convert to UTC and format
    return dt.astimezone(timezone.utc).isoformat()


@student_exams_blueprint.route('', methods=['POST'])
def add_student_exam():
    dto = StudentExamDTO(**request.get_json())
    service.add_student_exam(dto)
    return jsonify({'message': 'StudentExam added'}), 201


@student_exams_blueprint.route('', methods=['GET'])
def get_student_exams():
    """החזרת מבחנים לתלמיד — מסונן לפי כיתה מה-token.
    מבחן שהוגש/נבדק יוחזר עם computedStatus=Closed."""
    data = get_student_data()
    if not data:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = data.get('student_id')
    class_id = data.get('class_id')

    if not student_id or not class_id:
        return jsonify({"error": "Unauthorized"}), 401

    items = exam_service.get_exams_with_status(student_id, class_id)

    return jsonify([
        {
            'id': item['exam'].id,
            'examName': item['exam'].exam_name,
            'teacherID': item['exam'].teacher_id,
            'subject': item['exam'].subject.subject_name if item['exam'].subject else None,
            'startTime': item['exam'].start_time.isoformat() if item['exam'].start_time else None,
            'endTime': item['exam'].end_time.isoformat() if item['exam'].end_time else None,
            'durationMinutes': item['exam'].duration_minutes,
            'status': item['exam'].status,
            'computedStatus': item['computedStatus'],
            'studentExamStatus': item['studentExamStatus'],
        }
        for item in items
    ])


@student_exams_blueprint.route('/student/data', methods=['GET'])
def get_student_my_data():
    """החזרת כל המבחנים הסגורים עם ציונים, ממוצע כיתתי, והתפלגות — בקריאה אחת."""
    data = get_student_data()
    if not data:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = data.get('student_id')
    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        result = service.get_student_data_for_my_data_page(student_id)
        return jsonify(result), 200
    except Exception as e:
        print("ERROR get_student_my_data:", repr(e))
        return jsonify({"error": "Internal server error"}), 500


@student_exams_blueprint.route('/<int:student_exam_id>', methods=['PUT'])
def update_student_exam(student_exam_id):
    dto = StudentExamDTO(**request.get_json())
    service.update_student_exam(student_exam_id, dto)
    return jsonify({'message': 'StudentExam updated'})


@student_exams_blueprint.route('/<int:student_exam_id>', methods=['DELETE'])
def delete_student_exam(student_exam_id):
    service.delete_student_exam(student_exam_id)
    return jsonify({'message': 'StudentExam deleted'})


@student_exams_blueprint.route('/<int:student_exam_id>/finish', methods=['POST'])
def finish(student_exam_id):
    # 1. וידוא שהמבחן קיים
    exam = repo.get_by_id(student_exam_id)
    if not exam:
        return jsonify({
            "success": False,
            "message": "לא נמצא מבחן תלמיד"
        }), 404
    # 2. מניעת שליחה כפולה
    if exam.status == "Submitted":
        return jsonify({
            "success": True,
            "message": "המבחן כבר נשלח",
            "data": {
                "id": exam.id,
                "status": exam.status,
            }
        }), 200
    # 3. שינוי סטטוס מיידי ל-Submitted — בלי ציונים
    #  הפעלת חישוב ציונים ברקע (thread נפרד)
    submit_student_exam(student_exam_id)

    return jsonify({
        "success": True,
        "message": "המבחן נשלח לבדיקה",
        "data": {
            "id": exam.id,
            "status": exam.status,
        }
    }), 200


@student_exams_blueprint.route('/exam/<int:exam_id>', methods=['GET'])
def get_student_exam(exam_id):
    data = get_student_data()

    if not data:
        return jsonify({'message': 'Student not found'}), 404

    student_id = data.get('student_id')

    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    student_exam = service.get_student_exam(student_id, exam_id)

    # יצירה ראשונית
    if not student_exam:
        try:
            student_exam = service.create_student_exam(
                student_id=student_id,
                exam_id=exam_id,
                status='NotStarted'
            )
        except Exception as e:
            return jsonify({"error": f"Failed to create student exam: {str(e)}"}), 500

    exam = student_exam.exam
    if not exam:
        return jsonify({"error": "Exam not found"}), 404

    print(
        f"[DEBUG] Exam ID={exam.id}, Status={exam.status}, Duration={exam.duration_minutes}, Questions={len(exam.questions) if exam.questions else 0}")

    if student_exam.status == 'NotStarted':
        now_utc = datetime.utcnow()
        student_exam.status = 'InProgress'
        student_exam.start_time = now_utc
        # Set personal deadline in UTC: start time + exam duration
        duration = exam.duration_minutes or 60
        student_exam.end_time = now_utc + timedelta(minutes=duration)
        service.repo.session.commit()

    return jsonify({
        "exam": {
            "id": exam.id,
            "name": exam.exam_name,
            "subject": exam.subject.subject_name if exam.subject else None,
            "status": exam.status,
            "durationMinutes": exam.duration_minutes,
            "startTime": exam.start_time,
            "endTime": exam.end_time,
        },

        "studentExam": {
            "id": student_exam.id,
            "score": student_exam.score,
            "status": student_exam.status,
            "startTime": _to_utc_iso(student_exam.start_time),
            "endTime": _to_utc_iso(student_exam.end_time),
        },

        "questions": [
            {
                "id": q.id,
                "text": q.question_text,
                "typeId": q.question_type_id,
                "maxScore": q.max_score,
                "questionNumber": q.question_number,

                "options": [
                    {
                        "id": o.id,
                        "text": o.option_text
                    }
                    for o in q.options
                ] if q.question_type_id == 1 else []
            }
            for q in exam.questions
        ],

        "answers": [
            {
                "questionId": a.question_id,
                "answerText": a.answer_text,
                "selectedOptionId": a.selected_option_id,
                "score": a.score
            }
            for a in student_exam.answers
        ],
        "serverTime": datetime.utcnow().isoformat() + 'Z'
    })


@student_exams_blueprint.route('/exam/<int:exam_id>/scores-distribution', methods=['GET'])
def get_scores_distribution(exam_id):
    """התפלגות ציונים של כלל התלמידים במבחן (לפי כיתות המבחן)."""
    try:
        data = get_student_data()
        if not data:
            return jsonify({"error": "Unauthorized"}), 401

        student_id = data.get('student_id')
        if not student_id:
            return jsonify({"error": "Unauthorized"}), 401

        distribution = service.get_scores_distribution(exam_id)
        return jsonify(distribution), 200
    except Exception as e:
        print("ERROR get_scores_distribution:", repr(e))
        return jsonify({"error": "Internal server error"}), 500


@student_exams_blueprint.route('/exam/<int:exam_id>/results', methods=['GET'])
def get_results_by_exam(exam_id):
    try:
        data = get_student_data()
        if not data:
            return jsonify({"error": "Unauthorized"}), 401

        student_id = data.get('student_id')
        if not student_id:
            return jsonify({"error": "Unauthorized"}), 401

        student_exam = service.get_full_exam(student_id, exam_id)
        if not student_exam:
            return jsonify({"error": "Student exam not found"}), 404

        try:
            return jsonify(service.get_results(student_exam.id))
        except CleverCheckBaseError:
            return jsonify({"error": "Student exam not found"}), 404
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500
    except Exception as e:
        print("ERROR:", repr(e))
        raise


@student_exams_blueprint.route('/<int:student_exam_id>/results', methods=['GET'])
def get_results(student_exam_id):
    try:
        return jsonify(service.get_results(student_exam_id))
    except CleverCheckBaseError:
        return jsonify({"error": "Student exam not found"}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@student_exams_blueprint.route('/<int:student_exam_id>/answers', methods=['POST'])
def save_answer(student_exam_id):
    data = request.get_json()
    question_id = data.get("questionId")
    answer_text = data.get("answerText")
    selected_option_id = data.get("selectedOptionId")

    if question_id is None:
        return jsonify({"error": "questionId is required"}), 400

    try:
        service.save_answer(
            student_exam_id=student_exam_id,
            question_id=question_id,
            answer_text=answer_text,
            selected_option_id=selected_option_id
        )

        return jsonify({"message": "Answer saved"}), 200

    except Exception as e:
        session.rollback()
        return jsonify({"error": "Save failed"}), 500

    return jsonify({"message": "Answer saved"}), 200
