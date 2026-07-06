---
source_file: "client/student/src/store/authStore.ts"
source_type: "typescript"
subtype: "store"
exports_count: 1
dependencies:
  - "zustand"
  - "../types"
imports_keywords: ["useAuthStore", "AuthState", "User", "isAuthenticated"]
---

## Overview
Zustand store לניהול מצב אימות — user, isAuthenticated, loading.

## Public Interface

### Export: `useAuthStore`

### State

| Field | Type | Initial |
|---|---|---|
| `user` | `User \| null` | `null` |
| `isAuthenticated` | `boolean` | `false` |
| `loading` | `boolean` | `true` |

### Actions

| Action | Signature | Description |
|---|---|---|
| `setUser` | `(user: User \| null) => void` | קובע user, isAuthenticated, loading=false |
| `setLoading` | `(loading: boolean) => void` | משנה loading |
