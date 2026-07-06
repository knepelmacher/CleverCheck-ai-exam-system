from flask import Blueprint, request, jsonify


from server.dtos.exams_dto import ExamDTO
from server.services.exam_service import ExamService
from server.repositories.exam_repository import ExamRepository
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models.exams import Base
from server.services.jwt_service import get_student_data

engine = create_engine(
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

repo = ExamRepository(session)
service = ExamService(repo)

exams_blueprint = Blueprint('exams', __name__)


@exams_blueprint.route('', methods=['POST'])
def add_exam():
    dto = ExamDTO(**request.get_json())
    service.add_exam(dto)
    return jsonify({'message': 'Exam added'}), 201


@exams_blueprint.route('', methods=['GET'])
def get_exams():
    """רשימת מבחנים עבור הסטודנט המחובר, כולל computedStatus."""
    student_data = get_student_data()
    if not student_data:
        return jsonify({"error": "Unauthorized"}), 401

    student_id = student_data.get('student_id')
    if not student_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = service.get_exams_with_status(student_id)

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