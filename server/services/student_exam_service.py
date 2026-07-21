from server.models.student_exams import StudentExam
from server.exceptions.exceptions import CleverCheckBaseError


class StudentExamService:
    def __init__(self, repo):
        self.repo = repo

    def add_studentexam(self, dto):
        entity = StudentExam(
            exam_id=dto.exam_id,
            student_id=dto.student_id,
            start_time=dto.start_time,
            end_time=dto.end_time,
            score=dto.score,
        )

        return self.repo.add(entity)

    def get_all_student_exams(self):
        return self.repo.get_all()

    def get_full_exam(self, student_id: int, exam_id: int):
        obj = self.repo.get_full_exam_for_student(student_id, exam_id)
        if not obj:
            return None
        return obj

    def update_studentexam(self, student_exam_id, dto):
        obj = self.repo.get_by_id(student_exam_id)
        if not obj:
            raise CleverCheckBaseError(student_exam_id)

        obj.exam_id = dto.exam_id
        obj.student_id = dto.student_id
        obj.start_time = dto.start_time
        obj.end_time = dto.end_time
        obj.score = dto.score

        return self.repo.add(obj)  # או commit בתוך repo

    def delete_studentexam(self, student_exam_id):
        obj = self.repo.delete(student_exam_id)
        if not obj:
            raise CleverCheckBaseError(student_exam_id)
        return obj

    def get_results(self, student_exam_id: int):
        student_exam = self.repo.get_by_id(student_exam_id)

        if not student_exam:
            return {"error": "Student exam not found"}

        exam = getattr(student_exam, "exam", None)
        if not exam:
            return {"error": "Exam not loaded"}

        questions = getattr(exam, "questions", []) or []
        answers = getattr(student_exam, "answers", []) or []

        result_questions = []
        total_score = 0

        for question in questions:

            try:
                if not question:
                    continue

                teacher = getattr(question, "teacher_answer", None)
                options = getattr(question, "options", []) or []

                answer = next(
                    (a for a in answers if getattr(a, "question_id", None) == question.id),
                    None
                )

                student_answer = None
                correct_answer = None
                is_correct = False
                score = 0

                # =========================
                # אם קיימת תשובה
                # =========================
                if answer:

                    # =========================
                    # MCQ
                    # =========================
                    if getattr(question, "question_type_id", None) == 1:

                        selected_option = next(
                            (o for o in options if o.id == answer.selected_option_id),
                            None
                        )

                        correct_option = None
                        if teacher and getattr(teacher, "correct_option_id", None):
                            correct_option = next(
                                (o for o in options if o.id == teacher.correct_option_id),
                                None
                            )

                        student_answer = getattr(selected_option, "option_text", None)
                        correct_answer = getattr(correct_option, "option_text", None)

                        is_correct = (
                                teacher is not None and
                                answer.selected_option_id == getattr(teacher, "correct_option_id", None)
                        )

                    # =========================
                    # TEXT
                    # =========================
                    else:
                        student_answer = getattr(answer, "answer_text", None)

                        if teacher:
                            correct_answer = getattr(teacher, "answer_text", None)

                        score = getattr(answer, "score", 0) or 0
                        is_correct = score == getattr(question, "max_score", None)

                else:
                    # אין תשובה כלל
                    if getattr(question, "question_type_id", None) == 1:

                        teacher = getattr(question, "teacher_answer", None)
                        correct_option = None

                        if teacher and getattr(teacher, "correct_option_id", None):
                            correct_option = next(
                                (o for o in options if o.id == teacher.correct_option_id),
                                None
                            )

                        correct_answer = getattr(correct_option, "option_text", None)

                    else:
                        if teacher:
                            correct_answer = getattr(teacher, "answer_text", None)

                # =========================
                # חישוב ניקוד סופי לשאלה
                # =========================
                if is_correct:
                    score = getattr(question, "max_score", 0) or 0

                total_score += score

                result_questions.append({
                    "questionId": getattr(question, "id", None),
                    "text": getattr(question, "question_text", None),
                    "studentAnswer": student_answer,
                    "correctAnswer": correct_answer,
                    "isCorrect": is_correct,
                    "score": score,
                    "maxScore": getattr(question, "max_score", 0)
                })

            except Exception:
                # שאלה פגומה לא מפילה את כל המבחן
                continue

        return {
            "examName": getattr(exam, "exam_name", None),
            "subject": exam.subject.subject_name if exam.subject else None,
            "score": total_score,
            "status": getattr(student_exam, "status", None),
            "questions": result_questions
        }

    def save_answer(self, student_exam_id, question_id, answer_text, selected_option_id):
        self.repo.save_answer(
            student_exam_id,
            question_id,
            answer_text,
            selected_option_id
        )

    def update_exam_grades(self, student_exam_id: int, grades_service=None):
        # 1. שירות חיצוני — חישוב ציונים (MCQ + NLP לפתוחות)
        if grades_service is not None:
            exam = grades_service.update_exam_grades(student_exam_id)
            if exam is None:
                return None
        else:
            # fallback: משנה סטטוס בלבד בלי חישוב ציונים
            exam = self.repo.get_by_id(student_exam_id)
            if not exam:
                return None

        # 2. שינוי סטטוס ל-Submitted
        exam = self.repo.update_exam_grades(student_exam_id)
        if not exam:
            return None

        return {
            "id": exam.id,
            "status": exam.status,
            "score": exam.score if hasattr(exam, 'score') else None,
        }

    def create_student_exam(self, student_id, exam_id, status='NotStarted'):
        student_exam = StudentExam(
            student_id=student_id,
            exam_id=exam_id,
            status=status
        )

        self.repo.session.add(student_exam)
        self.repo.session.commit()

        return student_exam

    def get_student_exam(self, student_id, exam_id):
        return self.repo.get_student_exam(student_id, exam_id)

    def get_scores_distribution(self, exam_id: int):
        """Return score distribution for an exam as 10 bins (0-9, 10-19, ..., 90-100)."""
        scores = self.repo.get_scores_by_exam(exam_id)
        print("SCORES:", scores)
        total = len(scores)
        avg = round(sum(scores) / total, 1) if total > 0 else 0

        bins = []

        for i in range(10):
            lo = i * 10
            hi = (i + 1) * 10 if i < 9 else 100

            count = sum(1 for s in scores if lo <= s < hi)

            bins.append({
                "min": lo,
                "max": hi,
                "count": count,
                "label": f"{lo}–{hi}",
            })

        return {
            "bins": bins,
            "totalStudents": total,
            "average": avg,
        }

    def get_student_data_for_my_data_page(self, student_id: int):
        """Return all closed exams with grades, class averages, and score distributions
        for a student — single query for the MyDataPage.

        Returns:
            list of dicts, each with:
                examId, name, subject, score, maxScore, classAvg, date, status
        """
        student_exams = self.repo.get_closed_exams_with_grades_for_student(student_id)

        result = []
        for se in student_exams:
            exam = se.exam
            if not exam:
                continue

            # Calculate max score from exam questions
            questions = exam.questions or []
            max_score = sum(getattr(q, "max_score", 0) or 0 for q in questions)

            # Calculate class average from the scores distribution logic
            scores = self.repo.get_scores_by_exam(exam.id)
            total = len(scores)
            class_avg = round(sum(scores) / total, 1) if total > 0 else 0

            result.append({
                "examId": exam.id,
                "name": exam.exam_name,
                "subject": exam.subject.subject_name if exam.subject else "",
                "score": se.score or 0,
                "maxScore": max_score or 100,
                "classAvg": class_avg,
                "date": exam.start_time.isoformat() if exam.start_time else "",
                "status": se.status,
            })

        return result

# services/exam_service.py
