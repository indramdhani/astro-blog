---
title: "Saga Pattern"
publishDate: "2026-11-20"
description: "Keep data consistent across microservices with local transactions, choreography or orchestration, and compensating actions."
tags:
  - "pattern"
  - "microservices"
---

## Overview
- **Saga** = series of local transactions
- Maintains data consistency across distributed transactions
- Supports rollback via compensating transactions
- More complex — requires high skill level

## Two Coordination Models

### Choreography (Event-Driven)
```
Service A → Local Transaction → Publish Event → Service B → Local Transaction → Publish Event → ...
```
- **Pros:** Decoupled, no central coordinator
- **Cons:** Hard to track flow, cyclic dependencies risk, eventual consistency harder to reason about
- **Flow:** Perform transaction → Publish event → Other services respond to event → Perform their tasks

### Orchestration (Central Coordinator)
```
Orchestrator → Service A (transaction) → Orchestrator → Service B (transaction) → ...
```
- **Pros:** Clear flow control, explicit failure handling, easier debugging
- **Cons:** Central point of failure, orchestrator becomes complex
- **Flow:** Orchestrator triggers transactions → Publishes events → Triggers other services

## Compensating Transactions
Each step must have a corresponding "undo" action:
| Step | Forward Action | Compensating Action |
|------|----------------|---------------------|
| 1 | Reserve inventory | Release inventory |
| 2 | Charge payment | Refund payment |
| 3 | Create shipping label | Cancel shipment |

## When to Use
- Long-running business processes across services
- ACID transactions not possible across service boundaries
- Need for eventual consistency with rollback capability

## Complexity Factors
- Idempotency required for all steps
- Timeout handling for stuck sagas
- Saga state persistence (orchestrator tracks state)
- Monitoring and debugging tooling

## Related

- [Transactional Outbox Pattern](/posts/outbox-pattern/) — Reliable event publishing for choreography
- [Circuit Breaker Pattern](/posts/circuit-breaker/) — Protect saga steps from cascading failures
