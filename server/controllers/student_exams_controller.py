from datetime import datetime

from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.dtos.student_exam_dto import StudentExamDTO
from server.exceptions.exceptions import CleverCheckBaseError
from server.services.jwt_service import get_student_data
from server.services.student_exam_service import StudentExamService
from server.repositories.student_exam_repository import StudentExamRepository
from server.models.student_exams import Base

engine = create_engine(
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

repo = StudentExamRepository(session)
service = StudentExamService(repo)

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
    result = service.update_exam_grades(student_exam_id)

    if not result:
        return jsonify({
            "success": False,
            "message": "לא נמצא מבחן תלמיד"
        }), 404

    return jsonify({
        "success": True,
        "message": "המבחן נשמר בהצלחה",
        "data": result
    }), 200

@student_exams_blueprint.route('/exam/<int:exam_id>', methods=['GET'])
def get_student_exam(exam_id):
    data = get_student_data()
    if not data:
        return jsonify({'message': 'StudentExam not found'}), 404
    student_id = data.get('student_id')

    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    student_exam = service.get_full_exam(student_id, exam_id)
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
    print("DATA:", data)
    print("STUDENT_EXAM_ID:", student_exam_id)
    question_id = data.get("questionId")
    answer_text = data.get("answerText")
    selected_option_id = data.get("selectedOptionId")

    if question_id is None:
        return jsonify({"error": "questionId is required"}), 400

    service.save_answer(
        student_exam_id=student_exam_id,
        question_id=question_id,
        answer_text=answer_text,
        selected_option_id=selected_option_id
    )

    return jsonify({"message": "Answer saved"}), 200