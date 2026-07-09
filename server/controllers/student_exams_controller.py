from datetime import datetime
import threading
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.dtos.student_exam_dto import StudentExamDTO
from server.exceptions.exceptions import CleverCheckBaseError
from server.services.jwt_service import get_student_data
from server.services.student_exam_service import StudentExamService
from server.services.update_grades_service import UpdateGradesService
from server.repositories.student_exam_repository import StudentExamRepository
from server.repositories.student_answer_repository import StudentAnswerRepository
from server.repositories.question_repository import QuestionRepository
from server.repositories.teacher_answer_repository import TeacherAnswerRepository
from server.models.student_exams import Base
from server.models import StudentExam
from server.db_connection import SessionLocal


engine = create_engine(
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

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
    bg_session = Session()
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

student_exams_blueprint = Blueprint('student_exams', __name__)


@student_exams_blueprint.route('', methods=['POST'])
def add_student_exam():
    dto = StudentExamDTO(**request.get_json())
    service.add_student_exam(dto)
    return jsonify({'message': 'StudentExam added'}), 201


@student_exams_blueprint.route('', methods=['GET'])
def get_student_exams():
    data = service.get_all_student_exams()
    return jsonify([
        {
            'id': x.id,
            'score': x.score
        } for x in data
    ])


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
    #2. מניעת שליחה כפולה
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
        student_exam = service.create_student_exam(
            student_id=student_id,
            exam_id=exam_id,
            status='NotStarted'
        )

    exam = student_exam.exam

    if student_exam.status == 'NotStarted':
        student_exam.status = 'InProgress'
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
            "serverTime": datetime.now()
        })

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