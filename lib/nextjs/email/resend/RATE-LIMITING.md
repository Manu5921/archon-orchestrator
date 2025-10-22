# Rate Limiting for Resend Email API

## Overview

This module **intentionally does NOT include built-in rate limiting** because rate limiting strategies vary based on application requirements and infrastructure.

**Why?**
- Different rate limits per user type (free vs paid)
- Different limits per email type (transactional vs marketing)
- Infrastructure-specific (single server vs serverless)
- Storage-specific (in-memory vs Redis vs database)

**Responsibility**: Rate limiting must be implemented at the **application level** (middleware, server actions wrapper, or API route).

---

## Security Risk

**OWASP Threat**: Denial of Service (DoS) via email API abuse

**Impact without rate limiting:**
- Attacker could trigger thousands of password reset emails
- Exhaust Resend API quota
- Increase infrastructure costs
- Degrade service for legitimate users

**Severity**: **MAJOR** (not CRITICAL because Resend has its own API limits)

---

## Implementation Options

### Option 1: Upstash Rate Limit (Recommended for Vercel)

**Best for**: Serverless deployments (Vercel, Netlify)

```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const emailRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 emails per hour
  analytics: true,
});

// Server action wrapper
export async function sendEmailWithRateLimit(
  userId: string,
  params: SendEmailParams
) {
  const { success, limit, remaining, reset } = await emailRateLimit.limit(
    `email_${userId}`
  );

  if (!success) {
    throw new Error(
      `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s`
    );
  }

  return sendEmail(params);
}
```

**Pros:**
- Serverless-friendly (no persistent connections)
- Built-in analytics
- Sliding window algorithm
- Redis-backed (distributed)

**Cons:**
- Requires Upstash account (free tier: 10K requests/day)
- External dependency

**Pricing**: Free tier sufficient for most MVPs

---

### Option 2: Vercel KV (Vercel-specific)

**Best for**: Vercel deployments only

```bash
npm install @vercel/kv
```

```typescript
// lib/rate-limit.ts
import { kv } from '@vercel/kv';

export async function checkEmailRateLimit(
  userId: string,
  limit: number = 5,
  windowMs: number = 3600000 // 1 hour
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `email_rate_limit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get timestamps of recent emails
  const timestamps = (await kv.zrange(key, windowStart, now, {
    byScore: true,
  })) as number[];

  const count = timestamps.length;

  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Add current timestamp
  await kv.zadd(key, { score: now, member: now });

  // Set expiry
  await kv.expire(key, Math.ceil(windowMs / 1000));

  // Remove old timestamps
  await kv.zremrangebyscore(key, 0, windowStart);

  return { allowed: true, remaining: limit - count - 1 };
}
```

**Pros:**
- Native Vercel integration
- Simple API
- Built-in Redis

**Cons:**
- Vercel-only
- Paid feature (Hobby plan: $0.30/100K commands)

---

### Option 3: Database-based (PostgreSQL/MySQL)

**Best for**: Traditional server deployments

```typescript
// lib/rate-limit.ts
import { db } from '@/lib/database';

export async function checkEmailRateLimit(
  userId: string,
  limit: number = 5,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

  // Count recent emails
  const count = await db.emailLog.count({
    where: {
      userId,
      sentAt: { gte: windowStart },
    },
  });

  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Log current email
  await db.emailLog.create({
    data: {
      userId,
      sentAt: new Date(),
    },
  });

  return { allowed: true, remaining: limit - count - 1 };
}
```

**Schema:**
```sql
CREATE TABLE email_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  email_type VARCHAR(50),
  INDEX idx_user_sent (user_id, sent_at)
);

-- Cleanup old entries (cron job)
DELETE FROM email_log WHERE sent_at < NOW() - INTERVAL '7 days';
```

**Pros:**
- No external service
- Full control
- Works offline

**Cons:**
- Requires database
- Extra table + queries
- Manual cleanup needed

---

### Option 4: In-Memory (Development Only)

**Best for**: Local development, testing

```typescript
// lib/rate-limit.ts (DO NOT USE IN PRODUCTION)
const emailCounts = new Map<string, { count: number; resetAt: number }>();

