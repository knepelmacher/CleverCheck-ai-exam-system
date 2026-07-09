# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    BASE_DIR = os.getenv("BASE_DIR")
    CLIENT_PATH = os.getenv("CLIENT_PATH")
