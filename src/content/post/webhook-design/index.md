---
title: "Designing Webhooks"
publishDate: "2026-12-11"
description: "Provider and receiver design for webhooks: security, idempotency, retries, health checks and queue decoupling."
tags:
  - "architecture"
---

## Core Functions (Provider Side)

| Function | Purpose |
|----------|---------|
| `createWebhook` | Create subscription: generate ID, secret key, store URL + events |
| `deleteWebhook` | Remove subscription, invalidate secret |
| `listWebhooks` | List active subscriptions with filtering/pagination |
| `updateWebhook` | Modify events, callback URL |
| `sendWebhookEvent` | Construct payload, sign with secret, POST to callback URL |
| `verifyWebhookSignature` | Validate incoming requests using stored secret |
| `processWebhookPayload` | Parse, validate, act on received payload |
| `logWebhookEvent` | Audit trail for incoming/outgoing webhooks |
| `retryFailedWebhooks` | Retry mechanism (exponential backoff) or queue integration |
| `webhookHealthCheck` | Periodic check of registered URLs |
| `webhookMetrics` | Success/failure rates, latency, errors |
| `webhookAuthentication` | AuthZ for webhook management operations |

## Webhook Flow

```
Application A (Provider)          Application B (Receiver)
        │                              │
        │ 1. Expose webhook endpoint   │
        │ ◄──────────────────────────── │
        │                              │
        │ 2. Register webhook URL      │
        │ ───────────────────────────► │
        │                              │
        │ 3. Event occurs in A         │
        │                              │
        │ 4. POST payload to B's URL   │
        │ ───────────────────────────► │
        │                              │
        │ 5. B receives, processes     │
        │ ◄──────────────────────────── │
```

## Payload & Security

```json
{
  "id": "evt_abc123",
  "type": "user.created",
  "timestamp": "2025-07-24T10:30:00Z",
  "payload": { "userId": "usr_456", "email": "user@example.com" }
}
```

**Security:**
- **Secret key** per subscription — HMAC-SHA256 signature in header
- **Verify signature** on every receipt
- **Idempotency** — Include event ID; receiver deduplicates

## Fallback & Reliability

| Pattern | Description |
|---------|-------------|
| **Long polling fallback** | If webhook delivery fails repeatedly |
| **Queue decoupling** | SQS/Kafka between event and delivery |
| **Exponential backoff** | Retry with jitter (1s, 2s, 4s, 8s, max 5×) |
| **Dead letter queue** | Capture permanently failed deliveries |
| **Health checks** | Periodic HEAD/GET to verify endpoint liveness |

## Implementation Options

| Approach | When to Use |
|----------|-------------|
| Separate Lambda per function | Max isolation, independent scaling |
| Combined into fewer functions | Lower cost, simpler deployment |
| API Gateway + Lambda | HTTP frontend, auth, throttling |
| EventBridge + Lambda | Native AWS event bus integration |
