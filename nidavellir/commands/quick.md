---
name: nid:quick
description: Run a small inline task with atomic commit -- no planning overhead
argument-hint: "[task description]"
---

## Steps

**Step 1 — Get task:**
Read `$ARGUMENTS`.
- If a task description is present, use it.
- If it is empty, ask: "What's the task?" Wait for answer.

**Step 2 — Execute task:**
Do the requested work directly.
Keep the change small and focused.
Do not create or modify project tracking docs.

**Step 3 — Commit:**
Generate a conventional commit message based on what changed.
Use the standard type that fits the work, such as `fix:`, `feat:`, `refactor:`, or `docs:`.
Run `node nidavellir/bin/nid.cjs commit '<generated message>'`

---

## Self-check

- [ ] No .planning/ files were created or modified
- [ ] `git log --oneline -1` shows a commit for this task
<!-- Add 1-2 task-specific checks below based on what was changed -->
