---
title: "Proxy vs Reverse Proxy"
publishDate: "2026-12-18"
description: "The difference between forward and reverse proxies, their use cases, and implementations such as Nginx, ALB and CloudFront."
tags:
  - "architecture"
  - "networking"
---

## Forward Proxy
Sits between **client devices** and the **internet**.

| Use Case | Description |
|----------|-------------|
| **Protect clients** | Hide client IPs, enforce policies |
| **Bypass restrictions** | Access blocked content |
| **Content filtering** | Block malicious/unwanted sites |
| **Caching** | Reduce bandwidth, improve speed |

**Flow:** Client → Forward Proxy → Internet → Forward Proxy → Client

---

## Reverse Proxy
Sits between **clients** and **backend servers**.

| Use Case | Description |
|----------|-------------|
| **Protect servers** | Hide backend topology, WAF integration |
| **Load balancing** | Distribute traffic across servers |
| **Caching** | Serve static content from edge |
| **SSL Termination** | Decrypt HTTPS at edge, plain HTTP to backends |
| **Rate limiting** | Protect against abuse |
| **Request routing** | Path/host-based routing to services |

**Flow:** Client → Reverse Proxy → Backend Server(s) → Reverse Proxy → Client

---

## Comparison

| Aspect | Forward Proxy | Reverse Proxy |
|--------|---------------|---------------|
| **Position** | Client side | Server side |
| **Visibility** | Client knows proxy | Client thinks proxy is server |
| **Primary goal** | Client anonymity/control | Server protection/scaling |
| **Examples** | Squid, corporate proxy | Nginx, HAProxy, ALB, CloudFront |

---

## Common Implementations
- **Nginx** — Reverse proxy, load balancer, cache
- **HAProxy** — High-performance TCP/HTTP load balancer
- **Envoy** — Service mesh sidecar, L7 proxy
- **AWS ALB** — Managed L7 reverse proxy
- **CloudFront** — CDN + reverse proxy at edge
- **Squid** — Classic forward proxy
