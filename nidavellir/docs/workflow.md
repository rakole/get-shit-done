# Nidavellir Workflow Guide

This guide walks through the Nidavellir workflow from project setup to shipping. It assumes Tabnine is already configured — if not, see [setup.md](setup.md) first.

---

## The Workflow

### 1. Start a Project — `/nid:new`

**When to use:** Starting a new project or scoping new work on existing code.

**What it produces:** A `.planning/` directory containing five planning files.

```
.planning/
  PROJECT.md        # What the project is, constraints, decisions
  REQUIREMENTS.md   # Tracked requirements with completion status
  ROADMAP.md        # Phases, plans, and done-when criteria
  STATE.md          # Current phase, status, recent decisions
  config.json       # Settings (e.g., commit_docs: true/false)
```

`/nid:new` handles both greenfield (empty project) and brownfield (existing code) paths.

---

### 2. Discuss a Phase Approach — `/nid:discuss`

**When to use:** Before planning, to research the approach and lock key decisions.

**What it produces:** `NN-CONTEXT.md` in the phase directory (e.g., `.planning/phases/01-foundation/01-CONTEXT.md`) with named implementation decisions.

> **Optional but recommended.** You can skip straight to `/nid:plan` if the phase approach is already clear.

Use the `--research` flag to enable web search mode before surfacing gray areas.

---

### 3. Plan a Phase — `/nid:plan`

**When to use:** When you are ready to break a phase into implementable tasks.

**What it produces:** `PLAN.md` in the phase directory with an atomic task breakdown (each task touches at most 3 files).

Example task structure:

```
**Task 1: Create user model**
Files: src/models/user.ts
Action: Define User interface with id, email, name fields...
Verify: grep "export interface User" src/models/user.ts
```

---

### 4. Execute the Plan — `/nid:execute`

**When to use:** When `PLAN.md` exists and you are ready to build.

**What it produces:** One git commit per task, plus `NN-SUMMARY.md` recording what was done.

Phase directory after execution:

```
.planning/phases/01-foundation/
  01-CONTEXT.md    (from /nid:discuss)
  PLAN.md          (from /nid:plan)
  01-SUMMARY.md    (from /nid:execute)
```

After execution, `STATE.md` is updated and the phase is marked complete. Repeat from `/nid:discuss` (or `/nid:plan`) for the next phase.

---

### 5. Support Commands

These commands are used as needed throughout development, not in a fixed sequence.

#### `/nid:debug` — Investigate a bug

**When to use:** When you hit a bug during development.

**What it produces:** `DEBUG.md` with hypothesis, test log, and conclusion. Persists across context resets — re-running `/nid:debug` resumes from the last state.

#### `/nid:progress` — Check project position

**When to use:** To see where you are, what phase is active, or what to do next.

**What it produces:** Status display with next-command recommendation. Detects drift between `STATE.md` and actual files on disk.

#### `/nid:quick` — Small inline task

**When to use:** For a small change that does not need planning overhead.

**What it produces:** An atomic git commit. Does not create or modify `.planning/` files.

#### `/nid:review` — Code review

**When to use:** Before committing or merging, to catch bugs and issues.

**What it produces:** Categorized findings (bugs, logic issues, security flags, convention violations) with a PASS/WARN/FAIL verdict.

---

## Command Reference

| Command | When to Use | What It Produces |
|---------|-------------|------------------|
| `/nid:new` | Starting a new project or scoping new work on existing code | `.planning/` with 5 planning files |
| `/nid:discuss` | Before planning, to research approach and lock decisions | `NN-CONTEXT.md` with named decisions |
| `/nid:plan` | When ready to break a phase into tasks | `PLAN.md` with atomic task breakdown |
| `/nid:execute` | When PLAN.md exists and you are ready to build | Per-task commits + `NN-SUMMARY.md` |
| `/nid:debug` | When you hit a bug during development | `DEBUG.md` with hypothesis/test log |
| `/nid:progress` | To check where you are or what to do next | Status display + next-command suggestion |
| `/nid:quick` | Small task outside the planning workflow | Atomic commit, no planning files |
| `/nid:review` | Before committing, to catch bugs and issues | Categorized findings + PASS/WARN/FAIL |

---

## Key Artifacts

| File | Created By | Purpose |
|------|-----------|---------|
| `PROJECT.md` | `/nid:new` | What the project is, constraints, core value |
| `REQUIREMENTS.md` | `/nid:new` | Tracked requirements with completion status |
| `ROADMAP.md` | `/nid:new` | Phases, plans, and done-when criteria |
| `STATE.md` | `/nid:new` | Current phase, status, next action |
| `config.json` | `/nid:new` | Settings (e.g., commit_docs toggle) |
| `NN-CONTEXT.md` | `/nid:discuss` | Phase decisions and research |
| `PLAN.md` | `/nid:plan` | Atomic task breakdown for a phase |
| `NN-SUMMARY.md` | `/nid:execute` | Completion record for a phase |
| `DEBUG.md` | `/nid:debug` | Bug investigation log |

---

Commands use `nid.cjs` internally for state management and commits. See [setup.md](setup.md) for the CLI reference.
