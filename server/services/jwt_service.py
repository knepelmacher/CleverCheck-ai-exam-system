import jwt
import datetime
from config import Config

def create_token(user: dict):
    payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

def decode_token(token: str):
    return jwt.decode(
        token,
        Config.SECRET_KEY,
        algorithms=["HS256"]
    )