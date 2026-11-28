---
title: "Semantic Versioning"
publishDate: "2026-11-28"
description: "MAJOR.MINOR.PATCH explained: pre-release labels, build metadata, the rules, and automating releases with conventional commits."
tags:
  - "versioning"
  - "software-development"
---

## Purpose
- Communicating changes to consumers
- Indicating stability / product maturity
- Automating dependency updates

## Format
```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

## Version Components

| Component | When to Increment | Example |
|-----------|-------------------|---------|
| **MAJOR** | Incompatible API changes (breaking) | 1.0.0 → 2.0.0 |
| **MINOR** | New functionality, backward compatible | 1.0.0 → 1.1.0 |
| **PATCH** | Backward-compatible bug fixes | 1.0.0 → 1.0.1 |

## Pre-release Labels
```
alpha → beta → RC1 → RC2 → release
```
- `1.0.0-alpha.1` — Early testing
- `1.0.0-beta.2` — Feature complete, testing
- `1.0.0-rc.1` — Release candidate, final validation

## Build Metadata (Optional)
```
1.0.0+build.123
1.0.0+sha.abc123
```
- Does not affect precedence
- Used for CI/CD traceability

## Rules
1. **Public API must be declared** (OpenAPI, headers, docs)
2. **Once released, never modify** — re-release with new version
3. **Pre-release < Release** — `1.0.0-alpha < 1.0.0`
4. **Build metadata ignored** for precedence

## Automation
- **Conventional Commits** → auto-semver (feat=minor, fix=patch, BREAKING=major)
- **Release Please, semantic-release, changesets** — automate versioning + changelog

## Related

- [Version number: why it matters](/posts/notion-version-number/) — Version numbers for documents, not just code
