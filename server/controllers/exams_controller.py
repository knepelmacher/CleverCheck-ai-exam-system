from datetime import datetime

from flask import Blueprint, request, jsonify


from server.dtos.exams_dto import ExamDTO
from server.services.exam_service import ExamService
from server.repositories.exam_repository import ExamRepository
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models.exams import Base
from server.services.jwt_service import get_student_data
from server.services.jwt_teacher_service import get_teacher_data

engine = create_engine(
    'mssql+pyodbc://localhost/GradexDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

repo = ExamRepository(session)
service = ExamService(repo)

exams_blueprint = Blueprint('exams', __name__)


def _parse_datetime(value: str) -> datetime | None:
    """Parse ISO datetime string from the frontend."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None


@exams_blueprint.route('', methods=['POST'])
def add_exam():
    data = request.get_json()

    # Get teacher_id from JWT cookie
    teacher_data = get_teacher_data()
    teacher_id = teacher_data.get('teacher_id') if teacher_data else None

    if not teacher_id:
        return jsonify({"error": "Unauthorized"}), 401

    dto = ExamDTO(
        exam_name=data.get('name', ''),
        teacher_id=teacher_id,
        subject_id=data.get('subject_id', 1),
        start_time=_parse_datetime(data.get('startTime')),
        end_time=_parse_datetime(data.get('endTime')),
        duration_minutes=data.get('duration_minutes', 60),
        status=data.get('status', 'draft'),
        class_ids=data.get('classIds', []),
        questions=data.get('questions', []),
    )
    service.add_exam(dto)
    return jsonify({'message': 'Exam added'}), 201


@exams_blueprint.route('', methods=['GET'])
def get_exams():
    data = service.get_all_exams()
    return jsonify([
        {
            'id': e.id,
            'examName': e.exam_name,
            'teacherID': e.teacher_id,
            'subjectID': e.subject_id,
            'startTime': e.start_time,
            'endTime': e.end_time,
            'durationMinutes': e.duration_minutes,
            'status': e.status
        }
        for e in data
    ])


@exams_blueprint.route('/<int:exam_id>', methods=['GET'])
def get_student_exam(exam_id):
    student_id = get_student_data().get('student_id')

    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    exam = service.get_exam_by_id(exam_id)
    questions = service.get_questions(exam_id)

    student_exam = service.get_or_create_student_exam(student_id, exam_id)

    answers = service.get_answers(student_exam.id)

    return jsonify({
        "exam": {
            "id": exam.id,
            "examName": exam.exam_name,
            "subjectID": exam.subject_id,
            "status": exam.status,
            "durationMinutes": exam.duration_minutes,
            "startTime": exam.start_time,
            "endTime": exam.end_time
        },
        "studentExam": {
            "studentExamId": student_exam.id,
            "endTime": student_exam.end_time
        },
        "serverTime": datetime.utcnow().isoformat(),
        "questions": questions,
        "answers": answers
    })

@exams_blueprint.route('/<int:exam_id>', methods=['PUT'])
def update_exam(exam_id):
    dto = ExamDTO(**request.get_json())
    service.update_exam(exam_id, dto)
    return jsonify({'message': 'Exam updated'})


@exams_blueprint.route('/<int:exam_id>', methods=['DELETE'])
def delete_exam(exam_id):
    service.delete_exam(exam_id)
    return jsonify({'message': 'Exam deleted'})