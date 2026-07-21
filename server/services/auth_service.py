"""
services/auth_service.py — בדיקת משתמשים (בהמשך יתחבר ל-DB)
"""

def validate_user(username: str, password: str):
    # כרגע דמו (בהמשך SQL)
    if username == "admin" and password == "1234":
        return {
            "id": 1,
            "role": "teacher",
            "username": "admin"
        }

    return None