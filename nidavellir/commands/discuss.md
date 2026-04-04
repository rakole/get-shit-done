---
name: nid:discuss
description: Research a phase approach and produce CONTEXT.md with decisions
argument-hint: "[phase-number] [--research] [seed questions...]"
---

## Steps

**Step 1 — Parse arguments:**
Read `$ARGUMENTS`.
- If `--research` appears anywhere, enable web search mode and remove the flag from the remaining text.
- If the remaining text starts with a phase number, use that phase. Treat any text after the number as seed questions.
- If no phase number is present, run `node nidavellir/bin/nid.cjs state-read` and extract the current phase number from the output.

**Step 2 — Read phase context:**
Read `.planning/ROADMAP.md` and find the target phase.
Extract the phase goal, Plans list, and "Done when" criteria.
Read `.planning/REQUIREMENTS.md` and note the requirement IDs mapped to this phase.

**Step 3 — Surface gray areas:**
Identify 3-5 ambiguous areas about HOW to implement this phase.
- Use the phase goal and requirements, not generic boilerplate.
- If seed questions were provided, fold them in and still add any missing gray areas you find.
- Present the gray areas as a numbered list of questions.
- If web search mode is on, search before asking and include a short findings summary under each question.

Wait for answers.

**Step 4 — Synthesize decisions:**
Turn the answers into named implementation choices.
Write at least 3 items in this exact form:
`Decision: [concise choice] -- Rationale: [why this approach]`
Do not write observations or research notes as decisions.

**Step 5 — Write CONTEXT.md:**
Determine the phase directory from the target phase number and name.
If it does not exist, run `node nidavellir/bin/nid.cjs phase-init <n> '<phase-name>'`.
Write `.planning/phases/NN-name/NN-CONTEXT.md` with:
- A phase header and today's date
- A Decisions section containing every `Decision: ... -- Rationale: ...` line
- Specific implementation notes or references from the discussion

**Step 6 — Commit:**
Run `node nidavellir/bin/nid.cjs commit 'discuss(<n>): phase research decisions'`

---

## Self-check

Before marking this complete:
- [ ] `.planning/phases/NN-name/NN-CONTEXT.md` exists and is non-empty
- [ ] The file contains at least 3 lines starting with `Decision:` and including `-- Rationale:`
- [ ] Every decision is an actionable implementation choice, not a research observation
