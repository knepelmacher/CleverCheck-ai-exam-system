from server.services.main_service.my_stanza_service.correction_answer_scribens import scribens_service
from server.services.main_service.my_stanza_service.stanza_and_Reverso_singleton import (nlp,synonym_client)
from server.services.main_service.my_stanza_service.main_stanza_service import analyze_texts


def get_student_score(student_text, teacher_text, answer_score):

    cleaned_student_text = scribens_service.correct_text(student_text)

    result = analyze_texts(
        cleaned_student_text,
        teacher_text,
        answer_score,
        nlp,
        synonym_client
    )

    return result["total_answer_score"]










if __name__ == "__main__":
    students = [
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

    teacher_text = "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה"
    for student_text in students:
        result = get_student_score(student_text, teacher_text,100)
        print(result["student_text"])
        print(result["total_answer_score"])
        print("matches_pos",result["matches_pos"])
        print("matches_neg" ,result["matches_neg"])
        print("="*50)

