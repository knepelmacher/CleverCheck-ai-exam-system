---
source_file: "server/controllers/exams_controller.py"
source_type: "python"
subtype: "controller"
exports_count: 1
dependencies:
  - "flask"
  - "server.services.jwt_service"
imports_keywords: ["exams_blueprint", "get_student_data", "ExamService", "JWT"]
api_routes:
  - method: POST
    path: "/api/exams"
    handler: "add_exam"
  - method: GET
    path: "/api/exams"
    handler: "get_exams"
  - method: GET
    path: "/api/exams/<int:exam_id>"
    handler: "get_student_exam"
  - method: PUT
    path: "/api/exams/<int:exam_id>"
    handler: "update_exam"
  - method: DELETE
    path: "/api/exams/<int:exam_id>"
    handler: "delete_exam"
---

## Overview

CRUD למבחנים. GET מבחן יחיד (get_student_exam) מורכב: שולף מבחן + שאלות + StudentExam + תשובות, עם אימות JWT.

## Public Interface

### Blueprint: `exams_blueprint`

| Method | Path | Handler | Notes |
|---|---|---|---|
| POST | `/exams` | `add_exam()` | |
| GET | `/exams` | `get_exams()` | |
| GET | `/exams/<exam_id>` | `get_student_exam()` | JWT auth, מחזיר מבחן מלא |
| PUT | `/exams/<exam_id>` | `update_exam()` | |
| DELETE | `/exams/<exam_id>` | `delete_exam()` | |
