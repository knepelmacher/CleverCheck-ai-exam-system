---
source_file: "client/student/src/services/examService.ts"
source_type: "typescript"
subtype: "service"
exports_count: 1
dependencies:
  - "../types"
imports_keywords: ["examService", "listExams", "getExam", "saveAnswer", "submitExam", "getResults"]
---

## Overview
שירות API לתקשורת עם שרת הבחינות. כל הקריאות עם `credentials: 'include'` ל-JWT cookie.

## Public Interface

### Export: `examService` (object literal)

| Method | Signature | Returns | Description |
|---|---|---|---|
| `listExams` | `() => Promise<ExamCardModel[]>` | `ExamCardModel[]` | שליפת רשימת מבחנים, מנרמל status |
| `getExam` | `(examId: string) => Promise<ExamInitialPayload>` | `ExamInitialPayload` | שליפת מבחן מלא דרך `/student_exams/exam/` |
| `saveAnswer` | `(payload: {studentExamId, questionId, answerText, selectedOptionId}) => Promise<any>` | `any` | שמירת תשובה |
| `submitExam` | `(studentExamId: number) => Promise<any>` | `any` | הגשת מבחן |
| `getResults` | `(studentExamId: string) => Promise<ResultsPayload>` | `ResultsPayload` | שליפת תוצאות |

### Internal Functions

| Function | Signature | Description |
|---|---|---|
| `normalizeExamStatus` | `(status: string \| undefined \| null) => ExamStatus` | מנרמל סטטוסים מהשרת |
| `parseJson` | `(response: Response) => Promise<any>` | Helper — מפרק JSON, זורק Error עם הודעה |
