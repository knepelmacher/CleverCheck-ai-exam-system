import csv
import stanza

from server.services.main_service.my_stanza_service.Synonym_reverso import SynonymClient
from server.services.main_service.my_stanza_service.main_stanza_service import analyze_texts

nlp = stanza.Pipeline(
    lang="he",
    dir=r"/server/my_model/stanza-he/resources",
    processors="tokenize,pos,lemma,depparse",
    download_method=None,
    verbose=False
)

synonym_client = SynonymClient()

input_path = r"Y:\שונות\מלכי וציפי\test.csv"
output_path = r"Y:\שונות\מלכי וציפי\test_with_model_score_new_new.csv"

rows_output = []

with open(input_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f, quotechar='"', skipinitialspace=True)

    for i, row in enumerate(reader):
        if i == 0:
            # מוסיפים כותרת חדשה
            rows_output.append(row + ["model_score"])
            continue

        if not row:
            continue

        full_text = row[0]

        # חילוץ שדות
        question = full_text.split("[Q]")[1].split("[T]")[0].strip()
        teacher_text = full_text.split("[T]")[1].split("[S]")[0].strip()
        student_text = full_text.split("[S]")[1].strip()

        # תמיד שולחים 1 במקום הציון מה-CSV
        result = analyze_texts(student_text, teacher_text, 1, nlp, synonym_client)

        model_score = result["total_answer_score"]

        print(result["teacher_text"])
        print(result["student_text"])
        print(model_score)
        print("matches_pos", result["matches_pos"])
        print("matches_neg", result["matches_neg"])
        print("=" * 50)

        # מוסיפים עמודה חדשה
        rows_output.append(row + [model_score])

# כתיבה לקובץ חדש
with open(output_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows_output)