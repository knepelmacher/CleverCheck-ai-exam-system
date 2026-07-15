from server.services.student_grades.singleton_service.stanza_singleton import (nlp)
from server.services.student_grades.singleton_service.Reverso_singelton import (synonym_client)
from server.services.student_grades.my_stanza_service.main_stanza_service import analyze_texts
from server.services.student_grades.stanza_and_model.check_answer_main import get_student_score


def check_with_stanza(student_text, teacher_text, answer_score):
    print(student_text)
    print(teacher_text)
    print(answer_score)
    result = analyze_texts(
        student_text,
        teacher_text,
        answer_score,
        nlp,
        synonym_client
    )
    print("result_stanza")
    print(result["total_answer_score"])
    return result["total_answer_score"]


if __name__ == "__main__":
    students = [
        "כמה פעמים מחברים את אותו מספר",
        "מערכת ההפעלה אחראית על ניהול משאבי החומרה, הקצאת זיכרון, תזמון תהליכים ותקשורת בין התוכנות לרכיבי החומרה.",
        "מערכת ההפעלה מנהלת את החומרה, מקצה זיכרון ומבצעת תזמון תהליכים.",
        "מערכת ההפעלה מקצה זיכרון ליישומים ומנהלת תהליכים.",
        "מערכת ההפעלה משמשת כמתווך בין התוכנות לבין רכיבי המחשב ומנהלת את המשאבים הדרושים להפעלת תוכניות.",
        "מערכת ההפעלה מאפשרת להריץ תוכנות על המחשב.",
        "מסד נתונים משמש לאחסון מידע בצורה מאורגנת.",
        "מערכת ההפעלה מנהלת את משאבי החומרה ואינה מקצה זיכרון ליישומים.",
        "מערכת ההפעלה אחראית על ניהול משאבי המחשב, חלוקת זיכרון לתוכניות ותיאום פעולת התהליכים.",
        "מערכת הפעלה מריצה קודים",
        "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה"
    ]
    teacher_text = "כמה פעמים מחברים אותו מספר"
  #  teacher_text = "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה"
    for student_text in students:
        result = check_with_stanza(student_text, teacher_text,20)
        print(result["student_text"])
        print(result["total_answer_score"])
        print("matches_pos",result["matches_pos"])
        print("matches_neg" ,result["matches_neg"])
        print("="*50)

