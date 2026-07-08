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
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
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
    """רשימת מבחנים עבור הסטודנט המחובר, כולל computedStatus."""
    student_data = get_student_data()
    if not student_data:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = student_data.get('student_id')
    class_id = student_data.get('class_id')

    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = service.get_exams_with_status(student_id, class_id)

    return jsonify([
        {
            'id': item['exam'].id,
            'examName': item['exam'].exam_name,
            'teacherID': item['exam'].teacher_id,
            'subject': item['exam'].subject.subject_name if item['exam'].subject else None,
            'startTime': item['exam'].start_time,
            'endTime': item['exam'].end_time,
            'durationMinutes': item['exam'].duration_minutes,
            'status': item['exam'].status,
            'computedStatus': item['computedStatus'],
            'studentExamStatus': item['studentExamStatus'],
        }
        for item in data
    ])


@exams_blueprint.route('/<int:exam_id>', methods=['GET'])
def get_exam_by_id(exam_id):
    """שליפת מבחן בודד (ללא StudentExam — השימוש עובר דרך student_exams_controller)."""
    exam = service.get_exam_by_id(exam_id)
    return jsonify({
        'id': exam.id,
        'examName': exam.exam_name,
        'teacherID': exam.teacher_id,
        'subject': exam.subject.subject_name if exam.subject else None,
        'startTime': exam.start_time,
        'endTime': exam.end_time,
        'durationMinutes': exam.duration_minutes,
        'status': exam.status,
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