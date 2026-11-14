---
title: "Storing Passwords Securely with Argon2id"
publishDate: "2026-12-22"
description: "Argon2id parameters, bcrypt as a fallback, schemas for MySQL and DynamoDB, and a security checklist for password storage."
tags:
  - "security"
---

## Core Principle
**Never store plaintext passwords.** Use a memory-hard, salted key derivation function.

---

## Recommended: Argon2id

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Algorithm | `argon2id` | Hybrid of Argon2i (side-channel resistance) + Argon2d (GPU resistance) |
| Memory Cost | 65,536 KB (64 MB) | Adjust for target hardware; higher = more GPU/ASIC resistance |
| Time Cost | 3 iterations | Balance latency vs security |
| Parallelism | 4 threads | Utilize multi-core; don't exceed CPU cores |

```javascript
const argon2 = require('argon2');

const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
});

const valid = await argon2.verify(storedHash, password);
```

---

## Alternative (Legacy Support): bcrypt

```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12); // cost factor 12
const valid = await bcrypt.compare(password, storedHash);
```
- **Only if Argon2 unavailable** (some serverless/edge runtimes)
- Cost factor 12+ as of 2024

---

## What NOT to Use
| Algorithm | Reason |
|-----------|--------|
| MD5, SHA-1, SHA-256, SHA-512 | Fast = easily brute-forced |
| PBKDF2 | Better than raw hash, but not memory-hard |
| Custom crypto | Don't roll your own |

---

## Database Schema

### MySQL
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### DynamoDB
```json
{
  "TableName": "Users",
  "KeySchema": [{ "AttributeName": "email", "KeyType": "HASH" }],
  "AttributeDefinitions": [{ "AttributeName": "email", "AttributeType": "S" }],
  "BillingMode": "PAY_PER_REQUEST"
}
```
Item: `{ email: "user@example.com", password_hash: "<argon2-hash>", created_at: "2025-07-24T..." }`

---

## Security Checklist

- [ ] **Argon2id** with appropriate parameters
- [ ] **Parameterized queries** (no SQL injection)
- [ ] **TLS** for DB connections (`ssl: { rejectUnauthorized: true }`)
- [ ] **Environment variables** for credentials (never hardcode)
- [ ] **Rate limiting** on auth endpoints
- [ ] **HTTPS only** for all API traffic
- [ ] **Input validation** on email/password
- [ ] **Password policy** (min length, entropy, breach check via HaveIBeenPwned)
- [ ] **Audit logging** for auth events (no passwords in logs)
- [ ] **Regular dependency updates** (`npm audit`, Dependabot)

---

## Dependencies
```bash
npm install argon2 @aws-sdk/client-dynamodb mysql2 dotenv
```

---

## Environment Variables
```bash
# MySQL
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# DynamoDB / AWS
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```
