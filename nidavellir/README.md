# Nidavellir

A structured workflow toolkit for AI coding agents in constrained environments (Tabnine + Sonnet/GPT).

## What Is This / Who Is It For

Nidavellir delivers the GSD discuss-plan-execute workflow as Tabnine custom `/commands`. It is for teams using Tabnine's IntelliJ plugin with Claude Sonnet 4.5 or GPT models in single-agent mode. It replaces multi-agent orchestration with structured prompts and a lightweight CLI helper.

## Quick Start

1. Clone the repo: `git clone https://github.com/your-org/get-shit-done.git && cd get-shit-done`
2. Point Tabnine at the commands folder:
   ```bash
   mkdir -p ~/.tabnine/agent/commands
   ln -s "$(pwd)/nidavellir/commands" ~/.tabnine/agent/commands/nidavellir
   ```
3. Restart your IDE
4. Type `/` in Tabnine chat — you should see `/nid:new`, `/nid:plan`, etc.
5. Run `/nid:new` to start your first project

For alternative setup methods and troubleshooting, see [docs/setup.md](docs/setup.md).

## Commands

| Command | Description |
|---------|-------------|
| `/nid:new` | Initialize a new project (greenfield or brownfield) |
| `/nid:discuss` | Research a phase approach and produce CONTEXT.md with decisions |
| `/nid:plan` | Create a PLAN.md for the current phase with atomic task breakdown |
| `/nid:execute` | Execute the current PLAN.md, committing after each task |
| `/nid:debug` | Investigate a bug with structured hypothesis/test loop |
| `/nid:progress` | Check project position and detect state drift |
| `/nid:quick` | Run a small inline task with no planning overhead |
| `/nid:review` | Structured code review of recent changes |

## Learn More

- [Workflow Guide](docs/workflow.md) — how to use the commands, what each one produces
- [Setup Guide](docs/setup.md) — detailed installation, troubleshooting, nid.cjs reference
