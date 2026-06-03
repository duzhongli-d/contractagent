# LegalEdge AI

AI-powered contract analysis SaaS. Upload PDF contracts and get instant legal insights, risks, and recommendations powered by OpenAI's Assistants API.

## Features

- **AI Contract Analysis** - Upload contracts and receive detailed analysis with identified risks and recommendations
- **Multi-language Support** - Available in English, Chinese, and Norwegian
- **Token-based Pricing** - Pay only for what you use (1 CNY per token)
- **Secure Authentication** - Powered by Clerk
- **Alipay Integration** - Purchase tokens securely

## Tech Stack

- **Framework**: Next.js 16 with App Router and TypeScript
- **AI**: OpenAI Assistants API
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Clerk
- **Payments**: Alipay
- **Analytics**: PostHog
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Visit http://localhost:3000 after starting the dev server.

## Environment Variables

Copy `.example.env` to `.env.local` and configure:

```bash
# OpenAI
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
OPENAI_PREMIUM_ASSISTANT_ID=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# PostgreSQL (used by Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/contractagent

# Alipay
ALIPAY_APP_ID=
ALIPAY_PRIVATE_KEY=
ALIPAY_ALIPAY_PUBLIC_KEY=
```

## Project Structure

```
app/                    # Next.js App Router
├── actions/           # Server Actions
├── api/               # API Routes
├── (locale)/          # i18n routes
config/               # App constants
components/           # React components
context/              # React context providers
lib/                  # Utilities and i18n
locales/              # Translation files
utils/                # Helper functions
```

## License

Private - All rights reserved