import stanza
from typing import List


# יצירת Pipeline פעם אחת בלבד בעת טעינת המודול
# כך לא נטען מודלים מחדש בכל קריאה לפונקציה.
print("LOADING STANZA...")
_NLP = stanza.Pipeline(
    lang="he",
    dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)


def get_lemmas(text: str) -> List[str]:
    """
    מקבלת טקסט בעברית ומחזירה רשימת צורות בסיס (lemmas).

    Args:
        text: טקסט לעיבוד.

    Returns:
        רשימת צורות בסיס לפי סדר המילים בטקסט.

    Example:
         get_lemmas("המחשב מנהלת את משאבי המחשב")
        ['ה', 'מחשב', 'ניהל', 'את', 'משאב', 'ה', 'מחשב']
    """
    if not text or not text.strip():
        return []

    doc = _NLP(text)

    return [
        word.lemma
        for sentence in doc.sentences
        for word in sentence.words
        if word.lemma
    ]


def get_lemma_text(text: str) -> str:
    """
    מקבלת טקסט ומחזירה מחרוזת של צורות הבסיס.

    Example:
        get_lemma_text("המחשב מנהלת את משאבי המחשב")
        'ה מחשב ניהל את משאב ה מחשב'
    """
    return " ".join(get_lemmas(text))

def debug_dependencies(text: str) -> None:
    doc = _NLP(text)

    for sent in doc.sentences:
        for word in sent.words:
            print(
                f"id={word.id:<2} "
                f"text={word.text:<15} "
                f"lemma={word.lemma:<15} "
                f"upos={word.upos:<10} "
                f"head={word.head:<2} "
                f"deprel={word.deprel}"
            )

if __name__ == "__main__":
    debug_dependencies(
        "מסד נתונים משמש לאחסון וניהול מידע"

    )

#if __name__ == "__main__":

    #sentence = "המחשב מנהלת את משאבי המחשב"

    #print("מקור:", sentence)
    #print("Lemmas:", get_lemmas(sentence))
    #print("Lemma text:", get_lemma_text(sentence))