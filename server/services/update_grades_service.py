from server.services.main_service.my_stanza_service.file_to_run import get_student_score


class UpdateGradesService:
    """שירות לחישוב ציונים ושמירתם — מופרד מהלוגיקה העסקית של StudentExam"""

    def __init__(
        self,
        student_answer_repo,
        question_repo,
        teacher_answer_repo,
        student_exam_repo,
        session
    ):
        self.student_answer_repo = student_answer_repo
        self.question_repo = question_repo
        self.teacher_answer_repo = teacher_answer_repo
        self.student_exam_repo = student_exam_repo
        self.session = session

    def update_exam_grades(self, student_exam_id: int):
        """
        מחשב ציונים לכל תשובות התלמיד במבחן נתון:
        - אמריקאיות: השוואה ל-correct_option_id של המורה
        - פתוחות: הרצת get_student_score (NLP)
        מעדכן ציון לתשובה + ציון כולל למבחן.
        """

        # 1. שליפת כל התשובות של התלמיד למבחן
        answers = self.student_answer_repo.get_by_exam(student_exam_id)

        if not answers:
            return None

        total_score = 0

        # 2. מעבר על כל תשובה
        for answer in answers:
            question = self.question_repo.get_by_id(answer.question_id)

            if not question:
                continue

            teacher_answer = self.teacher_answer_repo.get_by_question(
                answer.question_id
            )

            # ── שאלה אמריקאית (MCQ) ──
            if question.question_type_id == 1:
                if (
                    teacher_answer is not None
                    and answer.selected_option_id is not None
                    and answer.selected_option_id == teacher_answer.correct_option_id
                ):
                    score = question.max_score
                else:
                    score = 0

            # ── שאלה פתוחה (TEXT) ──
            else:
                student_text = answer.answer_text or ""
                teacher_text = (
                    teacher_answer.answer_text
                    if teacher_answer and teacher_answer.answer_text
                    else ""
                )

                if student_text and teacher_text:
                    score = get_student_score(
                        student_text,
                        teacher_text,
                        question.max_score,
                    )
                else:
                    score = 0

            answer.score = score
            total_score += score

        # 3. עדכון ציון כולל למבחן
        exam = self.student_exam_repo.get_by_id(student_exam_id)
        if exam:
            exam.score = total_score

        # מחזיר את ה-exam (ה-commit ייעשה ע"י הקורא — StudentExamService)
        return exam
