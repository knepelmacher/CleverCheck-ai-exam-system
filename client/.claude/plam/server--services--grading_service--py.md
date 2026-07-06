---
source_file: "server/services/grading_service.py"
source_type: "python"
subtype: "service"
exports_count: 1
dependencies:
  - "sentence_transformers"
  - "keybert"
imports_keywords: ["GradingService", "SentenceTransformer", "KeyBERT", "grade_answer"]
---

## Overview

שירות הניקוד המרכזי. בודק תשובות טקסט פתוחות מול תשובות מפתח באמצעות SentenceTransformer (השוואה סמנטית) ו-KeyBERT (חילוץ מושגים). מחזיר ציון (0-100), מושגים מכוסים/חסרים, זיהוי שלילה וסטטוס.

## Public Interface

### Classes

#### `GradingService`
| Constructor | |
|---|---|
| `__init__(self, model)` | מקבל מודל SentenceTransformer, יוצר KeyBERT |

| Method | Signature | Returns | Description |
|---|---|---|---|
| `grade_answer` | `(self, student_answer: str, model_answer: str) -> dict` | `dict` | פונקציה ראשית — מחזירה `score`, `key_concepts`, `covered`, `missing`, `has_negation`, `status`, `needs_review`, `review_reason` |
| `extract_key_concepts` | `(self, model_answer: str, top_n: int = 5) -> list[str]` | `list[str]` | חילוץ מושגים מ-KeyBERT + ניקוי אותיות חיבור |
| `get_concept_coverage` | `(self, student_answer: str, key_concepts: list[str]) -> tuple` | `tuple[list, list]` | מחזיר `(covered, missing)` לפי cosine similarity > 0.5 |
| `check_negation` | `(self, text: str) -> bool` | `bool` | בדיקת ביטויי שלילה בעברית |
