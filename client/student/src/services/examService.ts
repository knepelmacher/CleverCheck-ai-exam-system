import type { ExamCardModel, ExamInitialPayload, ExamStatus, ResultsPayload } from '../types';

const API_BASE = 'http://localhost:5000/api';

const VALID_EXAM_STATUSES: readonly ExamStatus[] = ['Active', 'Draft', 'Closed'] as const;

const validateExamStatus = (status: string): ExamStatus => {
  const trimmed = String(status ?? '').trim();
  if ((VALID_EXAM_STATUSES as readonly string[]).includes(trimmed)) {
    return trimmed as ExamStatus;
  }
  return 'Closed';
};

interface RawExamItem {
  id: number;
  examName: string;
  subject: string;
  status: string;
  computedStatus: string | null;
  studentExamStatus: string | null;
  durationMinutes: number;
  startTime: string;
  endTime: string;
}

const parseJson = async (response: Response) => {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error || payload?.message || response.statusText || 'Request failed';
    throw new Error(String(message));
  }
  return payload;
};

export const examService = {
  listExams: async (): Promise<ExamCardModel[]> => {
    const payload = await parseJson(await fetch(`${API_BASE}/exams`, { credentials: 'include' }));
    console.log("EXAMS FROM SERVER:", payload);
    return (payload as RawExamItem[]).map((exam) => ({
      examId: exam.id,
      name: exam.examName,
      subject: exam.subject,
      status: validateExamStatus(exam.computedStatus ?? exam.status),
      computedStatus: exam.computedStatus ?? null,
      studentExamStatus: exam.studentExamStatus ?? null,
      durationMinutes: exam.durationMinutes,
      startTime: exam.startTime,
      endTime: exam.endTime,
    }));
  },
  getExam: async (examId: string): Promise<ExamInitialPayload> => {
    const payload = await parseJson(await fetch(`${API_BASE}/student_exams/exam/${examId}`, { credentials: 'include' }));
    return payload as ExamInitialPayload;
  },
  saveAnswer: async (payload: { studentExamId: number; questionId: number; answerText: string | null; selectedOptionId: number | null }) => {
    const response = await fetch(`${API_BASE}/student_exams/${payload.studentExamId}/answers`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson(response);
  },
  submitExam: async (studentExamId: number) => {
    const response = await fetch(`${API_BASE}/student_exams/${studentExamId}/finish`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentExamId }),
    });
    return parseJson(response);
  },
  getResults: async (examId: string): Promise<ResultsPayload> => {
    const response = await fetch(`${API_BASE}/student_exams/exam/${examId}/results`, { credentials: 'include' });
    const payload = await parseJson(response);
    return payload as ResultsPayload;
  },
};
