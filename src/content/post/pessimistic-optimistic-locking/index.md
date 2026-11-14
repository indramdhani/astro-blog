---
title: "Pessimistic vs Optimistic Locking"
publishDate: "2026-12-15"
description: "Two ways to handle concurrent updates: lock rows up front, or detect conflicts at write time."
tags:
  - "pattern"
  - "database"
---

## Overview
Locks are essential to maintain data consistency and integrity in multi-user environments. They prevent simultaneous modifications that can lead to data inconsistencies.

---

## Pessimistic Locking

**Assumption:** Conflicts **will** occur → lock early

| Aspect | Detail |
|--------|--------|
| **Behavior** | Locks data before any changes; prevents other users from reading/updating until lock released |
| **Typical SQL** | `SELECT ... FOR UPDATE` (row-level), `LOCK TABLE` (table-level) |
| **Isolation** | Often requires `REPEATABLE READ` or `SERIALIZABLE` |
| **Best for** | High contention, short transactions, critical sections |

### Pros
- Strong consistency guarantee
- Simple mental model
- Prevents conflicts entirely

### Cons
- **Performance:** Blocks other transactions
- **Deadlock risk:** Circular wait conditions
- **Scalability:** Limits concurrency

---

## Optimistic Locking

**Assumption:** Conflicts are **rare** → check at commit

| Aspect | Detail |
|--------|--------|
| **Behavior** | Allows concurrent reads/writes; validates at commit time (version/timestamp check) |
| **Typical Implementation** | `version` column (increment on update), or `updated_at` timestamp |
| **Conflict Handling** | Abort + retry on version mismatch |
| **Best for** | Low contention, long transactions, high read-to-write ratio |

### Pros
- High concurrency, no blocking
- Better throughput under low contention
- Works well with distributed systems

### Cons
- Retry logic complexity
- Wasted work on conflict
- Not suitable for high-contention hotspots

---

## Comparison

| Dimension | Pessimistic | Optimistic |
|-----------|-------------|------------|
| **Concurrency** | Low (blocks) | High (non-blocking) |
| **Consistency** | Immediate | At commit |
| **Deadlocks** | Possible | None (but retries) |
| **Latency** | Predictable | Variable (retries) |
| **Complexity** | Low | Medium (retry logic) |

---

## Best Practices

1. **Hold locks minimum time** — Short transactions
2. **Granular locks** — Row-level > table-level
3. **Retry logic** — Exponential backoff for optimistic conflicts
4. **Choose per use case:**
   - Inventory decrement → Pessimistic
   - User profile update → Optimistic
   - Financial ledger → Pessimistic (or serialized)
   - Cache invalidation → Optimistic
