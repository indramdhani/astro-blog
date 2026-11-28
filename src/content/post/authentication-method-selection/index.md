---
title: "Authentication Method Selection Guide"
publishDate: "2026-11-28"
description: "How to pick an authentication approach: sessions, tokens, OAuth/OIDC, passwordless or mTLS, with implementation patterns."
tags:
  - "security"
  - "architecture"
---

## Quick Decision Matrix

| Architecture | Recommended Approach |
|--------------|---------------------|
| Server-rendered web app | Server-side sessions (Redis) + secure cookies |
| SPA / Mobile app | Short-lived access tokens + refresh tokens (HttpOnly cookie preferred) |
| Third-party / delegated access | OAuth 2.0 / OpenID Connect (use existing IdP) |
| Low friction / modern UX | Passwordless (magic links) + optional MFA |
| High security / service-to-service | mTLS or short signed tokens (key rotation) |

**Principle:** Start simple, add complexity only when needed.

---

## Implementation Patterns

### Session-Based (Traditional Web)
```javascript
// Store session server-side (Redis) with TTL + sliding expiration
// Cookie flags: HttpOnly, Secure, SameSite=Lax (or Strict for high security)
Set-Cookie: session=<id>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800
```

### Token-Based (SPA / API)
```javascript
// Short-lived access token (10-30 min) + long-lived refresh token
const access = jwt.sign({ sub: user.id }, ACCESS_KEY, { expiresIn: '15m' });
const refresh = createRefreshToken(); // Store hashed in DB with expiry, userId

res.cookie('refresh', refresh, { 
  httpOnly: true, 
  secure: true, 
  sameSite: 'lax', 
  maxAge: 7*24*60*60*1000 
});
```

### Password Handling
- **Hash:** `argon2id` (preferred) or `bcrypt` (cost ≥12)
- **Policy:** Reasonable length/complexity + rate-limited login attempts + lockout/backoff

### Refresh Token Rotation
- On refresh: **rotate** token, invalidate previous, store hashed new token + expiry
- On logout: Delete stored refresh token(s)

### MFA & Passwordless
| Method | Standard | Notes |
|--------|----------|-------|
| TOTP | RFC 6238 | Time-based, 30s window |
| WebAuthn | FIDO2 | Hardware keys, biometrics |
| Magic links | Custom | Single-use, short expiry, one-time |

---

## Security & Operations Checklist

- [ ] TLS everywhere
- [ ] Validate token: signature, issuer, audience, expiry
- [ ] Deny-by-default auth checks on critical endpoints
- [ ] Log auth failures with correlation IDs (no PII)
- [ ] Rate-limit auth endpoints; CAPTCHA where appropriate
- [ ] Rotate keys (JWKS for public keys); plan key rollover
- [ ] No sensitive data in JWT payloads (IDs/claims only)

---

## Scalability Tips

| Component | Recommendation |
|-----------|----------------|
| Session store | Redis/managed store with TTL, horizontal scaling |
| Access tokens | Short-lived, stateless → reduces DB roundtrips |
| Refresh flow | Re-check privileges only on refresh, not every request |
| Caching | Add only after measuring bottlenecks |

---

## Example: Project Y (2024)
- 15-min JWT access tokens + rotating refresh tokens
- Refresh tokens stored hashed in DB for revocation
- Refresh token delivered as HttpOnly cookie
- Prevented long-lived token misuse; enabled server-side revocation on logout

## Related

- [Storing Passwords Securely with Argon2id](/posts/password-storage-security/) — Hashing and storing the passwords behind the login
- [Authorization Model Selection](/posts/authorization-model-selection/) — Who may do what once the user is authenticated
