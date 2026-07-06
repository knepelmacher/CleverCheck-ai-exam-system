import threading
import time
from datetime import datetime

from server.models import StudentExam, Exam
from server.db_connection import SessionLocal


def run_exam_jobs():
    while True:
        session = SessionLocal()
        now = datetime.utcnow()

        try:
            # =========================
            # 1. סגירת מבחני תלמידים
            # =========================
            expired_student_exams = session.query(StudentExam).filter(
                StudentExam.status == "InProgress",
                StudentExam.end_time <= now
            ).all()

            for se in expired_student_exams:
                se.status = "Submitted"

            # =========================
            # 2. סגירת מבחנים כלליים
            # =========================
            expired_exams = session.query(Exam).filter(
                Exam.status != "Closed",
                Exam.end_time <= now
            ).all()

            for exam in expired_exams:
                exam.status = "Closed"

            # שמירה אם היה שינוי
            if expired_student_exams or expired_exams:
                session.commit()
                print(f"[JOB] Updated: {len(expired_student_exams)} student exams, {len(expired_exams)} exams")

        except Exception as e:
            session.rollback()
            print(f"[JOB ERROR] {e}")

        finally:
            session.close()

        time.sleep(30)


def start_exam_jobs():
    thread = threading.Thread(target=run_exam_jobs, daemon=True)
    thread.start()