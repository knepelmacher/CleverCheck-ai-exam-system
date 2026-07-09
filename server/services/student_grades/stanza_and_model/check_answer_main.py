from server.services.main_service.my_model_service.check_with_model import check_with_model
from server.services.main_service.my_stanza_service.file_to_run import check_with_stanza
from server.services.main_service.singleton_service.Scribens_singleton import scribens_service


def get_student_score(question_text, student_text, teacher_text, max_score,):

    cleaned_student_text = scribens_service.correct_text(student_text)

    score_model = check_with_model(question_text, teacher_text, cleaned_student_text)

    score_stanza = check_with_stanza(student_text, cleaned_student_text)

    return max(score_model,score_stanza)



