---
source_file: "server/models/teachers.py"
source_type: "python"
subtype: "model"
exports_count: 1
dependencies:
  - "sqlalchemy"
imports_keywords: ["Teacher", "Teachers", "Email", "Role"]
---

## Overview

מודל SQLAlchemy של מורה.

## Public Interface

### SQLAlchemy Model: `Teacher`
- **Table**: `Teachers`
- **PK**: `id` (TeacherID, Integer, autoincrement=False)

| Column | Attribute | Type | Constraints |
|---|---|---|---|
| TeacherID | `id` | Integer | PK |
| PasswordHash | `password_hash` | String(255) | NOT NULL |
| FirstName | `first_name` | String(50) | NOT NULL |
| LastName | `last_name` | String(50) | NOT NULL |
| Email | `email` | String(100) | NOT NULL, unique |
| IsActive | `is_active` | Boolean | default=False |
| Role | `role` | String(10) | default="teacher" |

| Relationship | Target | Back Populates |
|---|---|---|
| `exams` | Exam | `teacher` |
| `teacher_classes` | TeacherClass | `teacher` |
