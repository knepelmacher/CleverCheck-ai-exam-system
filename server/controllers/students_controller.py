from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.db_connection import get_db
from server.dtos.student_dto import StudentDTO
from server.services.jwt_service import create_token
from server.services.student_service import StudentService
from server.repositories.student_repository import StudentRepository
from server.models.student import Base


engine = create_engine(
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

repo = StudentRepository(session)
service = StudentService(repo)

students_blueprint = Blueprint('students', __name__)


def _student_to_dict(x):
    return {
        'id': x.id,
        'first_name': x.first_name,
        'last_name': x.last_name,
        'class_id': x.class_id,
        'is_active': x.is_active,
    }


@students_blueprint.route('', methods=['POST'])
def add_student():
    data = request.get_json()
    plain_password = data.get("password", "")
    hashed = generate_password_hash(plain_password) if plain_password else data.get("password_hash", "")

    dto = StudentDTO(
        student_id=data.get("student_id"),
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        class_id=data.get("class_id"),
        is_active=data.get("is_active", True),
        password_hash=hashed,
    )
    service.add_student(dto)
    return jsonify({'message': 'Student added'}), 201


@students_blueprint.route('', methods=['GET'])
def get_students():
    data = service.get_all_students()
    return jsonify([_student_to_dict(x) for x in data])


@students_blueprint.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    x = service.get_student_by_id(student_id)
    return jsonify(_student_to_dict(x))


@students_blueprint.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.get_json()
    plain_password = data.get("password")

    # Get existing student to preserve values when fields aren't provided
    existing = service.get_student_by_id(student_id)

    # If no new password provided, keep the existing hash
    if plain_password:
        hashed = generate_password_hash(plain_password)
    else:
        hashed = existing.password_hash

    dto = StudentDTO(
        student_id=data.get("student_id", student_id),
        first_name=data.get("first_name", existing.first_name),
        last_name=data.get("last_name", existing.last_name),
        class_id=data.get("class_id", existing.class_id),
        is_active=data.get("is_active", existing.is_active),
        password_hash=hashed,
    )
    service.update_student(student_id, dto)
    return jsonify({'message': 'Student updated'})


@students_blueprint.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    service.delete_student(student_id)
    return jsonify({'message': 'Student deleted'})
