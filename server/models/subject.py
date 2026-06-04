from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from server.models.base import Base

class Subject(Base):
    __tablename__ = 'Subjects'
    subject_id = Column("SubjectID", Integer, primary_key=True)
    subject_name = Column("SubjectName", String(50), unique=True, nullable=False)
    exams = relationship("Exam", back_populates="subject")