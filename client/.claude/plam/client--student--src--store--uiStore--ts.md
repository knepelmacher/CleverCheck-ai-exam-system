---
source_file: "client/student/src/store/uiStore.ts"
source_type: "typescript"
subtype: "store"
exports_count: 1
dependencies:
  - "zustand"
imports_keywords: ["useUIStore", "timerVisible", "sidebarOpen"]
---

## Overview
Zustand store לממשק — שליטה על נראות timer ו-sidebar.

## Public Interface

### Export: `useUIStore`

### State

| Field | Type | Initial |
|---|---|---|
| `timerVisible` | `boolean` | `true` |
| `sidebarOpen` | `boolean` | `true` |

### Actions

| Action | Signature |
|---|---|
| `setTimerVisible` | `(value: boolean) => void` |
| `setSidebarOpen` | `(value: boolean) => void` |
