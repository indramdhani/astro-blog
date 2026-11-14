---
title: "CQRS: Command Query Responsibility Segregation"
publishDate: "2026-11-27"
description: "Separate read and write models to scale and optimise each side, and the trade-offs that come with eventual consistency."
tags:
  - "pattern"
  - "architecture"
---

## Overview
CQRS stands for **Command Query Responsibility Segregation**. It separates **read (query)** and **write (command)** operations into different models.

> "Can be used for situations when app performance and security are complex and objects are exposed to both reading and writing transactions."

## Core Principle
| Model | Responsibility | Optimization |
|-------|----------------|--------------|
| **Write Model (Command)** | Handle create, update, delete; manage persistence events; act as data source for read side | Scalability, consistency, event sourcing |
| **Read Model (Query)** | Generate projections → denormalized views; handle read requests | Performance, fast queries, no joins |

## When to Use
- **Performance problems** — High read volume, model needs frequent updates
- **Scalability problems** — Large concurrent users, shared model bottleneck
- **Flexibility needs** — Change read/write independently for new features

## Architecture
```
┌─────────────┐     Commands      ┌─────────────┐
│   Client    │ ────────────────▶ │ Write Model │
└─────────────┘                   └──────┬──────┘
                                         │ Events
                                         ▼
┌─────────────┐     Queries       ┌─────────────┐
│   Client    │ ◀──────────────── │ Read Model  │
└─────────────┘                   └─────────────┘
        ▲                                │
        │         Projections            │
        └────────────────────────────────┘
```

## Benefits
| Benefit | How Achieved |
|---------|--------------|
| **Improved performance** | Read model denormalized, optimized for query patterns |
| **Increased scalability** | Read/write scaled independently |
| **Improved flexibility** | Change read or write model without affecting the other |
| **Security** | Different auth/validation per model |

## Trade-offs
| Drawback | Mitigation |
|----------|------------|
| **Complexity** | Two models to maintain; event synchronization |
| **Cost** | Double development/maintenance effort |
| **Eventual consistency** | Read model lags write model (ms to seconds) |
| **Not always needed** | Only when benefits outweigh costs |

## Implementation Patterns
| Pattern | Description |
|---------|-------------|
| **Separate tables** | Different DB tables for read/write |
| **Separate databases** | Different DB engines (e.g., write → PostgreSQL, read → Elasticsearch) |
| **Event sourcing** | Write model emits events; read model rebuilds from event log |
| **Materialized views** | Read model = precomputed views refreshed on write |

## Related

- [Saga Pattern](/posts/saga-pattern/) — Commands as saga steps
- [Transactional Outbox Pattern](/posts/outbox-pattern/) — Reliable event emission for read model sync
