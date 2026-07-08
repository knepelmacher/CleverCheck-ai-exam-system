---
source_file: "server/models/student_answer.py"
source_type: "python"
subtype: "model"
exports_count: 1
dependencies:
  - "sqlalchemy"
imports_keywords: ["StudentAnswer", "AnswerText", "SelectedOptionID", "CheckConstraint"]
---

## Overview

מודל SQLAlchemy של תשובת תלמיד (פתוחה או אמריקאית). CheckConstraint מוודא שרק סוג תשובה אחד מולא.

## Public Interface

### SQLAlchemy Model: `StudentAnswer`
- **Table**: `StudentAnswers`
- **PK**: `id` (AnswerID, Integer, autoincrement)
- **Constraint**: `(AnswerText IS NOT NULL AND SelectedOptionID IS NULL) OR (AnswerText IS NULL AND SelectedOptionID IS NOT NULL)`

| Column | Attribute | Type | Constraints |
|---|---|---|---|
| AnswerID | `id` | Integer | PK |
| StudentExamID | `student_exam_id` | Integer | FK → StudentExams (CASCADE) |
| QuestionID | `question_id` | Integer | FK → Questions |
| SelectedOptionID | `selected_option_id` | Integer | FK → Options, nullable |
| AnswerText | `answer_text` | Text | nullable |
| Score | `score` | Float | nullable |

| Relationship | Target |
|---|---|
| `student_exam` | StudentExam |
| `question` | Question |
| `option` | Option |
