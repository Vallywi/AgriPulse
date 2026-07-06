# 🌱 AgriPulse Marketplace

> **"The Heartbeat of Smarter Farming."**

AgriPulse is a mobile-first agricultural marketplace connecting Filipino farmers directly with consumers, restaurants, and grocery stores — eliminating middlemen and ensuring fair prices.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **State**: Zustand
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth (OTP + OAuth)
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **ORM**: Prisma
- **Deployment**: Vercel + Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# Clone and install
git clone <repo-url>
cd AgriPulse
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Push database schema
npx prisma db push

# Seed categories
npm run db:seed

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # Login, Register
│   ├── (buyer)/         # Marketplace, Cart, Orders, Profile
│   ├── (farmer)/        # Dashboard, Products, Analytics
│   ├── (admin)/         # Admin panel
│   └── api/             # API routes
├── components/          # Reusable UI components
├── lib/                 # Supabase clients, Prisma, utilities
├── store/               # Zustand stores
├── types/               # TypeScript types
└── styles/              # Global CSS
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed categories |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

### Vercel

1. Connect repo to Vercel
2. Set environment variables
3. Deploy (automatic on push to `main`)

### Supabase

- Database auto-managed
- Enable RLS policies in dashboard
- Configure Auth providers (Phone, Google, Facebook)

## License

MIT — Built with ❤️ for Filipino farmers.
