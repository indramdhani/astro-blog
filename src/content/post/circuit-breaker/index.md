---
title: "Circuit Breaker Pattern"
publishDate: "2026-11-17"
description: "How the circuit breaker pattern stops one slow service from taking down the rest: states, thresholds and libraries."
tags:
  - "pattern"
  - "microservices"
  - "resilience"
---

## Overview
- Prevent cascading failures in a system
- Usually applied on services that communicate synchronously
- Handles high latency or unresponsive downstream services
- Prevents failure across multiple systems when a single microservice becomes unresponsive
- Core pattern for handling failures in distributed systems

## States
| State | Behavior | Transition |
|-------|----------|------------|
| **Closed** | Normal operation, requests pass through | Failure threshold exceeded → Open |
| **Open** | Short-circuit: fail fast, no downstream calls | Timeout elapsed → Half-Open |
| **Half-Open** | Test requests allowed through | Success threshold → Closed; Failure → Open |

## Key Parameters
| Parameter | Typical Value | Purpose |
|-----------|---------------|---------|
| Failure threshold | 5–10 errors | Trip to Open |
| Success threshold (Half-Open) | 2–5 successes | Close circuit |
| Timeout (Open → Half-Open) | 30–60 seconds | Allow recovery time |
| Rolling window | 10–60 seconds | Count failures in window |

## Benefits
- **Prevent cascading failures** — Stop one slow service from exhausting thread pools upstream
- **Allow service recovery time** — Downstream gets breathing room without new load
- **Fail fast** — Upstream gets immediate error instead of hanging on timeout
- **Observability** — Circuit state is a clear system health signal

## Considerations
- Requires careful threshold tuning to avoid false trips (flapping)
- Idempotent operations safe to retry; non-idempotent need compensation
- Combine with bulkheads (thread pool isolation) for stronger isolation
- Monitor circuit state changes as alerts

## Implementation Options
| Library/Platform | Language | Notes |
|------------------|----------|-------|
| Resilience4j | Java | Lightweight, functional |
| Hystrix | Java | Legacy (maintenance mode) |
| Polly | .NET | Fluent policies |
| gobreaker | Go | Simple |
| envoy/istio | Sidecar | Infrastructure-level |

## Related

- [Transactional Outbox Pattern](/posts/outbox-pattern/) — Reliable events for state changes
