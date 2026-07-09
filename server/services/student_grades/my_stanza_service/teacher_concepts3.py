import stanza

from server.services.main_service.my_stanza_service.check_nagative_in_answer import extract_syntactic_negation


def mark_negation(concepts, neg_tokens):
    neg_tokens = set(neg_tokens)

    for c in concepts:
        if set(c["tokens"]) & neg_tokens:
            c["is_negative"] = True
        else:
            c["is_negative"] = False

    return concepts

def get_depth(word, words_by_id):
    depth = 0
    current = word

    while current.head != 0:
        depth += 1
        current = words_by_id[current.head]

    return depth

def remove_sub_concepts(concepts):
    texts = [c["text"] for c in concepts]

    result = []

    for concept in concepts:
        words = concept["text"].split()

        is_subconcept = False

        for other in texts:
            if other == concept["text"]:
                continue

            other_words = other.split()

            if all(w in other_words for w in words):
                is_subconcept = True
                break

        if not is_subconcept:
            result.append(concept)

    return result

def semantic_dedup(concepts):
    merged = {}

    for c in concepts:

        key = c.split()[0]  # HEAD בלבד

        if key not in merged:
            merged[key] = c
        else:
            # שומר הכי עשיר
            if len(c.split()) > len(merged[key].split()):
                merged[key] = c

    return list(merged.values())

def is_core_concept(word):
    return (
        word.deprel == "root"
        or (
            word.upos in {"NOUN", "PROPN"}
            and word.deprel not in {"obl"}
        )
    )

def build_concepts(sent):
    concepts = []

    children = {}
    words_by_id = {w.id: w for w in sent.words}
    for w in sent.words:
        children.setdefault(w.head, []).append(w)

    DEPREL_WEIGHTS = {"nsubj": 30, "obj": 25, "obl": 15, "compound": 5, "amod": 3}

    def collect(node):
        tokens = [node]

        for c in children.get(node.id, []):
            if c.deprel in {"compound", "amod"}:
                tokens.extend(collect(c))

        return tokens

    for w in sent.words:
        if not is_core_concept(w):
            continue

        if w.deprel == "root":
            tokens = [w]
            text = w.lemma  # או w.text אם אתה מעדיף
        else:
            tokens = collect(w)
            tokens = sorted(tokens, key=lambda x: x.id)
            text = normalize_concept(tokens)

        depth = get_depth(w, words_by_id)

        children_count = len(children.get(w.id, []))

        score = (
                children_count * 5
                - depth
                + DEPREL_WEIGHTS.get(w.deprel, 0)
        )

        if len(text.split()) >= 1:
            concepts.append({
                "text": text,
                "head_id": w.id,
                "score": score,
                "tokens": [t.id for t in tokens],
                "is_root": (w.head == 0)
            })
    print("concepts: ", concepts)






    return concepts

def normalize_concept(tokens):
    stopwords = {"ב", "של", "את", "על", "עם", "ל", "אל", "מ"}

    cleaned = [
        t.text for t in tokens
        if t.upos in {"NOUN", "PROPN"} and t.text not in stopwords
    ]

    return " ".join(cleaned)

def dedup_concepts(concepts):
    seen = set()
    result = []

    for c in concepts:

        key = c["text"]  # 👈 שינוי קריטי

        if key in seen:
            continue

        seen.add(key)
        result.append(c)

    return result

def analyze_concepts(text, nlp):
    doc = nlp(text)

    all_concepts = []

    for sent in doc.sentences:
        concepts = build_concepts(sent)

        concepts = dedup_concepts(concepts)
        concepts = remove_sub_concepts(concepts)

        negations = extract_syntactic_negation(sent)

        neg_tokens = set()
        for n in negations:
            neg_tokens |= n["tokens"]

        concepts = mark_negation(concepts, neg_tokens)

        all_concepts.extend(concepts)

    return all_concepts

# =========================
# MAIN DEMO
# =========================
if __name__ == "__main__":

    nlp = stanza.Pipeline(
        lang="he",
        dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
        processors="tokenize,pos,lemma,depparse",
        download_method=None,
        verbose=False
    )

    text = "מערכת ההפעלה במחשב האישי מנהלת בצורה יעילה את משאבי החומרה"

    result = analyze_concepts(text, nlp)

    print("\nFINAL CONCEPTS:")
    for c in result:
        print(c)