from sentence_transformers import util, SentenceTransformer

model = SentenceTransformer(r"/server/my_model")


def semantic_similarity(word1: str, word2: str, model):
    emb1 = model.encode(word1)
    emb2 = model.encode(word2)

    return util.cos_sim(emb1, emb2).item()>0.9

s=semantic_similarity("זורמים", "זרם", model)
print(s)