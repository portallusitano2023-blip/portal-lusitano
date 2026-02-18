# SECURITY AUDIT REPORT - Portal Lusitano

**Date:** 2026-02-18
**Auditor:** Security Engineer Agent (Claude Opus 4.6)
**Overall Risk:** HIGH

---

## 🚨 CRITICAL ISSUES (1)

### ✅ CRITICAL-01: Production Secrets in .env.local

**Status:** ✅ VERIFIED SAFE - File NOT in git history
**Action:** Keep .env.local in .gitignore (already present)

---

## ⚠️ HIGH PRIORITY ISSUES (5)

### HIGH-01: In-Memory Rate Limiting Ineffective in Serverless

**File:** `middleware.ts:27-61`
**Impact:** Attackers can bypass rate limits by triggering new serverless instances
**Fix:** Migrate to Upstash Redis (serverless-safe)

```typescript
npm install @upstash/ratelimit @upstash/redis

// lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const authLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  analytics: true,
});

export const apiLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
});
```

**Timeline:** 1 week

---

### HIGH-02: XSS in Admin Chat

**File:** `components/admin-app/ChatContent.tsx:154-159`
**Impact:** Admin session hijacking via malicious messages
**Fix:** Use DOMPurify or avoid dangerouslySetInnerHTML

```typescript
npm install dompurify @types/dompurify

import DOMPurify from 'dompurify';

const highlightMentions = (text: string) => {
  const escaped = escapeHtml(text);
  const highlighted = escaped.replace(
    /@(\S+@\S+\.\S+)/g,
    '<span class="mention">@$1</span>'
  );
  return DOMPurify.sanitize(highlighted, {
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class']
  });
};
```

**Timeline:** 48 hours

---

### HIGH-03: No JWT Revocation Mechanism

**File:** `lib/auth.ts:32-46`
**Impact:** Stolen tokens valid for 7 days, can't force logout
**Fix:** Implement Redis session store with JTI tracking

```typescript
npm install @upstash/redis

export async function createSession(email: string) {
  const jti = crypto.randomUUID();

  const token = await new SignJWT({ email, jti })
    .setExpirationTime("7d")
    .sign(getSecret());

  await redis.setex(`session:${jti}`, 604800, email);
  return token;
}

export async function verifySession() {
  const { jti } = verified.payload;
  const session = await redis.get(`session:${jti}`);
  if (!session) return null; // Revoked
  return email;
}
```

**Timeline:** 2 weeks

---

### HIGH-04: Supabase Service Role Key Used in Public Code

**File:** `lib/supabase.ts:16,22`
**Risk:** Admin key could leak into client bundles
**Fix:** Use server-only package for admin client

```typescript
// lib/supabase-admin.ts
import 'server-only'; // Throws error if imported client-side
export const supabaseAdmin = createClient(...);

// lib/supabase.ts (client-safe)
export const supabase = supabasePublic;
export default supabasePublic;
```

**Timeline:** 1 week (audit all imports)

---

### HIGH-05: Missing Stripe Webhook Failure Alerting

**File:** `app/api/stripe/webhook/route.ts:22-28`
**Risk:** Replay attacks undetected
**Fix:** Alert on repeated signature failures

```typescript
const FAILURE_THRESHOLD = 5;

const key = `webhook:failures:${ip}`;
const failures = await redis.incr(key);
await redis.expire(key, 3600);

if (failures >= FAILURE_THRESHOLD) {
  await resend.emails.send({
    to: SECURITY_ALERT_EMAIL,
    subject: "SECURITY: Stripe Webhook Attack",
    html: `Repeated failures from IP: ${ip}`,
  });
}
```

**Timeline:** 1 week

---

## 📋 MEDIUM PRIORITY ISSUES (8)

1. **CSP 'unsafe-inline'** - Implement nonce-based CSP (next sprint)
2. **Email HTML Injection** - Enhance escapeHtml with Unicode normalization (2 weeks)
3. **File Upload MIME Validation** - Check magic bytes, not just Content-Type (3 weeks)
4. **Missing Input Validation** - Add Zod schemas to all admin routes (next sprint)
5. **Session Cookie Security** - Use `__Host-` prefix, sameSite: strict (next release)
6. **Hardcoded Admin Credentials** - Migrate to database with bcrypt (Q2)
7. **CORS Origin Validation** - Implement allowlist check (next sprint)
8. **No Request Size Limits** - Configure 1MB limit globally (next release)

---

## 🔵 LOW PRIORITY ISSUES (7)

1. Environment variable validation at startup
2. Sensitive data in error messages
3. Missing security headers (Expect-CT, NEL)
4. No SRI for external scripts
5. Client-side env variables (expected, verify RLS)
6. No automated dependency scanning
7. Missing rate limiting on file uploads

---

## ✅ POSITIVE FINDINGS

Well-implemented security practices:

- ✅ Timing-safe credential comparison
- ✅ JWT signature verification
- ✅ Stripe webhook signature verification
- ✅ HttpOnly cookies for sessions
- ✅ Input sanitization in search
- ✅ File upload size limits (50MB)
- ✅ File type allowlist
- ✅ HTTPS enforcement (HSTS)
- ✅ X-Frame-Options (clickjacking protection)

---

## 🎯 REMEDIATION ROADMAP

### Immediate (24-48 hours)

- [x] Verify .env.local not in git (DONE)
- [ ] Fix XSS in ChatContent.tsx (DOMPurify)

### Week 1-2

- [ ] Upstash Redis rate limiting
- [ ] JWT revocation with Redis
- [ ] Stripe webhook failure alerts
- [ ] Audit supabaseAdmin usage

### Sprint 1 (1 month)

- [ ] Nonce-based CSP
- [ ] Zod validation on admin routes
- [ ] Enhanced HTML sanitization
- [ ] CORS origin allowlist

### Q2 2026

- [ ] Database-backed admin auth (bcrypt)
- [ ] GDPR data export/deletion
- [ ] Automated security scanning (CI/CD)
- [ ] Penetration testing

---

## 📊 SUMMARY STATISTICS

- **Total Issues:** 21
- **Critical:** 1 (mitigated - .env not in git)
- **High:** 5 (require action within 1-2 weeks)
- **Medium:** 8 (next sprint/release)
- **Low:** 7 (ongoing improvements)

**Current Security Posture:** GOOD with improvement areas identified
**Recommended Action:** Prioritize HIGH issues within 2 weeks

---

Full detailed report: See agent transcript at `tasks/a76939e.output`
