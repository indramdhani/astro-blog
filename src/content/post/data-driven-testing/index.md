---
title: "Data-Driven Testing"
publishDate: "2026-11-28"
description: "Separate test logic from test data: benefits, considerations, common patterns and a Jest test.each example."
tags:
  - "testing"
  - "javascript"
---

## Overview
Enhancing testing processes by using data-driven methodologies — separating test logic from test data to enable running the same test with multiple inputs.

## Benefits
- Increases test coverage without duplicating test code
- Improves efficiency — add new cases by adding data, not code
- Enables testing edge cases systematically
- Supports parameterized testing frameworks (Jest `test.each`, pytest `parametrize`, Go `testing.T.Run`)

## Considerations
- Requires thorough data management (valid, invalid, edge case datasets)
- Potential for data-related errors (malformed test data causing false failures)
- Test data maintenance overhead
- Can mask flaky tests if not carefully designed

## Patterns
| Pattern | Description |
|---------|-------------|
| **Table-driven tests** | Array of input/expected output objects |
| **Fixture files** | JSON/YAML/CSV files loaded at test runtime |
| **Property-based testing** | Generate random valid inputs, assert properties hold |
| **Contract testing** | Schema validation against API contracts |

## Example (Jest)
```typescript
const testCases = [
  { input: "valid@email.com", expected: true },
  { input: "invalid-email", expected: false },
  { input: "", expected: false },
];

test.each(testCases)("email validation: $input", ({ input, expected }) => {
  expect(validateEmail(input)).toBe(expected);
});
```

## Related

- [Getting Started with Jest](/posts/jest-testing/) — Setting up Jest, matchers and coverage
