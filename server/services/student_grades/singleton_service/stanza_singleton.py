import stanza
from server.config import Config
import os

BASE_DIR = Config.BASE_DIR

dir = os.path.join(BASE_DIR, "my_model", "stanza-he", "resources")

nlp = stanza.Pipeline(
    lang="he",
    processors="tokenize,pos,lemma,depparse",
    dir = dir,
    download_method=None,
    verbose=False
)
