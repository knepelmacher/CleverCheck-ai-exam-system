from server.services.main_service.my_stanza_service.semantic_similarity import semantic_similarity


def match_concepts(teacher_concepts, student_concepts, student_text, model,synonym_client, nlp):
    results = []
    text_student_concepts = {item["text"].strip() for item in student_concepts}
    #student_words = set(student_text.split())
    doc = nlp(student_text)

    student_words = {
        w.lemma
        for sent in doc.sentences
        for w in sent.words
        if w.lemma
    }
    #print(student_words)
    #teacher_nagative=analyze_nagative_sentence()

    for tc in teacher_concepts:
        teacher_text = tc["text"].strip()
        if teacher_text in text_student_concepts :
            results.append({
                "text": [teacher_text],
                "score": tc.get("score", 0),
                "matched_words": teacher_text,
                "missing_words": [],
            })
            continue

        teacher_words = teacher_text.split()
        total_words = len(teacher_words)
        if total_words == 0:
            continue

        matched_words = []
        missing_words = []

#        used_student_words = set()

        for teacher_word in teacher_words:
            found = False

            for student_word in student_words:
                if teacher_word == student_word:
                    matched_words.append(teacher_word)
                    found = True
                    break

                # Embedding
                similarity = semantic_similarity(
                    teacher_word,
                    student_word,
                    model
                )
                if similarity:
                    matched_words.append(teacher_word)
                    found = True
                    break

                # Synonyms
                try:
                    if synonym_client.are_synonyms(
                            teacher_word,
                            student_word
                    ):

                        matched_words.append(teacher_word)
                        found = True
                        break

                except Exception:
                    pass
            if not found:
                missing_words.append(teacher_word)

        matched_count = len(matched_words)

        if matched_count == total_words:
            score = tc.get("score", 0) * 0.9
        elif matched_count == 2:
            score = tc.get("score", 0) * 0.8
        elif matched_count == 1:
            score = tc.get("score", 0) * 0.7
        else:
            score = 0

        results.append({
            "text": teacher_text,
            "score": round(score, 4),
            "student": " ".join(matched_words),
            "matched_words": matched_words,
             "missing_words": missing_words,
        })

    return results
