---
source_file: "server/config.py"
source_type: "python"
subtype: "config"
exports_count: 1
dependencies:
  - "os"
  - "dotenv"
imports_keywords: ["Config", "SECRET_KEY"]
---

## Overview

קובץ קונפיגורציה — טוען משתני סביבה מקובץ `.env` וחושף אותם דרך מחלקת Config.

## Public Interface

### Classes

#### `Config`
| Field | Type | Source |
|---|---|---|
| `SECRET_KEY` | `str` | `os.getenv("SECRET_KEY")` |
