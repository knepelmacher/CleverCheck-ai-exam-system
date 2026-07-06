---
source_file: "server/models/questions.py"
source_type: "python"
subtype: "model"
exports_count: 1
dependencies:
  - "sqlalchemy"
imports_keywords: ["Question", "Questions", "Base"]
---

## Overview

מודל SQLAlchemy של שאלה במבחן.

## Public Interface

### SQLAlchemy Model: `Question`
- **Table**: `Questions`
- **PK**: `id` (QuestionID, Integer, autoincrement)
- **Constraints**: `UniqueConstraint(ExamID, QuestionNumber)`

| Column | Attribute | Type | Constraints |
|---|---|---|---|
| QuestionID | `id` | Integer | PK |
| QuestionNumber | `question_number` | Integer | NOT NULL |
| ExamID | `exam_id` | Integer | FK → Exams (CASCADE) |
| QuestionText | `question_text` | Text | NOT NULL |
| QuestionTypeID | `question_type_id` | Integer | FK → QuestionTypes |
| MaxScore | `max_score` | Float | NOT NULL |

| Relationship | Target | Back Populates |
|---|---|---|
| `exam` | Exam | `questions` |
| `question_type` | QuestionType | — |
| `options` | Option | `question` |
| `teacher_answer` | TeacherAnswer | `question` (uselist=False) |
| `student_answers` | StudentAnswer | `question` |
