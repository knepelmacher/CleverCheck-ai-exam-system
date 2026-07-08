---
source_file: "server/exceptions/error_handlers.py"
source_type: "python"
subtype: "exception"
exports_count: 1
dependencies:
  - "flask"
imports_keywords: ["register_error_handlers"]
---

## Overview

רישום מטפלי שגיאות גלובליים ב-Flask app.

## Public Interface

### Functions

| Function | Signature | Description |
|---|---|---|
| `register_error_handlers` | `(app: Flask) -> None` | רושם handlers ל-404, 405, 500 עם הודעות בעברית |
