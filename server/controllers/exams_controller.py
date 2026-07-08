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
"""
engine = create_engine(
    'mssql+pyodbc://localhost/GradexDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
"""
from server.db_connection import SessionLocal

session = SessionLocal()
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
    # Get current user from JWT
    teacher_data = get_teacher_data()
    teacher_id = teacher_data.get('teacher_id') if teacher_data else None
    role = teacher_data.get('role') if teacher_data else None

    all_exams = service.get_all_exams()

    # Teachers see only their own exams; admins see all
    if role != 'admin' and teacher_id:
        all_exams = [e for e in all_exams if e.teacher_id == teacher_id]

    return jsonify([
        {
            'id': e.id,
            'examName': e.exam_name,
            'teacherID': e.teacher_id,
            'teacherName': f'{e.teacher.first_name} {e.teacher.last_name}' if e.teacher else '',
            'subjectID': e.subject_id,
            'startTime': e.start_time,
            'endTime': e.end_time,
            'durationMinutes': e.duration_minutes,
            'status': e.status,
            'questionCount': len(e.questions or []),
        }
        for e in all_exams
    ])


@exams_blueprint.route('/stats', methods=['GET'])
def get_exam_stats():
    teacher_data = get_teacher_data()
    teacher_id = teacher_data.get('teacher_id') if teacher_data else None
    role = teacher_data.get('role') if teacher_data else None

    all_exams = service.get_all_exams()

    # Teachers see only their own exams; admins see all
    if role != 'admin' and teacher_id:
        all_exams = [e for e in all_exams if e.teacher_id == teacher_id]

    total = len(all_exams)
    active = sum(1 for e in all_exams if (e.status or '').strip().lower() == 'active')
    draft = sum(1 for e in all_exams if (e.status or '').strip().lower() == 'draft')
    closed = sum(1 for e in all_exams if (e.status or '').strip().lower() == 'closed')

    # Calculate average score across all student exams for these exams
    all_scores = []
    for e in all_exams:
        for se in (e.student_exams or []):
            if se.score is not None:
                all_scores.append(se.score)

    average_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0

    return jsonify({
        'totalExams': total,
        'activeCount': active,
        'draftCount': draft,
        'closedCount': closed,
        'averageScore': average_score,
    }), 200


@exams_blueprint.route('/teacher/<int:exam_id>', methods=['GET'])
def get_teacher_exam(exam_id):
    exam = service.get_exam_by_id(exam_id)

    def _question_to_dict(q):
        correct = ''
        ta = q.teacher_answer
        if ta:
            if ta.answer_text:
                correct = ta.answer_text
            elif ta.correct_option_id:
                match = next((o.option_text for o in (q.options or []) if o.id == ta.correct_option_id), '')
                correct = match

        return {
            'id': q.id,
            'question_number': q.question_number,
            'exam_id': q.exam_id,
            'question_text': q.question_text,
            'question_type_id': q.question_type_id,
            'max_score': q.max_score,
            'options': [
                {'id': o.id, 'option_number': o.option_number, 'option_text': o.option_text}
                for o in (q.options or [])
            ],
            'correct_answer': correct,
        }

    question_lookup = {q.id: q for q in (exam.questions or [])}

    student_exams = []
    for student_exam in (exam.student_exams or []):
        student = getattr(student_exam, 'student', None)
        answers = []
        for answer in (getattr(student_exam, 'answers', []) or []):
            question = question_lookup.get(answer.question_id)
            selected_option = None
            answer_text = getattr(answer, 'answer_text', None)

            if getattr(answer, 'selected_option_id', None) and question:
                selected_option = next(
                    (o for o in (getattr(question, 'options', []) or []) if o.id == answer.selected_option_id),
                    None,
                )
                if not answer_text and selected_option:
                    answer_text = getattr(selected_option, 'option_text', None)

            answers.append({
                'id': answer.id,
                'question_id': answer.question_id,
                'answer_text': answer_text,
                'selected_option_id': answer.selected_option_id,
                'selected_option_text': getattr(selected_option, 'option_text', None),
                'score': answer.score,
            })

        student_exams.append({
            'id': student_exam.id,
            'student_id': student_exam.student_id,
            'exam_id': student_exam.exam_id,
            'score': student_exam.score,
            'status': 'passed' if (student_exam.score is not None and student_exam.score >= 60) else 'submitted',
            'student': {
                'id': student.id,
                'first_name': student.first_name,
                'last_name': student.last_name,
            } if student else None,
            'answers': answers,
        })

    return jsonify({
        'id': exam.id,
        'examName': exam.exam_name,
        'teacherID': exam.teacher_id,
        'subjectID': exam.subject_id,
        'startTime': str(exam.start_time) if exam.start_time else None,
        'endTime': str(exam.end_time) if exam.end_time else None,
        'durationMinutes': exam.duration_minutes,
        'status': exam.status,
        'classIds': [ec.class_id for ec in (exam.exam_classes or [])],
        'questions': [_question_to_dict(q) for q in (exam.questions or [])],
        'student_exams': student_exams,
    }), 200


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
    data = request.get_json()

    # Preserve existing teacher_id from DB; never overwrite it
    existing = service.get_exam_by_id(exam_id)

    dto = ExamDTO(
        exam_name=data.get('name', existing.exam_name),
        teacher_id=existing.teacher_id,
        subject_id=data.get('subject_id', existing.subject_id),
        start_time=_parse_datetime(data.get('startTime')) or existing.start_time,
        end_time=_parse_datetime(data.get('endTime')) or existing.end_time,
        duration_minutes=data.get('duration_minutes', existing.duration_minutes),
        status=data.get('status', existing.status),
        class_ids=data.get('classIds', []),
        questions=data.get('questions', []),
    )
    service.update_exam(exam_id, dto)
    return jsonify({'message': 'Exam updated'})


@exams_blueprint.route('/<int:exam_id>', methods=['DELETE'])
def delete_exam(exam_id):
    service.delete_exam(exam_id)
    return jsonify({'message': 'Exam deleted'})