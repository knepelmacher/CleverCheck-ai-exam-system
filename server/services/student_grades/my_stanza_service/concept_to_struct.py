def concept_to_struct(concept, nlp):
    doc = nlp(concept["text"])

    lemmas = {
        w.lemma
        for s in doc.sentences
        for w in s.words
        if w.lemma
    }

    # בחירת head פשוטה (אפשר לשפר אחר כך)
    head = None
    for w in doc.sentences[0].words:
        if w.upos in {"NOUN", "PROPN"}:
            head = w.lemma
            break

    return {
        "text": concept["text"],
        "lemmas": lemmas,
        "head": head,
        "score": concept["score"],
        "is_negative": concept.get("is_negative", False)
    }