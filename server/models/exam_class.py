from sqlalchemy import Column, Integer, ForeignKey
from server.models.base import Base
from sqlalchemy.orm import relationship


class ExamClass(Base):
    __tablename__ = "ExamClasses"

    class_id = Column(
        "ClassID",
        Integer,
        ForeignKey("Classes.ClassID"),
        primary_key=True
    )

    exam_id = Column(
        "ExamID",
        Integer,
        ForeignKey("Exams.ExamID"),
        primary_key=True
    )

    class_ = relationship(
        "Class",
        back_populates="exam_classes"
    )

    exam = relationship(
        "Exam",
        back_populates="exam_classes"
    )