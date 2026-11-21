---
title: "Do You Need a Team of Seven AI Agents?"
publishDate: "2026-11-21"
description: "A viral infographic promises seven specialist agents. The evidence says the value is in verification, not in the roles."
tags:
  - "ai"
  - "agents"
  - "productivity"
---

A widely shared infographic shows "Lauren Tan's Bot Team": seven specialist agents (Chief of Staff, Researcher, Engineer, Reviewer, Doc Writer, Operator, Memory Manager) that turn one question into a reliable result. Is it real or mostly hype? These are my notes from a short research memo on that question.

## Short Answer

- **Checks make delegation scale.** This core idea is well supported.
- **The seven roles are packaging.** The role names and the headline throughput numbers are not independently verified.
- **A single strong agent often matches a team** when the compute budget is the same.
- **Recommendation:** start with a small, verification-first setup on one repository and add agents only when the numbers justify it.

## What the Evidence Says

- **Equal budgets erase most wins.** A Stanford comparison under equal thinking-token budgets found single agents matching or beating multi-agent systems on multi-hop reasoning. Teams only pulled ahead when one agent's context became too long or corrupted.
- **Extra cost.** Other work reports a two to six times efficiency penalty on tool-heavy tasks, and generated multi-agent systems losing to simple self-consistency at up to ten times the cost.
- **Anthropic's research system** beat its single-agent baseline by a wide margin, but token usage alone explained about 80 percent of the variance on BrowseComp. Part of the gain is just more compute. Anthropic's guidance keeps subagents for parallel work, context overload and conflicting instructions.
- **Verification is the consistent part.** The Claude Code team argues that without checks one person can supervise one or two agents; with reliable checks many can run at once, and the human reviews evidence instead of steps.
- **pstack's numbers are self-reported.** About 11,000 agent pull requests a month with roughly 0.5 percent reverted comes from the author's own reporting, and reviewers I found did not verify it either.

## Five Principles

1. **Proof before parallelism.** Add agents only after you can verify what one agent produces.
2. **The fewest agents that work.** Each extra agent must earn its place with a measured gain.
3. **Graders must not be gameable.** A change cannot modify the rules that review it.
4. **Gate by blast radius, not by confidence.** Reversible actions are free; irreversible ones need a person.
5. **People own "done".** Agents propose and prove; you decide, and form your own view first.

## Six Phases on One Repository

| Phase | What to build | Done when |
| --- | --- | --- |
| 0. Baseline | Record time per change, revert rate, review findings and human interventions | Two weeks of numbers |
| 1. Harness and verify | `CLAUDE.md` plus a `verify` skill that boots the app and drives one real flow | The agent returns screenshots or traces as evidence |
| 2. Check loop | Tests, build and lint before every PR; three fix attempts, then escalate; never retry flaky tests | PRs arrive green |
| 3. One reviewer | A fresh-context subagent guided by `REVIEW.md`, with rules read from the base branch | It catches seeded bugs from past incidents |
| 4. Gates | Hooks and permissions by blast radius, rolled out as off, observe, then enforce | No surprising blocks for two weeks |
| 5. Always-on | Scheduled tasks, a notes folder as memory, credentials behind a proxy, a quiet outbox | One job runs a month with no unsafe action |

Judge success against the phase 0 baseline: revert rate, interventions per change, time to merge, and how many escalations were justified. Also count tokens per merged change. A speed gain with a rising revert rate is a failure.

## Do You Need Seven Agents?

No.

- **Chief of Staff:** you, plus a good `CLAUDE.md`.
- **Engineer, Doc Writer, Researcher:** one agent using skills.
- **Reviewer:** the one subagent worth adding early.
- **Operator, Memory Manager:** scheduled tasks and a notes folder, added last.

Add another role only when a specific task fails without it and the measures improve at comparable cost. Parallel research and isolating a large context are the likeliest cases.

## Risks

- **Cognitive surrender:** fast answers shrink the pause to evaluate them, so estimate first and restate the reasoning in your own words.
- **Overbuilding:** big-team checklists only pay off if your baseline shows the problem.
- **Gameable checks:** keep rules outside the diff.
- **Unattended access:** keep secrets in a proxy and start with read-only jobs.

## Caveats

- Cost is unknown: reviewer subagents and check loops add tokens, and the sources give no figures.
- The memo relied on page summaries, not full texts, and did not inspect pstack's repository. Treat every figure as a lead to check.

Sources (as listed in the memo): The Neuron, YouMind, TeamDay, AI.JoaoQueiros.com, VentureBeat (two articles), Hacker Noon, Towards AI, Digg, claude.dev and claude.com.
