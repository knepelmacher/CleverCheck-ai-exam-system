import stanza

def extract_lemmas(text, nlp):
    if not isinstance(text, str):
        text = str(text)

    doc = nlp(text)

    lemmas = []

    for sent in doc.sentences:
        for w in sent.words:
            lemma = w.lemma

            if not lemma or lemma.strip() == "":
                continue

            lemmas.append((w.text, lemma))  # שומר גם מילה מקורית וגם lemma

    return lemmas


nlp = stanza.Pipeline(
    lang="he",
    dir=r"/server/my_model/stanza-he/resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)

text = "זרם מים טבעי"

result = extract_lemmas(text, nlp)

for word, lemma in result:
    print(f"{word} -> {lemma}")