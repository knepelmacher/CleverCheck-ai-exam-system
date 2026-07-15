---
source_file: "server/models/exams.py"
source_type: "python"
subtype: "model"
exports_count: 1
dependencies:
  - "sqlalchemy"
imports_keywords: ["Exam", "Exams", "Base"]
---

## Overview

מודל SQLAlchemy של מבחן.

## Public Interface

### SQLAlchemy Model: `Exam`
- **Table**: `Exams`
- **PK**: `id` (ExamID, Integer, autoincrement)

| Column (DB) | Attribute | Type | Constraints |
|---|---|---|---|
| ExamID | `id` | Integer | PK |
| ExamName | `exam_name` | String(100) | NOT NULL |
| TeacherID | `teacher_id` | Integer | FK → Teachers |
| SubjectID | `subject_id` | Integer | FK → Subjects |
| StartTime | `start_time` | DateTime | NOT NULL |
| EndTime | `end_time` | DateTime | NOT NULL |
| DurationMinutes | `duration_minutes` | Integer | NOT NULL |
| CreatedAt | `created_at` | DateTime | default=utcnow |
| Status | `status` | String(20) | NOT NULL, default="Draft" |

| Relationship | Target | Back Populates | Cascade |
|---|---|---|---|
| `teacher` | Teacher | `exams` | — |
| `subject` | Subject | `exams` | — |
| `questions` | Question | `exam` | all, delete-orphan |
| `student_exams` | StudentExam | `exam` | all, delete-orphan |
| `exam_classes` | ExamClass | `exam` | all, delete-orphan |
