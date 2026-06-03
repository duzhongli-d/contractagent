# System Overview - Technical Architecture Diagram

> LegalEdge AI Contract Analysis SaaS Platform

## Overview

This document provides a high-level system architecture diagram for LegalEdge AI, visualizing the complete system components, data flow, and external integrations.

**System Purpose:** AI-powered contract analysis platform using OpenAI's Assistants API with token-based payment system.

**Technology Stack:**
- **Frontend:** Next.js 16 with TypeScript, App Router, Turbopack
- **Backend:** Next.js Server Actions & API Routes
- **Authentication:** Clerk (clerkMiddleware)
- **Database:** PostgreSQL with Prisma ORM (user_queries table)
- **AI Processing:** OpenAI Assistants API (Threads & Runs)
- **Payments:** Stripe Checkout
- **Analytics:** PostHog
- **Email:** Resend
- **E2E Testing:** Playwright (Page Object Model pattern)

---

## System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Frontend - Next.js 16"]
        Browser["Browser (Client)"]
        LocaleRouter["Locale Router<br/>/[locale]/"]
        ProtectedRoutes["Protected Routes<br/>/liveAnalyser<br/>/buytokens"]
        PublicRoutes["Public Routes<br/>/ (Homepage)<br/>/contact"]
    end

    subgraph NextJS["Next.js Application Layer"]
        Middleware["Clerk Middleware<br/>(proxy.ts)"]
        ServerActions["Server Actions<br/>analyzeContractsTXT.ts<br/>stripe.ts"]
        APIRoutes["API Routes<br/>/api/webhooks/stripe<br/>/api/usersignup<br/>/api/tokens"]
        Components["Components<br/>ContractUploader<br/>MarkdownRenderer"]
        Context["Context Providers<br/>TokenContext"]
    end

    subgraph ExternalServices["External Services"]
        OpenAI["OpenAI API<br/>Assistants + Threads"]
        Stripe["Stripe<br/>Checkout & Webhooks"]
        Clerk["Clerk<br/>Authentication"]
        PostgreSQL_DB["PostgreSQL Database<br/>Prisma ORM"]
        PostHog["PostHog<br/>Analytics"]
        Resend["Resend<br/>Email"]
    end

    subgraph DataLayer["Data Layer"]
        PDFs["PDF Storage<br/>(/tmp - temp)"]
        DB["PostgreSQL DB<br/>user_queries"]
    end

    subgraph TestingLayer["Testing Layer"]
        Playwright["Playwright Test Runner"]
        POM["Page Objects<br/>HomePage, LiveAnalyserPage<br/>BuytokensPage, AuthPage<br/>ContactPage"]
        Specs["Test Specs<br/>auth, navigation<br/>contract-analysis<br/>token-purchase, contact"]
        CI_CD["GitHub Actions<br/>e2e.yml workflow"]
    end

    Browser --> LocaleRouter
    LocaleRouter --> Middleware

    Middleware -->|Authenticated| ProtectedRoutes
    Middleware -->|Public| PublicRoutes

    ProtectedRoutes --> Components
    PublicRoutes --> Components

    Components --> ServerActions
    Components --> Context

    ServerActions -->|1. Validate & Extract| PDFs
    ServerActions -->|2. AI Analysis| OpenAI
    ServerActions -->|3. Update Quota| PostgreSQL
    ServerActions -->|4. Payment| Stripe

    APIRoutes -->|Webhook Handler| Stripe
    APIRoutes -->|Token Sync| PostgreSQL
    APIRoutes -->|User Signup| Clerk

    ServerActions -->|Analytics| PostHog
    ServerActions -->|Email| Resend

    PostgreSQL --> DB

    Browser -.->|"E2E Tests"| Playwright
    Playwright -->|"Page Objects"| Components
    Specs -->|"Test assertions"| Components
    Playwright -->|"CI Pipeline"| CI_CD
