---
title: "Push Notification System Design"
publishDate: "2026-11-28"
description: "A push notification architecture from gateway to channel services: components, key design decisions and reliability patterns."
tags:
  - "architecture"
---

## Architecture Overview

```
Business Services
       │
       ▼ (single or batch)
┌──────────────────┐
│ Notification     │  ◄── Two modes: single notification or batch
│ Gateway          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Distribution     │  ◄── Validation, formatting, scheduling
│ Service          │
│                  │
│ • Template Repo  │  ◄── Pre-defined message formats
│ • Channel Prefs  │  ◄── User delivery preferences
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Routers (MQ)     │  ◄── Message queues for each channel
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Channel Services │  ◄── In-app, Email, SMS, Social Media
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Tracking &       │  ◄── Delivery metrics, analytics
│ Analytics        │
└──────────────────┘
```

## Components

| Component | Responsibility |
|-----------|----------------|
| **Notification Gateway** | Entry point; accepts single/batch; rate limiting, auth |
| **Distribution Service** | Validates, formats (templates), schedules, resolves channel prefs |
| **Template Repository** | Stores pre-defined message formats (Handlebars, MJML, etc.) |
| **Channel Preference Repo** | User opt-in/opt-out per channel (email, SMS, push, in-app) |
| **Routers (Message Queues)** | Decouples distribution from delivery; per-channel queues |
| **Channel Services** | Actual delivery: FCM/APNs (push), SendGrid/SES (email), Twilio (SMS), etc. |
| **Tracking & Analytics** | Delivery rates, open rates, click-through, failure analysis |

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Batch + single mode** | High-volume systems need batching; transactional needs single |
| **Template-driven** | Separates content from logic; marketing can edit without code |
| **Channel preferences** | Respect user choices; compliance (TCPA, GDPR) |
| **Queue-based routing** | Durability, retry, dead-letter, backpressure |
| **Async delivery** | Non-blocking for business services; fire-and-forget |

## Reliability Patterns
- **Idempotency keys** — Deduplicate retries
- **Dead letter queues** — Capture permanently failed deliveries
- **Exponential backoff** — Retry with jitter
- **Circuit breaker** — Protect downstream providers

## Related

- [Publish-Subscribe Pattern](/posts/publish-subscribe-pattern/) — The messaging idea behind notification queues
- [Designing Webhooks](/posts/webhook-design/) — The receiving side of event delivery
