export type ExamStatus =
  | 'Active'
  | 'Draft'
  | 'Closed'
  | 'InProgress';
export type QuestionType = 'MCQ' | 'TEXT';
export type QuestionMarkStatus = 'none' | 'in-progress' | 'review';
export type StudentExamStatus =
  'NotStarted' |
  'InProgress' |
  'Submitted' |
  'Checked';

export interface User {
  studentId: number;
  name: string;
  classId: number;
}

export interface ExamCardModel {
  examId: number;
  name: string;
  subject: string;
  status: ExamStatus;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  computedStatus: StudentExamStatus | null;
}

export interface QuestionOption {
  id: number;
  text: string;
}

export interface QuestionModel {
  questionId: number;
  questionNumber: number;
  text: string;
  typeId: QuestionType;
  maxScore: number;
  options: QuestionOption[];
}

export interface AnswerValue {
  answerText?: string;
  selectedOptionId?: number;
}

export interface ExamInitialPayload {
  exam: {
    examId: number;
    name: string;
    subject: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
  };
  studentExam: {
    studentExamId: number;
    status: StudentExamStatus;
    startTime: string | null;
    endTime: string | null;
  };
  questions: QuestionModel[];
  answers: Array<{
    questionId: number;
    answerText: string | null;
    selectedOptionId: number | null;
  }>;
  serverTime: string;
}

export interface ResultQuestion {
  questionId: number;
  text: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

export interface ResultsPayload {
  examName: string;
  subject: string;
  score: number;
  status: string;
  questions: ResultQuestion[];
}

export interface ScoreBin {
  min: number;
  max: number;
  count: number;
  label: string;
}

export interface ScoresDistribution {
  bins: ScoreBin[];
  totalStudents: number;
  average: number;
}
