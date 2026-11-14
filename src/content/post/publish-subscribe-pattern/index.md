---
title: "Publish-Subscribe Pattern"
publishDate: "2026-12-08"
description: "Decouple producers and consumers with topics and brokers, delivery guarantees, and when to pick Kafka, Redis, RabbitMQ or SNS."
tags:
  - "pattern"
  - "architecture"
---

## Overview
Decouples producers (publishers) from consumers (subscribers) in messaging systems. Publishers send messages to topics/channels without knowing who receives them. Subscribers express interest in topics and receive relevant messages.

## Components
| Component | Role |
|-----------|------|
| **Publisher** | Produces messages, publishes to topic |
| **Broker** | Routes messages from publishers to subscribers |
| **Topic/Channel** | Logical routing key for message categories |
| **Subscriber** | Registers interest in topics, receives messages |

## Benefits
- **Scalability:** Add consumers without changing producers
- **Flexibility:** Consumers can come/go independently
- **Async Communication:** Non-blocking, fire-and-forget
- **Decoupling:** Publishers don't know subscriber details

## Considerations
- **Complexity:** Message routing, ordering, delivery guarantees
- **Broker Reliability:** Single point of failure (cluster for HA)
- **Debugging:** Harder to trace message flows
- **Ordering:** Not guaranteed across partitions/subscribers

## Delivery Guarantees
| Guarantee | Description | Use Case |
|-----------|-------------|----------|
| **At most once** | Fire-and-forget, may lose messages | Metrics, logs |
| **At least once** | Retry until ack, possible duplicates | Most business events |
| **Exactly once** | Deduplication + idempotency | Financial, critical ops |

## Popular Brokers
- **Redis Pub/Sub** — Simple, in-memory, no persistence
- **Redis Streams** — Consumer groups, persistence (Kafka-lite)
- **RabbitMQ** — AMQP, flexible routing, multiple protocols
- **Apache Kafka** — High throughput, log retention, replay
- **AWS SNS/SQS** — Managed, serverless, integration with Lambda
- **Google Pub/Sub** — Managed, global, exactly-once option
- **NATS** — Lightweight, fast, JetStream for persistence

## Patterns
| Pattern | Description |
|---------|-------------|
| **Fan-out** | One message → multiple subscribers |
| **Work queue** | Competing consumers (only one processes) |
| **Event sourcing** | Events as source of truth, replayable |
| **CQRS** | Separate read/write models via events |

## Related

- [Transactional Outbox Pattern](/posts/outbox-pattern/) — Reliable event emission
