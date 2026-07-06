---
source_file: "server/controllers/students_auth_controller.py"
source_type: "python"
subtype: "controller"
exports_count: 1
dependencies:
  - "flask"
  - "services.auth_service"
  - "services.jwt_service"
imports_keywords: ["auth_bp", "login", "JWT", "cookie"]
api_routes:
  - method: POST
    path: "/api/auth/login"
    handler: "login"
    description: "התחברות — מחזיר JWT ב-cookie"
  - method: GET
    path: "/api/auth/me"
    handler: "get_student_me"
    description: "שליפת פרטי תלמיד מה-JWT"
---

## Overview

בקר אימות לכניסת תלמידים. התחברות מחזירה cookie httponly עם JWT token.

## Public Interface

### Blueprint: `auth_bp`
- **url_prefix**: `/api/auth`

| Route | Method | Handler | Description |
|---|---|---|---|
| `/auth/login` | POST, OPTIONS | `login()` | מאמת מול DB, יוצר JWT, מחזיר cookie |
| `/auth/me` | GET | `get_student_me()` | מחזיר פרטי תלמיד מה-token |
