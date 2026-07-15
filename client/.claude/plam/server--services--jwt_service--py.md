---
source_file: "server/services/jwt_service.py"
source_type: "python"
subtype: "service"
exports_count: 2
dependencies:
  - "jwt"
  - "flask"
imports_keywords: ["create_token", "get_student_data", "JWT"]
---

## Overview

יצירת ופענוח JWT tokens. שימוש ב-cookie `"token"` מה-request.

## Public Interface

### Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `create_token` | `(student: dict) -> str` | `str` | יוצר JWT עם `student_id`, `role`, `student_name`, `exp` (2h) |
| `get_student_data` | `() -> dict \| None` | `dict \| None` | שולף cookie, מפענח JWT, מחזיר payload |
