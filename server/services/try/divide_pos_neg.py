from server.services.main_service.my_stanza_service.check_nagative_in_answer import analyze_negative_sentence
from server.services.main_service.my_stanza_service.concept_to_struct import concept_to_struct
from server.services.main_service.my_stanza_service.teacher_concepts3 import build_concepts


def divide_pos_neg(text: str, nlp):
 #   text_set = set(text.split())
    doc = nlp(text)
    concepts_arr = []
    concepts_neg = []
    concepts_pos = []


    for sent in doc.sentences:
        concepts = build_concepts(sent)

        for c in concepts:
            concepts_arr.append(concept_to_struct(c, nlp))


    negative_positive_text = analyze_negative_sentence(text)
    negative_text = negative_positive_text.get("neg_part", "")
    positive_text = negative_positive_text.get("pos_part", "")
    doc_neg = nlp(negative_text)
    doc_pos = nlp(positive_text)

    for sent in doc_neg.sentences:
        concepts = build_concepts(sent)

        for c in concepts:
            concepts_neg.append(concept_to_struct(c, nlp))

    for sent in doc_pos.sentences:
        concepts = build_concepts(sent)

        for c in concepts:
            concepts_pos.append(concept_to_struct(c, nlp))

    return {"concepts_neg":concepts_neg, "concepts_pos": concepts_pos,"negative_text": negative_text, "positive_text": positive_text}
