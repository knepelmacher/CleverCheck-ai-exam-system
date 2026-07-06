---
source_file: "server/services/auth_service.py"
source_type: "python"
subtype: "service"
exports_count: 1
dependencies:
  - "werkzeug"
imports_keywords: ["validate_student", "check_password_hash", "StudentRepository"]
---

## Overview

אימות תלמידים מול בסיס הנתונים באמצעות password hash של werkzeug.

## Public Interface

### Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `validate_student` | `(db, student_name: str, password: str) -> dict \| None` | `dict \| None` | בודק `is_active`, משווה hash, מחזיר `{"id", "role", "student_name"}` או None |
