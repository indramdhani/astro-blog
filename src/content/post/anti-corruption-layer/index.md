---
title: "Anti-Corruption Layer"
publishDate: "2026-12-01"
description: "A DDD pattern that isolates your domain model from legacy or external systems through a translation layer."
tags:
  - "pattern"
  - "architecture"
---

## Definition
An **Anti-Corruption Layer** is a software design pattern that protects and isolates different systems or subsystems from each other, especially when they have incompatible models or interfaces. Commonly used in **Domain-Driven Design (DDD)** to prevent "corruption" of your internal domain model by external systems or legacy code.

## Key Concepts

| Term | Meaning |
|------|---------|
| **Corruption** | When changes/inconsistencies in one system negatively affect another. Example: integrating a legacy system with poor design pollutes your clean domain model. |
| **Layer** | The ACL acts as a buffer/translator between two systems with different designs or responsibilities. |

## How It Works
1. **Translates** data and calls between systems so each keeps its own internal model/logic
2. **Adapts** external services, APIs, or data formats into forms compatible with your system
3. **Prevents leakage** of external system complexity into your domain model

## Example
> New system with clean domain model integrating with an old CRM with messy, inconsistent API.
> 
> **ACL responsibilities:**
> - Talks to old CRM system
> - Translates CRM data → clean structure your domain understands
> - Converts your requests → format CRM expects

## Benefits
- Preserves domain model integrity
- Enables gradual migration from legacy systems
- Simplifies testing and maintenance (external changes isolated to ACL)

## Implementation Patterns
| Pattern | Use Case |
|---------|----------|
| **Adapter** | Translate external API → internal interface |
| **Facade** | Simplify complex external system behind clean API |
| **Translator/Mapper** | Convert data formats, naming conventions |
| **Gateway** | Encapsulate external communication (HTTP, gRPC, queue) |

## When to Use
- Integrating with legacy systems
- Consuming third-party APIs with unstable/poorly designed contracts
- Migrating from monolith to microservices (strangler fig)
- Multiple bounded contexts with different ubiquitous languages
