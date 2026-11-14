---
title: "Transactional Outbox Pattern"
publishDate: "2026-11-24"
description: "Publish events reliably by writing them to an outbox table in the same transaction as your data, then relaying them."
tags:
  - "pattern"
  - "microservices"
---

## Overview
Ensures reliable message delivery in distributed systems (especially microservices) by atomically storing messages in an **outbox table** within the same transaction as the business operation, then as the business data change. A separate relay process publishes messages from the outbox.

## Problem
> In a distributed system, you need to update a database AND publish an event. These are two separate operations — if one fails, you get inconsistency.

## Solution
```
┌─────────────────────────────────────┐
│         Single Transaction           │
├─────────────────────────────────────┤
│  Business Data Change (e.g. Order)  │
│  + Outbox Record (Event Payload)    │
└─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│     Relay Process (async)            │
│  - Polls outbox table               │
│  - Publishes to message broker       │
│  - Marks outbox record as published  │
└─────────────────────────────────────┘
```

## Implementation Approaches

### 1. Polling Relay (Simple)
- Background job polls outbox table every N seconds
- Publishes unpublished records
- Marks as published on success

### 2. Transaction Log Tailer (CDC)
- Tools: Debezium, AWS DMS, custom log miner
- Reads DB transaction log directly
- Lower latency, no polling

### 3. Dual Write to Broker + Outbox (Not Recommended)
- Write to both DB and broker in same transaction
- Requires transactional outbox support (rare)

## Database Schema
```sql
CREATE TABLE outbox (
  id UUID PRIMARY KEY,
  aggregate_type VARCHAR(100),      -- e.g., "Order"
  aggregate_id VARCHAR(100),        -- e.g., "order-123"
  event_type VARCHAR(100),          -- e.g., "OrderCreated"
  payload JSONB NOT NULL,           -- Event payload
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP NULL,      -- NULL = unpublished
  retry_count INT DEFAULT 0
);

CREATE INDEX idx_outbox_unpublished ON outbox (published_at) 
  WHERE published_at IS NULL;
```

## Key Properties
| Property | How Achieved |
|----------|--------------|
| **Atomicity** | Business change + outbox write = single DB transaction |
| **Durability** | Outbox in same DB as business data (survives crashes) |
| **Ordering** | FIFO per aggregate (aggregate_id + created_at) |
| **Idempotency** | Consumer must handle duplicates (use event ID) |
| **Retry** | Failed publishes stay in outbox, retried on next poll |

## Considerations
- **Latency:** Polling interval adds delay (typically 100ms–5s)
- **Complexity:** Relay process, ordering, deduplication
- **Schema evolution:** Outbox payload versioning needed
- **Cleanup:** Archive published records periodically

## Related

- [Saga Pattern](/posts/saga-pattern/) — Often uses outbox for step events
