
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

MODEL_PATH = r"C:\git\CleverCheck/server/my_model/hebert_model_download"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
def m(q,t,s):
    model.eval()  # חובה

    # -------------------------
    # פונקציית בניית קלט
    # -------------------------
    def build_input(question, reference, student):
        return f"שאלה: {question} תשובת מורה: {reference} תשובת תלמיד: {student}"


    # -------------------------
    # חיזוי
    # -------------------------
    def predict(question, reference, student):
        text = build_input(question, reference, student)

        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=128
        )

        with torch.no_grad():
            outputs = model(**inputs)

        # regression score
        return outputs.logits.item()


    score = predict(q, t, s)
    return score
