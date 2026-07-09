import threading
import time
from datetime import datetime, timedelta
from server.controllers.student_client_controller import submit_student_exam
from server.models import StudentExam, Exam
from server.db_connection import SessionLocal

SERVER_START_TIME = datetime.utcnow()

def run_exam_jobs():
    print("Starting exam jobs...")
    """"
    while True:
        session = SessionLocal()
        now = datetime.utcnow()

        try:
            # =========================
            # 1. פתיחת מבחנים שהגיע זמנם
            # =========================
            exams_to_open = session.query(Exam).filter(
                Exam.status == "Draft",
                Exam.start_time <= now,
                Exam.end_time > now
            ).all()

            for exam in exams_to_open:
                exam.status = "Active"

            # =========================
            # 2. סגירת מבחני תלמידים
            # =========================
            expired_student_exams = session.query(StudentExam).filter(
                StudentExam.status == "InProgress",
                StudentExam.end_time <= now
            ).all()

            for se in expired_student_exams:

                # מגבלת חודש מסיום המבחן
                max_deadline = se.end_time + timedelta(days=30)

                # חלון שבוע מחזרת השרת
                sync_deadline = SERVER_START_TIME + timedelta(days=7)

                if now >= max_deadline or now >= sync_deadline:
                    se.status = "Submitted"

            for se in expired_student_exams:
                submit_student_exam(se.id)
            # =========================
            # 3. סגירת מבחנים כלליים
            # =========================
            expired_exams = session.query(Exam).filter(
                Exam.status == "Active",
                Exam.end_time <= now
            ).all()

            for exam in expired_exams:
                exam.status = "Closed"

            # שמירה אם היה שינוי
            if exams_to_open or expired_student_exams or expired_exams:
                session.commit()
                print(
                    f"[JOB] Opened: {len(exams_to_open)}, "
                    f"Submitted: {len(expired_student_exams)}, "
                    f"Closed: {len(expired_exams)}"
                )

        except Exception as e:
            session.rollback()
            print(f"[JOB ERROR] {e}")

        finally:
            session.close()

        time.sleep(30)
"""

def start_exam_jobs():
    thread = threading.Thread(target=run_exam_jobs, daemon=True)
    thread.start()