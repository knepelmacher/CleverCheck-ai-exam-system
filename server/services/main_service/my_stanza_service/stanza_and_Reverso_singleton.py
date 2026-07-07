import stanza
from server.services.main_service.my_stanza_service.Synonym_reverso import SynonymClient


nlp = stanza.Pipeline(
    lang="he",
    processors="tokenize,pos,lemma,depparse",
    dir = "C:\\git\\CleverCheck\\server\\my_model\\stanza-he\\resources",
    download_method=None,
    verbose=False
)

synonym_client = SynonymClient()