---
source_file: "client/student/src/App.tsx"
source_type: "tsx"
subtype: "component"
exports_count: 2
dependencies:
  - "react-router-dom"
  - "./hooks/useAuth"
imports_keywords: ["App", "Routes", "Navigate", "DashboardPage", "ExamPage", "LoginPage", "ResultsPage", "RTL"]
---

## Overview
קומפוננטת השורש — מגדירה ניתוב (React Router) עם RTL.

## Public Interface

### Export: `App` (default + named)

| Route | Component | Description |
|---|---|---|
| `/` | Navigate to `/login` | הפניה אוטומטית |
| `/login` | `LoginPage` | דף התחברות |
| `/dashboard` | `DashboardPage` | דף הבית |
| `/exam/:examId` | `ExamPage` | דף בחינה |
| `/results/:id` | `ResultsPage` | דף תוצאות |

- `useAuth()` נקרא ב-mount
- `dir="rtl"` על ה-div הראשי
