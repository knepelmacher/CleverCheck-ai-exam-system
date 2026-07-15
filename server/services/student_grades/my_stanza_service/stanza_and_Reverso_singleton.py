import stanza
from server.services.main_service.my_stanza_service.Synonym_reverso import SynonymClient

nlp = stanza.Pipeline(
    lang="he",
    dir=r"/server/my_model/stanza-he/resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)

synonym_client = SynonymClient()