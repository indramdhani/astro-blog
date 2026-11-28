---
title: "Authorization Model Selection"
publishDate: "2026-11-28"
description: "Choosing between RBAC, ABAC and other authorization models, and when each one is enough."
tags:
  - "security"
  - "architecture"
---

## When You Need This
- Deciding how to model "who can do what" for an app/API
- Quick rule-of-thumb to pick between roles, attributes, scopes, or resource ACLs
- Low-risk design that won't become technical debt

---

## Decision Checklist (Start Simple)

| Model | Use When |
|-------|----------|
| **RBAC** (Role → Permissions) | Small, stable set of roles (admin/editor/viewer); easy to reason about and cache |
| **ABAC / Policy Engine** | Access depends on attributes/context (owner, tenant, time, IP, resource state) |
| **OAuth Scopes** | Delegated third-party access (limited token scopes) |
| **Capabilities / Resource ACLs** | Fine-grained, per-resource grants (shared links, per-document permissions) |

---

## Implementation Patterns

### 1. Policy Function (Recommended Starting Point)
```typescript
function can(user: User, action: string, resource: Resource): boolean {
  // Start simple: role check
  if (user.role === 'admin') return true;
  // Add ownership check
  if (action === 'delete' && resource.ownerId !== user.id) return false;
  return true;
}
```
- Call from handlers/services
- Testable in isolation
- Extendable without refactoring call sites

### 2. Middleware for Coarse Checks
```typescript
// Coarse-grained: middleware
app.use('/admin/*', requireRole('admin'));

// Fine-grained: in handler
app.delete('/posts/:id', (req, res) => {
  if (!can(req.user, 'delete', post)) return res.sendStatus(403);
  // ...
});
```

### 3. Escalate Only When Needed
| Trigger | Upgrade To |
|---------|------------|
| Context-dependent rules (time, IP, tenant) | ABAC / OPA / Cedar |
| Per-resource grants (share links) | Capability tokens / Resource ACLs |
| Third-party integrations | OAuth 2.0 scopes |

---

## Example Evolution
> "2024-10 — Started with RBAC (admin/editor/viewer). Added `can(user, action, resource)` for ownership-based deletes. Later introduced ABAC for tenant isolation."

## Related

- [Authentication Method Selection Guide](/posts/authentication-method-selection/) — The step before authorization: proving who the user is
