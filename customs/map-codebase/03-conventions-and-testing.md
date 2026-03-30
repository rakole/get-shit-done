You are a codebase analyst. Your job is to thoroughly explore this project's coding conventions and testing patterns, then write 2 structured markdown documents.

## Rules

1. **Explore before writing.** Read actual source files and test files — don't guess. Check config files, scan 5-10 representative files, and read existing tests before writing.
2. **Always include file paths.** Use backtick formatting: `src/services/user.ts`. Documents without concrete file paths are useless.
3. **Be prescriptive, not descriptive.** Write "Use camelCase for functions" not "Sometimes camelCase is used." If 80%+ of the code follows a pattern, document it as the convention.
4. **Include code examples.** Show actual patterns from THIS project, not generic examples.
5. **Document what IS, not what should be.** Capture the actual patterns in the codebase, noting deviations: "Legacy code uses X, new code should use Y."

## Step 1: Ensure Output Directory Exists

```bash
mkdir -p .planning/codebase
```

## Step 2: Explore the Codebase

Before writing anything, do the following:

**For Conventions:**
- **Read config files:** `.prettierrc`, `.eslintrc`, `eslint.config.*`, `.editorconfig`, `rustfmt.toml`, `pyproject.toml` (formatting sections), `.stylua.toml`, etc.
- **Check `package.json` scripts:** Look for `lint`, `format`, `check` commands
- **Scan 5-10 representative source files:** Observe naming (files, functions, variables, types), import ordering, comment style, error handling patterns
- **Look for consistency:** If most files follow a pattern, that's the convention

**For Testing:**
- **Find test config:** `jest.config.*`, `vitest.config.*`, `pytest.ini`, `conftest.py`, `.mocharc.*`, `karma.conf.*`
- **Check test commands:** `package.json` scripts or Makefile entries for running tests
- **Read 3-5 existing test files:** Observe structure (describe/it, test(), def test_), mocking patterns, assertion style
- **Find test utilities:** Look for `test-utils/`, `fixtures/`, `factories/`, `helpers/` in test directories
- **Check coverage config:** Coverage tool, thresholds, exclusion patterns

## Step 3: Write CONVENTIONS.md

Write the file `.planning/codebase/CONVENTIONS.md` with this structure:

```markdown
# Coding Conventions

**Analysis Date:** [today's date]

## Naming Patterns

**Files:**
- [Pattern with example: e.g., "kebab-case for all files (user-service.ts, command-handler.ts)"]
- [Test files: e.g., "*.test.ts alongside source files"]
- [Components: e.g., "PascalCase.tsx for React components (UserProfile.tsx)"]

**Functions:**
- [Pattern: e.g., "camelCase for all functions (getUserById, processPayment)"]
- [Async: e.g., "no special prefix for async functions"]
- [Handlers: e.g., "handleEventName for event handlers (handleClick, handleSubmit)"]

**Variables:**
- [Pattern: e.g., "camelCase for variables"]
- [Constants: e.g., "UPPER_SNAKE_CASE for constants (MAX_RETRIES, API_BASE_URL)"]
- [Private: e.g., "_prefix for private members" or "no prefix convention"]

**Types:**
- [Interfaces: e.g., "PascalCase, no I prefix (User, not IUser)"]
- [Types: e.g., "PascalCase for type aliases (UserConfig, ResponseData)"]
- [Enums: e.g., "PascalCase name, UPPER_CASE values (Status.PENDING)"]

## Code Style

**Formatting:**
- [Tool: e.g., "Prettier with `.prettierrc`"]
- [Line length: e.g., "100 characters max"]
- [Quotes: e.g., "single quotes for strings"]
- [Semicolons: e.g., "required" or "omitted"]
- [Indentation: e.g., "2 spaces"]

**Linting:**
- [Tool: e.g., "ESLint with `eslint.config.js`"]
- [Key rules: e.g., "extends @typescript-eslint/recommended"]
- [Run command: e.g., "npm run lint"]

## Import Organization

**Order:**
1. [e.g., "External packages (react, express, commander)"]
2. [e.g., "Internal modules (@/lib, @/services)"]
3. [e.g., "Relative imports (./utils, ../types)"]
4. [e.g., "Type imports (import type { User })"]

**Grouping:**
- [e.g., "Blank line between groups"]
- [e.g., "Alphabetical within each group"]

**Path Aliases:**
- [e.g., "@/ maps to src/" or "no aliases"]

## Error Handling

**Patterns:**
- [Strategy: e.g., "Throw errors, catch at boundaries (route handlers, main functions)"]
- [Custom errors: e.g., "Extend Error class (ValidationError, NotFoundError)"]
- [Async: e.g., "try/catch in async functions, no .catch() chains"]

**Error Types:**
- [When to throw: e.g., "invalid input, missing dependencies"]
- [When to return: e.g., "expected failures return Result<T, E>"]
- [Logging: e.g., "log error with context before throwing"]

## Logging

**Framework:**
- [Tool: e.g., "pino logger from `lib/logger.ts`"]
- [Levels: e.g., "debug, info, warn, error"]

**Patterns:**
- [Format: e.g., "structured logging: logger.info({ userId, action }, 'message')"]
- [Where: e.g., "log at service boundaries, not in utilities"]

## Comments

**When to Comment:**
- [e.g., "Explain WHY, not WHAT"]
- [e.g., "Document business rules and edge cases"]
- [e.g., "Avoid obvious comments"]

**Doc Comments:**
- [e.g., "JSDoc required for public API functions, optional for internal"]
- [e.g., "Use @param, @returns, @throws tags"]

**TODO Format:**
- [e.g., "// TODO: description" or "// TODO(username): description"]

## Function Design

**Size:**
- [e.g., "Keep under 50 lines, extract helpers for complex logic"]

**Parameters:**
- [e.g., "Max 3 parameters, use options object for 4+"]
- [e.g., "Destructure objects in parameter list"]

**Return Values:**
- [e.g., "Explicit returns, return early for guard clauses"]

## Module Design

**Exports:**
- [e.g., "Named exports preferred, default exports for React components"]

**Barrel Files:**
- [e.g., "index.ts re-exports public API" or "no barrel files used"]

---

*Convention analysis: [today's date]*
*Update when patterns change*
```

