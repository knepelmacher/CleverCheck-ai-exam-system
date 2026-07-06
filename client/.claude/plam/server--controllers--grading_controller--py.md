---
source_file: "server/controllers/grading_controller.py"
source_type: "python"
subtype: "controller"
exports_count: 2
dependencies:
  - "flask"
  - "dtos.dtos"
imports_keywords: ["grading_bp", "register_routes", "GradeRequestDTO", "grade"]
api_routes:
  - method: POST
    path: "/api/grade"
    handler: "grade"
    description: "בדיקת תשובת תלמיד מול מודל ניקוד"
  - method: GET
    path: "/api/results/<int:result_id>"
    handler: "get_result"
    description: "שליפת תוצאת ניקוד"
---

## Overview

בקר ניקוד מבוסס Dependency Injection. ה-service מוזרק דרך `register_routes(grading_service)`. כולל ולידציה מפורטת.

## Public Interface

### Blueprint: `grading_bp`
- **url_prefix**: `/api`

### Functions

| Function | Signature | Description |
|---|---|---|
| `register_routes` | `(grading_service) -> Blueprint` | יוצר Blueprint עם ה-service המוזרק |

### Route Handler: `grade()`
- **Method**: POST
- **Path**: `/api/grade`
- **Input**: `{"submission_id": int, "student_answer": str, "key_concepts": list[str]}`
- **Returns**: `GradeResponseDTO`

### Route Handler: `get_result(result_id)`
- **Method**: GET
- **Path**: `/api/results/<int:result_id>`
- **Returns**: GradingResult
