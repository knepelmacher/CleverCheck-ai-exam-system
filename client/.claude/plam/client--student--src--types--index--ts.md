---
source_file: "client/student/src/types/index.ts"
source_type: "typescript"
subtype: "types"
exports_count: 12
dependencies: []
imports_keywords: ["ExamStatus", "QuestionType", "User", "ExamCardModel", "QuestionModel", "AnswerValue", "ExamInitialPayload", "ResultsPayload", "ResultQuestion"]
---

## Overview
הגדרות טיפוסים כלליות לאפליקציית הסטודנט.

## Public Interface

### Type Aliases

| Name | Definition |
|---|---|
| `ExamStatus` | `'Active' \| 'InProgress' \| 'Submitted' \| 'Draft' \| 'Closed' \| 'Graded'` |
| `QuestionType` | `'MCQ' \| 'TEXT'` |
| `QuestionMarkStatus` | `'none' \| 'in-progress' \| 'review'` |

### Interfaces

| Interface | Key Properties |
|---|---|
| `User` | `studentId: number`, `name: string`, `classId: number` |
| `ExamCardModel` | `examId: number`, `name: string`, `subject: string`, `status: ExamStatus`, `durationMinutes: number` |
| `QuestionOption` | `optionId: number`, `text: string` |
| `QuestionModel` | `questionId: number`, `questionNumber: number`, `text: string`, `type: QuestionType`, `maxScore: number`, `options: QuestionOption[]` |
| `AnswerValue` | `answerText?: string`, `selectedOptionId?: number` |
| `ExamInitialPayload` | `exam`, `studentExam`, `questions: QuestionModel[]`, `answers`, `serverTime` |
| `ResultQuestion` | `questionId`, `text`, `studentAnswer`, `correctAnswer`, `isCorrect`, `score`, `maxScore` |
| `ResultsPayload` | `examName: string`, `subject: string`, `score: number`, `questions: ResultQuestion[]` |
