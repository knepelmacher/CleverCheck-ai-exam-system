"""
db_connection.py — חיבור SQLAlchemy ל-SQL Server
"""
import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from server.models import Base

logger = logging.getLogger(__name__)

# ── הרכבת Connection String ──────────────────────────────────
from urllib.parse import quote_plus

#_SERVER = os.getenv('DB_SERVER', r'localhost\SQLEXPRESS')
#_DATABASE = os.getenv('DB_NAME', 'CleverCheckDB')
#_DRIVER = os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')
_SERVER = '192.168.43.13'
_DATABASE = 'CleverCheckDB'
_DRIVER = os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')

#params = quote_plus(f"DRIVER={_DRIVER};SERVER={_SERVER};DATABASE={_DATABASE};Trusted_Connection=yes")
params = quote_plus(f"DRIVER={_DRIVER};SERVER={_SERVER};DATABASE={_DATABASE};UID=gradex_user;PWD=Gradex123!")

DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(
    f'mssql+pyodbc://gradex_user:Gradex123!@{_SERVER}/{_DATABASE}'
    f'?driver={_DRIVER.replace(" ", "+")}'
    f'&TrustServerCertificate=yes'
)
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT @@SERVERNAME, DB_NAME()"
    ))
    print(result.fetchone())

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def init_db() -> None:
    """יצירת טבלאות אם לא קיימות (Dev/Test בלבד — בפרודקשן: Alembic)."""
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready.")


def get_db() -> Session:
    """
    Generator לשימוש עם Dependency Injection (Flask / pytest).
    סוגר את ה-session בסיום הבקשה.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def health_check() -> bool:
    """בדיקת תקינות חיבור — משמש ב-/health endpoint."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error(f"DB health check failed: {exc}")
        return False

if __name__ == "__main__":
    print(health_check())



