from server.services.student_grades.my_model_service.check_with_model import check_with_model
from server.services.student_grades.singleton_service.Scribens_singleton import scribens_service


def get_student_score(question_text, student_text, teacher_text, max_score,):

    from server.services.student_grades.my_stanza_service.file_to_run import check_with_stanza

    cleaned_student_text = scribens_service.correct_text(student_text)

    score_model = check_with_model(question_text, teacher_text, cleaned_student_text)*max_score

    score_stanza = check_with_stanza(cleaned_student_text, teacher_text, max_score)

    print("score_model")
    print(score_model)
    print("score_stanza")
    print(score_stanza)

    return max(score_model,score_stanza)



