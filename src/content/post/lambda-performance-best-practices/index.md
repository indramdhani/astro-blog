---
title: "AWS Lambda Performance Best Practices"
publishDate: "2026-12-29"
description: "Cold start remedies, memory and runtime choices, async processing, batching and layers to make Lambda faster and cheaper."
tags:
  - "aws"
  - "serverless"
---

## Cold Start Remedies
- **Provisioned Concurrency** — Pre-warmed instances for predictable traffic
- **Warmer Functions** — Scheduled invocations to keep functions warm
- **Caching** — Initialize heavy dependencies in global scope (outside handler)

## Invocation Model
- **Asynchronous invocations** — EventBridge, SQS, SNS for decoupling and retries
- **Event-driven** — React to events rather than polling

## Code Optimization
- **Efficient dependencies** — Remove unused code, use specific imports (ESM tree-shaking)
- **Asynchronous programming** — Non-blocking I/O, parallelize independent operations
- **Bundle size** — Minimize with esbuild/webpack; exclude dev dependencies
- **Stateless & ephemeral** — No local state; externalize to DDB, Redis, S3

## Memory & Runtime
- **Memory configuration** — More memory = more CPU (linear up to 10GB); find sweet spot
- **Runtime choice** — Python, Node.js for fast cold starts; Go, Rust for CPU-intensive; avoid Java/.NET for latency-sensitive paths

## Architecture
- **Parallelization / Batching** — Process multiple items per invocation (SQS batch window, Kinesis batch size)
- **Lambda Layers** — Share common dependencies across functions
- **Split by usage, not routes** — Group by scaling/performance profile, not API paths

## Observability
- **Structured logging** — JSON, sampling for high volume
- **Metrics** — Duration, errors, throttles, cold start %
- **Tracing** — X-Ray for distributed traces
- **Error handling** — Dead letter queues, retry policies
