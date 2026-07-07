export type QuestionTypeValue = 'american' | 'open' | 'truefalse' | 'numeric'

export interface QuestionDraft {
  id: string
  questionType: QuestionTypeValue
  text: string
  score: number
  options: string[]
  correctAnswer: string
}

export interface ExamDraft {
  id: string
  name: string
  classIds: number[]
  baseScore: number
  startTime: string
  endTime: string
  duration_minutes: number
  subject_id: number
  questions: QuestionDraft[]
}
