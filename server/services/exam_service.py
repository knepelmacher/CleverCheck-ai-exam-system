from server.models.exams import Exam
from server.models.exam_class import ExamClass
from server.models.questions import Question
from server.models.options import Option
from server.models.teacher_answer import TeacherAnswer
from server.exceptions.exceptions import CleverCheckBaseError


class ExamService:
    def __init__(self, repo):
        self.repo = repo

    def add_exam(self, dto):
        session = self.repo.session

        exam = Exam(
            exam_name=dto.exam_name,
            teacher_id=dto.teacher_id,
            subject_id=dto.subject_id,
            start_time=dto.start_time,
            end_time=dto.end_time,
            duration_minutes=dto.duration_minutes,
            status=dto.status,
        )
        session.add(exam)
        session.flush()  # get exam.id without committing yet

        # Create ExamClass links for selected classes
        for class_id in dto.class_ids:
            session.add(ExamClass(exam_id=exam.id, class_id=class_id))

        # Save questions with options and teacher answers
        for idx, q_data in enumerate(dto.questions):
            question = Question(
                exam_id=exam.id,
                question_number=idx + 1,
                question_text=q_data.get('text', ''),
                question_type_id=q_data.get('typeId', 1),
                max_score=q_data.get('score', 10),
            )
            session.add(question)
            session.flush()  # get question.id before adding options/answers

            question_type = q_data.get('questionType', 'open')
            options_list = q_data.get('options', [])
            correct_answer = q_data.get('correctAnswer', '')

            if question_type == 'american' and options_list:
                for opt_idx, opt_text in enumerate(options_list):
                    option = Option(
                        question_id=question.id,
                        option_number=opt_idx + 1,
                        option_text=opt_text,
                    )
                    session.add(option)
                    session.flush()

                    # If this option is the correct answer, create TeacherAnswer
                    if opt_text.strip() == correct_answer.strip():
                        teacher_answer = TeacherAnswer(
                            question_id=question.id,
                            correct_option_id=option.id,
                            answer_text=None,
                        )
                        session.add(teacher_answer)
            elif correct_answer:
                # Open / numeric / truefalse — save answer as text
                teacher_answer = TeacherAnswer(
                    question_id=question.id,
                    correct_option_id=None,
                    answer_text=correct_answer,
                )
                session.add(teacher_answer)

        session.commit()
        return exam

    def get_all_exams(self):
        return self.repo.get_all()

    def get_exam_by_id(self, exam_id):
        obj = self.repo.get_by_id(exam_id)
        if not obj:
            raise CleverCheckBaseError(exam_id)
        return obj

    def update_exam(self, exam_id, dto):
        obj = self.repo.update(
            exam_id,
            Exam(
                exam_name=dto.exam_name,
                teacher_id=dto.teacher_id,
                subject_id=dto.subject_id,
                start_time=dto.start_time,
                end_time=dto.end_time,
                duration_minutes=dto.duration_minutes,
                status=dto.status,
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