from datetime import datetime


class ExamDTO:
    def __init__(
        self,
        exam_name: str,
        teacher_id: int,
        subject_id: int = 1,
        start_time: datetime = None,
        end_time: datetime = None,
        duration_minutes: int = 60,
        status: str = "draft",
        class_ids: list = None,
        questions: list = None,
    ):
        self.exam_name = exam_name
        self.teacher_id = teacher_id
        self.subject_id = subject_id
        self.start_time = start_time or datetime.utcnow()
        self.end_time = end_time or datetime.utcnow()
        self.duration_minutes = duration_minutes
        self.status = status
        self.class_ids = class_ids or []
        self.questions = questions or []