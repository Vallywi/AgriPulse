# AgriPulse Marketplace — Deployment & Infrastructure

## Deployable Components

| # | Component | Technology | Platform | URL |
|---|-----------|-----------|----------|-----|
| 1 | Frontend Mobile App | React Native + Expo | Expo EAS → App Store / Play Store | — |
| 2 | Web PWA | Next.js | Vercel | agripulse.ph |
| 3 | Admin Dashboard | Next.js | Vercel | admin.agripulse.ph |
| 4 | Backend API | Next.js API Routes + Supabase | Vercel | api.agripulse.ph |
| 5 | Database | PostgreSQL | Supabase | (internal) |
| 6 | Authentication | Supabase Auth | Supabase | (internal) |
| 7 | File Storage | Supabase Storage | Supabase | (CDN) |
| 8 | Real-time (Chat) | Supabase Realtime | Supabase | (WebSocket) |
| 9 | Background Jobs | Vercel Cron + Supabase Edge Functions | Vercel + Supabase | (internal) |
| 10 | Cache | Upstash Redis | Upstash (Vercel KV) | (internal) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              Vercel Edge Network (Global CDN)                     │
│              - SSL/TLS Termination (automatic)                    │
│              - Edge Caching                                       │
│              - DDoS Protection                                    │
└────────┬──────────────────┬──────────────────┬──────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Next.js Web  │  │ Next.js      │  │ Vercel       │
│ PWA          │  │ Admin Panel  │  │ API Routes   │
│ agripulse.ph │  │ admin.*      │  │ /api/*       │
└──────────────┘  └──────────────┘  └──────┬───────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE (Backend-as-a-Service)              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  PostgreSQL  │  │  Supabase    │  │  Supabase Storage    │   │
│  │  Database    │  │  Auth        │  │  (Images, Docs)      │   │
│  │              │  │              │  │                      │   │
│  │  - Tables    │  │  - OTP/SMS   │  │  - Product images    │   │
│  │  - RLS       │  │  - OAuth     │  │  - Verification docs │   │
│  │  - Functions │  │  - JWT       │  │  - Avatars           │   │
│  │  - Triggers  │  │  - Roles     │  │  - Chat media        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │  Supabase    │  │  Edge        │                              │
│  │  Realtime    │  │  Functions   │                              │
│  │              │  │              │                              │
│  │  - Chat msgs │  │  - Webhooks  │                              │
│  │  - Order     │  │  - Payment   │                              │
│  │    updates   │  │    callbacks │                              │
│  │  - Notifs    │  │  - Background│                              │
│  └──────────────┘  └──────────────┘                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Upstash    │  │ Semaphore  │  │ PayMongo   │                │
│  │ Redis      │  │ (SMS OTP)  │  │ (Payments) │                │
│  │ (Caching)  │  │            │  │            │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│  ┌────────────┐  ┌────────────┐                                 │
│  │ Firebase   │  │ Resend     │                                 │
│  │ (Push)     │  │ (Email)    │                                 │
│  └────────────┘  └────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Hosting Configuration

### Vercel (Frontend + API Compute)

| Service | Plan | Purpose |
|---------|------|---------|
| Vercel Pro | $20/month per member | Hosting, serverless functions, CDN |
| Vercel KV (Upstash) | Pro tier | Caching, rate limiting |
| Vercel Cron | Included | Scheduled jobs (payouts, cleanup) |

### Supabase (Database + Backend Services)

| Service | Plan | Purpose |
|---------|------|---------|
| Supabase Pro | $25/month | Database, Auth, Storage, Realtime, Edge Functions |
| Database | 8GB RAM, 100GB storage | PostgreSQL with connection pooling |
| Auth | Included | OTP, OAuth, JWT, Row Level Security |
| Storage | 100GB included | Product images, documents, media |
| Realtime | Included | Chat, order updates, notifications |
| Edge Functions | Included | Webhooks, background processing |

### Expo EAS (Mobile Deployment)

| Service | Plan | Purpose |
|---------|------|---------|
| EAS Build | Production | iOS/Android builds |
| EAS Submit | Included | App Store & Play Store submission |
| EAS Update | Included | OTA updates without store review |

---

## Vercel Project Structure

```
agripulse/
├── apps/
│   ├── web/                    # Next.js Consumer PWA → Vercel
│   │   ├── app/
│   │   │   ├── api/            # API Routes (serverless)
│   │   │   │   ├── auth/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── payments/
│   │   │   │   ├── chat/
│   │   │   │   └── webhooks/
│   │   │   ├── (marketplace)/  # Consumer pages
│   │   │   └── layout.tsx
│   │   ├── next.config.js
│   │   ├── vercel.json
│   │   └── package.json
│   │
│   ├── admin/                  # Next.js Admin Dashboard → Vercel
│   │   ├── app/
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── mobile/                 # React Native Expo → EAS
│       ├── src/
│       ├── app.json
│       └── package.json
│
├── packages/                   # Shared packages (monorepo)
│   ├── supabase/               # Supabase client, types, queries
│   │   ├── client.ts
│   │   ├── types.ts            # Generated from DB schema
│   │   └── queries/
│   ├── shared-types/
│   ├── validators/             # Zod schemas
│   └── utils/
│
├── supabase/                   # Supabase project config
│   ├── migrations/             # SQL migrations
│   ├── functions/              # Edge Functions
│   │   ├── payment-webhook/
│   │   ├── process-payout/
│   │   └── send-notification/
│   ├── seed.sql
│   └── config.toml
│
├── turbo.json
├── package.json
└── vercel.json
```

---

## Database Configuration (Supabase)

### Connection Details

```env
# Supabase Project
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Server-side only (API routes, Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Direct database connection (migrations only)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Pooled connection (application use)
DATABASE_URL_POOLED=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Supabase Features Used

| Feature | Usage in AgriPulse |
|---------|-------------------|
| **PostgreSQL** | All application data (users, products, orders, etc.) |
| **Row Level Security (RLS)** | Data access control per user role |
| **Auth** | OTP login, Google/Facebook OAuth, session management |
| **Storage** | Product images, farmer verification docs, avatars |
| **Realtime** | Chat messages, order status updates, notifications |
| **Edge Functions** | Payment webhooks, payout processing, email triggers |
| **Database Functions** | Business logic (update ratings, stock management) |
| **Triggers** | Auto-update counters, send notifications on events |
| **Cron (pg_cron)** | Scheduled payouts, cart cleanup, analytics |

### Row Level Security (RLS) Policies

```sql
-- Users can only read their own profile
CREATE POLICY "Users read own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Farmers can only manage their own products
CREATE POLICY "Farmers manage own products"
ON products FOR ALL
USING (farmer_id IN (
  SELECT id FROM farmers WHERE user_id = auth.uid()
));

-- Buyers can only see their own orders
CREATE POLICY "Buyers see own orders"
ON orders FOR SELECT
USING (buyer_id = auth.uid());

-- Anyone can read active products
CREATE POLICY "Public read active products"
ON products FOR SELECT
USING (is_active = true AND deleted_at IS NULL);

-- Chat participants can read their messages
CREATE POLICY "Chat participants read messages"
ON messages FOR SELECT
USING (
  chat_id IN (
    SELECT chat_id FROM chat_participants
    WHERE user_id = auth.uid()
  )
);
```

### Database Functions (pg/plpgsql)

```sql
-- Auto-update product rating when review is added
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating_average = (
      SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id
    ),
    total_reviews = (
      SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-decrement stock on order placement
CREATE OR REPLACE FUNCTION decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    available_quantity = available_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Supabase Auth Configuration

### Providers Enabled

| Provider | Config |
|----------|--------|
| Phone (OTP) | Semaphore SMS gateway, 6-digit code, 5-min expiry |
| Google OAuth | Google Cloud Console credentials |
| Facebook OAuth | Meta Developer App credentials |
| Email (optional) | Magic link or password |

### Auth Settings
```
- Site URL: https://agripulse.ph
- Redirect URLs: agripulse://, https://agripulse.ph/auth/callback
- JWT Expiry: 3600 seconds (1 hour)
- Refresh Token Rotation: Enabled
- MFA: Optional (TOTP for admin accounts)
- Custom Claims: role, farmer_id (via database hook)
```

### Custom JWT Claims (Database Hook)
```sql
-- Add role and farmer_id to JWT
CREATE OR REPLACE FUNCTION custom_access_token_hook(event jsonb)
RETURNS jsonb AS $$
DECLARE
  claims jsonb;
  user_role text;
  user_farmer_id uuid;
BEGIN
  SELECT role INTO user_role FROM users WHERE id = (event->>'user_id')::uuid;
  SELECT id INTO user_farmer_id FROM farmers WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

  IF user_farmer_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{farmer_id}', to_jsonb(user_farmer_id));
  END IF;

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$ LANGUAGE plpgsql;
```

---

## Supabase Storage Configuration

### Buckets

| Bucket | Public | Max Size | Allowed Types | Purpose |
|--------|--------|----------|---------------|---------|
| `product-images` | Yes (CDN) | 5MB | image/jpeg, image/png, image/webp | Product listing photos |
| `avatars` | Yes (CDN) | 2MB | image/jpeg, image/png, image/webp | User profile pictures |
| `farm-photos` | Yes (CDN) | 5MB | image/jpeg, image/png | Farm gallery |
| `verification-docs` | **No** (private) | 10MB | image/*, application/pdf | ID docs, certificates |
| `chat-media` | **No** (authenticated) | 5MB | image/jpeg, image/png | Chat images |
| `review-images` | Yes (CDN) | 5MB | image/jpeg, image/png, image/webp | Review photos |
| `delivery-proofs` | **No** (authenticated) | 5MB | image/jpeg, image/png | Delivery confirmation |

### Storage Policies
```sql
-- Anyone can view product images
CREATE POLICY "Public product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only farmer can upload to their folder
CREATE POLICY "Farmers upload own product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Only owner can view verification docs
CREATE POLICY "Owner views own docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'verification-docs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Supabase Realtime Configuration

### Channels

| Channel | Pattern | Purpose |
|---------|---------|---------|
| Chat messages | `messages:chat_id=eq.{chatId}` | Real-time chat |
| Order updates | `orders:id=eq.{orderId}` | Status changes |
| Notifications | `notifications:user_id=eq.{userId}` | Push to in-app |
| Product stock | `products:id=eq.{productId}` | Stock updates |

### Client Subscription Example
```typescript
// Subscribe to chat messages
const channel = supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `chat_id=eq.${chatId}`
  }, (payload) => {
    addMessage(payload.new);
  })
  .subscribe();

// Subscribe to order status
const orderChannel = supabase
  .channel(`order:${orderId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `id=eq.${orderId}`
  }, (payload) => {
    updateOrderStatus(payload.new.status);
  })
  .subscribe();
```

---

## Environment Variables

### Vercel Environment Configuration

```env
# ═══════════════════════════════════════
# SUPABASE
# ═══════════════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_JWT_SECRET=<your-jwt-secret>

# ═══════════════════════════════════════
# APP CONFIG
# ═══════════════════════════════════════
NEXT_PUBLIC_APP_URL=https://agripulse.ph
NEXT_PUBLIC_API_URL=https://agripulse.ph/api
NEXT_PUBLIC_ADMIN_URL=https://admin.agripulse.ph

# ═══════════════════════════════════════
# REDIS (Upstash via Vercel KV)
# ═══════════════════════════════════════
KV_URL=<auto-populated by Vercel>
KV_REST_API_URL=<auto-populated>
KV_REST_API_TOKEN=<auto-populated>

# ═══════════════════════════════════════
# SMS (Semaphore — PH OTP Provider)
# ═══════════════════════════════════════
SEMAPHORE_API_KEY=<secret>
SEMAPHORE_SENDER_NAME=AgriPulse

# ═══════════════════════════════════════
# PAYMENT (PayMongo)
# ═══════════════════════════════════════
PAYMONGO_SECRET_KEY=<secret>
PAYMONGO_PUBLIC_KEY=<public>
PAYMONGO_WEBHOOK_SECRET=<secret>

# ═══════════════════════════════════════
# PUSH NOTIFICATIONS (Firebase)
# ═══════════════════════════════════════
FIREBASE_PROJECT_ID=agripulse-prod
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY=<private-key>

# ═══════════════════════════════════════
# EMAIL (Resend)
# ═══════════════════════════════════════
RESEND_API_KEY=<secret>
EMAIL_FROM=noreply@agripulse.ph

# ═══════════════════════════════════════
# MONITORING
# ═══════════════════════════════════════
SENTRY_DSN=<sentry-dsn>
NEXT_PUBLIC_SENTRY_DSN=<sentry-dsn>
```

---

## CI/CD

### Vercel Git Integration (Automatic)

```
Push to GitHub → Vercel Build → Deploy

Branch mapping:
  main        → Production (agripulse.ph)
  develop     → Preview (dev.agripulse.ph)
  feature/*   → Preview (feature-xxx.vercel.app)
```

### Full Pipeline

```
1. Push / PR to GitHub
        │
        ▼
2. GitHub Actions: Lint + Typecheck + Unit Tests
        │
        ▼
3. Vercel: Build Next.js apps
        │
        ▼
4. Vercel: Deploy (Preview or Production)
        │
        ▼
5. Post-deploy: Health check + E2E smoke tests
        │
        ▼
6. Supabase: Run migrations (if any in supabase/migrations/)
```

### Supabase CI (Database Migrations)

```yaml
# .github/workflows/supabase.yml
name: Supabase CI

on:
  push:
    branches: [main]
    paths: ['supabase/migrations/**']

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref $PROJECT_REF
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase db push
```

### Mobile Deployment (Expo EAS)

```
main branch merge → GitHub Action → EAS Build → App Store / Play Store
                                  → EAS Update (OTA for JS-only changes)
```

---

## Security

### Supabase Security
- **Row Level Security (RLS)**: All tables protected, policies enforce access
- **Service Role Key**: Only used server-side (never exposed to client)
- **Anon Key**: Safe for client-side (RLS restricts access)
- **SSL**: All connections encrypted
- **Network Restrictions**: Optional IP allowlist for database
- **Vault**: Encrypted secrets storage for Edge Functions

### Vercel Security
- **Automatic HTTPS**: All deployments
- **DDoS Protection**: Vercel Edge Network
- **Security Headers**: Configured in vercel.json/next.config.js
- **Environment Encryption**: All env vars encrypted at rest
- **Build Isolation**: Sandboxed builds

### Application Security
- Rate limiting via Upstash Redis (`@upstash/ratelimit`)
- Input validation with Zod schemas
- CORS restricted to production domains
- CSRF protection via SameSite cookies
- JWT verification on all protected API routes
- File upload validation (type, size) via Supabase Storage policies

### Compliance
- **Data Privacy Act (RA 10173)** — Full compliance
- **PCI DSS** — Via PayMongo (no card data stored)
- Supabase SOC 2 Type II certified
- Vercel SOC 2 Type II certified

---

## Backup Strategy

### Supabase Database Backups

| Type | Frequency | Retention | Plan |
|------|-----------|-----------|------|
| Point-in-Time Recovery | Continuous (WAL) | 7 days | Pro |
| Daily Backup | Automated | 7 days | Pro |
| Manual pg_dump | Weekly (via CI) | 30 days | Custom |

### Supabase Storage
- Built-in redundancy (S3-compatible, multi-AZ)
- Versioning available for critical buckets
- Cross-region replication on Team/Enterprise

### Upstash Redis
- Automatic persistence
- Multi-region replication
- Daily snapshots

### Backup Verification
- Monthly: Restore database to staging project
- Quarterly: Full DR drill

---

## Monitoring

### Built-in Monitoring

| Platform | Monitors |
|----------|----------|
| Vercel | Web Vitals, function logs, deployment history, bandwidth |
| Supabase | Database health, API requests, auth events, storage usage, realtime connections |

### External Monitoring

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking + performance |
| Checkly | Uptime monitoring + API checks |
| Better Stack | Log aggregation (Vercel log drain) |

### Alerting

| Alert | Condition | Channel |
|-------|-----------|---------|
| API Error Rate > 5% | 5-min window | Slack + PagerDuty |
| Supabase DB CPU > 80% | Sustained 5 min | Slack |
| Payment Failures > 10% | 15-min window | PagerDuty (P1) |
| Auth failures spike | 50+ in 5 min | Slack |
| Storage approaching limit | > 80GB | Email |

---

## Scaling Strategy

### Vercel (Auto-scales)
- Serverless functions: Automatic scaling to thousands of concurrent executions
- Edge Network: 100+ PoPs globally
- No manual intervention needed

### Supabase Scaling

| Phase | Users | Supabase Plan | Database |
|-------|-------|---------------|----------|
| Launch | 0-10K | Pro ($25/mo) | 2 CPU, 8GB RAM |
| Growth | 10K-100K | Pro + compute add-on | 4 CPU, 16GB RAM |
| Scale | 100K-500K | Team ($599/mo) | 8 CPU, 32GB RAM |
| Enterprise | 500K+ | Enterprise (custom) | Dedicated, read replicas |

### Supabase Compute Add-ons
- Upgrade database compute without changing plans
- Add read replicas for heavy read workloads
- Connection pooling (Supavisor) handles serverless connection patterns

---

## Production Checklist

### Supabase Setup
- [ ] Project created in ap-southeast-1 (Singapore)
- [ ] Database schema migrated (all tables, RLS, functions, triggers)
- [ ] Row Level Security enabled on ALL tables
- [ ] Storage buckets created with policies
- [ ] Auth providers configured (Phone, Google, Facebook)
- [ ] Custom JWT hook deployed
- [ ] Edge Functions deployed
- [ ] Realtime enabled for required tables
- [ ] Database backups verified
- [ ] Connection pooling configured

### Vercel Setup
- [ ] Pro team created
- [ ] Custom domains configured
- [ ] Environment variables set
- [ ] Git repo connected (auto-deploy)
- [ ] Vercel KV provisioned
- [ ] Cron jobs configured
- [ ] Security headers in vercel.json

### Application
- [ ] Supabase client initialized correctly (anon key client-side, service key server-side)
- [ ] All API routes use service role key
- [ ] Rate limiting active on auth endpoints
- [ ] Payment webhook endpoint registered
- [ ] SMS OTP tested end-to-end
- [ ] File uploads working with storage policies
- [ ] Realtime subscriptions tested

### Mobile
- [ ] EAS Build configured
- [ ] App Store & Play Store accounts ready
- [ ] Deep linking configured
- [ ] Push notification certificates set

---

## Disaster Recovery

### Recovery Objectives
- **RTO**: 15 minutes (Vercel instant rollback + Supabase PITR)
- **RPO**: < 1 minute (continuous WAL archiving)

### Scenarios

| Scenario | Response | Recovery Time |
|----------|----------|---------------|
| Bad deployment | Vercel instant rollback | < 1 minute |
| Database issue | Supabase Point-in-Time Recovery | 5-15 minutes |
| Supabase outage | Wait (99.9% SLA) or failover plan | Rare |
| Vercel outage | Wait (99.99% SLA) | Rare |
| Security breach | Rotate keys, invalidate sessions, redeploy | 1-2 hours |

---

## Cost Estimation

### Monthly Costs (Launch — 0-10K users)

| Service | Cost |
|---------|------|
| Vercel Pro (2 members) | $40 |
| Supabase Pro | $25 |
| Upstash Redis (Vercel KV) | $10 |
| Semaphore SMS (~5K OTPs) | ~$35 (₱2,000) |
| Firebase (Push) | $0 (free tier) |
| Resend (Email) | $0 (free tier) |
| Sentry | $0 (free tier) |
| Domain | ~$2 |
| **Total** | **~$112/month (~₱6,400)** |

### Growth Phase (10K-50K): ~$200-400/month
### Scale Phase (50K-200K): ~$800-1,500/month
