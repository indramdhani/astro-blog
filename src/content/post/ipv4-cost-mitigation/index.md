---
title: "Reducing AWS Public IPv4 Costs"
publishDate: "2026-11-28"
description: "Since February 2024 AWS charges for every public IPv4 address. How to find them, what they cost, and when IPv6, BYOIP or private subnets pay off."
tags:
  - "aws"
  - "networking"
---

## Background
Since **1 February 2024** AWS charges **$0.005 per public IPv4 address per hour** (about **$3.65 per month**). The charge applies to every public IPv4 address, in use or idle, on every service that can have one: EC2, RDS, EKS nodes, load balancers, NAT gateways and more. EC2 free tier includes 750 hours of public IPv4 usage per month for the first 12 months. Addresses you bring yourself (BYOIP) are not charged.

Prices in this post are for US East (N. Virginia), taken from the AWS announcement and the VPC and Elastic Load Balancing pricing pages on 28 November 2026. Check your Region.

## Find and Count Your Public IPs

| Step | Action |
|------|--------|
| **1. Identify** | List every public IPv4 address (EC2, NAT gateways, load balancers, Elastic IPs, RDS) |
| **2. Evaluate** | Decide which resources really need to be reachable from the internet |
| **3. Review EC2** | Check instance networking, subnets and security groups |
| **4. Budget** | Multiply by $3.65 per month and rank by saving |

Quick wins:
- Run `aws ec2 describe-addresses` to list Elastic IPs and **release the idle ones**.
- Find instances with a public address: `aws ec2 describe-instances --filters "Name=ip-address,Values=*"`.
- Use the Public IP Insights feature of VPC IPAM and Cost Explorer to see where the charge comes from.

## What the Numbers Look Like

| Item | Monthly cost |
|------|--------------|
| One public IPv4 address | $3.65 |
| 5 EC2 instances with a public IP | 5 × $3.65 = **$18.25** |
| One NAT gateway (hourly part only, $0.045/h) | $32.85, **plus** $0.045 per GB processed, **plus** its own public IPv4 ($3.65) |
| Public Application Load Balancer in 2 AZs | $16.43 (at $0.0225/h) + LCU charges + **2 public IPs = $7.30** |

Two consequences:
- **A load balancer is not free of IPv4 charges.** Every public address it uses is billed like any other.
- **Moving a few instances behind a NAT gateway can cost more than it saves.** One NAT gateway with its address is about $36.50 per month, the price of roughly **10** public IPv4 addresses. Removing public IPs from 5 instances and adding a NAT gateway raises the bill. It only pays off when one NAT gateway replaces many addresses, or when you need private subnets for security anyway.

## Options

### 1. Migrate to IPv6
- Enable IPv6 on the VPC, subnets and instances, and update ALB/NLB to dual-stack and DNS (AAAA records).
- IPv6 addresses are not part of the public IPv4 charge.
- Watch client support: some clients and partner services are still IPv4-only, so you usually run dual-stack during the transition.
- Steps: associate an IPv6 CIDR with the VPC, assign it to subnets, enable it on instances, update load balancers and DNS, test end to end.

### 2. Remove Public IPv4 You Do Not Need
| Resource | What to do |
|----------|------------|
| **EC2 instances** | Private subnets; use a shared NAT gateway (or a NAT instance for low traffic) only if they need outbound access |
| **NAT gateways** | Consolidate; one per AZ is the usual resilient minimum |
| **ALB / NLB** | Internal scheme where traffic is private; put CloudFront in front when only the CDN must be public |
| **Elastic IPs** | Release unused ones immediately |
| **RDS / ElastiCache** | Disable public accessibility and use private connectivity |
| **S3 and DynamoDB traffic** | Use gateway endpoints so it does not need a public path (see [S3 Gateway Endpoint](/posts/aws-s3-gateway-endpoint/)) |

### 3. Bring Your Own IP (BYOIP)
- Import your own IPv4 range; those addresses are not charged.
- Needs at least a /24 and RPKI/ROA setup, plus ongoing operations work.
- Only worth it for organisations that already own address space.

## Checklist
- [ ] List all public IPv4 addresses and their owners
- [ ] Release idle Elastic IPs
- [ ] Switch ALBs to internal where possible
- [ ] Compare the cost of NAT gateways against the addresses they would replace
- [ ] Enable IPv6 on the VPC and plan dual-stack for public services

## Related

- [Networking in AWS](/posts/networking-in-aws/) — VPC, subnets, gateways and endpoints
- [S3 Gateway Endpoint: Cut NAT Gateway Data Costs](/posts/aws-s3-gateway-endpoint/) — keep S3 traffic off the NAT gateway
