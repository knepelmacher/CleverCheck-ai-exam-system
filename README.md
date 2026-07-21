# GRADEX — מערכת בדיקת מבחנים אוטומטית

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2-CC3534)](https://www.sqlalchemy.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)

**Gradex** is an automated exam management and grading platform for Israeli educational institutions. It enables teachers to create and schedule exams with multiple question types, while students take exams online and receive AI-powered grading for open-ended Hebrew answers using a hybrid NLP pipeline (SentenceTransformers, Stanza, and DictaBERT).

---

## Quick Start

```bash
# Clone and enter the project
git clone <repository-url>
cd GRADEX

# Backend
cd server
python -m venv .venv
.venv\Scripts\activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py                    # Starts on http://localhost:5000

# Teacher Portal (new terminal)
cd client/teacher
npm install
npm run dev                      # Starts on http://localhost:5173

# Student Portal (new terminal, optional)
cd client/student
npm install
npm run dev                      # Starts on http://localhost:5174
```

> See [Installation & Setup](#installation--setup) for detailed prerequisites including SQL Server and ML model setup.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Security](#security)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [NLP Grading Pipeline](#nlp-grading-pipeline)
- [Background Jobs](#background-jobs)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

---

## Overview

Gradex provides two portals:

- **Teacher Portal** — A React SPA for creating exams with multiple question types (American multiple-choice, open-ended, true/false, numeric), scheduling them for specific classes, viewing real-time results with score distributions, and managing students, teachers, and subjects. Role-based access (teacher/admin).
- **Student Portal** — A React SPA where students log in, browse active exams, answer questions with auto-save, and view graded results.

Core capabilities:

- Full CRUD for exams, questions, options, students, teachers, subjects, and classes
- JWT cookie-based authentication with role-based route guards
- Automated exam lifecycle management (Draft → Active → Closed)
- AI-powered grading of open-ended Hebrew answers using a hybrid model pipeline
- RTL Hebrew UI built with MUI 5
- Scheduled background jobs for exam auto-open/close and student exam auto-submit

---

## Screenshots

### Teacher Portal

| Dashboard | Exam Editor |
|-----------|-------------|
| ![Teacher Dashboard](docs/screenshots/dashboard.png) | ![Exam Editor](docs/screenshots/exam-editor.png) |

| Exams List | Results View |
|------------|-------------|
| ![Exams List](docs/screenshots/exams.png) | ![Results](docs/screenshots/results.png) |

### Student Portal

| Exam Interface | Results View |
|----------------|-------------|
| ![Student Exam](docs/screenshots/student-exam.png) | ![Student Results](docs/screenshots/student-results.png) |

> Screenshots are maintained in `docs/screenshots/`. To add screenshots, capture each view and save them with the filenames shown above. The table will render correctly once images are placed in the directory.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19, TypeScript 6 |
| **Build Tool** | Vite 8 |
| **UI Library** | MUI 5 (Material-UI) |
| **Routing** | React Router 6 |
| **Forms** | react-hook-form + zod |
| **HTTP Client** | Axios (with credentials) |
| **State Management** | React Context (teacher), Zustand (student) |
| **Backend Framework** | Flask 3 (Python) |
| **ORM** | SQLAlchemy 2.x |
| **Database** | SQL Server (via pyodbc) |
| **Authentication** | JWT (HS256) in HTTP-only cookies |
| **NLP/ML** | SentenceTransformers, Stanza, DictaBERT, PyTorch |
| **Testing** | pytest, pytest-cov |

---

## Project Structure

```
GRADEX/
├── .env                          # Environment variables (not committed)
├── .gitignore
│
├── server/                       # Flask backend
│   ├── app.py                    # Application entry point, blueprint registration
│   ├── config.py                 # Loads .env into Config class
│   ├── db_connection.py          # SQLAlchemy engine + SessionLocal
│   ├── requirements.txt          # Python dependencies
│   ├── pytest.ini                # pytest configuration
│   │
│   ├── controllers/              # Flask blueprints (route handlers)
│   │   ├── exams_controller.py           # /api/exams
│   │   ├── questions_controller.py       # /api/questions
│   │   ├── subject_controller.py         # /api/subjects
│   │   ├── classes_controller.py         # /api/classes
│   │   ├── teachers_controller.py        # /api/teachers
│   │   ├── students_controller.py        # /api/students
│   │   ├── options_controller.py         # /api/options
│   │   ├── question_types_controller.py  # /api/question_types
│   │   ├── student_answers_controller.py # /api/student_answers
│   │   ├── student_exams_controller.py   # /api/student_exams
│   │   ├── teacher_answers_controller.py # /api/teacher_answers
│   │   ├── students_auth_controller.py   # /api/auth (student login)
│   │   ├── teacher_auth_controller.py    # /api/auth_teacher
│   │   ├── student_client_controller.py  # Student-facing endpoints
│   │   └── grading_controller.py         # /api/grade (NLP grading)
│   │
│   ├── services/                 # Business logic
│   │   ├── exam_service.py               # Exam CRUD + status computation
│   │   ├── auth_student_service.py       # Student credential validation
│   │   ├── auth_teacher_service.py       # Teacher credential validation
│   │   ├── jwt_student_service.py        # JWT create/decode (student)
│   │   ├── jwt_teacher_service.py        # JWT create/decode (teacher)
│   │   ├── student_exam_service.py       # Student exam lifecycle
│   │   └── student_grades/               # NLP grading pipeline
│   │       ├── my_model_service/         # DictaBERT model scoring
│   │       ├── my_stanza_service/        # Stanza concept extraction & matching
│   │       ├── stanza_and_model/         # Combined scorer (max of both)
│   │       └── singleton_service/        # Lazy-loaded singletons
│   │
│   ├── repositories/             # Data access layer (SQLAlchemy queries)
│   │
│   ├── models/                   # SQLAlchemy ORM models (14 tables)
│   │   ├── exams.py, questions.py, options.py
│   │   ├── teachers.py, student.py
│   │   ├── subject.py, classes.py
│   │   ├── exam_class.py, teacher_class.py
│   │   ├── question_types.py
│   │   ├── student_exams.py, student_answer.py
│   │   └── teacher_answer.py
│   │
│   ├── dtos/                     # Data transfer objects
│   ├── middleware/               # JWT auth middleware (@token_required)
│   ├── exceptions/               # Custom exceptions + error handlers
│   ├── jobs/                     # Background thread (exam lifecycle)
│   └── tests/                    # Backend tests
│
├── client/                       # Frontend applications
│   ├── teacher/                  # Teacher/admin portal
│   │   ├── package.json          # Dependencies & scripts
│   │   ├── vite.config.ts        # Vite + API proxy config
│   │   ├── tsconfig.json         # TypeScript config
│   │   └── src/
│   │       ├── main.tsx          # Entry point (BrowserRouter + AuthProvider)
│   │       ├── App.tsx           # Route definitions with RouteGuard
│   │       ├── theme.ts          # MUI RTL theme (orange primary)
│   │       ├── config.ts         # SERVER_URL from env
│   │       ├── api/              # HTTP client + endpoint modules
│   │       ├── models/           # TypeScript interfaces
│   │       ├── pages/            # Page components
│   │       │   ├── HomePage.tsx, Login.tsx
│   │       │   ├── DashboardPage.tsx, ExamsPage.tsx
│   │       │   ├── ExamEditorPage.tsx (create/edit exams)
│   │       │   ├── ExamResultsPage.tsx, StudentExamDetailsPage.tsx
│   │       │   ├── AdminPage.tsx, AdminStudentsPage.tsx
│   │       │   ├── AdminTeachersPage.tsx, AdminSubjectsPage.tsx
│   │       │   └── Login.tsx
│   │       ├── components/      # Reusable components
│   │       ├── context/          # AuthContext (React Context)
│   │       ├── services/         # Auth + student test services
│   │       └── utils/            # examStatus helpers
│   │
│   └── student/                  # Student exam-taking portal
│       ├── package.json
│       ├── vite.config.js        # Port 5174, no proxy
│       └── src/
│           ├── App.tsx           # Routes (login, dashboard, exam, results)
│           ├── pages/            # DashboardPage, ExamPage, LoginPage, ResultsPage
│           ├── components/       # LoginForm, ExamCard, ScoreHistogram
│           ├── store/            # Zustand stores (auth, exam, ui)
│           ├── hooks/            # useAuth, useAutoSaveExam
│           ├── services/         # authService, examService
│           └── types/            # TypeScript type definitions
```

---

## Architecture

```
┌──────────────────────┐     ┌──────────────────────┐
│   Teacher Portal     │     │   Student Portal     │
│  (React + MUI + RTL) │     │  (React + Zustand)   │
│   Port 5173 (Vite)   │     │   Port 5174 (Vite)   │
└─────────┬────────────┘     └─────────┬────────────┘
          │                            │
          │  /api/* (proxy)            │  http://localhost:5000/api/*
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────────┐
│                Flask REST API (:5000)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Controllers│─▶│ Services │─▶│   Repositories   │  │
│  └──────────┘  └────┬─────┘  └────────┬─────────┘  │
│                      │                │             │
│  ┌───────────────────┤                ▼             │
│  │ NLP Pipeline      │    ┌──────────────────┐     │
│  │ ┌───────────────┐ │    │   SQL Server     │     │
│  │ │ DictaBERT     │ │    │  (CleverCheckDB) │     │
│  │ │ Stanza        │ │    └──────────────────┘     │
│  │ │ SentenceTransf│ │                             │
│  │ │ Reverso Syn.  │ │  ┌──────────────────┐     │
│  │ │ Scribens Spell│ │  │  Background Jobs  │     │
│  │ └───────────────┘ │  │  (exam lifecycle) │     │
│  └───────────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────┘
```

**Data flow**:

1. Teacher creates an exam → questions, options, and teacher answers stored in SQL Server
2. Background job auto-opens the exam at `start_time` (Draft → Active)
3. Student takes the exam → answers saved progressively (auto-save every 60s)
4. Student submits → answers stored in `StudentAnswers` with `StudentExam.status = "Submitted"`
5. For open-ended questions, the NLP pipeline scores answers via DictaBERT + Stanza concept matching
6. Teacher views results with score distribution and per-student answer details

---

## Prerequisites

### Backend

- Python 3.10+
- SQL Server with ODBC Driver 17 for SQL Server
- A working `my_model/` directory containing:
  - SentenceTransformer model files
  - DictaBERT model files (under `onlplabalephbertbase/`)
  - Tokenizer and sentencepiece model files
- Windows, Linux, or macOS

### Frontend

- Node.js 18+ (LTS recommended)
- npm or yarn

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GRADEX
```

### 2. Backend Setup

```bash
cd server

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

Create a SQL Server database named `CleverCheckDB`:

```sql
CREATE DATABASE CleverCheckDB;
```

Create a login and user with appropriate permissions:

```sql
CREATE LOGIN gradex_user WITH PASSWORD = 'YourPassword123!';
USE CleverCheckDB;
CREATE USER gradex_user FOR LOGIN gradex_user;
ALTER ROLE db_owner ADD MEMBER gradex_user;
```

Tables are created automatically on first run via `Base.metadata.create_all()`.

### 4. ML Model Setup

Place your model files in the `server/my_model/` directory. The expected structure:

```
server/my_model/
├── config.json / model.safetensors / pytorch_model.bin / tf_model.h5
├── tokenizer.json / tokenizer_config.json
├── special_tokens_map.json / sentencepiece.bpe.model
└── onlplabalephbertbase/
    ├── config.json / pytorch_model.bin / tf_model.h5
    ├── tokenizer_config.json / special_tokens_map.json / vocab.txt
    └── flax_model.msgpack / training_args.bin
```

> Model binary files (`.h5`, `.bin`, `.safetensors`) are excluded from version control by `.gitignore`.

### 5. Frontend Setup

```bash
cd client/teacher

# Install dependencies
npm install
```

```bash
cd client/student

# Install dependencies
npm install
```

---

## Configuration

### Environment Variables (`.env`)

Create a `.env` file at the project root:

```ini
# ── Database ─────────────────────────────────────────
DB_SERVER=192.168.43.13          # SQL Server host
DB_NAME=CleverCheckDB             # Database name
DB_DRIVER=ODBC+Driver+17+for+SQL+Server

# ── ML Model ────────────────────────────────────────
MODEL_PATH=C:\path\to\GRADEX\server\my_model

# ── Grading Thresholds ─────────────────────────────
SIMILARITY_THRESHOLD=0.65         # Minimum concept similarity
LLM_REVIEW_MIN=0.40               # Lower bound for LLM review
LLM_REVIEW_MAX=0.85               # Upper bound for LLM review
NEGATION_WINDOW=5                 # Negation detection window (words)

# ── Server ──────────────────────────────────────────
PORT=5000
FLASK_DEBUG=false
SECRET_KEY=<your-secret-key>      # Used for JWT signing

# ── SSL ─────────────────────────────────────────────
DISABLE_SSL_VERIFY=true           # Dev only — must be false in production

# ── Client ──────────────────────────────────────────
CLIENT_PATH=http://localhost:5173
```

> Database credentials are configured in `server/db_connection.py`. For production deployments, these should be externalized to environment variables.

### Vite Proxy

The teacher portal (`client/teacher/vite.config.ts`) proxies `/api/*` to `http://localhost:5000` in development. The student portal connects directly to the backend.

---

## Running the Application

### 1. Start the Backend

```bash
cd server
python app.py
```

The Flask server starts on `http://localhost:5000`. On startup:

- DB health check runs and prints pass/fail
- Background exam lifecycle thread starts
- 12 API blueprints are registered

### 2. Start the Teacher Portal

```bash
cd client/teacher
npm run dev
```

Opens on `http://localhost:5173` with hot module replacement.

### 3. Start the Student Portal (optional)

```bash
cd client/student
npm run dev
```

Opens on `http://localhost:5174`.

---

## API Overview

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth_teacher/login` | Teacher login → JWT cookie |
| GET | `/api/auth_teacher/me` | Get current teacher from JWT |
| POST | `/api/auth_teacher/logout` | Clear JWT cookie |
| POST | `/api/auth/login` | Student login → JWT cookie |
| GET | `/api/auth/me` | Get current student from JWT |
| POST | `/api/auth/logout` | Clear JWT cookie |

### Exams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | List exams (filtered by teacher unless admin) |
| POST | `/api/exams` | Create exam with questions |
| GET | `/api/exams/stats` | Aggregate stats (total, active, draft, closed, avg score) |
| GET | `/api/exams/teacher/<id>` | Full exam details + student exams + answers |
| GET | `/api/exams/<id>` | Basic exam detail (student-facing) |
| PUT | `/api/exams/<id>` | Update exam + questions |
| DELETE | `/api/exams/<id>` | Delete exam |

### CRUD Endpoints

All follow RESTful conventions at `/api/<resource>`:

- `/api/subjects` — Subjects management
- `/api/classes` — Classes management
- `/api/teachers` — Teachers management
- `/api/students` — Students management
- `/api/questions` — Questions management
- `/api/options` — Answer options management
- `/api/question_types` — Question types management
- `/api/student_answers` — Student answer records
- `/api/student_exams` — Student exam records
- `/api/teacher_answers` — Teacher answer keys

### Grading (NLP)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/grade` | Score a student's open-ended answer |
| GET | `/api/results/<id>` | Get grading result with per-concept scores |

> The grading API is implemented but currently disabled. To enable it, uncomment the grading blueprint registration in `server/app.py` and ensure the model singletons are properly initialized.

---

## Security

### Authentication

- **JWT (HS256)** tokens stored in **HTTP-only cookies** with `SameSite=Lax` — prevents JavaScript access to tokens and protects against XSS token theft
- **Separate auth flows** for teachers (`/api/auth_teacher`) and students (`/api/auth`) with independent JWT services
- Passwords hashed using **werkzeug.security** (`generate_password_hash` / `check_password_hash`)

### Authorization

- **Role-based access control**: users are assigned `teacher` or `admin` roles
- **Backend**: teacher-scoped data filtering — teachers see only their own exams; admins see all resources
- **Frontend**: `RouteGuard` component checks user role before rendering routes; unauthorized users are redirected
- **Controller-level**: exam creation/update reads `teacher_id` from the JWT payload, preventing impersonation

### Environment & Secrets

- Configuration loaded from `.env` via `python-dotenv`; the `.env` file is excluded from version control
- `SECRET_KEY` stored in environment variable, used for JWT signing
- Grading thresholds and model path configurable via environment variables

### Production Hardening Checklist

| Item | Current State | Action Required |
|------|--------------|-----------------|
| Cookie `secure` flag | `False` | Set to `True` when behind HTTPS |
| Database credentials | Hardcoded in `db_connection.py` | Move to environment variables |
| Rate limiting | Not implemented | Add rate limiting on login endpoints |
| HTTPS | Not enforced | Terminate TLS at reverse proxy (nginx) |
| CORS | Restricted to `CLIENT_PATH` | Verify origin in production deployment |

---

## Testing

### Backend Tests

```bash
cd server
pytest
```

Configuration in `pytest.ini`:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

Current test coverage:

- `test_grading_controller.py` — Grading API endpoint tests
- `test_grading_repository.py` — Repository layer tests
- `test_student_client_api.py` — Student client API tests
- `conftest.py` — Shared fixtures (sys.path setup)

### Frontend Tests

No frontend test framework is currently configured. To add:

```bash
cd client/teacher
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## Build & Deployment

### Teacher Portal Build

```bash
cd client/teacher
npm run build
```

Output goes to `client/teacher/dist/`. The build runs `tsc -b` for type checking before bundling with Vite.

### Student Portal Build

```bash
cd client/student
npm run build
```

### Production Deployment

For production:

1. Build both frontends:
   ```bash
   cd client/teacher && npm run build
   cd client/student && npm run build
   ```
2. Serve the Flask app behind a production WSGI server (gunicorn/uWSGI):
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 server.app:app
   ```
3. Serve static frontend files via nginx or the Flask app itself
4. Set `FLASK_DEBUG=false`, configure a strong `SECRET_KEY`
5. Set `secure=True` on JWT cookies
6. Enable HTTPS

---

## NLP Grading Pipeline

The automated grading system combines two parallel approaches and takes the maximum score:

### Model-Based Scoring (`my_model_service/`)

- Formats input as `[Q] question [T] teacher_answer [S] student_answer`
- Passes through DictaBERT (`onlplabalephbertbase`) for Hebrew text understanding
- Returns a continuous score normalized to the question's max score

### Stanza-Based Scoring (`my_stanza_service/`)

1. **Spelling Correction** — Scribens.fr API corrects Hebrew spelling errors in student answers
2. **Concept Extraction** — Stanza NLP pipeline extracts key concepts from teacher answers
3. **Concept Matching** — Student concepts are matched against teacher concepts using:
   - Semantic similarity via SentenceTransformer embeddings
   - Synonym detection via Reverso.net (Hebrew)
   - Negation detection for polarity-aware scoring
4. **Score Computation** — Per-concept similarity scores are aggregated

### Combined Scoring (`stanza_and_model/`)

```python
final_score = max(model_score, stanza_score)
```

### Singleton Services

ML models are loaded as lazy singletons to avoid reloading:

- `SentenceTransformer_singleton.py` — Embedding model
- `dictabert_singleton.py` — DictaBERT model + tokenizer
- `stanza_singleton.py` — Stanza NLP pipeline
- `Scribens_singleton.py` — Spelling correction client
- `Reverso_singelton.py` — Synonym lookup client

---

## Background Jobs

A daemon thread (`server/jobs/exams_jobs.py`) runs every 30 seconds to manage exam lifecycle:

| Action | Trigger | Status Change |
|--------|---------|---------------|
| **Auto-open** | `start_time ≤ now < end_time` AND `status = "Draft"` | Draft → Active |
| **Auto-close** | `end_time ≤ now` AND `status = "Active"` | Active → Closed |
| **Auto-submit** | Student exam `end_time` passed AND `status = "InProgress"` | InProgress → Submitted |

The thread survives individual cycle errors and logs all actions.

---

## Troubleshooting

### Database Connection Issues

**Error**: `pyodbc.InterfaceError: ('IM002', '[IM002] [Microsoft][ODBC Driver Manager] Data source name not found')`

**Solution**: Install ODBC Driver 17 for SQL Server:

```powershell
# Windows
winget install Microsoft.ODBCDriver17forSQLServer
```

Verify with: `odbcinst -q -d`

### Model Loading Errors

**Error**: `ModelNotFoundError` or `OSError: Can't load tokenizer`

**Solution**: Ensure `MODEL_PATH` in `.env` points to a valid `my_model/` directory containing SentenceTransformer and DictaBERT model files. Check that `config.py` correctly loads the `.env` file.

### CORS Issues

**Error**: Browser console shows CORS errors when the student portal calls the API

**Solution**: The teacher portal uses Vite proxy — CORS is handled. The student portal calls `http://localhost:5000` directly — ensure Flask-CORS is configured with the correct origin. In `app.py`:

```python
CORS(app, supports_credentials=True, origins=[Config.CLIENT_PATH])
```

### Frontend Port Conflicts

**Error**: `Port 5173 is already in use`

**Solution**: Kill the existing process or change the port in `vite.config.ts`:

```typescript
server: { port: 5175 }
```

### JWT Cookie Not Sent

**Symptom**: `401 Unauthorized` on authenticated endpoints

**Solution**: Ensure the client sends `withCredentials: true` (Axios) or `credentials: 'include'` (fetch). The cookie is HTTP-only and SameSite=Lax.

---

## Development Notes

### Code Generation

Helper scripts exist for scaffolding new layers:

- `server/generate_repositories.py` — Auto-generate repository classes
- `server/generate_services.py` — Auto-generate service classes

### Adding a New Entity

1. Create SQLAlchemy model in `server/models/`
2. Import it in `server/models/__init__.py`
3. Create repository in `server/repositories/`
4. Create service in `server/services/`
5. Create DTO in `server/dtos/` (optional)
6. Create controller blueprint in `server/controllers/`
7. Register blueprint in `server/app.py`

### RTL / Hebrew Support

- The MUI theme is RTL (`direction: 'rtl'`)
- Font: Rubik, fallback to Arial
- All teacher portal UI is in Hebrew
- Backend NLP pipeline handles Hebrew text natively via DictaBERT + Stanza

### Status Flow

Exam status lifecycle:

```
Draft ──(start_time reached)──▶ Active ──(end_time reached)──▶ Closed
```

Student exam status lifecycle:

```
NotStarted ──(student begins)──▶ InProgress ──(submit/auto-submit)──▶ Submitted ──▶ Checked
```

The `computeStatus()` function on the frontend computes display status from `startTime`/`endTime` relative to the current clock. The backend background job enforces the same transitions server-side.

### Question Type Mapping

| ID | Type | Description |
|----|------|-------------|
| 1 | `american` | Multiple choice — options + correct answer selection |
| 2 | `open` | Free-text — NLP-graded |
| 3 | `truefalse` | True/False |
| 4 | `numeric` | Numeric answer |

### Current Limitations

- **Schema migrations**: No migration tool is configured. [Alembic](https://alembic.sqlalchemy.org/) is recommended for production schema management.
- **Grading integration**: The NLP grading pipeline is implemented at the service layer but the controller blueprint is not yet registered in the application entry point.
- **Student portal data**: The student-facing endpoints in `student_client_controller.py` return static mock data. Integration with the shared exam and student services is in progress.
- **Frontend test coverage**: A frontend test framework has not yet been configured. The backend includes pytest suites; adding Vitest with React Testing Library is the recommended path.
- **Containerization**: No Docker or container orchestration configuration is included.
- **Database credential isolation**: Database credentials are embedded in `db_connection.py`. Moving them to environment variables is recommended for production deployments.
- **Student portal UI**: The student portal uses plain CSS without a component library.

---

## License

*This section should be completed by the project owner.*

---

## Contributing

*Contribution guidelines to be added by the project maintainers.*
