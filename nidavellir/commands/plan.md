---
name: nid:plan
description: Create a PLAN.md for the current phase with atomic task breakdown
argument-hint: "[phase-number]"
---

## Steps

**Step 1 — Read current phase:**
Run `node nidavellir/bin/nid.cjs state-read` and read the output to find the current phase number and name. If `$ARGUMENTS` contains a phase number, use that instead.

**Step 2 — Initialize phase directory:**
Run `node nidavellir/bin/nid.cjs phase-init <n> '<phase-name>'` using the phase number and name from Step 1. Note the created path (e.g., `.planning/phases/02-core-workflow-commands/PLAN.md`).

**Step 3 — Read planning context:**
Read `.planning/REQUIREMENTS.md` — identify which requirements are marked `[ ]` (unmet).
Read `.planning/ROADMAP.md` — find the current phase's Plans list and "Done when" criteria.

**Step 4 — Write PLAN.md:**
Read `nidavellir/templates/PLAN.md` for the task structure format.
Write `.planning/phases/NN-name/PLAN.md` (path from Step 2) with:

- **Objective section:** state what this plan delivers (from the ROADMAP.md phase goal).
- **Tasks section:** one task per logical unit of work. Each task must include:
  - **Name** — action-oriented label
  - **Files** — exact paths. At most 3 files per task. If more than 3 files are needed, split into two tasks.
  - **Action** — concrete steps: what to write, what CLI to run
  - **Verify** — a runnable shell command that proves the task is done
  - **Done** — observable acceptance criterion
  - Order tasks by dependency: tasks that create files needed by later tasks come first.
- **Self-check section:** 3 items specific to this phase, each naming a file or runnable command — no vague criteria.

**Step 5 — Commit:**
Run `node nidavellir/bin/nid.cjs commit 'plan(<n>): <phase-name>'`

## Self-check

Before marking this complete:

- [ ] `.planning/phases/NN-name/PLAN.md` exists (confirmed by the `nid.cjs phase-init` output path)
- [ ] Every task in PLAN.md **Files:** line lists at most 3 file paths
- [ ] PLAN.md ends with a `## Self-check` section containing at least 3 filled-in items (no placeholder text remaining)
