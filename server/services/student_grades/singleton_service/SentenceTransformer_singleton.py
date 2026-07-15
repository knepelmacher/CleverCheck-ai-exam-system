from sentence_transformers import SentenceTransformer

from server.config import Config
import os

BASE_DIR = Config.BASE_DIR

model_path = os.path.join(BASE_DIR, "my_model")

model = SentenceTransformer(model_path)