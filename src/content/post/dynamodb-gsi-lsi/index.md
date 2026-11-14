---
title: "DynamoDB: GSI vs LSI"
publishDate: "2026-12-31"
description: "Global vs local secondary indexes: key differences, query scope, creation timing, consistency and cost."
tags:
  - "aws"
  - "dynamodb"
---

## Overview
- **GSI (Global Secondary Index)** — Different partition key AND sort key; queries across ALL partitions
- **LSI (Local Secondary Index)** — SAME partition key, different sort key; queries within ONE partition

## Comparison

| Feature | GSI | LSI |
|---------|-----|-----|
| **Partition Key** | Different from base table | Same as base table |
| **Sort Key** | Different from base table | Different from base table |
| **Query Scope** | All partitions | Single partition |
| **Creation** | Anytime (after table creation) | Must create WITH table |
| **Consistency** | Eventual only | Strong or eventual |
| **Throughput** | Separate RCU/WCU | Shares base table throughput |
| **Max per Table** | 20 | 5 |

## Example: Orders Table

**Base Table:**
- PK: `OrderID` (partition)
- SK: `OrderDate` (sort)

### GSI: Query by Customer Across All Orders
- PK: `CustomerName`
- SK: `OrderDate`
- **Use case:** "Show all orders for Customer X" — spans multiple partitions

### LSI: Query by Customer Within Single Order Partition
- PK: `OrderID` (same as base)
- SK: `CustomerName`
- **Use case:** "Show orders for Customer X within OrderID partition" — single partition

## Decision Guide

```
Need to query by different partition key?
    │
    ├─ YES → GSI
    │
    └─ NO (same partition key, different sort key)
         │
         ├─ Need strong consistency? → LSI
         │
         └─ Eventual OK? → GSI (more flexible)
```

## Cost Implications
- **GSI:** Separate provisioned/on-demand capacity → additional cost
- **LSI:** Shares base table capacity → no extra cost, but consumes base RCU/WCU

## Best Practices
- Prefer GSI for flexibility (create anytime, query across partitions)
- Use LSI only when you need strong consistency on alternate sort key
- Project only needed attributes (`INCLUDE` or `KEYS_ONLY`) to save storage/RCU
- Monitor `ConsumedReadCapacityUnits` per index
