---
name: nid:progress
description: Check project position, detect state drift, and recommend next command
argument-hint: "[phase-number]"
---

## Steps

**Step 1 — Read project state:**
Run `node nidavellir/bin/nid.cjs init` and parse the JSON output.
If `$ARGUMENTS` contains a phase number, use that phase. Otherwise use `current_phase`.
Read `.planning/ROADMAP.md` for the full phase list, goals, and plan counts.
Read `.planning/PROJECT.md` if it exists to get the project name.

**Step 2 — Display status:**
Print:
- Project name
- One line per phase showing completion status
- A simple progress bar such as `[====------]`
- Current position in the form `Phase N -- [name] ([status])`

**Step 3 — Detect drift:**
Inspect the target phase directory `.planning/phases/NN-name/` and check all of these:
- `NN-SUMMARY.md` exists but STATE.md shows the phase incomplete
- STATE.md shows the phase complete but `NN-SUMMARY.md` is missing
- `PLAN.md` or `NN-PLAN.md` exists but STATE.md says the phase is not started
- `DEBUG.md` exists and still shows `Status: open`
- The phase directory has CONTEXT.md but no PLAN.md
Report every condition you find. If none apply, explicitly say no drift was found.

**Step 4 — Recommend next action:**
Suggest the single best next command based on the state and any drift.
Examples: `/nid:discuss 3`, `/nid:plan 3`, `/nid:execute 2`, `/nid:debug`
Do not execute anything automatically.

---

## Self-check

Before marking this complete:
- [ ] The output includes the current phase number and phase name
- [ ] At least one concrete drift condition was checked against files on disk
- [ ] The output ends with a specific next-command recommendation
