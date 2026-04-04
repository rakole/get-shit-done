---
name: nid:new
description: Initialize a new project with Nidavellir (greenfield or brownfield)
argument-hint: "[project-name]"
---

## Steps

**Step 1 — Detect project state:**
Run: `node nidavellir/bin/nid.cjs init` and parse JSON output.
- If `project_exists: true` → Tell the user: "Project already initialized (Phase [current_phase]). Run /nid:plan to continue." Stop.
- If `project_exists: false` → Continue to Step 2.

**Step 2 — Detect greenfield vs brownfield:**
List files in the root directory.
- If files other than `nidavellir/`, `.git/`, `.planning/`, `.gitignore`, `README.md`, `LICENSE` exist → **brownfield path** (Step 3b).
- Otherwise → **greenfield path** (Step 3a).

**Step 3a — Greenfield: ask scoping questions:**
Ask in a single markdown block:
1. Project name?
2. What does it do and who is it for? (2-3 sentences)
3. What is the single most important thing it must do? (core value — one sentence)
4. Key constraints? (tech stack, environment, compatibility)
5. Commit planning docs to git? (y/n)

Wait for answers. Then go to Step 4.

**Step 3b — Brownfield: infer existing work:**
Read `package.json` (if exists), `README.md` (if exists). List root directory.
Infer: what the project is, its tech stack, what appears already built.
Print: "Existing codebase: [your summary]".
Ask:
1. Project name (confirm or correct)?
2. What NEW work needs scoping?
3. Key constraints on the new work?
4. Commit planning docs to git? (y/n)

Wait for answers. Then go to Step 4.

**Step 4 — Create `.planning/` and write files:**
Create `.planning/` if it does not exist.

**Write `.planning/PROJECT.md`:**
Read `nidavellir/templates/PROJECT.md`. Replace `[Project Name]` with project name.
Fill "What This Is" with description. Fill "Core Value" with core value (greenfield) or "Scope only: [new work]" + "Existing work: [inferred summary]" note above Constraints (brownfield).
Fill Constraints with constraints. Set date to today.

**Write `.planning/REQUIREMENTS.md`:**
Read `nidavellir/templates/REQUIREMENTS.md`. Replace `[Project Name]`.
Add `- [ ] **REQ-01**: <!-- fill in during /nid:plan -->` under the first area.
Brownfield only: add `## Validated (existing)` section listing inferred already-built items.

**Write `.planning/ROADMAP.md`:**
Read `nidavellir/templates/ROADMAP.md`. Replace `[Project Name]` and `[Milestone Name]` with "v1".
Replace `[Phase Name]` in Phase 1 with "Foundation".
Set Phase 1 goal to: "Run /nid:plan 1 to generate PLAN.md and fill in phase details".

**Write `.planning/config.json`:**
If user said "y": write `{"commit_docs": true}`
If user said "n": write `{"commit_docs": false}`
Write the file directly (no nid.cjs subcommand needed for this).

**Write `.planning/STATE.md`:**
Read `nidavellir/templates/STATE.md`. Replace `[Project Name]`.
Set "Current focus:" to "Phase 1 — Foundation".
Set "Next action:" to "Run /nid:plan 1 to plan Phase 1".

**Step 5 — Commit:**
Run: `node nidavellir/bin/nid.cjs commit 'init: project planning docs'`

---

## Self-check

Before marking this complete:
- [ ] `node nidavellir/bin/nid.cjs init` returns `project_exists: true`
- [ ] `.planning/PROJECT.md` exists and contains a non-placeholder Core Value section (no `<!-- placeholder` text)
- [ ] `.planning/config.json` exists and contains either `"commit_docs": true` or `"commit_docs": false`
- [ ] `.planning/STATE.md` exists and "Next action" line reads "Run /nid:plan 1 to plan Phase 1"