export function checkEmailRateLimitMemory(
  userId: string,
  limit: number = 5,
  windowMs: number = 3600000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = emailCounts.get(userId);

  if (!entry || now > entry.resetAt) {
    emailCounts.set(userId, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  emailCounts.set(userId, entry);

  return { allowed: true, remaining: limit - entry.count };
}
```

**⚠️ WARNING**: Only use for development. Does NOT work in:
- Multi-instance deployments
- Serverless functions (ephemeral memory)
- Load-balanced servers

---

## Recommended Limits

| Email Type | Limit | Window | Rationale |
|------------|-------|--------|-----------|
| **Password Reset** | 3 | 1 hour | Prevent abuse, allow legitimate retries |
| **Email Verification** | 5 | 1 hour | More permissive (user-initiated) |
| **Welcome Email** | 1 | 24 hours | Should only trigger once |
| **Invoice Email** | 10 | 1 day | Batch processing allowed |
| **Marketing Email** | 1 | 1 week | Strict limits (CAN-SPAM compliance) |

---

## Integration Example

```typescript
// app/actions/auth.ts
'use server';

import { sendEmail } from '@/lib/email/client';
import { PasswordResetEmail } from '@/lib/email/templates/reset-password';
import { emailRateLimit } from '@/lib/rate-limit';

export async function sendPasswordResetEmail(userId: string, email: string) {
  // ✅ RATE LIMITING: Check before sending
  const { success, remaining } = await emailRateLimit.limit(
    `password_reset_${userId}`
  );

  if (!success) {
    return { error: 'Too many password reset attempts. Try again later.' };
  }

  const resetToken = await generateResetToken(userId);
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const result = await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    react: <PasswordResetEmail name={user.name} resetLink={resetLink} />,
  });

  if (!result.success) {
    return { error: 'Failed to send email' };
  }

  return { success: true, remaining };
}
```

---

## Monitoring & Alerts

### Upstash Analytics Dashboard

```typescript
// Get rate limit statistics
const analytics = await emailRateLimit.analytics({
  prefix: 'email_',
});

console.log('Rate limit stats:', analytics);
```

### Custom Logging

```typescript
// Log rate limit hits
if (!success) {
  console.warn('[RATE LIMIT] Email blocked', {
    userId,
    emailType: 'password_reset',
    remaining,
    resetAt: new Date(reset),
  });

  // Send alert if abuse detected
  if (remaining === 0) {
    await sendSlackAlert(`User ${userId} hit rate limit repeatedly`);
  }
}
```

---

## Testing Rate Limits

```typescript
// __tests__/rate-limit.test.ts
import { describe, it, expect } from 'vitest';
import { checkEmailRateLimit } from '@/lib/rate-limit';

describe('Email Rate Limiting', () => {
  it('should allow emails within limit', async () => {
    const userId = 'test_user_1';

    for (let i = 0; i < 5; i++) {
      const { allowed } = await checkEmailRateLimit(userId, 5, 3600000);
      expect(allowed).toBe(true);
    }
  });

  it('should block emails exceeding limit', async () => {
    const userId = 'test_user_2';

    // Send 5 emails (limit)
    for (let i = 0; i < 5; i++) {
      await checkEmailRateLimit(userId, 5, 3600000);
    }

    // 6th email should be blocked
    const { allowed, remaining } = await checkEmailRateLimit(userId, 5, 3600000);
    expect(allowed).toBe(false);
    expect(remaining).toBe(0);
  });

  it('should reset after window expires', async () => {
    const userId = 'test_user_3';
    const windowMs = 1000; // 1 second for test

    // Fill limit
    for (let i = 0; i < 5; i++) {
      await checkEmailRateLimit(userId, 5, windowMs);
    }

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Should allow again
    const { allowed } = await checkEmailRateLimit(userId, 5, windowMs);
    expect(allowed).toBe(true);
  });
});
```

---

## Resend API Limits (Fallback)

Resend has built-in API limits per account:

- **Free tier**: 100 emails/day, 3,000 emails/month
- **Paid tiers**: Higher limits

If application rate limiting is not implemented, Resend will return HTTP 429 (Too Many Requests).

**Recommendation**: Implement application-level rate limiting BEFORE hitting Resend limits to provide better UX (custom error messages, retry timing).

---

## Summary

✅ **Recommended Solution for MVPs**: Upstash Rate Limit

- 5-10 lines of code
- Serverless-friendly
- Free tier sufficient
- Production-ready

🔴 **DO NOT ship to production without rate limiting** - Security risk + cost risk.

---

**See also:**
- [OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [Upstash Rate Limit Docs](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)
- [Vercel KV Rate Limiting Guide](https://vercel.com/guides/vercel-kv-rate-limiting)
