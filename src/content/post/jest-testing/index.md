---
title: "Getting Started with Jest"
publishDate: "2026-11-28"
description: "Install and configure Jest, structure your tests, use matchers, async tests, setup and teardown, coverage and GitLab CI reports."
tags:
  - "testing"
  - "javascript"
---

## Overview
Jest is a delightful JavaScript Testing Framework with a focus on simplicity. Works with: Babel, TypeScript, Node, React, Angular, Vue.

## Installation

```bash
# Project-level (recommended)
yarn add --dev jest
# or
npm install --save-dev jest

# Global (not recommended for projects)
npm install -g jest
```

## Configuration

### package.json scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Generate config
```bash
jest --init
```

## Project Structure

### Option 1: Tests by Type (unit/integration separate)
```
mainAppDir/
├── test/
│   ├── unitTestDir/
│   │   └── appUnit.test.js
│   └── integrationTestDir/
│       └── appIntegration.test.js
├── config/
├── service/
├── router/
└── util/
```

### Option 2: Colocated Unit Tests (Recommended)
```
mainAppDir/
├── test/
│   └── appIntegration.test.js
├── config/
├── service/
│   ├── app.service.js
│   └── app.service.test.js
├── router/
│   ├── app.router.js
│   └── app.router.test.js
└── util/
    ├── app.util.js
    └── app.util.test.js
```

## Core APIs

| Function | Purpose |
|----------|---------|
| `describe(name, fn)` | Group related tests (optional) |
| `test(name, fn)` / `it(name, fn)` | Single test case |
| `expect(value)` | Assertion entry point |
| `beforeAll(fn)` | Run once before all tests in scope |
| `afterAll(fn)` | Run once after all tests in scope |
| `beforeEach(fn)` | Run before each test in scope |
| `afterEach(fn)` | Run after each test in scope |

## Matchers (Common)

| Matcher | Use Case |
|---------|----------|
| `toBe(value)` | Strict equality (===) |
| `toEqual(value)` | Deep equality (objects/arrays) |
| `toBeNull()` | Null check |
| `toBeUndefined()` | Undefined check |
| `toBeDefined()` | Defined check |
| `toBeTruthy()` / `toBeFalsy()` | Truthiness |
| `toContain(item)` | Array/string contains |
| `toMatch(regex)` | String regex match |
| `toThrow(error)` | Function throws |
| `resolves` / `rejects` | Promise resolution |

## Async Testing

```javascript
// Promises
test('fetches data', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

// async/await (preferred)
test('fetches data', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});

test('handles error', async () => {
  await expect(fetchData()).rejects.toThrow('error');
});

// Callbacks (legacy)
test('callback style', done => {
  fetchData(data => {
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  });
});
```

## Setup & Teardown

```javascript
// Global setup (once per test file)
beforeAll(() => {
  openDatabase();
});

afterAll(() => {
  closeDatabase();
});

// Per-test setup
beforeEach(() => {
  prepareTestData();
});

afterEach(() => {
  cleanTestData();
});

// Scoped to describe block
describe('group', () => {
  beforeEach(() => { /* group-specific */ });
  test('...', () => {});
});
```

## Code Coverage

### Enable in jest.config.js
```javascript
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Metrics
- **Function coverage** — % functions called
- **Statement coverage** — % statements executed
- **Branch coverage** — % if/else branches taken
- **Condition coverage** — % boolean sub-expressions tested
- **Line coverage** — % lines executed

## GitLab CI Integration

### 1. Install JUnit reporter
```bash
npm install --save-dev jest-junit
```

### 2. Update jest.config.js
```javascript
module.exports = {
  reporters: ['default', ['jest-junit', { outputDirectory: './artifacts' }]],
};
```

### 3. .gitlab-ci.yml
```yaml
stages:
  - test

javascript:
  stage: test
  before_script:
    - npm install
    - cd backend && npm install
  script:
    - npm run test
  artifacts:
    when: always
    paths:
      - ./backend/junit.xml
      - ./backend/coverage/cobertura-coverage.xml
    reports:
      junit:
        - ./backend/junit.xml
      cobertura: ./backend/coverage/cobertura-coverage.xml
```

## References
- https://jestjs.io/docs/getting-started
- https://jestjs.io/docs/expect
- https://jestjs.io/docs/asynchronous
- https://jestjs.io/docs/setup-teardown
- https://docs.gitlab.com/ee/ci/unit_test_reports.html
