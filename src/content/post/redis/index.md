---
title: "Redis: Data Structures, Persistence and Scaling"
publishDate: "2026-11-28"
description: "Redis data structures and use cases, RDB and AOF persistence, performance tuning, scaling strategies and multi-region high availability."
tags:
  - "redis"
  - "database"
---

## Overview
Multi-model in-memory database with optional persistence. Used for caching, session storage, message queues, rate limiting, and more.

## Persistence Options
| Method | Description | Trade-off |
|--------|-------------|-----------|
| **Snapshotting (RDB)** | Periodic full dataset dump to disk | Fast recovery, potential data loss since last snapshot |
| **AOF (Append Only File)** | Log every write operation | Better durability, larger files, slower recovery |

**Note:** Both add storage overhead.

## Performance Optimization
- **Redis on Flash** — RAM for hot data, SSD for cold data (Redis Enterprise feature)
- Reduces memory cost for large datasets with skewed access patterns

## Scaling Strategies
| Strategy | Description |
|----------|-------------|
| **Clustering** | Master-replica for read scaling + HA |
| **Sharding** | Hash slots distributed across nodes (16,384 slots) |
| **Redis Cluster** | Combines sharding + replication |

## Multi-Region HA
| Concern | Approach |
|---------|----------|
| Geographic distribution | Deploy clusters per region |
| Disaster recovery | Cross-region replication |
| Local ↔ Remote sync | Active-active geo-distribution (Redis Enterprise) |
| Consistency | Eventual consistency typical; strong consistency requires careful design |

## Data Structures & Use Cases
| Structure | Use Case |
|-----------|----------|
| **String** | Caching, counters, rate limiting |
| **Hash** | Object caching, session data |
| **List** | Queues, recent items, activity feeds |
| **Set** | Unique tags, social graphs, IP blocking |
| **Sorted Set** | Leaderboards, rate limiting with TTL, priority queues |
| **Stream** | Message queues, event sourcing (5.0+) |
| **Bitmap** | User activity tracking, bloom filters |
| **HyperLogLog** | Approximate cardinality counting |

## Related

- [How to Scale and Make Redis More Resilient](/posts/how-to-scale-and-make-redis-more-resilient/) — Making Redis persistent and resilient
- [Publish-Subscribe Pattern](/posts/publish-subscribe-pattern/) — Redis Pub/Sub and other brokers
