# Map Codebase — Single-Agent Prompts

> Analyze any codebase and produce 7 structured planning documents using a single AI agent (Claude Sonnet 4.5, GPT 5.2, or equivalent) via the Tabnine IntelliJ plugin.

## What This Produces

After running all 4 prompts, you'll have a `.planning/codebase/` directory with:

| Document | Contents | Written By |
|---|---|---|
| `STACK.md` | Languages, runtime, frameworks, dependencies, configuration | Pass 1 |
| `INTEGRATIONS.md` | External APIs, databases, auth providers, webhooks | Pass 1 |
| `ARCHITECTURE.md` | Pattern, layers, data flow, abstractions, entry points | Pass 2 |
| `STRUCTURE.md` | Directory layout, key locations, naming conventions | Pass 2 |
| `CONVENTIONS.md` | Code style, naming, patterns, error handling | Pass 3 |
| `TESTING.md` | Framework, structure, mocking, coverage | Pass 3 |
| `CONCERNS.md` | Tech debt, bugs, security, performance, fragile areas | Pass 4 |

## Prerequisites

- **IDE:** IntelliJ IDEA with Tabnine plugin installed
- **Agent:** Claude Sonnet 4.5 or GPT 5.2 (or any model with file read/write capability)
- **Project:** Must be opened in IntelliJ with the codebase you want to map

## How to Run

### Step 0: Prepare

1. Open your target project in IntelliJ
2. Make sure the Tabnine plugin is active and connected to your preferred model
3. No `.planning/codebase/` directory should exist yet (if re-running, delete it first)

### Step 1: Technology & Integrations

1. Open Tabnine chat in IntelliJ
2. Copy the **entire contents** of [`01-tech-and-integrations.md`](./01-tech-and-integrations.md) into the chat
3. Send and let the agent work
4. **Wait for completion** — the agent should confirm it wrote `STACK.md` and `INTEGRATIONS.md`
5. **Verify:** Check that both files exist in `.planning/codebase/` and have >20 lines each

### Step 2: Architecture & Structure

1. **Start a new chat session** (or clear context if your tool supports it)
2. Copy the **entire contents** of [`02-architecture-and-structure.md`](./02-architecture-and-structure.md) into the chat
3. Send and let the agent work
4. **Wait for completion** — the agent should confirm it wrote `ARCHITECTURE.md` and `STRUCTURE.md`
5. **Verify:** Check that both files exist and have >20 lines each

### Step 3: Conventions & Testing

1. **Start a new chat session**
2. Copy the **entire contents** of [`03-conventions-and-testing.md`](./03-conventions-and-testing.md) into the chat
3. Send and let the agent work
4. **Wait for completion** — the agent should confirm it wrote `CONVENTIONS.md` and `TESTING.md`
5. **Verify:** Check that both files exist and have >20 lines each

### Step 4: Concerns & Issues

1. **Start a new chat session**
2. Copy the **entire contents** of [`04-concerns.md`](./04-concerns.md) into the chat
3. Send and let the agent work
4. **Wait for completion** — the agent should confirm it wrote `CONCERNS.md`
5. **Verify:** Check that the file exists and has >20 lines

### Step 5: Final Verification

After all 4 passes, verify the complete output:

```bash
ls -la .planning/codebase/
wc -l .planning/codebase/*.md
```

You should see all 7 files, each with >20 lines of content.

## Important Notes

### Why Separate Sessions?

Each prompt is designed to run in isolation with a **fresh context window**. This prevents the agent from running out of context on large codebases. The prompts do not depend on each other — each one explores the codebase independently and writes its own documents.

### Ordering

The passes are numbered for convenience, but **they can run in any order**. Pass 4 (Concerns) benefits slightly from running last because the agent may pick up patterns it wouldn't notice without the exploration effort, but this is a minor optimization.

### Optional Focus Area

To narrow the analysis to a specific subsystem, append this line at the end of any prompt before sending:

```
Focus specifically on the [api/auth/frontend/database/etc.] subsystem only.
```

### Re-running

If `.planning/codebase/` already exists from a previous run:

- **Full refresh:** Delete the entire directory, then run all 4 passes again
- **Partial update:** Delete only the specific `.md` files you want to regenerate, then run only the corresponding pass

### Troubleshooting

| Problem | Solution |
|---|---|
| Agent doesn't create the directory | Prepend `First, create the directory: mkdir -p .planning/codebase` to the prompt |
| Agent writes incomplete documents | Re-run that specific pass in a fresh session |
| Agent hallucinates file paths | Remind it: "Only include file paths that actually exist in this project" |
| Context window exhausted mid-pass | For very large codebases, ask the agent to focus on a specific subsystem |
| Agent can't read files | Ensure Tabnine has workspace/file access permissions in IntelliJ settings |

## Origin

These prompts are distilled from the [GSD (Get Shit Done)](https://github.com/coleam00/get-shit-done) framework's `map-codebase` command, adapted for single-agent use without multi-agent orchestration.
