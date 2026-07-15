from sentence_transformers import SentenceTransformer

from server.services.student_grades.my_stanza_service.check_nagative_in_answer import analyze_negative_sentence
from server.services.student_grades.my_stanza_service.concept_match import match_concepts
from server.services.student_grades.my_stanza_service.concept_to_struct import concept_to_struct
from server.services.student_grades.my_stanza_service.teacher_concepts3 import analyze_concepts
from server.services.student_grades.singleton_service.SentenceTransformer_singleton import model


def analyze_texts(student_text: str, teacher_text: str, answer_score, nlp, synonym_client):
    # student_lemmas = extract_lemmas(student_text, nlp)
    student_set = set(student_text.split())
    teacher_concepts = []
    student_concepts = []
    teacher_pos_concepts = []
    teacher_neg_concepts = []
    student_pos_concepts = []
    student_neg_concepts = []
    # student_pos_text=""
    # student_neg_text = ""

    # doc = nlp(teacher_text)
    # teacher_negative_positive_text=analyze_nagative_sentence(teacher_text)
    # teacher_negative_text=teacher_negative_positive_text["neg_part"]
    # teacher_positive_text=teacher_negative_positive_text["pos_part"]
    # doc_neg = nlp(teacher_negative_text)
    # doc_pos = nlp(teacher_positive_text)
    #
    #
    # doc_s = nlp(student_text)
    # student_negative_positive_text=analyze_nagative_sentence(teacher_text)
    # student_negative_text=student_negative_positive_text["neg_part"]
    # student_positive_text=student_negative_positive_text["pos_part"]
    # doc_s_neg = nlp(student_negative_text)
    # doc_s_pos = nlp(student_positive_text)
    # negations_all = analyze_negative_sentence(teacher_text, nlp)

    # for sent in doc.sentences:

    # neg = analyze_negative_sentence(teacher_text, nlp)
    # neg = neg_data[0]
    concepts = analyze_concepts(teacher_text, nlp)

    for c in concepts:
        struct = concept_to_struct(c, nlp)
        teacher_concepts.append(struct)

        if struct.get("is_negative"):
            teacher_neg_concepts.append(struct)
        else:
            teacher_pos_concepts.append(struct)

    neg_results = analyze_negative_sentence(student_text, nlp)

    student_neg_text = " ".join(item["neg_part"] for item in neg_results)
    student_pos_text = " ".join(item["pos_part"] for item in neg_results)

    concepts = analyze_concepts(student_text, nlp)

    for c in concepts:
        struct = concept_to_struct(c, nlp)

        student_concepts.append(struct)

        if struct.get("is_negative"):
            student_neg_concepts.append(struct)
        else:
            student_pos_concepts.append(struct)

    matches_pos = match_concepts(teacher_pos_concepts, student_pos_concepts, student_pos_text, model, synonym_client,
                                 nlp)
    matches_neg = match_concepts(teacher_neg_concepts, student_neg_concepts, student_neg_text, model, synonym_client,
                                 nlp)
    # for a in matches:
    #     if a["score"] != 0 :
    #         print(a)
    # total_answer_score=(sum(m["score"] for m in matches_pos)+sum(m["score"] for m in matches_neg))*answer_score
    teacher_total = sum(c["score"] for c in teacher_concepts)

    student_score = (
            sum(m["score"] for m in matches_pos)
            + sum(m["score"] for m in matches_neg)
    )
    total_answer_score = round(
        (student_score / teacher_total) * answer_score,
        2
    )
    return {
        "teacher_text": teacher_text,
        "student_text": student_text,
        "student_set": student_set,
        "teacher_concepts": teacher_concepts,
        "matches_pos": matches_pos,
        "matches_neg": matches_neg,
        "total_answer_score": total_answer_score
    }
