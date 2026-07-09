import torch
from server.services.main_service.singleton_service.dictabert_singleton import model, tokenizer
# מצב חיזוי
model.eval()

def predict_score(text):
    inputs = tokenizer(
        text,
        truncation=True,
        padding="max_length",
        max_length=512,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    # בגלל num_labels=1 זה ערך רציף אחד
    score = outputs.logits.squeeze().item()

    return score

def format_model_text(question, teacher_answer, student_answer):
    return f"[Q] {question} [T] {teacher_answer} [S] {student_answer}"

def check_with_model(question, teacher_answer, student_answer):
    text = format_model_text(
        question,
        teacher_answer,
        student_answer
    )

    score = predict_score(text)

    return score

