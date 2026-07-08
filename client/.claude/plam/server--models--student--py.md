---
source_file: "server/models/student.py"
source_type: "python"
subtype: "model"
exports_count: 1
dependencies:
  - "sqlalchemy"
imports_keywords: ["Student", "Students", "PasswordHash", "ClassID"]
---

## Overview

מודל SQLAlchemy של תלמיד.

## Public Interface

### SQLAlchemy Model: `Student`
- **Table**: `Students`
- **PK**: `id` (StudentID, Integer, autoincrement=False)

| Column | Attribute | Type | Constraints |
|---|---|---|---|
| StudentID | `id` | Integer | PK (no autoincrement) |
| PasswordHash | `password_hash` | String(255) | NOT NULL |
| FirstName | `first_name` | String(100) | NOT NULL |
| LastName | `last_name` | String(100) | NOT NULL |
| ClassID | `class_id` | Integer | FK → Classes, indexed |
| IsActive | `is_active` | Boolean | default=False |

| Relationship | Target | Back Populates |
|---|---|---|
| `class_` | Class | `students` |
| `student_exams` | StudentExam | `student` |
