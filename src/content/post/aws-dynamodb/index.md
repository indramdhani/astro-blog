---
title: "AWS DynamoDB: Single-Table Design and Capacity"
publishDate: "2026-11-28"
description: "DynamoDB core features, single-table design, secondary indexes, capacity modes, consistency, cost optimisation and anti-patterns."
tags:
  - "aws"
  - "dynamodb"
---

## Overview
- **Highly scalable** — seamless scalability
- **Reliable key-value datastore** — managed infrastructure
- **Serverless architecture** — no servers to manage
- **Table structure:** Items → Attributes

## Key Features
- Scalability (on-demand + provisioned)
- Schemaless data model
- Efficient data retrieval with complex queries
- High throughput
- Managed infrastructure
- Consistency models (eventual + strong)
- Partitioning & sorting
- Local & Global tables (multi-region)
- Replication & latency optimization
- Primary key types:
  - **Partition Key** — single attribute, uniquely identifies item; items with same PK stored together, sorted by SK
  - **Sort Key** — composite primary key (PK + SK); multiple items per PK, distinguished by SK
- Secondary indexes:
  - **LSI (Local Secondary Index)** — same PK, different SK; useful for different query patterns on same partition
  - **GSI (Global Secondary Index)** — different PK and SK; flexible query patterns, independent of main table

## Use Cases
- Real-time applications
- Internet of Things (IoT)
- E-commerce
- Content management

## Single-Table Design (Core Pattern)
| Principle | Do | Don't |
|-----------|-----|-------|
| **Access patterns first** | Plan all queries upfront | Design schema then figure out queries |
| **Composite keys** | Use PK + SK for hierarchies | Single-attribute keys only |
| **Sparse indexes** | Leverage GSIs for optional attributes | Dense indexes on all attributes |
| **Normalization** | Avoid over-normalization | Normalize like SQL |
| **Hot partitions** | Distribute load via PK design | Concentrate writes on one PK |
| **Key design** | Ensure uniqueness + load distribution | Sequential IDs as PK |

### Single-Table Design Checklist
- [ ] Plan access patterns first
- [ ] Use composite keys (PK + SK)
- [ ] Leverage sparse GSIs
- [ ] Avoid over-normalization
- [ ] Avoid hot partitions (design PK for even distribution)
- [ ] Don't neglect key design (uniqueness + distribution)

## Secondary Indexes
- **LSI:** Same PK, different SK — created at table creation, strongly consistent optional
- **GSI:** Different PK + SK — created anytime, eventually consistent, separate throughput

**Best practice:** Use GSIs for flexibility; index sparingly; avoid over-indexing

## Performance & Capacity
| Mode | Use When |
|------|----------|
| **Provisioned** | Predictable traffic, cost optimization |
| **On-Demand** | Variable/unpredictable traffic |
| **Auto Scaling** | Always enable for provisioned |

### Read/Write Capacity
- **1 RCU** = 1 strongly consistent read/sec (4 KB) OR 2 eventually consistent reads/sec (4 KB)
- **1 WCU** = 1 write/sec (1 KB)

### Consistency
- **Eventual consistency** — default, 2x read throughput, <1s typically
- **Strong consistency** — latest data, half the throughput of eventual

## Cost Optimization
- Choose right capacity mode
- Monitor usage (CloudWatch metrics)
- Don't ignore capacity alerts
- Implement TTL for auto-expiry
- Archive cold data (S3, Glacier)
- Don't store unnecessary data
- DAX for read-heavy workloads (in-memory cache)

## Data Management Strategies
- **TTL** — Auto-delete expired items
- **Archive cold data** — Move to Infrequent Access tables or S3
- **Don't store unnecessary data** — Keep items < 400 KB

## Bad Practices (Anti-Patterns)
1. Ignoring partition key design
2. Misusing global tables
3. Underestimating backup/restore
4. Over-reliance on GSIs
5. Inappropriate stream designs
6. **Scans instead of queries** — expensive, slow
7. Querying without projection expression
8. Neglecting monitoring/optimization
9. Over-provisioning capacity
10. Ignoring item size limits (400 KB)
11. Inefficient data usage
12. **Normalizing data** — denormalize for access patterns

## Related

- [DynamoDB: GSI vs LSI](/posts/dynamodb-gsi-lsi/) — Global and local secondary indexes in detail
