from server.models import StudentExam
from server.models.student_answer import StudentAnswer


class StudentExamRepository:
    def __init__(self, session):
        self.session = session

    def add(self, entity):
        self.session.add(entity)
        self.session.commit()
        return entity

    def get_all(self):
        return self.session.query(StudentExam).all()

    def get_by_id(self, id):
        return self.session.get(StudentExam, id)

    def get_full_exam_for_student(self, student_id, exam_id):
        return (
            self.session.query(StudentExam)
            .filter(
                StudentExam.student_id == student_id,
                StudentExam.exam_id == exam_id
            )
            .first()
        )

    def delete(self, id):
        obj = self.get_by_id(id)
        if obj:
            self.session.delete(obj)
            self.session.commit()
        return obj

    def save_answer(self, student_exam_id, question_id, answer_text, selected_option_id):
        try:
            existing = self.session.query(StudentAnswer).filter_by(
                student_exam_id=student_exam_id,
                question_id=question_id
            ).first()

            if existing:
                existing.answer_text = answer_text
                existing.selected_option_id = selected_option_id
            else:
                new_answer = StudentAnswer(
                    student_exam_id=student_exam_id,
                    question_id=question_id,
                    answer_text=answer_text,
                    selected_option_id=selected_option_id
                )
                self.session.add(new_answer)

            self.session.commit()

        except Exception as e:
            self.session.rollback()
            raise e

    def update_exam_grades(self, student_exam_id: int):
        """משנה סטטוס ל-Submitted ומבצע commit"""
        try:
            obj = self.session.get(StudentExam, student_exam_id)

            if not obj:
                return None

            # הסטטוס לא נקבע פה — מי שקורא ל-repository אחראי על זה
            self.session.commit()

            return obj

        except Exception as e:
            self.session.rollback()
            print(e)
            return None

    def get_student_exam(self, student_id, exam_id):
        return self.session.query(StudentExam).filter_by(
            student_id=student_id,
            exam_id=exam_id
        ).first()

    def get_scores_by_exam(self, exam_id: int) -> list[float]:
        """Return scores of all checked/submitted StudentExams for a given exam,
        limited to students whose class is assigned to the exam."""
        from server.models.student import Student
        from server.models.exam_class import ExamClass

        rows = (
            self.session.query(StudentExam.score)
            .join(Student, StudentExam.student_id == Student.id)
            .join(ExamClass, Student.class_id == ExamClass.class_id)
            .filter(
                StudentExam.exam_id == exam_id,
                ExamClass.exam_id == exam_id,
                StudentExam.score.isnot(None),
                StudentExam.status.in_(["Submitted", "Checked"]),
            )
            .all()
        )
        return [row.score for row in rows if row.score is not None]

