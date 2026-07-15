import threading
import time
import traceback
from datetime import datetime, timedelta
from sqlalchemy import func
from server.controllers.student_exams_controller import submit_student_exam
from server.models import StudentExam, Exam
from server.db_connection import SessionLocal

SERVER_START_TIME = datetime.utcnow()

CHECK_INTERVAL_SECONDS = 30


def _open_exams(session, now):
    """Open exams whose start time has arrived."""

    all_exams = session.query(Exam).all()

    exams_to_open = session.query(Exam).filter(
        func.lower(Exam.status) == "draft",
        Exam.start_time <= now,
        Exam.end_time > now
    ).all()


    for exam in exams_to_open:
        exam.status = "Active"

    return exams_to_open


def _gather_expired_student_exams(session, now):
    """Collect student exams whose time has passed. Only marks those past the deadlines."""
    expired = session.query(StudentExam).filter(
        StudentExam.status == "InProgress",
        StudentExam.end_time <= now
    ).all()

    submitted_ids = []
    for se in expired:
        max_deadline = se.end_time + timedelta(days=30)
        sync_deadline = SERVER_START_TIME + timedelta(days=7)

        if now >= max_deadline or now >= sync_deadline:
            se.status = "Submitted"
            submitted_ids.append(se.id)

    return expired, submitted_ids


def _close_exams(session, now):
    """Close exams whose end time has passed."""
    expired_exams = session.query(Exam).filter(
        Exam.status == "Active",
        Exam.end_time <= now
    ).all()

    for exam in expired_exams:
        exam.status = "Closed"

    return expired_exams


def _run_one_cycle():
    """Runs a single check cycle. Returns False on error so the outer loop continues."""
    session = SessionLocal()
    submitted_ids: list[int] = []
    try:
        now = datetime.now()
        opened = _open_exams(session, now)
        expired, submitted_ids = _gather_expired_student_exams(session, now)
        closed = _close_exams(session, now)

        # Single commit — all three functions modify objects on this session
        if opened or expired or closed:
            session.commit()
            print(
                f"[JOB] {now.strftime('%H:%M:%S')} | "
                f"Opened: {len(opened)}, "
                f"Expired: {len(expired)}, "
                f"Closed: {len(closed)}"
            )
        else:
            session.rollback()

        # submit_student_exam uses its own session — call after our commit
        for se_id in submitted_ids:
            try:
                submit_student_exam(se_id)
                print(f"[JOB] Submitted student exam {se_id}")
            except Exception as e:
                print(f"[JOB] Failed to submit student exam {se_id}: {e}")

        return True
    except Exception as e:
        try:
            session.rollback()
        except Exception:
            pass
        print(f"[JOB ERROR] {e}")
        traceback.print_exc()
        return False
    finally:
        try:
            session.close()
        except Exception:
            pass


def run_exam_jobs():
    """Runs forever — the thread never dies even if a cycle fails."""
    while True:
        try:
            if not _run_one_cycle():
                # Error occurred — log and continue
                pass
        except Exception as e:
            print(f"[JOB FATAL] Unexpected error in cycle: {e}")
            traceback.print_exc()

        time.sleep(CHECK_INTERVAL_SECONDS)


def start_exam_jobs():
    thread = threading.Thread(target=run_exam_jobs, daemon=True)
    thread.start()
    print("[JOB] Exam auto-open/close thread started")
