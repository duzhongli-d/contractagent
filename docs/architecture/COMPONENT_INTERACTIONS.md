# Component Interactions - System Integration Diagrams

> LegalEdge AI Contract Analysis SaaS Platform

## Overview

This document shows how components connect to each other and to external services using C4-style component diagrams.

---

## Frontend to Backend Connections

```mermaid
graph LR
    subgraph Browser["Browser / Client"]
        SPA["Next.js SPA<br/>(React Components)"]
        Auth["Clerk Auth<br/>(useAuth, useUser)"]
        State["TokenContext<br/>(useToken)"]
    end

    subgraph ServerActions["Server Actions Layer"]
        Analyze["analyzeTXTContract()<br/>analyzeContractsTXT.ts"]
        StripeAction["createCheckoutSession()<br/>stripe.ts"]
        StripeIntent["createPaymentIntent()<br/>stripe.ts"]
    end

    subgraph APIRoutes["API Routes Layer"]
        StripeWebhook["POST /api/webhooks/stripe<br/>route.ts"]
        UserSignup["POST /api/usersignup<br/>route.ts"]
        TokenAPI["GET /api/tokens<br/>route.ts"]
    end

    subgraph External["External Services"]
        OpenAI_API["OpenAI API"]
        Stripe_API["Stripe API"]
        Clerk_API["Clerk Auth API"]
        Appwrite_DB["Appwrite Database"]
        PostHog_AN["PostHog Analytics"]
        Resend_Mail["Resend Email"]
    end

    SPA -->|"formData"| Analyze
    SPA -->|"FormData"| StripeAction
    SPA -->|"FormData"| StripeIntent

    Auth -->|"userId"| Analyze
    Auth -->|"userId"| StripeAction

    State -->|"quota update"| SPA

    Analyze -->|"thread.run|message"| OpenAI_API
    Analyze -->|"update quota"| Appwrite_DB
    Analyze -->|"event", "event"| PostHog_AN

    StripeAction -->|"checkout.session"| Stripe_API
    StripeAction -->|"event"| PostHog_AN

    StripeWebhook -->|"webhook verification"| Stripe_API
    StripeWebhook -->|"read session"| Stripe_API
    StripeWebhook -->|"update quota"| Appwrite_DB
    StripeWebhook -->|"purchase event"| PostHog_AN

    TokenAPI -->|"query quota"| Appwrite_DB

    UserSignup -->|"webhook"| Clerk_API
    UserSignup -->|"create document"| Appwrite_DB
```

### Server Action Details

| Action | File | External Calls | Return Type |
|--------|------|----------------|-------------|
| `analyzeTXTContract(formData)` | `analyzeContractsTXT.ts` | OpenAI threads, Appwrite update | `{ data: Message, error: string \| null }` |
| `createCheckoutSession(formData)` | `stripe.ts` | Stripe checkout.sessions.create | `{ client_secret: string \| null, url: string \| null }` |
| `createPaymentIntent(formData)` | `stripe.ts` | Stripe paymentIntents.create | `{ client_secret: string }` |

---

## External Service Integrations

```mermaid
graph TB
    subgraph NextJSApp["Next.js Application"]
        subgraph Actions["Server Actions"]
            SA1["analyzeContractsTXT.ts"]
            SA2["stripe.ts"]
        end
        subgraph APIs["API Routes"]
            AR1["webhooks/stripe"]
            AR2["usersignup"]
            AR3["tokens"]
        end
    end

    subgraph OpenAI_Integration["OpenAI Integration"]
        OA["OpenAI API<br/>Assistants v2"]
        OT["Threads"]
        OR["Runs"]
        OM["Messages"]
    end

    subgraph Stripe_Integration["Stripe Integration"]
        SC["Checkout Sessions"]
        PI["Payment Intents"]
        WH["Webhooks"]
    end

    subgraph Clerk_Integration["Clerk Authentication"]
        CM["clerkMiddleware"]
        AU["auth()"]
        CU["currentUser()"]
    end

    subgraph Appwrite_Integration["Appwrite Database"]
        DB["user_queries<br/>collection"]
        AD["createAdminClient()"]
        QU["Query API"]
    end

    subgraph Observability["Observability"]
        PH["PostHog Client"]
        RE["Resend"]
    end

    SA1 -->|"create thread|run|message"| OA
    OA --> OT --> OR --> OM

    SA2 -->|"checkout.sessions.create"| SC
    SA2 -->|"paymentIntents.create"| PI

    AR1 -->|"verify|retrieve"| WH
    WH --> SC

    AR2 -->|"user.created webhook"| CM

    SA1 -->|"updateDocument"| DB
    AR1 -->|"listDocuments|updateDocument"| DB
    AR3 -->|"listDocuments"| DB

    SA1 -->|"capture()"| PH
    SA2 -->|"capture()"| PH

    AD -->|"admin SDK"| DB
    QU -->|"filter|equal"| DB

    RE -.->|"email notifications"| AR2
```

### Integration Authentication Methods

| Service | Authentication Method | Environment Variable |
|---------|---------------------|---------------------|
| **OpenAI** | API Key | `OPENAI_API_KEY` |
| **OpenAI Assistant** | Assistant ID | `OPENAI_ASSISTANT_ID`, `OPENAI_PREMIUM_ASSISTANT_ID` |
| **Stripe** | API Key + Webhook Secret | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Clerk** | Publishable Key + Secret | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| **Appwrite** | Endpoint + Project ID + Secret | `NEXT_PUBLIC_APPWRITE_*`, `APPWRITE_SECRET_KEY` |
| **PostHog** | Project API Key | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| **Resend** | API Key | `RESEND_API_KEY` |

