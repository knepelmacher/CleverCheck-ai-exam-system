---
source_file: "client/student/src/store/examStore.ts"
source_type: "typescript"
subtype: "store"
exports_count: 2
dependencies:
  - "zustand"
  - "../types"
imports_keywords: ["useExamStore", "ExamStore", "ExamPageStatus", "AnswerValue", "QuestionMarkStatus"]
---

## Overview
Zustand store לניהול מצב בחינת תלמיד — תשובות, שאלה נוכחית, סימונים, וסטטוס.

## Public Interface

### Export: `useExamStore`

### Export: `ExamPageStatus` (type)
`'idle' | 'active' | 'submitted'`

### State

| Field | Type | Initial |
|---|---|---|
| `exam` | `any \| null` | `null` |
| `studentExam` | `any \| null` | `null` |
| `questions` | `any[]` | `[]` |
| `answers` | `Record<number, AnswerValue>` | `{}` |
| `currentQuestion` | `number` | `0` |
| `markedQuestions` | `number[]` | `[]` |
| `inProgressQuestions` | `number[]` | `[]` |
| `visitedQuestions` | `number[]` | `[]` |
| `status` | `ExamPageStatus` | `'idle'` |

### Actions

| Action | Signature | Description |
|---|---|---|
| `setExamData` | `(payload: any) => void` | טוען פיילאוד ראשוני — מפרק answers, קובע status |
| `setAnswer` | `(questionId: number, value: AnswerValue) => void` | מעדכן תשובה + מסמן visited |
| `setCurrentQuestion` | `(id: number) => void` | משנה שאלה נוכחית + visited |
| `setQuestionStatus` | `(id: number, status: QuestionMarkStatus) => void` | מסמן/מבטל review/in-progress |
| `setStatus` | `(status: ExamPageStatus) => void` | משנה status |
| `reset` | `() => void` | איפוס למצב התחלתי |
