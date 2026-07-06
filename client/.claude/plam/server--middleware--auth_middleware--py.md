---
source_file: "server/middleware/auth_middleware.py"
source_type: "python"
subtype: "middleware"
exports_count: 1
dependencies:
  - "jwt"
  - "flask"
imports_keywords: ["token_required", "jwt", "Config"]
---

## Overview

Decorator לאימות JWT. שולף token מ-cookie, מפענח, ושומר את ה-user data ב-`request.user`.

## Public Interface

### Functions

| Function | Signature | Description |
|---|---|---|
| `token_required` | `(f) -> wrapper` | Decorator — בודק JWT cookie, מחזיר 401 אם לא תקין/פג תוקף |
