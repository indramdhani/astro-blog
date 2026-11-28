---
title: "Networking in AWS"
publishDate: "2026-11-28"
description: "The building blocks of AWS networking: VPC, subnets, gateways, endpoints, security groups and NACLs, Transit Gateway and PrivateLink."
tags:
  - "aws"
  - "networking"
---

## Core Topics

| Area | Key Concepts |
|------|--------------|
| **Networking Fundamentals** | CIDR, IP addressing, routing, subnetting |
| **VPC** | Virtual Private Cloud, isolation, tenancy |
| **Subnets & Route Tables** | Public/private subnets, NAT gateway, IGW, route propagation |
| **Security** | Security Groups (stateful), NACLs (stateless), VPC Flow Logs |
| **DNS & DHCP** | Route 53, VPC resolver, DHCP options sets |
| **Load Balancing** | ALB (L7), NLB (L4), CLB (legacy), target groups |
| **Performance** | Enhanced networking, ENA, placement groups, Global Accelerator |
| **Monitoring** | VPC Flow Logs, CloudWatch metrics, Reachability Analyzer |
| **Compliance** | Network segmentation, encryption in transit, audit trails |

## Quick Reference

| Component | Purpose |
|-----------|---------|
| **VPC** | Logically isolated network |
| **Subnet** | AZ-scoped IP range (public/private) |
| **Route Table** | Controls traffic flow |
| **IGW** | Internet access for public subnets |
| **NAT Gateway** | Outbound internet for private subnets |
| **Security Group** | Instance-level firewall (allow rules only) |
| **NACL** | Subnet-level firewall (allow + deny) |
| **VPC Peering** | Connect two VPCs (non-transitive) |
| **Transit Gateway** | Hub-and-spoke for many VPCs |
| **PrivateLink** | Private access to AWS services |

## Related

- [Proxy vs Reverse Proxy](/posts/proxy-and-reverse-proxy/) — Forward and reverse proxies, as used by ALB and CloudFront
