from server.services.main_service.build_noun_chunks import build_noun_chunks
import stanza


def concept_filter(sent, chunks, chunk_map):
    root = next((w for w in sent.words if w.deprel == "root"), None)
    if not root:
        return []

    concepts = []

    for chunk in chunks:
        tokens = chunk.split()

        head_ids = [
            wid for wid, c in chunk_map.items()
            if c == chunk
        ]

        if not head_ids:
            continue

        head_word = next((w for w in sent.words if w.id == head_ids[0]), None)
        if not head_word:
            continue

        score = 0

        # 1. קשר לרוט (מרכזי)
        if head_word.head == root.id:
            score += 0.5

        # 2. ישות שמית אמיתית
        if head_word.upos in {"NOUN", "PROPN"}:
            score += 0.2

        # 3. סינון רעש
        noise_words = {"צורה", "אופן", "מהירות", "גבוהה", "יעילה", "מודרני", "מתקדם"}
        if any(t in noise_words for t in tokens):
            score -= 0.4

        # 4. מבנה סמנטי תקין
        if any(w.upos == "NOUN" for w in sent.words if w.id in head_ids):
            score += 0.3

        if score >= 0.6:
            concepts.append(chunk)

    return concepts


# -----------------------------
# PIPELINE
# -----------------------------
nlp = stanza.Pipeline(
    lang="he",
    dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)


texts = [
    "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה, את התהליכים הרצים ברקע ואת הקצאת הזיכרון לכל יישום.",

    "מסד נתונים רלציוני משמש לאחסון, עיבוד וניהול מידע ארגוני תוך שמירה על עקביות נתונים וביצוע שאילתות מורכבות.",

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
        chunks, chunk_map = build_noun_chunks(sent)

        teacher_concepts = concept_filter(sent, chunks, chunk_map)

        print("TEACHER CONCEPTS:")
        for c in teacher_concepts:
            print("-", c)