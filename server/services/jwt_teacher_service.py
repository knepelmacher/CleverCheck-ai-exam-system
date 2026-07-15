import datetime
from flask import request

import jwt
from server.config import Config


def create_token(teacher: dict):
    payload = {
        "teacher_id": teacher["id"],
        "role": teacher["role"],
        "teacher_name": teacher["teacher_name"],
        "last_name": teacher["last_name"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")


def get_teacher_data():
    token = request.cookies.get("token")
    if not token:
        return None
    try:
        decoded = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=["HS256"]
        )
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    return decoded

