"""
controllers/auth_controller.py — קבלת בקשות HTTP, validation, תגובה
"""

import logging
from flask import Blueprint, request, jsonify, Response
from middleware.auth_middleware import token_required
from services.auth_service import validate_user
from services.jwt_service import create_token

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api')


# ── Routes ────────────────────────────────────────────────
def register_routes():

    @auth_bp.route('/login', methods=['POST'])
    def login() -> tuple[Response, int]:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"error": "נדרש JSON body"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "חסרים נתונים"}), 400

        user = validate_user(username, password)

        if not user:
            return jsonify({"error": "שם משתמש או סיסמה שגויים"}), 401

        token = create_token(user)

        response = jsonify({
            "message": "login success"
        })

        response.set_cookie(
            "token",
            token,
            httponly=True,
            samesite="Lax"
        )

        return response, 200

    @auth_bp.route("/me", methods=["GET"])
    @token_required
    def me():
        return jsonify({
            "user": request.user
        })

    @auth_bp.route('/me', methods=['GET'])
    def me() -> tuple[Response, int]:
        token = request.cookies.get("token")

        if not token:
            return jsonify({"error": "אין טוקן"}), 401

        try:
            from services.jwt_service import decode_token
            data = decode_token(token)

            return jsonify({
                "user_id": data["user_id"],
                "role": data["role"]
            }), 200

        except Exception:
            return jsonify({"error": "טוקן לא תקין"}), 401

    return auth_bp