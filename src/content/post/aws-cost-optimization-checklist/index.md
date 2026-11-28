---
title: "AWS Cost Optimization Checklist"
publishDate: "2026-11-28"
description: "A practical checklist for cutting an AWS bill: EC2, EBS, S3, data transfer, networking and the habits that keep costs down."
tags:
  - "aws"
  - "architecture"
---

A checklist, grouped by service. Prices mentioned were checked against the AWS pricing pages on 28 November 2026 (US East, N. Virginia); check your own Region.

## EC2

| Optimization | Action |
|--------------|--------|
| **Reduce instance sizes** | Rightsize based on utilization (CPU, memory) |
| **Scale idle capacity down** | Scale to zero for non-prod; target tracking for prod |
| **Commit for steady workloads** | Savings Plans or Reserved Instances. Savings Plans are the more flexible option; Standard RIs are cheaper than Convertible, so use Convertible only if you need flexibility, and Standard RIs can be resold on the RI Marketplace |
| **Spot Instances** | For fault-tolerant, stateless, batch workloads |
| **Upgrade generation** | Graviton and newer Intel/AMD generations give better price/performance |
| **Region selection** | us-east-1 (N. Virginia) is typically among the cheapest; weigh latency and data residency |

## EBS

| Optimization | Action |
|--------------|--------|
| **Terminate, don't stop** | Stopped instances still incur EBS charges |
| **Prefer gp3 over gp2** | gp3 is $0.08 per GB-month against $0.10 for gp2 (20% cheaper) and has provisioned IOPS |
| **Reduce volume size** | Rightsize volumes; monitor `VolumeIdleTime` and delete unattached volumes |
| **Don't use EBS for long-term backups** | S3 is much cheaper per GB; snapshots add their own cost |

## S3

| Optimization | Action |
|--------------|--------|
| **Choose the storage class** | Standard → IA → Glacier → Deep Archive by access pattern |
| **Use a gateway endpoint** | Private S3 access that avoids NAT gateway data processing charges (see [S3 Gateway Endpoint](/posts/aws-s3-gateway-endpoint/)) |
| **Watch request costs** | GET/PUT/LIST add up; use CloudWatch metrics |

## Data Transfer

| Optimization | Action |
|--------------|--------|
| **Return only needed fields** | GraphQL or sparse fieldsets reduce payload size |
| **Use a CDN (CloudFront)** | Cache at the edge to reduce origin data transfer; evaluate for global traffic |
| **Mind cross-AZ traffic** | Data between AZs is charged. Reduce chatty cross-AZ calls instead of dropping to a single AZ, which trades away resilience |
| **Private pricing for large volumes** | CloudFront offers contract pricing for high volume and long commitments |

## Networking

| Optimization | Action |
|--------------|--------|
| **Public IPv4 addresses** | $0.005 per address per hour since February 2024, in use or idle; release idle ones, see [Reducing AWS Public IPv4 Costs](/posts/ipv4-cost-mitigation/) |
| **NAT gateways** | $0.045 per hour plus $0.045 per GB processed; consolidate and keep S3/DynamoDB traffic on gateway endpoints |

## Organization

| Optimization | Action |
|--------------|--------|
| **Consolidated billing** | Volume discounts across all accounts |
| **Request credits for downtime** | Check the AWS Health Dashboard and open a support case |
| **Seek credits proactively** | Activate, startup, research and training programs |

## Monitoring and Habits

| Practice | Action |
|----------|--------|
| **Clear goals** | Define targets, for example "20% reduction in Q3" |
| **Regular routine** | Monthly review, quarterly deep dive |
| **Tag everything** | Cost allocation tags such as `Environment`, `Team`, `Project`, `Owner` |

## Sources

Based on my notes from two articles, [Optimize AWS Costs](https://blog.back4app.com/optimize-aws-costs/) (back4app) and [Reduce AWS Costs](https://george-51059.medium.com/reduce-aws-costs-74ef79f4f348) (Medium). The advice on committed use, cross-AZ traffic and networking, and all prices, were added or checked against AWS documentation.

## Related

- [Reducing AWS Public IPv4 Costs](/posts/ipv4-cost-mitigation/) — what each public address costs and how to cut it
- [S3 Gateway Endpoint: Cut NAT Gateway Data Costs](/posts/aws-s3-gateway-endpoint/) — keep S3 traffic off the NAT gateway
