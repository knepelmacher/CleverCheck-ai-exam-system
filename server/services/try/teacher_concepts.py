from server.services.main_service.build_noun_chunks import build_noun_chunks
import stanza


def score_chunk(chunk, sent, root_id):
    score = 0
    tokens = chunk.split()

    # בדיקה על head ולא על מילים
    for w in sent.words:
        if w.text == tokens[0]:

            # 1. chunk משמעותי (יותר ממילה אחת)
            if len(tokens) >= 2:
                score += 0.4

            # 2. מחובר ל-root
            if w.head == root_id:
                score += 0.3

            # 3. קשר תחבירי חזק
            if w.deprel in {"compound", "nmod", "amod"}:
                score += 0.3

    return score


def extract_teacher_concepts(sent):
    chunks, _ = build_noun_chunks(sent)

    root = next((w for w in sent.words if w.deprel == "root"), None)
    if not root:
        return []

    scored = []

    for c in chunks:
        s = score_chunk(c, sent, root.id)

        if s >= 0.6:
            scored.append(c)

    return scored

nlp = stanza.Pipeline(
    lang="he",
    dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)

texts = [
    "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה, את התהליכים הרצים ברקע ואת הקצאת הזיכרון לכל יישום.",

    "מסד נתונים רלציוני משמש לאחסון, עיבוד וניהול מידע ארגוני, תוך שמירה על עקביות נתונים וביצוע שאילתות מורכבות.",

    "הדפדפן המודרני מציג אתרי אינטרנט בצורה מהירה, תומך בהרצת קוד JavaScript ומנהל תקשורת מאובטחת מול שרתים מרוחקים.",

    "שרת היישומים מטפל בבקשות משתמשים נכנסות, מבצע לוגיקה עסקית בצד השרת ומחזיר תגובות בפורמט JSON ללקוח.",

    "מערכת קבצים מתקדמת מארגנת נתונים על גבי הדיסק הקשיח, מנהלת הרשאות גישה ומאפשרת גיבוי ושחזור מידע במקרה של תקלה.",

    "מערכת הפעלה מבוזרת מתאמת בין מספר מחשבים ברשת, מאזנת עומסים ומבטיחה זמינות גבוהה של שירותים גם בעת כשל חלקי.",

    "מנוע חיפוש אינטרנטי סורק דפי אינטרנט, מאנדקס תוכן ומחזיר תוצאות רלוונטיות בהתאם לשאילתת המשתמש ולדירוג אלגוריתמי."
]

for text in texts:
    print("\n==============================")
    print("TEXT:", text)

    doc = nlp(text)

    for sent in doc.sentences:
        teacher_concepts = extract_teacher_concepts(sent)

        print("TEACHER CONCEPTS:")
        for c in teacher_concepts:
            print("-", c)