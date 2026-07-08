from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from server.dtos.teacher_dto import TeacherDTO
from server.services.teacher_service import TeacherService
from server.repositories.teacher_repository import TeacherRepository
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models.teachers import Base

engine = create_engine('mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
"""
from server.db_connection import SessionLocal

session = SessionLocal()

repo = TeacherRepository(session)
service = TeacherService(repo)

teachers_blueprint = Blueprint('teachers', __name__)


def _teacher_to_dict(x):
    return {
        'id': x.id,
        'first_name': x.first_name,
        'last_name': x.last_name,
        'email': x.email,
        'is_active': x.is_active,
        'role': x.role,
    }


@teachers_blueprint.route('', methods=['POST'])
def add_teacher():
    data = request.get_json()
    plain_password = data.get("password", "")
    hashed = generate_password_hash(plain_password) if plain_password else data.get("password_hash", "")

    dto = TeacherDTO(
        teacher_id=data.get("teacher_id"),
        password_hash=hashed,
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        email=data.get("email"),
        is_active=data.get("is_active", True),
        role=data.get("role", "teacher")
    )
    service.add_teacher(dto)
    return jsonify({'message': 'Teacher added'}), 201


@teachers_blueprint.route('', methods=['GET'])
def get_teachers():
    data = service.get_all_teachers()
    return jsonify([_teacher_to_dict(x) for x in data])


@teachers_blueprint.route('/<int:teacher_id>', methods=['GET'])
def get_teacher(teacher_id):
    x = service.get_teacher_by_id(teacher_id)
    return jsonify(_teacher_to_dict(x))


@teachers_blueprint.route('/<int:teacher_id>', methods=['PUT'])
def update_teacher(teacher_id):
    data = request.get_json()
    plain_password = data.get("password")

    # Get existing teacher to preserve values when fields aren't provided
    existing = service.get_teacher_by_id(teacher_id)

    # If no new password provided, keep the existing hash
    if plain_password:
        hashed = generate_password_hash(plain_password)
    else:
        hashed = existing.password_hash

    dto = TeacherDTO(
        teacher_id=data.get("teacher_id", teacher_id),
        password_hash=hashed,
        first_name=data.get("first_name", existing.first_name),
        last_name=data.get("last_name", existing.last_name),
        email=data.get("email", existing.email),
        is_active=data.get("is_active", existing.is_active),
        role=data.get("role", existing.role)
    )
    service.update_teacher(teacher_id, dto)
    return jsonify({'message': 'Teacher updated'})


@teachers_blueprint.route('/<int:teacher_id>', methods=['DELETE'])
def delete_teacher(teacher_id):
    service.delete_teacher(teacher_id)
    return jsonify({'message': 'Teacher deleted'})
