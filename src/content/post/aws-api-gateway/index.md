---
title: "AWS API Gateway Design Principles"
publishDate: "2026-11-28"
description: "Design principles for API Gateway: what to consider, how to design, and when REST API Gateway is the right choice."
tags:
  - "aws"
  - "architecture"
---

## Considerations

### Design Principles
- **Single point of failure** — Design for resilience
- **Interface for developers** — Not end users
- **Focus on what API should do** — Always refactor
- **User experience:** Get what they need with minimal effort
  - Easy to learn
  - Easy to use
  - Hard to misuse
  - Readable and maintainable code
  - Sufficiently powerful
  - Easy to extend
  - Appropriate for the audience
- **No assumptions** on gathering requirements
- **One API = one purpose** — Limit scope
- **Clarity and consistency**
- **Understand the audience**
- **Versioning strategy:**
  - Prevent errors for existing customers
  - Consistent & incremental approach
  - Enable compatibility breaks

### When to Use REST API Gateway
| Scenario | Reason |
|----------|--------|
| Request-response model | Client-initiated, no real-time updates needed |
| CRUD operations | Basic create/read/update/delete on resources |
| Stateless interactions | Each request independent, no persistent connection |
| Wide compatibility | REST widely supported by clients |
| Caching | Built-in caching for performance |
| API management | Throttling, API keys, usage plans |
| Microservices | Inter-service communication |
| Mobile app backend | Typical mobile operations, no real-time |

## Related

- [Backend for Frontend (BFF)](/posts/backend-for-frontend/) — A common pattern for APIs behind a gateway
