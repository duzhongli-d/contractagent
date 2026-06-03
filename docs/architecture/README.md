# LegalEdge AI - Technical Architecture Documentation

> Comprehensive system documentation for the LegalEdge AI contract analysis SaaS platform

---

## 📁 Architecture Documents

| Document | Description |
|----------|-------------|
| **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** | High-level system architecture with Mermaid diagrams showing frontend, backend, external services, and route protection flow |
| **[DATA_FLOW.md](./DATA_FLOW.md)** | Contract analysis pipeline and Stripe payment flow with detailed step-by-step sequences |
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
│   Contract      │    │   stripe            │    │   (client state)    │
│ • createCheckout│    │ • /api/usersignup   │    │                     │
│   Session       │    │ • /api/tokens       │    │                     │
│ • createPayment │    │                     │    │                     │
│   Intent        │    │                     │    │                     │
└────────┬────────┘    └──────────┬──────────┘    └─────────────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌────────────────────────────────┴────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │ OpenAI  │  │ Stripe  │  │ Clerk   │  │Appwrite │  │ PostHog     │ │
│  │         │  │         │  │         │  │         │  │             │ │
│  │Assist.  │  │Checkout │  │ Auth    │  │ Database│  │ Analytics   │ │
│  │Threads  │  │ Webhooks│  │ Webhooks│  │ user_   │  │ Events      │ │
│  │Runs     │  │         │  │         │  │ queries │  │             │ │
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
    → Update Appwrite Quota → Delete temp file → Return result
```

### Payment Flow
```
User clicks Purchase → Create Stripe Checkout Session → Redirect
    → User pays on Stripe → Webhook fires → Update Appwrite quota
    → User redirected to success page
```

---

## 📊 Key Configuration

| Constant | Value | Description |
|----------|-------|-------------|
| `TOKENS_PER_QUERY` | 1 | Tokens consumed per standard analysis |
| `TOKENS_PER_PREMIUM_QUERY` | 4 | Tokens consumed per premium analysis |
| `START_TOKENS` | 2 | Initial tokens for new users |
| `NOKPERTOKEN` | 2 | Price per token in Norwegian Kroner |
| `CURRENCY` | `nok` | Stripe currency |
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
| Stripe | API Key + Webhook signature verification |
| Clerk | Publishable Key (client) + Secret Key (server) |
| Appwrite | Project ID + Secret Key |

---

## 📁 File Structure

```
contractagent/
├── app/
│   ├── actions/                    # Server Actions
│   │   ├── analyzeContractsTXT.ts  # Contract analysis
│   │   └── stripe.ts               # Stripe checkout
│   ├── api/                        # API Routes
│   │   ├── webhooks/stripe/       # Stripe webhooks
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
├── lib/stripe.ts                 # Stripe client
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
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
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
| `app/actions/stripe.ts` | Stripe checkout session creation |
| `app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `config/index.ts` | Application constants |
| `context/TokenContext.tsx` | Client-side token state |

---

*Documentation generated for LegalEdge AI - Contract Analysis SaaS Platform*
*Last updated: 2026-06-03*