---

## Data Model Relationships

```mermaid
erDiagram
    USER ||--o| USER_QUERIES : "has"
    USER_QUERIES {
        string clerk_user_id PK
        int document_quota_left
        int documents_analysed
    }

    USER_QUERIES ||--o{ PURCHASE : "generates"
    PURCHASE {
        string checkout_session_id
        string user_id
        int token_amount
        float total_amount_nok
        timestamp created_at
    }

    USER ||--o{ DOCUMENT : "uploads"
    DOCUMENT {
        string session_id
        string user_id
        string filename
        string analysis_result
        timestamp uploaded_at
    }
```

---

## Request-Response Flow for Contract Analysis

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant Clerk
    participant OpenAI
    participant Appwrite

    User->>Browser: Select PDF file
    Browser->>NextJS: POST analyzeTXTContract(FormData)
    NextJS->>Clerk: auth().userId
    Clerk-->>NextJS: userId

    NextJS->>Appwrite: listDocuments(query: clerk_user_id)
    Appwrite-->>NextJS: userQuota

    alt quota > 0
        NextJS->>Browser: Accept file
        Browser->>NextJS: Send file content

        NextJS->>NextJS: Save to /tmp
        NextJS->>NextJS: pdf-parse extractText

        NextJS->>OpenAI: threads.create()
        OpenAI-->>NextJS: thread

        NextJS->>OpenAI: runs.create(threadId, assistantId)
        OpenAI-->>NextJS: run

        loop Poll until completed (max 30 retries)
            NextJS->>OpenAI: runs.retrieve()
            OpenAI-->>NextJS: runStatus
        end

        NextJS->>OpenAI: messages.list(threadId)
        OpenAI-->>NextJS: messages

        NextJS->>Appwrite: updateDocument(quota - 1)
        Appwrite-->>NextJS: updated

        NextJS->>Browser: Return { data: response }
    else quota = 0
        NextJS->>Browser: Return { error: "no tokens" }
        Browser->>User: Redirect to /buytokens
    end
```

---

## Token Purchase Sequence

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant Stripe
    participant Clerk
    participant Appwrite

    User->>Browser: Click Purchase
    Browser->>NextJS: createCheckoutSession(formData)
    NextJS->>Clerk: auth().userId
    Clerk-->>NextJS: userId

    NextJS->>Stripe: checkout.sessions.create({
        line_items, client_reference_id: userId
    })
    Stripe-->>NextJS: session { id, url }

    NextJS-->>Browser: { url }

    Browser->>Stripe: Redirect to session.url
    User->>Stripe: Complete payment
    Stripe->>Browser: Redirect to /buytokens/success

    Note over Browser,Stripe: Meanwhile, webhook fires
    Stripe->>NextJS: POST /api/webhooks/stripe
    NextJS->>Stripe: Verify signature
    NextJS->>Stripe: Retrieve session
    Stripe-->>NextJS: session details

    NextJS->>Appwrite: Find user by client_reference_id
    Appwrite-->>NextJS: userDoc

    NextJS->>Appwrite: Update document_quota_left += tokens
    Appwrite-->>NextJS: updatedDoc
```

---

## Component Dependencies

```mermaid
graph TD
    ContractUploader["ContractUploader.tsx<br/>User-facing upload UI"]
    MarkdownRenderer["MarkdownRenderer.tsx<br/>AI response display"]
    TokenContext["TokenContext.tsx<br/>Client state"]
    useLocale["useLocale.tsx<br/>i18n hook"]

    analyzeAction["analyzeContractsTXT.ts<br/>Server Action"]
    stripeAction["stripe.ts<br/>Server Action"]

    Proxy["proxy.ts<br/>Clerk Middleware"]
    StripeWebhook["webhooks/stripe/route.ts<br/>API Route"]

    ContractUploader --> TokenContext
    ContractUploader --> analyzeAction
    MarkdownRenderer --> TokenContext

    analyzeAction --> Proxy
    stripeAction --> Proxy

    Proxy --> Clerk_Ext["Clerk Auth"]
    analyzeAction --> OpenAI_Ext["OpenAI API"]
    analyzeAction --> Appwrite_Ext["Appwrite DB"]
    stripeAction --> Stripe_Ext["Stripe API"]
    StripeWebhook --> Stripe_Ext
    StripeWebhook --> Appwrite_Ext
```

### Dependency Summary

| Component | Dependencies |
|-----------|-------------|
| `ContractUploader.tsx` | `TokenContext.tsx`, `analyzeContractsTXT.ts` (server action) |
| `MarkdownRenderer.tsx` | `TokenContext.tsx` |
| `TokenContext.tsx` | Appwrite API (via `/api/tokens`) |
| `proxy.ts` (middleware) | Clerk API |
| `analyzeContractsTXT.ts` | Clerk (auth), Appwrite, OpenAI, PostHog |
| `stripe.ts` | Clerk (auth), Stripe, PostHog |
| `webhooks/stripe/route.ts` | Stripe (webhook verification), Appwrite, PostHog |

---

## Middleware Flow

```mermaid
flowchart TD
    A["Request to protected route"] --> B{"Clerk Middleware<br/>proxy.ts"}
    B -->|Clerk Auth| C{("userId exists?")}
    C -->|Yes| D["Allow request"]
    C -->|No| E{("Protected route?")}
    E -->|Yes| F["redirectToSignIn()"]
    E -->|No| D
    F --> G["Clerk Sign-In Page"]
    G --> H["User authenticates"]
    H -->|Success| I["Redirect to original route"]
    I --> D
```

---

*Document generated for LegalEdge AI technical architecture*