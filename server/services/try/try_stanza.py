import stanza

nlp = stanza.Pipeline(
    lang="he",
    dir=r"C:\Users\kuperbergz\PycharmProjects\CleverCheck\server\stanza-he\resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)

IGNORE_DEPRELS = {"det", "case", "punct", "aux", "mark"}


# -----------------------------
# NP EXTRACTOR (כאן אתה מוסיף)
# -----------------------------
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
# GRAPH BUILDER
# -----------------------------
def build_graph(sent):
    nodes = set()
    edges = []

    root = None

    for w in sent.words:
        if w.deprel == "root":
            root = w
            break

    if not root:
        return None

    relation = root.text
    nodes.add(relation)

    noun_chunks, chunk_map  = build_noun_chunks(sent)

    # מוסיפים nodes נקיים
    for c in noun_chunks:
        nodes.add(c)

    # edges לפי dependency ישיר
    """
    for w in sent.words:
        if w.deprel in IGNORE_DEPRELS:
            continue

        if w.head == root.id:
            target = chunk_map.get(w.id, w.text)

            edges.append(
                (root.text, w.deprel, target)
            )
            """

    def get_subtree_nodes(sent, head_id):
        children = {}

        for w in sent.words:
            children.setdefault(w.head, []).append(w.id)

        result = []

        def dfs(node_id):
            for c in children.get(node_id, []):
                if c not in result:
                    result.append(c)
                    dfs(c)

        dfs(head_id)
        return result

    root_children = get_subtree_nodes(sent, root.id)

    for child_id in root_children:
        child = next((w for w in sent.words if w.id == child_id), None)
        if not child:
            continue

        if child.deprel in IGNORE_DEPRELS:
            continue

        target = chunk_map.get(child.id, child.text)

        edges.append(
            (root.text, child.deprel, target)
        )

    return {
        "nodes": list(nodes),
        "edges": edges
    }


# -----------------------------
# PIPELINE RUNNER
# -----------------------------
def process(text):
    doc = nlp(text)

    for sent in doc.sentences:
        graph = build_graph(sent)

        print("\n==============================")
        print("TEXT:", text)

        if not graph:
            print("No graph generated")
            continue

        print("NODES:")
        for n in graph["nodes"]:
            print("-", n)

        print("EDGES:")
        for e in graph["edges"]:
            print("-", e)


# -----------------------------
# TESTS
# -----------------------------
tests = [
    "מערכת ההפעלה מנהלת את משאבי המחשב",
    "מסד נתונים משמש לאחסון וניהול מידע",
#    "מערכת ההפעלה במחשב האישי אחראית על ניהול משאבי החומרה והתהליכים הרצים במערכת"
]

for t in tests:
    process(t)