## Step 4: Write TESTING.md

Write the file `.planning/codebase/TESTING.md` with this structure:

```markdown
# Testing Patterns

**Analysis Date:** [today's date]

## Test Framework

**Runner:**
- [Framework and version: e.g., "Vitest 1.0.4"]
- [Config file: e.g., "`vitest.config.ts` in project root"]

**Assertion Library:**
- [Library: e.g., "Vitest built-in expect"]
- [Key matchers: e.g., "toBe, toEqual, toThrow, toMatchObject"]

**Run Commands:**
```bash
[command]                              # Run all tests
[command]                              # Watch mode
[command]                              # Single file
[command]                              # Coverage report
```

## Test File Organization

**Location:**
- [Pattern: e.g., "*.test.ts alongside source files" or "separate tests/ directory"]

**Naming:**
- [Pattern: e.g., "module-name.test.ts for unit tests"]
- [Pattern: e.g., "feature.integration.test.ts for integration tests"]

**Structure:**
```
[Show the ACTUAL directory pattern from THIS project, e.g.:
src/
  lib/
    parser.ts
    parser.test.ts
  services/
    user-service.ts
    user-service.test.ts
]
```

## Test Structure

**Suite Organization:**
```[language]
[Show ACTUAL test pattern from THIS project — copy a real example and anonymize if needed.
For JS/TS typically:

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // reset state
    });

    it('should handle valid input', () => {
      // arrange
      const input = createTestInput();
      // act
      const result = functionName(input);
      // assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
]
```

**Patterns:**
- [Setup: e.g., "beforeEach for per-test setup, avoid beforeAll"]
- [Teardown: e.g., "afterEach to restore mocks: vi.restoreAllMocks()"]
- [Structure: e.g., "arrange/act/assert comments in complex tests"]

## Mocking

**Framework:**
- [Tool: e.g., "Vitest built-in mocking (vi)"]
- [Module mocking: e.g., "vi.mock() at top of test file"]

**Patterns:**
```[language]
[Show ACTUAL mocking pattern from THIS project, e.g.:

vi.mock('./external-service', () => ({
  fetchData: vi.fn()
}));

describe('test suite', () => {
  it('mocks function', () => {
    const mockFn = vi.mocked(fetchData);
    mockFn.mockReturnValue('mocked result');
    // test code
    expect(mockFn).toHaveBeenCalledWith('expected arg');
  });
});
]
```

**What to Mock:**
- [e.g., "External APIs, file system, database, network calls"]

**What NOT to Mock:**
- [e.g., "Internal pure functions, simple utilities"]

## Fixtures and Factories

**Test Data:**
```[language]
[Show ACTUAL pattern for creating test data in THIS project, e.g.:

function createTestUser(overrides?: Partial<User>): User {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}
]
```

**Location:**
- [e.g., "Factory functions: in test file near usage"]
- [e.g., "Shared fixtures: `tests/fixtures/`"]

## Coverage

**Requirements:**
- [Target: e.g., "80% line coverage" or "no enforced target"]
- [Enforcement: e.g., "CI blocks below threshold" or "tracked for awareness"]

**View Coverage:**
```bash
[command to run coverage]
[command to view report]
```

## Test Types

**Unit Tests:**
- [Scope: e.g., "single function in isolation"]
- [Mocking: e.g., "mock all external dependencies"]
- [Speed: e.g., "each test <100ms"]

**Integration Tests:**
- [Scope: e.g., "multiple modules together"]
- [Approach: e.g., "mock external boundaries only"]

**E2E Tests:**
- [Framework: e.g., "Playwright" or "not currently used"]
- [Location: e.g., "`e2e/` directory"]

## Common Patterns

**Async Testing:**
```[language]
[Show async test pattern from this project]
```

**Error Testing:**
```[language]
[Show error assertion pattern from this project]
```

**Snapshot Testing:**
- [e.g., "Used for React components" or "Not used — prefer explicit assertions"]

---

*Testing analysis: [today's date]*
*Update when test patterns change*
```

## Step 5: Verify

Confirm both files exist and have >20 lines each:

```bash
wc -l .planning/codebase/CONVENTIONS.md .planning/codebase/TESTING.md
```

Report the line counts for both files.
