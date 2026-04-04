---
name: nid:review
description: Structured code review with categorized findings and pass/warn/fail verdict
argument-hint: ""
---

## Steps

**Step 1 — Get diff:**
Run `git diff --staged`.
- If it is non-empty, review the staged changes.
- If it is empty, run `git diff` and review unstaged changes instead.
- If both are empty, print: "Nothing to review. Stage changes with `git add` or make modifications first." Stop.

**Step 2 — Read project context:**
Read `.planning/PROJECT.md` if it exists.
Extract any project-specific conventions or constraints that should be part of the review.

**Step 3 — Analyze and categorize:**
Review the diff in four categories:
1. **Bugs** — logic errors, broken behavior, missing error handling. Verdict: PASS or FAIL.
2. **Logic** — unclear flow, missing edge cases, unnecessary complexity. Verdict: PASS or WARN.
3. **Security** — secrets, injection risks, unsafe input handling. Verdict: PASS or FAIL.
4. **Conventions** — naming, formatting, dead code, commented-out code, and project-specific command rules. Verdict: PASS or WARN.
For each category, list specific findings with file path and line number, or say `No issues found.`

**Step 4 — Render verdict:**
Print a summary table:
`| Category | Verdict |`
Include rows for Bugs, Logic, Security, and Conventions.
Then print `**Overall: FAIL**` if any category failed, `**Overall: WARN**` if any category warned but none failed, or `**Overall: PASS**` if all categories passed.

---

## Self-check

Before marking this complete:
- [ ] The review used `git diff --staged` or the `git diff` fallback
- [ ] All four categories have explicit verdicts
- [ ] An overall PASS, WARN, or FAIL verdict appears at the end
