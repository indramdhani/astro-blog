---
title: "S3 Gateway Endpoint: Cut NAT Gateway Data Costs"
publishDate: "2026-11-28"
description: "Route S3 traffic through a gateway VPC endpoint instead of a NAT gateway: setup, access patterns, cost impact and limits."
tags:
  - "aws"
  - "networking"
---

## Purpose
Route S3 traffic through a **Gateway VPC Endpoint** instead of NAT Gateway / Internet Gateway to:
- **Remove NAT gateway data processing charges** for S3 traffic from private subnets
- Keep traffic within AWS network (never leaves to internet)
- Reduce latency

## Setup Steps

### 1. Create VPC Gateway Endpoint
1. VPC Console → **Endpoints** → **Create Endpoint**
2. Service: `com.amazonaws.<region>.s3` (type: **Gateway**)
3. Select VPC
4. (Optional) Tags

### 2. Create S3 Access Point (Optional, for stricter control)
1. S3 Console → **Access Points** → **Create Access Point**
2. Name, select bucket
3. Network origin: **VPC** (not Internet)
4. Enter VPC ID

## Access Pattern

| Method | How to Access |
|--------|---------------|
| **Standard bucket** | `arn:aws:s3:::bucket-name` — works automatically via endpoint |
| **Access Point** | `arn:aws:s3:region:account:accesspoint/name` — VPC-only |

## Cost Impact

Prices are for US East (N. Virginia), checked on the AWS VPC pricing page on 28 November 2026. Check your own Region.

| Path | What you pay |
|------|--------------|
| Private subnet → NAT Gateway → S3 | **$0.045 per NAT Gateway hour** + **$0.045/GB** processed, whatever the source or destination |
| Private subnet → **Gateway Endpoint** → S3 | **No hourly or data processing charge** |

A gateway endpoint does not remove the NAT gateway itself if other traffic still needs it, but all the S3 bytes stop counting against its per-GB processing charge.

## Requirements & Limitations
- A gateway endpoint exists only in the **Region where you created it**: create it in the same Region as your buckets. Buckets in other Regions are not reached through it.
- Associating a route table makes AWS add the route to the endpoint (the S3 prefix list) automatically. You can reference the S3 prefix list in security group rules; network ACLs need the IP ranges instead.
- Works for all S3 operations on general purpose buckets (`com.amazonaws.<region>.s3`); directory buckets use `com.amazonaws.<region>.s3express`.
- Gateway endpoints cannot be used from on-premises networks, from VPCs peered in other Regions, or through a transit gateway. For those you need an **interface endpoint**, which has an extra cost. S3 supports both types, and DynamoDB also has a gateway endpoint.
- Creating or changing the endpoint switches routes and drops open TCP connections, so do it when nothing critical is running.
- Control access with an **endpoint policy** and bucket policies using `aws:sourceVpce` or `aws:sourceVpc`. `aws:SourceIp` does not work for requests through a VPC endpoint; use `aws:VpcSourceIp`.

## Related

- [Networking in AWS](/posts/networking-in-aws/) — VPC, subnets, gateways and endpoints in context
