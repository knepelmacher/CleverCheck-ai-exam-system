import { httpClient } from './httpClient'
import type { Exam } from '../models/Exam'
import type { ExamDraft } from '../models/ExamDraft'

export async function getExams(): Promise<Exam[]> {
  const response = await httpClient.get<Exam[]>('/exams')
  return response.data
}

export async function getExamById(id: number): Promise<Exam | null> {
  const response = await httpClient.get<Exam>(`/exams/${id}`)
  return response.data ?? null
}

export async function createExam(payload: ExamDraft): Promise<void> {
  const questionTypeMap: Record<string, number> = {
    american: 1,
    open: 2,
    truefalse: 3,
    numeric: 4,
  }

  await httpClient.post('/exams', {
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
  })
}
