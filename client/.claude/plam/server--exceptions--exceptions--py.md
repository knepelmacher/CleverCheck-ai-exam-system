---
source_file: "server/exceptions/exceptions.py"
source_type: "python"
subtype: "exception"
exports_count: 6
dependencies: []
imports_keywords: ["CleverCheckBaseError", "ModelNotFoundError", "GradingError", "ValidationError", "DatabaseError"]
---

## Overview

הגדרת חריגות מותאמות לפרויקט. כל החריגות יורשות מ-`CleverCheckBaseError` ונושאות `http_status`.

## Public Interface

### Classes

| Class | Extends | http_status | Description |
|---|---|---|---|
| `CleverCheckBaseError` | `Exception` | 500 | בסיס כל החריגות |
| `ModelNotFoundError` | `CleverCheckBaseError` | 503 | מודל embedding לא נמצא |
| `GradingError` | `CleverCheckBaseError` | 500 | שגיאה בתהליך הערכה |
| `ValidationError` | `CleverCheckBaseError` | 400 | קלט לא תקין |
| `DatabaseError` | `CleverCheckBaseError` | 503 | שגיאת גישה ל-DB |
