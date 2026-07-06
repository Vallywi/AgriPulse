# 🌱 AgriPulse Marketplace

> **"The Heartbeat of Smarter Farming."**
>
> From Farm to Market, Fair Prices for Every Farmer.

A mobile-first agricultural marketplace connecting Filipino farmers directly with consumers, restaurants, and grocery stores — eliminating middlemen and ensuring fair prices.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn UI, Zustand
- **Backend**: Next.js Server Actions + Route Handlers, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (OTP, OAuth)
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Deployment**: Vercel + Supabase

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
# Fill in your Supabase credentials

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed categories
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Register
│   ├── (buyer)/            # Marketplace, Cart, Orders, Profile
│   ├── (farmer)/           # Farmer Dashboard
│   ├── (admin)/            # Admin Panel
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── layout/             # Layout components (BottomNav)
│   └── product-card.tsx    # Product display card
├── lib/
│   ├── supabase/           # Supabase clients (client, server, middleware)
│   ├── db.ts               # Prisma client
│   └── utils.ts            # Utility functions
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── styles/                 # Global CSS
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

### Vercel
```bash
vercel --prod
```

### Supabase
Migrations auto-deploy via GitHub Actions when files change in `prisma/`.

## Documentation

All specs live in `/docs`:
- `PRD.md` — Product requirements
- `DATABASE.md` — Schema design
- `API_SPEC.md` — API endpoints
- `DESIGN_SYSTEM.md` — Colors, components
- `DEPLOYMENT.md` — Infrastructure

## License

Private — All rights reserved.
