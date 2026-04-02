#!/usr/bin/env node
'use strict';

/**
 * nid.cjs — Zero-dependency CJS CLI helper for Nidavellir.
 * Subcommands: init, state-read, state-write, commit, phase-init, phase-advance
 * All structured output goes to stdout as JSON.
 * All log/error messages go to stderr.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// --- Shared helpers ---

function extractField(content, fieldName) {
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bold = new RegExp('\\*\\*' + esc + ':\\*\\*\\s*(.+)', 'i');
  const m = content.match(bold);
  if (m) return m[1].trim();
  const plain = new RegExp('^' + esc + ':\\s*(.+)', 'im');
  const m2 = content.match(plain);
  return m2 ? m2[1].trim() : null;
}

function replaceField(content, fieldName, newValue) {
  const esc = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bold = new RegExp('(\\*\\*' + esc + ':\\*\\*\\s*)(.*)', 'i');
  if (bold.test(content)) return content.replace(bold, '$1' + newValue);
  const plain = new RegExp('(^' + esc + ':\\s*)(.*)', 'im');
  return content.replace(plain, '$1' + newValue);
}

function phaseDir(n, name) {
  const padded = String(n).padStart(2, '0');
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return padded + '-' + slug;
}

function loadConfig(cwd) {
  const p = path.join(cwd, '.planning', 'config.json');
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (e) { return {}; }
}

function out(obj) { process.stdout.write(JSON.stringify(obj) + '\n'); }

// --- Subcommands ---

function cmdInit(cwd) {
  const planningDir = path.join(cwd, '.planning');
  const project_exists = fs.existsSync(planningDir);
  let current_phase = null;
  let phase_status = null;
  if (project_exists) {
    const statePath = path.join(planningDir, 'STATE.md');
    if (fs.existsSync(statePath)) {
      const content = fs.readFileSync(statePath, 'utf-8');
      const phaseVal = extractField(content, 'Phase');
      current_phase = phaseVal ? (parseInt(phaseVal, 10) || null) : null;
      phase_status = extractField(content, 'Status');
    }
  }
  const config = loadConfig(cwd);
  out({ project_exists, current_phase, phase_status, config: { commit_docs: !!config.commit_docs } });
}

function cmdStateRead(cwd) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  process.stdout.write(fs.readFileSync(statePath, 'utf-8'));
}

function cmdStateWrite(cwd, jsonArg) {
  if (!jsonArg) {
    process.stderr.write('nid.cjs: state-write: missing JSON argument\n');
    process.exit(1);
  }
  let updates;
  try { updates = JSON.parse(jsonArg); } catch (e) {
    process.stderr.write('nid.cjs: state-write: invalid JSON: ' + e.message + '\n');
    process.exit(1);
  }
  if (typeof updates !== 'object' || Array.isArray(updates) || updates === null) {
    process.stderr.write('nid.cjs: state-write: JSON argument must be an object\n');
    process.exit(1);
  }
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  let content = fs.readFileSync(statePath, 'utf-8');
  for (const [field, value] of Object.entries(updates)) {
    content = replaceField(content, field, String(value));
  }
  fs.writeFileSync(statePath, content, 'utf-8');
  out({ updated: Object.keys(updates) });
}

function cmdCommit(cwd, message) {
  const config = loadConfig(cwd);
  // When commit_docs is falsy, skip silently — no output, no error (CLI-03 Phase 1 scope)
  if (!config.commit_docs) return;
  if (!message) {
    process.stderr.write('nid.cjs: commit: missing commit message argument\n');
    process.exit(1);
  }
  try {
    execFileSync('git', ['add', '-A'], { cwd, stdio: 'pipe' });
    execFileSync('git', ['commit', '-m', message], { cwd, stdio: 'pipe' });
    out({ committed: true, message });
  } catch (e) {
    const stderr = (e.stderr || Buffer.alloc(0)).toString();
    const stdout = (e.stdout || Buffer.alloc(0)).toString();
    if (stderr.includes('nothing to commit') || stdout.includes('nothing to commit')) {
      out({ committed: false, reason: 'nothing to commit' });
    } else {
      process.stderr.write(stderr || e.message + '\n');
      process.exit(1);
    }
  }
}

function cmdPhaseInit(cwd, phaseNum, name) {
  if (!phaseNum || !name) {
    process.stderr.write('nid.cjs: phase-init: usage: phase-init <phaseNum> <name>\n');
    process.exit(1);
  }
  const dirName = phaseDir(phaseNum, name);
  const phasePath = path.join(cwd, '.planning', 'phases', dirName);
  fs.mkdirSync(phasePath, { recursive: true });
  const planPath = path.join(phasePath, 'PLAN.md');
  if (!fs.existsSync(planPath)) {
    const placeholder = '# Plan: Phase ' + phaseNum + ' \u2014 ' + name + '\n\n<!-- Tasks will be added here -->\n';
    fs.writeFileSync(planPath, placeholder, 'utf-8');
  }
  out({ created: phasePath });
}

function cmdPhaseAdvance(cwd, phaseNum) {
  if (!phaseNum) {
    process.stderr.write('nid.cjs: phase-advance: usage: phase-advance <phaseNum>\n');
    process.exit(1);
  }
  const statePath = path.join(cwd, '.planning', 'STATE.md');
  let content = fs.readFileSync(statePath, 'utf-8');
  content = replaceField(content, 'Status', 'Phase complete');
  content = replaceField(content, 'Phase', String(phaseNum));
  fs.writeFileSync(statePath, content, 'utf-8');
  out({ advanced: true, phase: parseInt(phaseNum, 10) });
}

// --- Dispatch ---

const cmd = process.argv[2];
const cwd = process.cwd();

switch (cmd) {
  case 'init':          cmdInit(cwd); break;
  case 'state-read':    cmdStateRead(cwd); break;
  case 'state-write':   cmdStateWrite(cwd, process.argv[3]); break;
  case 'commit':        cmdCommit(cwd, process.argv[3]); break;
  case 'phase-init':    cmdPhaseInit(cwd, process.argv[3], process.argv[4]); break;
  case 'phase-advance': cmdPhaseAdvance(cwd, process.argv[3]); break;
  default:
    process.stderr.write('nid.cjs: unknown command: ' + cmd + '\n');
    process.exit(1);
}
