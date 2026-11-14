---
title: "Backend for Frontend (BFF)"
publishDate: "2026-12-04"
description: "Give each client type its own backend service so web, mobile and other clients get data shaped for them."
tags:
  - "pattern"
  - "architecture"
---

## Overview
Involves creating specific backend services tailored to the requirements of individual frontend applications, optimizing communication and data delivery.

## When to Use
- Multiple frontend clients (web, mobile, third-party) with different data needs
- Need to aggregate data from multiple downstream services
- Frontend-specific transformations, filtering, or pagination logic

## Benefits
- Optimizes communication and data delivery per client
- Reduces over-fetching/under-fetching
- Allows frontend teams to own their BFF

## Considerations
- Can lead to duplicated logic across BFFs
- Additional maintenance burden (more services to deploy/monitor)
- Requires clear ownership boundaries

## Patterns
| Pattern | Description |
|---------|-------------|
| **One BFF per frontend** | Web BFF, Mobile BFF, Partner BFF |
| **Shared BFF** | Common functionality shared, extensions per client |
| **GraphQL Gateway** | Single GraphQL layer with client-specific resolvers |


## Source Note
Original note was brief; expanded with standard BFF patterns. Consider ingesting a detailed article on BFF for higher confidence.