```

---

## Component Description

### Frontend Components

| Component | Purpose |
|-----------|---------|
| **Browser** | End-user web browser |
| **Locale Router** | i18n routing handler (/en, /zh, /nb) |
| **Clerk Middleware** | Authentication & route protection |
| **ContractUploader** | PDF file upload with validation |
| **MarkdownRenderer** | AI response display |
| **TokenContext** | Client-side token quota state |

### Backend Services (Server Actions)

| Action | File | Purpose |
|--------|------|---------|
| **analyzeTXTContract** | analyzeContractsTXT.ts | PDF text extraction + OpenAI analysis |
| **createCheckoutSession** | stripe.ts | Stripe checkout session creation |
| **createPaymentIntent** | stripe.ts | Stripe payment intent |

### API Routes

| Route | File | Purpose |
|-------|------|---------|
| **POST /api/webhooks/stripe** | route.ts | Stripe payment confirmation |
| **POST /api/usersignup** | route.ts | Clerk user signup handler |
| **GET /api/tokens** | route.ts | User token quota retrieval |

### External Integrations

| Service | Integration Point | Data Flow |
|---------|-------------------|-----------|
| **OpenAI** | Server Action | Thread creation, Run polling, Message retrieval |
| **Stripe** | Server Action + API Route | Checkout sessions, Webhooks |
| **Clerk** | Middleware + API Route | Auth, User signup events |
| **PostgreSQL (Prisma)** | Server Action + API Route | User quota, Document tracking |
| **PostHog** | Server Action | Analytics events (Document Analyzed, purchase) |
| **Resend** | API Route | Email notifications |

### E2E Testing

| Component | Purpose |
|-----------|---------|
| **playwright.config.ts** | Playwright test configuration (browsers, reporters, CI) |
| **tests/setup.ts** | Global test setup and fixtures |
| **tests/e2e/pages/*.ts** | Page Object Model classes (HomePage, LiveAnalyserPage, BuytokensPage, AuthPage, ContactPage) |
| **tests/e2e/*.spec.ts** | Test specifications (auth, navigation, contract-analysis, token-purchase, contact) |
| **.github/workflows/e2e.yml** | GitHub Actions CI workflow for automated testing |

---

## Environment Configuration

```mermaid
graph LR
    subgraph Environment["Environment Variables"]
        OpenAIEnv["OPENAI_API_KEY<br/>OPENAI_ASSISTANT_ID<br/>OPENAI_PREMIUM_ASSISTANT_ID"]
        ClerkEnv["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY<br/>CLERK_SECRET_KEY"]
        PostgreSQLEnv["DATABASE_URL<br/>(Prisma connection)"]
        StripeEnv["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY<br/>STRIPE_SECRET_KEY<br/>STRIPE_WEBHOOK_SECRET"]
        PostHogEnv["NEXT_PUBLIC_POSTHOG_KEY<br/>NEXT_PUBLIC_POSTHOG_HOST"]
        ResendEnv["RESEND_API_KEY"]
    end
```

---

## Route Protection Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Clerk
    participant NextJS

    User->>Browser: Navigate to /liveAnalyser
    Browser->>NextJS: Request page
    NextJS->>Clerk: Validate session
    Clerk->>NextJS: No userId
    NextJS->>Browser: Redirect to sign-in
    Browser->>Clerk: Sign-in page
    User->>Clerk: Authenticate
    Clerk->>Browser: Redirect to /liveAnalyser
    Browser->>NextJS: Request page with session
    NextJS->>Clerk: Validate session
    Clerk->>NextJS: Valid userId
    NextJS->>Browser: Render protected page
```

---

## File Structure Reference

```
contractagent/
├── app/
│   ├── actions/
│   │   ├── analyzeContractsTXT.ts    # Contract analysis server action
│   │   └── stripe.ts                 # Stripe checkout server action
│   ├── api/
│   │   ├── webhooks/stripe/route.ts # Stripe webhook handler
│   │   ├── usersignup/route.ts      # Clerk user signup handler
│   │   └── tokens/route.ts           # Token quota API
│   └── [locale]/
│       ├── page.tsx                 # Homepage
│       ├── liveAnalyser/            # Protected analysis page
│       ├── buytokens/               # Token purchase page
│       └── contact/                 # Contact page
├── components/
│   └── ContractUploader.tsx         # Main upload component
├── config/
│   └── index.ts                     # Constants (TOKENS_PER_QUERY, pricing)
├── context/
│   └── TokenContext.tsx             # Client-side token state
├── proxy.ts                         # Clerk middleware
├── lib/
│   ├── stripe.ts                    # Stripe client initialization
│   └── i18n/                        # Internationalization
├── tests/                           # E2E Testing
│   ├── setup.ts                     # Global test setup
│   └── e2e/
│       ├── pages/                   # Page Object Models
│       │   ├── HomePage.ts
│       │   ├── LiveAnalyserPage.ts
│       │   ├── BuytokensPage.ts
│       │   ├── AuthPage.ts
│       │   └── ContactPage.ts
│       └── *.spec.ts                # Test specifications
├── playwright.config.ts            # Playwright configuration
└── docs/
    └── architecture/
        └── SYSTEM_OVERVIEW.md       # This document
```

---

*Document generated for LegalEdge AI technical architecture*