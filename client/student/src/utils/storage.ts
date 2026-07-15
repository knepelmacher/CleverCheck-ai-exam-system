const STORAGE_PREFIX = (studentExamId: number) => `exam_${studentExamId}_`;

export const saveExamUiState = (
  studentExamId: number,
  answers: Record<number, { answerText?: string; selectedOptionId?: number }>,
  currentQuestion: number,
  markedQuestions: number[],
  visitedQuestions: number[],
  inProgressQuestions: number[],
) => {
  const p = STORAGE_PREFIX(studentExamId);
  const payload = {
    studentExamId,
    answers,
    currentQuestion,
    markedQuestions,
    visitedQuestions,
    inProgressQuestions,
    lastSavedAt: new Date().toISOString(),
  };

  localStorage.setItem(`${p}answers`, JSON.stringify(payload.answers));
  localStorage.setItem(`${p}currentQuestion`, String(payload.currentQuestion));
  localStorage.setItem(`${p}markedQuestions`, JSON.stringify(payload.markedQuestions));
  localStorage.setItem(`${p}inProgressQuestions`, JSON.stringify(payload.inProgressQuestions));
  localStorage.setItem(`${p}visitedQuestions`, JSON.stringify(payload.visitedQuestions));
  localStorage.setItem(`${p}lastSavedAt`, payload.lastSavedAt);
};

export const loadExamUiState = (studentExamId: number) => {
  const p = STORAGE_PREFIX(studentExamId);
  const answersRaw = localStorage.getItem(`${p}answers`);
  const currentQuestionRaw = localStorage.getItem(`${p}currentQuestion`);
  const markedQuestionsRaw = localStorage.getItem(`${p}markedQuestions`);
  const inProgressQuestionsRaw = localStorage.getItem(`${p}inProgressQuestions`);
  const visitedQuestionsRaw = localStorage.getItem(`${p}visitedQuestions`);
  const lastSavedAtRaw = localStorage.getItem(`${p}lastSavedAt`);

  return {
    answers: answersRaw ? JSON.parse(answersRaw) : {},
    currentQuestion: currentQuestionRaw ? Number(currentQuestionRaw) : 0,
    markedQuestions: markedQuestionsRaw ? JSON.parse(markedQuestionsRaw) : [],
    inProgressQuestions: inProgressQuestionsRaw ? JSON.parse(inProgressQuestionsRaw) : [],
    visitedQuestions: visitedQuestionsRaw ? JSON.parse(visitedQuestionsRaw) : [],
    lastSavedAt: lastSavedAtRaw ?? null,
  };
};
