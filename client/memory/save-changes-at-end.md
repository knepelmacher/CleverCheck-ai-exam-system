---
name: save-changes-at-end
description: Record every code change immediately in a change-log file throughout each session
metadata:
  type: feedback
---

After EVERY code change (every Edit, Write, or multi-file refactor), immediately
append a record to a change-log file for this session. The record must include:
- The file path
- A short description of what was changed and why
- The state BEFORE the change
- The state AFTER the change
- How to revert (e.g., specific git command or manual steps)

This is NOT only at end of session — it's live, after every single change.

Create the change-log file at `memory/changes-YYYY-MM-DD.md` (one per day).
If the file doesn't exist yet, create it with a heading. Append each change as a
new section.

**Why:** So every change is traceable in real-time and can be rolled back individually.

**How to apply:** After each Edit/Write that modifies code, append to the daily
change-log immediately before moving on.
