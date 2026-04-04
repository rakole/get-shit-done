---
name: nid:execute
description: Execute the current PLAN.md, committing after each task and writing SUMMARY.md
argument-hint: "[phase-number]"
---

## Steps

**Step 1 — Confirm current phase:**
Run `node nidavellir/bin/nid.cjs init` and read `current_phase` from the JSON output. If `$ARGUMENTS` contains a phase number, use that instead.
Confirm `.planning/phases/NN-name/PLAN.md` exists. If it does not exist, stop and tell the user to run `/nid:plan` first.

**Step 2 — Read PLAN.md (mandatory):**
Read `.planning/phases/NN-name/PLAN.md` in full. Do not rely on context from a previous `/nid:plan` session. Identify all tasks in order.

**Step 3 — Execute tasks in sequence:**
For each task in PLAN.md:
a. Read the task's **Files** and **Action** fields.
b. Execute the action (write files, run commands, make changes as specified).
c. Run the task's **Verify** command and confirm it passes.
d. Run: `node nidavellir/bin/nid.cjs commit 'task: <task name>'`
Do not proceed to the next task until the current task's Verify passes and commit succeeds.

**Step 4 — Run PLAN.md Self-check:**
Read the `## Self-check` section at the bottom of PLAN.md. Check each item. If any item fails, fix it before proceeding.

**Step 5 — Write SUMMARY.md:**
Write `.planning/phases/NN-name/NN-SUMMARY.md` with:
- `## What was done` — one bullet per task completed, naming the files changed.
- `## Decisions made` — any implementation choices that deviated from the plan, or "None" if plan was followed exactly.
- `## Requirements addressed` — the requirement IDs from ROADMAP.md for this phase.

**Step 6 — Advance phase:**
Run `node nidavellir/bin/nid.cjs phase-advance <n>` where `<n>` is the current phase number.

## Self-check

Before marking this complete:

- [ ] `node nidavellir/bin/nid.cjs state-read` output shows the current phase as complete
- [ ] `.planning/phases/NN-name/NN-SUMMARY.md` exists and contains a `## What was done` section
- [ ] Each task in the PLAN.md produced a git commit (`git log --oneline -10` shows task commit messages)
