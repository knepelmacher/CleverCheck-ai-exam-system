import { httpClient } from './httpClient'
import type { Exam } from '../models/Exam'
import type { ExamDraft } from '../models/ExamDraft'

export interface ExamStats {
  totalExams: number
  activeCount: number
  draftCount: number
  closedCount: number
  averageScore: number
}

export async function getExams(): Promise<Exam[]> {
  const response = await httpClient.get<Exam[]>('/exams')
  return response.data
}

export async function getExamStats(): Promise<ExamStats> {
  const response = await httpClient.get<ExamStats>('/exams/stats')
  return response.data
}

export async function getExamById(id: number): Promise<Exam | null> {
  const response = await httpClient.get<Exam>(`/exams/teacher/${id}`)
  return response.data ?? null
}

function buildExamPayload(payload: ExamDraft) {
  const questionTypeMap: Record<string, number> = {
    american: 1,
    open: 2,
    truefalse: 3,
    numeric: 4,
  }

  return {
    name: payload.name,
    classIds: payload.classIds,
    startTime: payload.startTime || new Date().toISOString(),
    endTime: payload.endTime || new Date().toISOString(),
    duration_minutes: payload.duration_minutes || 60,
    subject_id: payload.subject_id || 1,
    status: 'draft',
    questions: payload.questions.map((q) => ({
      text: q.text,
      questionType: q.questionType,
      typeId: questionTypeMap[q.questionType] ?? 1,
      score: q.score,
      options: q.options.filter((o) => o.trim() !== ''),
      correctAnswer: q.correctAnswer,
    })),
  }
}

export async function createExam(payload: ExamDraft): Promise<void> {
  await httpClient.post('/exams', buildExamPayload(payload))
}

export async function updateExam(id: number, payload: ExamDraft): Promise<void> {
  await httpClient.put(`/exams/${id}`, buildExamPayload(payload))
}
