from flask import Flask
from controllers.subject_controller import subject_blueprint
from controllers.classes_controller import classes_blueprint
from controllers.teachers_controller import teachers_blueprint
from controllers.students_controller import students_blueprint
from controllers.exams_controller import exams_blueprint
from controllers.options_controller import options_blueprint
from controllers.question_types_controller import question_types_blueprint
from controllers.questions_controller import questions_blueprint
from controllers.student_answers_controller import student_answers_blueprint
from controllers.student_exams_controller import student_exams_blueprint
from controllers.teacher_answers_controller import teacher_answers_blueprint
from controllers.student_client_controller import student_client_bp
from flask_cors import CORS
from config import Config
from server import config
from server.controllers.students_auth_controller import auth_bp
from server.controllers.teacher_auth_controller import auth_teacher_bp
import os
from sentence_transformers import SentenceTransformer
from db_connection import health_check
from flask_cors import CORS
from server.jobs.exams_jobs import start_exam_jobs

if health_check():
    print("DB connected successfully ✅")
else:
    print("DB connection failed ❌")

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[Config.CLIENT_PATH])
app.config["SECRET_KEY"] = Config.SECRET_KEY

start_exam_jobs()

app.register_blueprint(subject_blueprint, url_prefix='/api/subjects')
app.register_blueprint(classes_blueprint, url_prefix='/api/classes')
app.register_blueprint(teachers_blueprint, url_prefix='/api/teachers')
app.register_blueprint(students_blueprint, url_prefix='/api/students')
app.register_blueprint(exams_blueprint, url_prefix='/api/exams')
app.register_blueprint(options_blueprint, url_prefix='/api/options')
app.register_blueprint(questions_blueprint, url_prefix='/api/questions')
app.register_blueprint(student_answers_blueprint, url_prefix='/api/student_answers')
app.register_blueprint(student_exams_blueprint, url_prefix='/api/student_exams')
app.register_blueprint(teacher_answers_blueprint, url_prefix='/api/teacher_answers')
app.register_blueprint(question_types_blueprint, url_prefix='/api/question_types')
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(auth_teacher_bp, url_prefix="/api/auth_teacher")


if __name__ == '__main__':
    app.run(host="localhost", port=5000)


