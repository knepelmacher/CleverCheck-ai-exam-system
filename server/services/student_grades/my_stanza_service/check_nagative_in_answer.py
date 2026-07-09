from collections import defaultdict

NEG_WORDS = {"לא","בלא", "אין", "אסור", "בלי", "אינו", "אינה", "אינם", "אינן"}

def tokens_to_phrase(sent, token_ids):
    return " ".join(
        w.text
        for w in sent.words
        if w.id in token_ids
    )

def split_by_negation(sentence, neg_tokens_list):
    """
    מחזיר:
    1. כל תת-המשפטים של שלילה
    2. כל שאר המשפט
    """

    neg_tokens = set()
    for neg in neg_tokens_list:
        neg_tokens |= neg["tokens"]

    neg_part = [
        w.text
        for w in sentence.words
        if w.id in neg_tokens
    ]

    non_neg_part = [
        w.text
        for w in sentence.words
        if w.id not in neg_tokens
    ]

    return " ".join(neg_part), " ".join(non_neg_part)

def build_children_map(sentence):
    children = defaultdict(list)

    for word in sentence.words:
        children[word.head].append(word.id)

    return children


def collect_subtree(root_id, children_map, id_to_word):
    """
    אוסף תת-עץ של פסוקית שלילה בלי לבלוע פסוקיות מקבילות.
    """
    stack = [root_id]
    subtree = set()

    while stack:
        node = stack.pop()

        if node in subtree:
            continue

        subtree.add(node)

        for child in children_map.get(node, []):
            child_word = id_to_word[child]

            # חיתוך coordination
            if child_word.deprel in {"conj", "cc"}:
                continue

            stack.append(child)

    return subtree


def extract_syntactic_negation(sentence):
    children_map = build_children_map(sentence)
    id_to_word = {w.id: w for w in sentence.words}

    negations = []

    for word in sentence.words:

        if word.lemma not in NEG_WORDS:
            continue

        # ❗ לא לעלות ל-ROOT של המשפט
        # אלא לעבוד עם ה-head התחבירי האמיתי
        head_id = word.head if word.head != 0 else word.id

        subtree = collect_subtree(head_id, children_map, id_to_word)

        negations.append({
            "negation_word": word.text,
            "head": head_id,
            "tokens": subtree
        })

    return negations

def analyze_negative_sentence(sentence, nlp):
    doc = nlp(sentence)

    all_results = []

    for sent in doc.sentences:
        result = extract_syntactic_negation(sent)

        neg_text, non_neg_text = split_by_negation(sent, result)

        all_results.append({
            "result": result,
            "neg_part": neg_text,
            "pos_part": non_neg_text,
            "raw_negations": result
        })

    return all_results


if __name__ == "__main__":
    import stanza

    nlp = stanza.Pipeline(
        lang="he",
        dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
        processors="tokenize,pos,lemma,depparse",
        download_method=None,
        verbose=False
    )

    texts = [
        "אין לי מחשב אבל לא חסר לי כלום",
        "אין לי מחשב",
        "המחשב עובד תקין",
        "אסור למחוק את הקובץ",
        "לא ניתן להתחבר לשרת",
        "מערכת ההפעלה לא מנהלת את המחשב וכן מריצה פקודות",
        "מערכת ההפעלה מנהלת את משאבי החומרה אך לא מריצה קוד",
        "מערכת ההפעלה במחשב האישי לא מנהלת בצורה יעילה את משאבי החומרה"
    ]

    for text in texts:
        result=analyze_negative_sentence(text, nlp)
        print(result)

        # print(f"\nטקסט: {text}")
        #
        # doc = nlp(text)
        #
        # for sent in doc.sentences:
        #
        #     print("\n----- DEPENDENCIES -----")
        #
        #     for word in sent.words:
        #         print(
        #             f"id={word.id}, "
        #             f"text={word.text}, "
        #             f"head={word.head}, "
        #             f"deprel={word.deprel}, "
        #             f"lemma={word.lemma}"
        #         )
        #
        #     result = extract_syntactic_negation(sent)
        #
        #     neg_text, non_neg_text = split_by_negation(sent, result)
        #
        #     print(f"\nNEG PART: {neg_text}")
        #     print(f"NON-NEG PART: {non_neg_text}")
        #
        #     print("\nResult:")
        #     print(result)
        #
        #     for neg in result:
        #
        #         negated_words = [
        #             word.text
        #             for word in sent.words
        #             if word.id in neg["tokens"]
        #         ]
        #
        #         phrase = tokens_to_phrase(sent, neg["tokens"])
        #
        #         print(
        #             f"Negation={neg['negation_word']}, "
        #             f"Head={neg['head']}, "
        #             f"Tokens={negated_words}, "
        #             f"Phrase=\"{phrase}\""
        #         )