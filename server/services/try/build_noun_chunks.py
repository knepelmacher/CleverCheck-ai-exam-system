import stanza

def build_noun_chunks(sent):
    chunks = []
    used = set()
    chunk_map = {}

    for w in sent.words:

        # רק שמות עצם כ-head
        if w.upos not in {"NOUN", "PROPN"}:
            continue

        if w.id in used:
            continue

        chunk_tokens = [w]

        for child in sent.words:
            if child.head == w.id:

                if child.deprel in {"compound", "amod", "nmod"}:
                    chunk_tokens.append(child)
                    used.add(child.id)

        chunk_tokens = sorted(chunk_tokens, key=lambda x: x.id)

        chunk = " ".join([t.text for t in chunk_tokens])
        for t in chunk_tokens:
            chunk_map[t.id] = chunk

        chunks.append(chunk)
        used.add(w.id)

    return chunks, chunk_map

# -----------------------------
# DEBUG RUN ONLY FOR NOUN CHUNKS
# -----------------------------
if __name__ == "__main__":
    print("LOADING STANZA...")
    nlp = stanza.Pipeline(
        lang="he",
        dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
        processors="tokenize,pos,lemma,depparse",
        download_method=None,
        verbose=False
    )

    texts = [
        "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה, את התהליכים הרצים ברקע ואת הקצאת הזיכרון לכל יישום"
        "מערכת ההפעלה מנהלת את משאבי המחשב",
        "מסד נתונים משמש לאחסון וניהול מידע",
        # "מערכת ההפעלה במחשב האישי אחראית על ניהול משאבי החומרה והתהליכים הרצים במערכת",
        "הדפדפן המודרני מציג אתרים במהירות גבוהה"
    ]

    for text in texts:
        print("\n==============================")
        print("TEXT:", text)

        doc = nlp(text)

        for sent in doc.sentences:
            chunks = build_noun_chunks(sent)

            print("NOUN CHUNKS:")
            for c in chunks:
                print("-", c)