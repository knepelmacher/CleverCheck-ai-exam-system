---
source_file: "server/app.py"
source_type: "python"
subtype: "entry"
last_modified: "2026-07-01T00:00:00Z"
file_hash: "placeholder"
exports_count: 0
dependencies:
  - "flask"
  - "sentence_transformers"
  - "flask_cors"
imports_keywords: ["GradingService", "SentenceTransformer", "Config", "CORS"]
---

## Overview

קובץ הכניסה הראשי של שרת Flask. יוצר אפליקציית Flask, טוען מודל SentenceTransformer מקומי, יוצר GradingService, ורושם Blueprints לכל הישויות. כרגע grading_controller מושבת.

## Public Interface

### App Configuration
- `CORS(app, supports_credentials=True, origins=["http://localhost:5174"])`
- `app.config["SECRET_KEY"] = Config.SECRET_KEY`

### Model Loading
- `SentenceTransformer(MODEL_PATH)` — מודל מ-`server/my_model/`

### Registered Blueprints

| Blueprint | URL Prefix |
|---|---|
| `subject_blueprint` | `/api/subjects` |
| `classes_blueprint` | `/api/classes` |
| `teachers_blueprint` | `/api/teachers` |
| `students_blueprint` | `/api/students` |
| `exams_blueprint` | `/api/exams` |
| `options_blueprint` | `/api/options` |
| `questions_blueprint` | `/api/questions` |
| `student_answers_blueprint` | `/api/student_answers` |
| `student_exams_blueprint` | `/api/student_exams` |
| `teacher_answers_blueprint` | `/api/teacher_answers` |
| `question_types_blueprint` | `/api/question_types` |
| `auth_bp` | `/api/auth` |
