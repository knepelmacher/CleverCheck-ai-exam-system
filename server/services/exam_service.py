from datetime import datetime
from server.models.exams import Exam
from server.exceptions.exceptions import CleverCheckBaseError


# מיפוי StudentExam.status → computedStatus (תצוגה בלבד, ללא בדיקת זמן Exam)
_STUDENT_EXAM_STATUS_MAP = {
    'NotStarted': 'Draft',
    'InProgress': 'Active',
    'Submitted': 'Closed',
    'Checked': 'Closed',
}


class ExamService:
    def __init__(self, repo):
        self.repo = repo

    def add_exam(self, dto):
        self.repo.add(
            Exam(
                exam_name=dto.ExamName,
                teacher_id=dto.TeacherID,
                start_time=dto.StartTime,
                end_time=dto.EndTime,
                duration_minutes=dto.DurationMinutes,
                status=dto.Status,
            )
        )

    def get_all_exams(self):
        return self.repo.get_all()

    def get_exams_with_status(self, student_id: int):
        exams = self.repo.get_all_for_student(student_id)
        now = datetime.now()
        result = []

        for exam in exams:
            student_exam = exam.student_exams[0] if exam.student_exams else None

            # ברירת מחדל לפי זמן (DB)
            if now < exam.start_time:
                computed_status = 'Draft'
            elif exam.start_time <= now <= exam.end_time:
                computed_status = 'Active'
            else:
                computed_status = 'Closed'

            student_exam_status = None

            # אם יש StudentExam → הוא גובר (A)
            if student_exam:
                se_status = (student_exam.status or '').strip()
                student_exam_status = se_status

                if se_status == 'InProgress':
                    computed_status = 'InProgress'

                elif se_status in ['Submitted', 'Checked']:
                    computed_status = 'Closed'

                elif se_status == 'NotStarted':
                    # לא שוברים זמן — רק אם באמת בתוך חלון
                    if now < exam.start_time:
                        computed_status = 'Draft'
                    elif exam.start_time <= now <= exam.end_time:
                        computed_status = 'Active'
                    else:
                        computed_status = 'Closed'

            result.append({
                'exam': exam,
                'computedStatus': computed_status,
                'studentExamStatus': student_exam_status,
            })

        return result

    def get_exam_by_id(self, exam_id):
        obj = self.repo.get_by_id(exam_id)
        if not obj:
            raise CleverCheckBaseError(exam_id)
        return obj

    def update_exam(self, exam_id, dto):
        obj = self.repo.update(
            exam_id,
            Exam(
                exam_name=dto.ExamName,
                teacher_id=dto.TeacherID,
                start_time=dto.StartTime,
                end_time=dto.EndTime,
                duration_minutes=dto.DurationMinutes,
                status=dto.Status,
            )
        )

        if not obj:
            raise CleverCheckBaseError(exam_id)

        return obj

    def delete_exam(self, exam_id):
        obj = self.repo.delete(exam_id)
        if not obj:
            raise CleverCheckBaseError(exam_id)
        return obj