# LegalEdge AI - Technical Architecture Documentation

> Comprehensive system documentation for the LegalEdge AI contract analysis SaaS platform

---

## 📁 Architecture Documents

| Document | Description |
|----------|-------------|
| **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** | High-level system architecture with Mermaid diagrams showing frontend, backend, external services, and route protection flow |
| **[DATA_FLOW.md](./DATA_FLOW.md)** | Contract analysis pipeline and Alipay payment flow with detailed step-by-step sequences |
| **[COMPONENT_INTERACTIONS.md](./COMPONENT_INTERACTIONS.md)** | C4-style component diagrams, external service integrations, and dependency relationships |

---

## 🏗️ Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐    │
│  │   Browser   │  │ Clerk Auth  │  │  React Components           │    │
│  │   (Next.js) │  │   Hooks     │  │  • ContractUploader         │    │
│  │             │  │             │  │  • MarkdownRenderer         │    │
│  │             │  │             │  │  • TokenContext              │    │
│  └──────┬──────┘  └──────┬──────┘  └──────────────┬──────────────┘    │
└─────────┼────────────────┼──────────────────────────┼──────────────────┘
          │                │                          │
          │                ▼                          ▼
┌─────────▼────────────────┼──────────────────────────┼──────────────────┐
│                    MIDDLEWARE LAYER                   │                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              clerkMiddleware (proxy.ts)                        │   │
│  │              • Route protection (/liveAnalyser, /buytokens)    │   │
│  │              • Session validation via Clerk                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  SERVER ACTIONS  │    │     API ROUTES      │    │    CONTEXT          │
│                 │    │                     │    │                     │
│ • analyzeTXT    │    │ • /api/webhooks/    │    │ • TokenContext      │
│   Contract      │    │   alipay           │    │   (client state)    │
│ • createAlipay  │    │ • /api/usersignup   │    │                     │
│   Order         │    │ • /api/tokens       │    │                     │
└────────┬────────┘    └──────────┬──────────┘    └─────────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌────────────────────────────────┴────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │ OpenAI  │  │ Alipay  │  │ Clerk   │  │PostgreSQL│  │ PostHog     │ │
│  │         │  │         │  │         │  │         │  │             │ │
│  │Assist.  │  │Checkout │  │ Auth    │  │ Database│  │ Analytics   │ │
│  │Threads  │  │ Webhooks│  │ Webhooks│  │ user_   │  │ Events      │ │
│  │Runs     │  │         │  │         │  │queries  │  │             │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────────┘ │
│                          ┌─────────┐                                     │
│                          │ Resend  │                                     │
│                          │ Email   │                                     │
│                          └─────────┘                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Key Data Flows

### Contract Analysis Flow
```
User Upload PDF → Validate → Save to /tmp → pdf-parse extract
    → Create OpenAI Thread → Create Run → Poll → Get Message
    → Update PostgreSQL Quota → Delete temp file → Return result
```

### Payment Flow
```
User clicks Purchase → Create Alipay Order → Redirect
    → User pays on Alipay → Webhook fires → Update PostgreSQL quota
    → User redirected to success page
```

---

## 📊 Key Configuration

| Constant | Value | Description |
|----------|-------|-------------|
| `TOKENS_PER_QUERY` | 1 | Tokens consumed per standard analysis |
| `TOKENS_PER_PREMIUM_QUERY` | 4 | Tokens consumed per premium analysis |
| `START_TOKENS` | 2 | Initial tokens for new users |
| `CNYPERTOKEN` | 1 | Price per token in Chinese Yuan |
| `CURRENCY` | `cny` | Alipay currency |
| `MIN_AMOUNT` | 10.0 | Minimum purchase amount |
| `MAX_AMOUNT` | 500.0 | Maximum purchase amount |

### Discount Tiers
| Tier | Threshold | Discount |
|------|-----------|----------|
| LOW_VOLUME | 100+ tokens | 5% |
| MEDIUM_VOLUME | 500+ tokens | 10% |
| HIGH_VOLUME | 1000+ tokens | 15% |

---

## 🛡️ Security Architecture

### Route Protection
- All routes under `/liveAnalyser/*` and `/buytokens/*` require authentication
- Clerk middleware (`proxy.ts`) intercepts all requests
- Unauthenticated users redirected to Clerk's sign-in page

### External Service Security
| Service | Security Method |
|---------|----------------|
| OpenAI | API Key via environment variable |
| Alipay | API Key + Webhook signature verification |
| Clerk | Publishable Key (client) + Secret Key (server) |
| PostgreSQL | Connection String | `DATABASE_URL` |

---

## 📁 File Structure

```
contractagent/
├── app/
│   ├── actions/                    # Server Actions
│   │   ├── analyzeContractsTXT.ts  # Contract analysis
│   │   └── alipay.ts               # Alipay checkout
│   ├── api/                        # API Routes
│   │   ├── webhooks/alipay/       # Alipay webhooks
│   │   ├── usersignup/            # Clerk user signup
│   │   └── tokens/                # Token quota API
│   └── [locale]/                  # i18n pages
│       ├── page.tsx               # Homepage
│       ├── liveAnalyser/          # Protected analysis
│       ├── buytokens/             # Token purchase
│       └── contact/               # Contact page
├── components/                    # React components
├── config/index.ts               # Configuration constants
├── context/TokenContext.tsx       # Token state management
├── proxy.ts                      # Clerk middleware
├── lib/alipay.ts                 # Alipay client
├── tests/                        # E2E Testing (Playwright)
│   ├── setup.ts                  # Global test setup
│   └── e2e/
│       ├── pages/                # Page Object Models
│       └── *.spec.ts             # Test specifications
├── playwright.config.ts          # Playwright configuration
├── docs/architecture/            # This documentation
│   ├── README.md                 # This file
│   ├── SYSTEM_OVERVIEW.md        # System overview
│   ├── DATA_FLOW.md              # Data flow diagrams
│   └── COMPONENT_INTERACTIONS.md # Component interactions
```

---

## 🔗 Quick Reference Links

### External Services Documentation
- [Clerk Authentication](https://clerk.com/docs)
- [Alipay Checkout](https://opendocs.alipay.com/apis)
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants)
- [PostgreSQL Database](https://www.postgresql.org/docs/)
- [Prisma ORM](https://www.prisma.io/docs)
- [PostHog Analytics](https://posthog.com/docs)
- [Resend Email](https://resend.com/docs)

### Key Files Reference
| File | Purpose |
|------|---------|
| `proxy.ts` | Clerk middleware for route protection |
| `app/actions/analyzeContractsTXT.ts` | Main contract analysis logic |
| `app/actions/alipay.ts` | Alipay checkout session creation |
| `app/api/webhooks/alipay/route.ts` | Alipay webhook handler |
| `config/index.ts` | Application constants |
| `context/TokenContext.tsx` | Client-side token state |

---

*Documentation generated for LegalEdge AI - Contract Analysis SaaS Platform*
*Last updated: 2026-06-03*