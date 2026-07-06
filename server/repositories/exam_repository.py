from server.models.exams import Exam
from server.models.student_exams import StudentExam
from server.models.subject import Subject
from sqlalchemy import and_
from sqlalchemy.orm import Session


class ExamRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, obj: Exam):
        self.session.add(obj)
        self.session.commit()
        return obj

    def get_all(self):
        return self.session.query(Exam).all()

    def get_by_id(self, id):
        return self.session.get(Exam, id)

    def get_all_for_student(self, student_id: int):
        """שליפת כל המבחנים עם outer join ל-StudentExam של הסטודנט הספציפי, ול-Subject לשם המקצוע."""
        return (
            self.session.query(Exam)
            .outerjoin(
                StudentExam,
                and_(
                    StudentExam.exam_id == Exam.id,
                    StudentExam.student_id == student_id
                )
            )
            .outerjoin(Subject, Exam.subject_id == Subject.subject_id)
            .all()
        )

    def update(self, id, new_data: Exam):
        obj = self.get_by_id(id)

        if not obj:
            return None

        obj.exam_name = new_data.exam_name
        obj.teacher_id = new_data.teacher_id
        obj.subject_id = new_data.subject_id
        obj.start_time = new_data.start_time
        obj.end_time = new_data.end_time
        obj.duration_minutes = new_data.duration_minutes
        obj.status = new_data.status

        self.session.commit()
        return obj

    def delete(self, id):
        obj = self.get_by_id(id)

        if obj:
            self.session.delete(obj)
            self.session.commit()

        return obj