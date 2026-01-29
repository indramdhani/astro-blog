---
title: "Version number — why it matters (from my Notion notes)"
publishDate: "2026-01-29"
description: "Notes and practical guidance on using version numbers for documents, distilled from a short Notion note."
tags:
  - "notion"
  - "versioning"
  - "productivity"
  - "docs"
---

I kept a short Notion note that listed three simple items: communicating change, stability/product maturity, and semantic versioning. Those three points are small, but they capture why adding version information to document titles or metadata is useful. This post expands those ideas and gives practical guidance you can use right away.

Why a visible version number?
- Visibility: Titles and filenames are often the first things people see (in lists, links, exports). A visible version or date helps recipients understand whether they're looking at a draft, a working copy, or a released artifact.
- Communication: A version communicates intent. Is this a work-in-progress or a “final” spec? Combining a visible version with a short status (Draft / In review / Final) avoids confusion.
- Lightweight signal: Notion and other editors keep revision history, but history is not always convenient to scan. A title-based marker is an immediate, human-friendly signal.
- Export-friendly: When you export to PDF or Markdown, the title persists — keeping the version in the title helps archived files remain meaningful.

Three core uses (from the note)

1) Communicating change
A version number tells readers that a document has changed and hints at the magnitude of the change. Use version markers when sharing or publishing so readers know whether they need to re-read, re-review, or re-run tests.

Practical tips:
- Put a short status in the page UI (Draft / Review) and a version in the title for clarity.
- For shared links, prefer titles with visible versions so external readers get context without opening the editor.

2) Stability / product maturity
Versions convey stability. A `v0.x` or `0.x` convention implies experimentation; `v1.0` communicates an initial, stable release. Align document versions with product or release versions where it makes sense — that keeps specs and releases in sync.

Practical tips:
- Map significant product releases to document versions when the document drives or documents the release.
- Let major version increments reflect meaningful changes in scope or guarantees.

3) Semantic versioning (when helpful)
Borrowing ideas from semver (major.minor.patch) adds precision: major means breaking/structural changes, minor means additions, patch means fixes.

When to use semantic-like versions:
- API specs, public SDK docs, or anything where consumers care about compatibility.
- Avoid semver for ephemeral meeting notes or one-off drafts; it's overkill there.

Choosing a simple naming scheme
- Incremental: `Title — v1`, `Title — v2` — simple and readable.
- Date-based: `Title — 2026-01-29` — great for meeting notes and daily captures (ISO dates sort well).
- Semantic-ish: `Title — v1.2` — use when changes have different magnitudes.
- Hybrid: `Title — v1.2 — 2026-01-29` — a single glance shows both version and when it was published.

Where to put version information
- End of title (`Design Spec — v1`) is common and readable.
- Start of title (`v1 — Design Spec`) helps when you rely on lexicographic sorting.
- For Notion databases, prefer a dedicated `Version` or `Status` property so versions are structured and filterable.

A short, practical workflow
- Meeting notes: use date-based titles (e.g., `Sprint Notes — 2026-01-29`). No need for semver.
- Evolving specs: use `v{major}.{minor}` in titles and keep a 1–3 line changelog at the top of the page.
- Shared databases: add `Version` (text/number) and `Status` properties so you can filter, sort, and automate views.

Don't over-engineer
The note's tone was simple: keep it minimal. Only introduce structured versioning or automation when the manual approach becomes error-prone or slows the team. Manual `v2` bumps or date stamps are low-friction and often enough.

Examples
- `API Spec — v1.0`
- `Design Doc — v0.3`
- `User Research — 20260129`
- `Release Notes — v2.1 — 2026-01-29`

Quick checklist before you publish
- [ ] Pick a versioning style (numeric, date, semantic, or hybrid)
- [ ] Decide where to place versions in titles and be consistent
- [ ] Use database properties for structured workflows
- [ ] Reserve automation for clear ROI; prefer simple manual steps initially

Small conventions like this save time and confusion. Keep the rule simple, document it in a team template or a short "notes workflow" page, and only add complexity when the team benefits.