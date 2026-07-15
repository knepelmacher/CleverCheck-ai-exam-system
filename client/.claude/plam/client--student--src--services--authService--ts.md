---
source_file: "client/student/src/services/authService.ts"
source_type: "typescript"
subtype: "service"
exports_count: 1
dependencies:
  - "../types"
imports_keywords: ["authService", "login", "me", "JWT"]
---

## Overview
שירות אימות — התחברות ושליפת פרטי משתמש. כל הקריאות עם `credentials: 'include'`.

## Public Interface

### Export: `authService` (object literal)

| Method | Signature | Returns | Description |
|---|---|---|---|
| `me` | `() => Promise<User>` | `User` | שליפת פרטי תלמיד מה-cookie |
| `login` | `(payload: {id: string, password: string, rememberMe: boolean}) => Promise<{success: boolean}>` | `{success: boolean}` | התחברות — POST עם student_name + password |
