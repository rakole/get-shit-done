#!/usr/bin/env node
'use strict';

/**
 * TDD tests for nidavellir/bin/nid.cjs
 * RED phase: these tests must fail before implementation exists.
 * Run with: node nidavellir/tests/nid.test.cjs
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// nid.cjs runs with the project root as cwd (the dir that has .planning/)
// In this worktree, .planning/ lives in the parent GSD repo dir.
// Find the closest ancestor with .planning/ or fall back to the GSD repo root.
function findProjectRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.planning'))) return dir;
    dir = path.dirname(dir);
  }
  return startDir;
}

const WORKTREE_ROOT = path.join(__dirname, '../../');
const CWD = findProjectRoot(WORKTREE_ROOT);
const NID = path.join(__dirname, '../bin/nid.cjs');
const PLANNING_DIR = path.join(CWD, '.planning');

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    process.stdout.write('  PASS: ' + message + '\n');
  } else {
    failed++;
    failures.push(message);
    process.stdout.write('  FAIL: ' + message + '\n');
  }
}

function run(args) {
  return spawnSync('node', [NID, ...args], { cwd: CWD, encoding: 'utf-8' });
}

// --- Test: init ---
process.stdout.write('\nTest: init subcommand\n');
{
  const result = run(['init']);
  assert(result.status === 0, 'init exits 0');
  let json = null;
  try { json = JSON.parse(result.stdout.trim()); } catch (e) { json = null; }
  assert(json !== null, 'init stdout is valid JSON');
  assert(json && 'project_exists' in json, 'init JSON has project_exists');
  assert(json && 'current_phase' in json, 'init JSON has current_phase');
  assert(json && 'phase_status' in json, 'init JSON has phase_status');
  assert(json && 'config' in json, 'init JSON has config');
  assert(json && json.project_exists === true, 'project_exists is true (planning dir exists)');
}

// --- Test: state-read ---
process.stdout.write('\nTest: state-read subcommand\n');
{
  const result = run(['state-read']);
  assert(result.status === 0, 'state-read exits 0');
  assert(result.stdout.length > 0, 'state-read prints content to stdout');
  assert(result.stdout.includes('Phase'), 'state-read output contains "Phase"');
}

// --- Test: state-write ---
process.stdout.write('\nTest: state-write subcommand\n');
{
  const originalContent = fs.readFileSync(path.join(PLANNING_DIR, 'STATE.md'), 'utf-8');

  const writeResult = run(['state-write', JSON.stringify({ Status: 'TEST-STATUS-VALUE' })]);
  assert(writeResult.status === 0, 'state-write exits 0');
  let writeJson = null;
  try { writeJson = JSON.parse(writeResult.stdout.trim()); } catch (e) { writeJson = null; }
  assert(writeJson !== null, 'state-write stdout is valid JSON');
  assert(writeJson && 'updated' in writeJson, 'state-write returns {updated: [...]}');
  assert(writeJson && Array.isArray(writeJson.updated), 'state-write.updated is an array');

  const readBack = run(['state-read']);
  assert(readBack.stdout.includes('TEST-STATUS-VALUE'), 'state-read reflects state-write changes');

  // Restore
  fs.writeFileSync(path.join(PLANNING_DIR, 'STATE.md'), originalContent, 'utf-8');
}

// --- Test: commit (commit_docs=false, should skip silently) ---
process.stdout.write('\nTest: commit subcommand (commit_docs=false)\n');
{
  const result = run(['commit', 'test commit message']);
  assert(result.status === 0, 'commit exits 0 when commit_docs is false');
  assert(result.stdout.trim() === '', 'commit produces no stdout when commit_docs is false');
}

// --- Test: phase-init ---
process.stdout.write('\nTest: phase-init subcommand\n');
{
  const testPhaseDir = path.join(PLANNING_DIR, 'phases', '99-test-scaffold');
  if (fs.existsSync(testPhaseDir)) fs.rmSync(testPhaseDir, { recursive: true });

  const result = run(['phase-init', '99', 'test-scaffold']);
  assert(result.status === 0, 'phase-init exits 0');
  let json = null;
  try { json = JSON.parse(result.stdout.trim()); } catch (e) { json = null; }
  assert(json !== null, 'phase-init stdout is valid JSON');
  assert(json && 'created' in json, 'phase-init returns {created: "..."}');

  const planPath = path.join(testPhaseDir, 'PLAN.md');
  const planExists = fs.existsSync(planPath);
  assert(planExists, 'phase-init creates PLAN.md file');

  if (planExists) {
    const sentinel = '<!-- SENTINEL DO NOT OVERWRITE -->\n';
    fs.writeFileSync(planPath, sentinel);
    run(['phase-init', '99', 'test-scaffold']);
    const contentAfter = fs.readFileSync(planPath, 'utf-8');
    assert(contentAfter === sentinel, 'phase-init does not overwrite existing PLAN.md');
  } else {
    assert(false, 'phase-init does not overwrite existing PLAN.md (skipped - dir not created)');
  }

  if (fs.existsSync(testPhaseDir)) fs.rmSync(testPhaseDir, { recursive: true });
}

// --- Test: phase-advance ---
process.stdout.write('\nTest: phase-advance subcommand\n');
{
  const originalContent = fs.readFileSync(path.join(PLANNING_DIR, 'STATE.md'), 'utf-8');

  const result = run(['phase-advance', '1']);
  assert(result.status === 0, 'phase-advance exits 0');
  let json = null;
  try { json = JSON.parse(result.stdout.trim()); } catch (e) { json = null; }
  assert(json !== null, 'phase-advance stdout is valid JSON');
  assert(json && json.advanced === true, 'phase-advance returns {advanced: true}');
  assert(json && json.phase === 1, 'phase-advance returns {phase: N}');

  const stateContent = fs.readFileSync(path.join(PLANNING_DIR, 'STATE.md'), 'utf-8');
  assert(stateContent.includes('Phase complete'), 'phase-advance sets Status to "Phase complete"');

  fs.writeFileSync(path.join(PLANNING_DIR, 'STATE.md'), originalContent, 'utf-8');
}

// --- Test: unknown command ---
process.stdout.write('\nTest: unknown command\n');
{
  const result = run(['unknown-command-xyz']);
  assert(result.status === 1, 'unknown command exits 1');
  assert(result.stderr.length > 0, 'unknown command writes to stderr');
}

// --- Test: zero external dependencies ---
process.stdout.write('\nTest: zero external dependencies\n');
{
  if (fs.existsSync(NID)) {
    const content = fs.readFileSync(NID, 'utf-8');
    const requireMatches = content.match(/require\s*\(\s*['"][^'"]+['"]\s*\)/g) || [];
    const builtins = ["'fs'", '"fs"', "'path'", '"path"', "'child_process'", '"child_process"'];
    const external = requireMatches.filter(r => !builtins.some(b => r.includes(b)));
    assert(external.length === 0, 'nid.cjs requires only built-in Node.js modules');
    assert(!content.includes('execSync('), 'nid.cjs does not use unsafe execSync');
    assert(content.includes('execFileSync'), 'nid.cjs uses safe execFileSync');
  } else {
    assert(false, 'nid.cjs exists (FILE NOT FOUND - expected in RED phase)');
    assert(false, 'nid.cjs requires only built-in Node.js modules');
    assert(false, 'nid.cjs does not use unsafe execSync');
    assert(false, 'nid.cjs uses safe execFileSync');
  }
}

// Summary
process.stdout.write('\n================\n');
process.stdout.write('Passed: ' + passed + '\n');
process.stdout.write('Failed: ' + failed + '\n');
if (failures.length > 0) {
  process.stdout.write('\nFailures:\n');
  failures.forEach(f => process.stdout.write('  - ' + f + '\n'));
}
process.stdout.write('================\n');

if (failed > 0) process.exit(1);
