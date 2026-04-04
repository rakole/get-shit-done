# Nidavellir Setup Guide

This guide takes you from "just cloned the repo" to "Tabnine recognizes /commands and nid.cjs init works."

## Prerequisites

Before you begin, confirm:

- **Node.js v18 or later** — run `node --version` to check; install from [nodejs.org](https://nodejs.org) if needed
- **Tabnine plugin installed in your IDE** — must be active before commands will appear
- **Git installed** — run `git --version` to confirm

---

## Step 1: Clone the repository

```bash
git clone https://github.com/your-org/get-shit-done.git
cd get-shit-done
```

> **Adding to an existing project:** You do not need to clone into your project folder. Clone once to a shared location on your machine and point Tabnine at the `nidavellir/commands/` directory inside the clone (Step 2).

---

## Step 2: Point Tabnine at the commands directory

Tabnine loads custom `/commands` from a designated directory. You have two approaches:

### Approach A: Global symlink (available in all projects)

This makes the commands available everywhere Tabnine is active.

```bash
mkdir -p ~/.tabnine/agent/commands
ln -s "$(pwd)/nidavellir/commands" ~/.tabnine/agent/commands/nidavellir
```

Verify the symlink was created:

```bash
ls ~/.tabnine/agent/commands/nidavellir/
```

You should see `new.md`, `plan.md`, `execute.md` and other command files.

### Approach B: Project-local symlink (available only in this project)

Use this if you want the commands scoped to a specific project directory.

```bash
mkdir -p .tabnine/agent/commands
ln -s "/absolute/path/to/get-shit-done/nidavellir/commands" .tabnine/agent/commands/nidavellir
```

Replace `/absolute/path/to/get-shit-done` with the real path from `pwd` when you are in the cloned repo.

### Alternative: IDE settings (if available in your version)

> **Note:** Some Tabnine plugin versions include a UI setting for a custom commands directory — look for **"Custom Commands"** or **"Agent Commands"** under Tabnine plugin preferences in your IDE. If that setting exists, pointing it directly at `nidavellir/commands/` is the simplest approach and does not require a symlink.
>
> **The exact setting name varies by IDE and Tabnine version.** If the symlink approach works, use that. If you see a "Custom Commands directory" field in Tabnine settings, use that instead. Check your current Tabnine settings UI for the exact field name — this could not be confirmed from documentation at the time of writing.

---

## Step 3: Restart your IDE and verify commands appear

After setting up the symlink or IDE setting:

1. Restart your IDE completely (or use the Tabnine plugin's "Reload" / "Restart agent" option if available)
2. Open the Tabnine chat panel
3. Type `/` in the chat input

You should see `/nid:new`, `/nid:plan`, `/nid:execute` and other nidavellir commands in the autocomplete list.

### Troubleshooting if commands don't appear

- **Confirm the symlink target exists:**
  ```bash
  ls ~/.tabnine/agent/commands/nidavellir/
  ```
- **Confirm the commands directory is non-empty:**
  ```bash
  ls nidavellir/commands/
  ```
- **Try a full IDE restart** (not just a project reload)
- **Check the Tabnine agent log** for errors about the commands directory path

---

## Step 4: Initialize your project

Run `nid.cjs init` from the root of the project you want to manage with Nidavellir:

```bash
node /path/to/get-shit-done/nidavellir/bin/nid.cjs init
```

Replace `/path/to/get-shit-done` with the absolute path to the cloned repository.

**Expected output — first run (no `.planning/` directory yet):**

```json
{"project_exists":false,"current_phase":null,"phase_status":null,"config":{}}
```

**Expected output — after the project has been initialized:**

```json
{"project_exists":true,"current_phase":1,"phase_status":"Not started","config":{"commit_docs":false}}
```

`project_exists: true` means `nid.cjs` found a `.planning/` directory in the current folder. `current_phase` and `phase_status` are read from `.planning/STATE.md`.

---

## Step 5: Create your first project

With the commands loaded and `nid.cjs init` working, type `/nid:new` in the Tabnine chat panel to start a new project.

> **Note:** `/nid:new` is a stub command in Phase 1. The full interactive project-creation workflow is implemented in Phase 2. In Phase 1, `/nid:new` will acknowledge the invocation and instruct you to set up `.planning/` manually using the templates in `nidavellir/templates/`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `/` shows no custom commands | Symlink not set up or IDE not restarted | Re-run Step 2, then do a full IDE restart |
| `node: command not found` | Node.js not installed | Install Node.js v18+ from [nodejs.org](https://nodejs.org) |
| `nid.cjs: unknown command: undefined` | Running `node nid.cjs` with no subcommand | Add a subcommand: `node nid.cjs init` |
| STATE.md field not updating | Wrong field name in `state-write` JSON | Field names are case-insensitive; check STATE.md for exact field names (e.g., `"Phase"` not `"phase"`) |
| `project_exists: false` but `.planning/` exists | Running `nid.cjs init` from wrong directory | Run from the project root where `.planning/` lives, not from inside `nidavellir/` |
| Commands appear but show "Phase 2 coming soon" | Using a stub command from Phase 1 | Expected behavior — full commands are in Phase 2+ |

---

## What each nid.cjs subcommand does

| Subcommand | Usage | What it does |
|------------|-------|-------------|
| `init` | `node nid.cjs init` | Checks whether `.planning/` exists, reads current phase and status from STATE.md, returns JSON summary |
| `state-read` | `node nid.cjs state-read` | Prints the full contents of `.planning/STATE.md` to stdout |
| `state-write` | `node nid.cjs state-write '{"Phase":2}'` | Updates one or more fields in STATE.md using the provided JSON object; field names are matched case-insensitively |
| `commit` | `node nid.cjs commit 'message'` | Runs `git add -A` and `git commit` if `commit_docs` is `true` in `.planning/config.json`; silently skips if `commit_docs` is false |
| `phase-init` | `node nid.cjs phase-init 2 'core-commands'` | Creates `.planning/phases/02-core-commands/` with a placeholder PLAN.md |
| `phase-advance` | `node nid.cjs phase-advance 1` | Marks the current phase as complete in STATE.md by updating the `Status` and `Phase` fields |
