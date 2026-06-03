# Social Login Design Document

## Date: 2026-06-04

## Goal

Implement social login (WeChat, Alipay, Google) + email OTP for LegalEdge AI contract analysis platform.

---

## Overview

Replace Clerk authentication with NextAuth.js, supporting:
- WeChat OAuth (sandbox in dev, real OAuth when enterprise account available)
- Alipay OAuth (sandbox in dev, real OAuth when enterprise account available)
- Google OAuth (real, active now)
- Email OTP (magic link or code verification)

---

## Authentication Providers

| Provider | Status | Notes |
|----------|--------|-------|
| WeChat | Sandbox → Production | Requires enterprise account + 微信开放平台 |
| Alipay | Sandbox → Production | Requires enterprise account + 支付宝开放平台 |
| Google | ✅ Active | Real OAuth, works now |
| Email OTP | ✅ Active | NextAuth email provider |

---

## Architecture

### Replace Clerk with NextAuth.js

**Current (Clerk):**
- `proxy.ts` — Clerk middleware for route protection
- `middleware.ts` — Clerk auth
- `HeaderClient.tsx` — Clerk components (`SignInButton`, `SignUpButton`, `UserButton`)

**New (NextAuth):**
- `middleware.ts` — NextAuth middleware for route protection
- `auth.ts` — NextAuth configuration
- `HeaderClient.tsx` — NextAuth `useSession` + custom buttons

### Providers Configuration

```typescript
// auth.ts
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  // Sandbox WeChat (dev only)
  // Real WeChat OAuth (production, when enterprise ready)
  // Sandbox Alipay (dev only)
  // Real Alipay OAuth (production, when enterprise ready)
  EmailProvider({ /* OTP config */ }),
]
```

### User Data Model

```prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String?   @unique
  wechatId      String?   @unique
  alipayId      String?   @unique
  googleId      String?   @unique
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  queries       UserQuery[]
}
```

---

## Migration Strategy

1. **Remove Clerk** — Uninstall `@clerk/nextjs`, remove `proxy.ts`
2. **Install NextAuth** — `npm install next-auth@beta @auth/prisma-adapter`
3. **Update Prisma schema** — Replace `clerkUserId` with new user fields
4. **Reset database** — Clear existing data (dev environment)
5. **Implement providers** — Google (real), WeChat/Alipay (sandbox)
6. **Update components** — Replace Clerk components with NextAuth equivalents
7. **Update middleware** — Protect routes with NextAuth session check

---

## Route Changes

| Route | Protection | Auth Method |
|-------|------------|-------------|
| `/[locale]/liveAnalyser` | ✅ Required | NextAuth session |
| `/[locale]/buytokens` | ✅ Required | NextAuth session |
| `/[locale]/signin` | Public | Any provider |
| `/[locale]/error` | Public | Query param |

---

## Sandbox Behavior (Development)

| Provider | Sandbox | Production |
|----------|---------|------------|
| WeChat | Mock user `{ id: "wechat_sandbox", name: "WeChat Dev" }` | Real OAuth |
| Alipay | Mock user `{ id: "alipay_sandbox", name: "Alipay Dev" }` | Real OAuth |
| Google | Always real | Real OAuth |
| Email | Real dev SMTP | Real SMTP |

**Sandbox toggle:** `AUTH_SANDBOX=true` env variable

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| OAuth callback error | Redirect to `/error?error=OAuthError` |
| Email not verified | Show "check your email" message |
| Session expired | Redirect to sign-in |
| Sandbox mode active | Show yellow warning banner |

---

## Testing

1. **Unit tests** — Auth configuration, provider callbacks
2. **E2E tests** — Sign-in flow for each provider
3. **Integration tests** — Database user creation/lookup

---

## Next Steps

1. Create implementation plan via `writing-plans` skill
2. Execute plan
3. Verify sign-in pages work
4. Run E2E tests