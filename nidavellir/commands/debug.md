---
name: nid:debug
description: Investigate a bug with structured hypothesis-test-conclusion loop
argument-hint: "[bug description | close | resolved]"
---

## Steps

**Step 1 — Determine session mode:**
Read `$ARGUMENTS`.
- If the argument is `close` or `resolved`, go to Step 5.
- If the argument contains a bug description, start a fresh session and use that text as the hypothesis seed.
- If the argument is empty, run `node nidavellir/bin/nid.cjs init` and read `current_phase`.
- Check whether `.planning/phases/NN-name/DEBUG.md` exists.
- If it exists, read it and ask: "Resume this session or start a new one?" Wait for answer.
- If it does not exist, ask: "Describe the bug." Wait for answer.

**Step 2 — Create or refresh DEBUG.md:**
For a fresh session, write `.planning/phases/NN-name/DEBUG.md` with:
- `# Debug Session`
- `**Bug:** [description]`
- `**Hypothesis:** [current working hypothesis]`
- `**Status:** open`
- `---`
- `## Test Log`
If resuming, read the file and update the `**Hypothesis:**` field to match the latest working theory before adding new log entries.

**Step 3 — Run one investigation cycle:**
Based on the current hypothesis:
1. Propose one specific test.
2. Execute it.
3. Update the static header first.
4. Append a log entry in this format:
   - `### Test N -- [brief label]`
   - `**Tried:** [what was done]`
   - `**Result:** [what happened]`
   - `**Ruled out:** [what this eliminates]`
5. Ask: "Was this resolved? Or should we test another hypothesis?" Wait for answer.
- If resolved, go to Step 5.
- Otherwise repeat Step 3 with the revised hypothesis.

**Step 4 — Commit after each cycle:**
Run `node nidavellir/bin/nid.cjs commit 'debug: [brief test description]'`

**Step 5 — Close session:**
Update `DEBUG.md`:
- Set `**Status:**` to `resolved`
- Set `**Hypothesis:**` to the confirmed root cause
- Append a final `### Test` entry describing the conclusion
Run `node nidavellir/bin/nid.cjs commit 'debug: session resolved'`

---

## Self-check

Before marking this complete:
- [ ] `DEBUG.md` exists and contains `**Bug:**`, `**Hypothesis:**`, and `**Status:**`
- [ ] `## Test Log` contains at least one `### Test` entry unless the session closed immediately
- [ ] A fresh agent reading only `DEBUG.md` can understand the bug, current hypothesis, and test history
