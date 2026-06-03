# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LegalEdge AI** is a Next.js 16 TypeScript SaaS application providing AI-powered contract analysis using OpenAI's Assistants API. Users upload PDF contracts, which are analyzed and presented with insights, risks, and recommendations. The app uses a token-based payment system (2 NOK per token) with Stripe integration.

## Common Development Commands

```bash
# Start development server (with Turbopack enabled)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Development Server

Run `npm run dev` and visit http://localhost:3000. The dev server uses Turbopack for faster hot reloads.

## High-Level Architecture

### Directory Structure

```
app/                    # Next.js App Router
├── actions/           # Server Actions (secure backend logic)
│   ├── analyzeContractsTXT.ts
│   ├── stripe.ts
│   ├── tokens.ts
│   └── resend.ts
├── api/               # API Routes
│   ├── webhooks/stripe/
│   ├── usersignup/
│   └── tokens/
├── (locale)/          # i18n route groups
│   └── [locale]/
│       ├── page.tsx           # Homepage
│       ├── liveAnalyser/      # Protected contract analysis page
│       ├── buytokens/         # Token purchase page
│       └── contact/
├── ContractUploader.tsx  # Main upload component
└── MarkdownRenderer.tsx  # Response display

components/            # UI Components
└── ui/                 # shadcn/ui component library
├── stripe/            # Stripe checkout components
└── email/             # Email templates (Resend)

config/
└── index.ts            # App constants (token costs, limits)

context/
└── TokenContext.tsx    # Client-side token quota state

appwrite/
└── config.ts           # Appwrite client setup

hooks/
└── useLocale.tsx       # Locale switching hook

lib/
├── utils.ts            # Shared utilities
├── stripe.ts           # Stripe initialization
└── i18n/              # i18n configuration and dictionary loader

locales/                # i18n translations
├── en.json
├── zh.json
└── nb.json

utils/
├── stripeHelpers.ts    # Stripe amount formatting
└── tokens.ts          # Token management utilities

docs/
└── architecture/       # Technical architecture diagrams (Mermaid)
    ├── README.md
    ├── SYSTEM_OVERVIEW.md
    ├── DATA_FLOW.md
    └── COMPONENT_INTERACTIONS.md
```

### Authentication Flow

Routes are protected using Clerk middleware (`middleware.ts`). Protected routes:
- `/[locale]/liveAnalyser` - Contract analysis demo
- `/[locale]/buytokens` - Token purchase

Unauthenticated users are redirected to Clerk's sign-in page.

### Contract Analysis Workflow

1. **Upload**: User uploads PDF via `ContractUploader.tsx` component
2. **Text Extraction**: Server action `analyzeContractsTXT.ts` extracts text using `pdf-parse`
3. **AI Processing**: OpenAI Assistants API analyzes the contract text (creates threads)
4. **Display**: Results rendered via `MarkdownRenderer.tsx`
5. **Token Deduction**: User's token quota decremented in Appwrite database

Key files:
- `app/actions/analyzeContractsTXT.ts` - Main analysis logic
- `components/ContractUploader.tsx` - Upload UI

### Payment & Token System

- **Token Cost**: 2 NOK per token (configurable in `config/index.ts`)
- **Standard Query**: 1 token
- **Premium Query**: 4 tokens
- **Starting Quota**: 2 tokens for new users
- **Payment Flow**: Stripe Checkout → Webhook (`/api/webhooks/stripe`) → Appwrite update

Key files:
- `app/actions/stripe.ts` - Stripe integration
- `app/api/webhooks/stripe/route.ts` - Payment webhook handler
- `config/index.ts` - Pricing constants

### Database Schema (Appwrite)

**Collection: `user_queries`**
- `clerk_user_id` (string) - Clerk user identifier
- `document_quota_left` (int) - Remaining tokens
- `documents_analysed` (int) - Total analyzed documents

### Analytics (PostHog)

Events tracked:
- `Document Analyzed` - When a contract is analyzed
- `purchase` - When tokens are purchased
- `checkout_session_created` - When Stripe checkout starts
- `contact_form_submitted` - When contact form is submitted

### Discount Tiers (for token purchases)

- 5% discount: 100+ tokens
- 10% discount: 500+ tokens
- 15% discount: 1000+ tokens

### Middleware

Clerk middleware for route protection (`proxy.ts`). Protected routes: `/liveAnalyser/*`, `/buytokens/*`

**Note:** Route protection is defined in `proxy.ts` (not the default `middleware.ts`).

### i18n Structure

Translations are managed in `locales/` with JSON files per language:
- `en.json` - English translations
- `zh.json` - Chinese translations
- `nb.json` - Norwegian translations

Routes use locale prefix: `/en`, `/zh`, or `/nb`. Default is `zh`.

### Architecture Documentation

Architecture diagrams are maintained in `docs/architecture/`:
- **[README.md](../../docs/architecture/README.md)** - Index with ASCII overview and links
- **[SYSTEM_OVERVIEW.md](../../docs/architecture/SYSTEM_OVERVIEW.md)** - High-level system architecture, Mermaid diagrams
- **[DATA_FLOW.md](../../docs/architecture/DATA_FLOW.md)** - Contract analysis pipeline, Stripe payment flow
- **[COMPONENT_INTERACTIONS.md](../../docs/architecture/COMPONENT_INTERACTIONS.md)** - C4-style component diagrams

## Key Configuration

### Environment Variables

Required in `.env.local`:
- **OpenAI**: `OPENAI_API_KEY`, `OPENAI_ASSISTANT_ID`, `OPENAI_PREMIUM_ASSISTANT_ID`
- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Appwrite**: `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID`, `NEXT_PUBLIC_APPWRITE_COLLECTION_ID`, `APPWRITE_SECRET_KEY`
- **Stripe**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **PostHog**: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- **Resend**: `RESEND_API_KEY`

### Constants (`config/index.ts`)

```typescript
TOKENS_PER_QUERY = 1
TOKENS_PER_PREMIUM_QUERY = 4
START_TOKENS = 2
NOKPERTOKEN = 2
```

### File Upload Limits

Configured in `next.config.ts`:
- Max file size: 5MB
- Supported format: PDF
- Temporary storage: `/tmp` (auto-deleted after processing)

## Server Actions vs API Routes

**Server Actions** (`app/actions/`):
- Contract analysis (`analyzeContractsTXT.ts`)
- Stripe integration (`stripe.ts`)

**API Routes** (`app/api/`):
- Webhooks (Stripe, Clerk user signup)
- Token retrieval (`/api/tokens`)

## API Reference

### Server Actions

- `analyzeTXTContract(formData)` - Analyze PDF contract
- `createCheckoutSession(data)` - Create Stripe checkout

### API Routes

- `GET /api/tokens` - Get user's token quota (authenticated)
- `POST /api/webhooks/stripe` - Handle Stripe payment webhooks
- `POST /api/usersignup` - Handle Clerk user signup webhooks
