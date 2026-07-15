from sentence_transformers import util


def semantic_similarity(word1: str, word2: str, model):
    emb1 = model.encode(word1)
    emb2 = model.encode(word2)

    return util.cos_sim(emb1, emb2).item()>0.9
