"""
services/auth_service.py — בדיקת משתמשים
"""
from werkzeug.security import check_password_hash

from server.repositories.teacher_repository import TeacherRepository


def validate_teacher(db, username: str, password: str):
    try:
        teacher_id = int(username)
    except ValueError:
        return None

    repo = TeacherRepository(db)
    teacher = repo.get_by_id(teacher_id)

    if not teacher:
        return None

    if not teacher.is_active:
        return None

    if not check_password_hash(teacher.password_hash, password):
        return None

    return {
        "id": teacher.id,
        "role": teacher.role,
        "teacher_name": teacher.first_name,
        "last_name": teacher.last_name
    }