from transformers import AutoTokenizer, AutoModelForSequenceClassification
from server.config import Config
import os

BASE_DIR = Config.BASE_DIR

model_path = os.path.join(BASE_DIR, "my_model", "my_trained_dictabert")


# טעינת tokenizer ומודל
tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
model = AutoModelForSequenceClassification.from_pretrained(model_path, local_files_only=True)
