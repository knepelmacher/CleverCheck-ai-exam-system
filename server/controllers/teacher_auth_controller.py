from urllib import request

from fontTools.config import OPTIONS

from server.services.auth_teacher_service import validate_teacher
from server.services.jwt_teacher_service import create_token
from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
#from server.services.student_exam_service import StudentExamService
#from server.repositories.student_exam_repository import StudentExamRepository
#from server.models.student_exams import Base

"""
engine = create_engine(
    'mssql+pyodbc://localhost/CleverCheckDB?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
"""
from server.db_connection import SessionLocal

session = SessionLocal()
#
# repo = StudentExamRepository(session)
# service = StudentExamService(repo)

auth_teacher_bp = Blueprint('auth_teacher', __name__)


@auth_teacher_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
        if request.method == 'OPTIONS':
            return '',200
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"error": "נדרש JSON"}), 400

        teacher_name = data.get("username")
        password = data.get("password")

        try:
            teacher = validate_teacher(session, teacher_name, password)

            if not teacher:
                return jsonify({"error": "שם משתמש או סיסמה שגויים"}), 401

            token = create_token(teacher)

            response = jsonify({
                "id": teacher["id"],
                "role": teacher["role"],
                "first_name": teacher["teacher_name"],
                "last_name": teacher.get("last_name", "")
            })

            response.set_cookie(
                "token",
                token,
                httponly=True,
                samesite="Lax",
                secure=False,
                path="/"
            )
                # בפרודקשן True


            return response, 200

        except Exception as e:
            print("LOGIN ERROR:", e)
            return jsonify({"error": str(e)}), 500
@auth_teacher_bp.route('/me', methods=['GET'])
def get_teacher_me():
    try:
        from server.services.jwt_teacher_service import get_teacher_data
        data = get_teacher_data()
        print(data)
        return jsonify({
            'id': data['teacher_id'],
            'role': data['role'],
            "first_name": data["teacher_name"],
            "last_name": data.get("last_name", ""),
        }), 200
    except Exception:
        return jsonify({'error': 'טוקן לא תקין'}), 401

