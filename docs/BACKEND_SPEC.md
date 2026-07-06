# AgriPulse Marketplace — Backend Specification

## Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| Next.js | Fullstack framework (API Routes) | 14.x |
| TypeScript | Type-safe development | 5.x |
| Supabase | Backend-as-a-Service (DB, Auth, Storage, Realtime) | Latest |
| PostgreSQL | Primary database (via Supabase) | 15.x |
| Supabase Auth | Authentication (OTP, OAuth, JWT) | Built-in |
| Supabase Storage | File/image storage | Built-in |
| Supabase Realtime | WebSocket for chat & live updates | Built-in |
| Supabase Edge Functions | Serverless functions (Deno) | Built-in |
| Upstash Redis | Caching, rate limiting | Latest |
| Firebase Cloud Messaging | Push notifications | Admin SDK |
| Semaphore | SMS OTP delivery (Philippines) | Latest |
| PayMongo | Payment processing (PH) | Latest |
| Zod | Request/response validation | 3.x |
| Resend | Transactional email | Latest |
| Vitest | Testing framework | 1.x |

---

## Architecture

### Pattern: Vercel + Supabase (Serverless Full-Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                         │
│                   (CDN + SSL + Routing)                       │
├─────────────────────────────────────────────────────────────┤
│                   Next.js Application                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  API Routes (/api/*)                    │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │  │
│  │  │  Auth   │ │Products │ │ Orders  │ │Payments │    │  │
│  │  │ Routes  │ │ Routes  │ │ Routes  │ │ Routes  │    │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘    │  │
│  │       │            │            │            │         │  │
│  │  ┌────┴────────────┴────────────┴────────────┴────┐   │  │
│  │  │            Supabase Client (Server)             │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                         SUPABASE                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │PostgreSQL│  │  Auth    │  │ Storage  │  │ Realtime │   │
│  │  + RLS   │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                 │
│  │  Edge    │  │ Database │                                 │
│  │Functions │  │Functions │                                 │
│  └──────────┘  └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### Module Breakdown (Next.js API Routes)

```
app/api/
├── auth/
│   ├── otp/request/route.ts       # Request OTP
│   ├── otp/verify/route.ts        # Verify OTP
│   ├── callback/route.ts          # OAuth callback
│   └── logout/route.ts            # Logout
├── users/
│   ├── me/route.ts                # Profile CRUD
│   └── me/avatar/route.ts         # Avatar upload
├── farmers/
│   ├── register/route.ts          # Farmer onboarding
│   ├── me/dashboard/route.ts      # Dashboard data
│   ├── me/orders/route.ts         # Farmer orders
│   └── me/payouts/route.ts        # Payout history
├── products/
│   ├── route.ts                   # List/Create products
│   ├── [id]/route.ts              # Get/Update/Delete product
│   └── [id]/reviews/route.ts      # Product reviews
├── categories/
│   └── route.ts                   # List categories
├── cart/
│   ├── route.ts                   # Get/Clear cart
│   └── items/route.ts             # Add/Update/Remove items
├── wishlist/
│   └── route.ts                   # Wishlist CRUD
├── orders/
│   ├── route.ts                   # Create/List orders
│   ├── [id]/route.ts              # Order details
│   └── [id]/cancel/route.ts       # Cancel order
├── payments/
│   └── webhook/route.ts           # PayMongo webhook
├── chat/
│   ├── route.ts                   # List/Create conversations
│   └── [id]/messages/route.ts     # Messages
├── notifications/
│   ├── route.ts                   # List notifications
│   └── read/route.ts              # Mark as read
├── admin/
│   ├── dashboard/route.ts         # Admin stats
│   ├── users/route.ts             # User management
│   └── verifications/route.ts     # Verification queue
└── webhooks/
    └── paymongo/route.ts          # Payment callbacks
```
```

---

## Authentication and Authorization

### Authentication (Supabase Auth)

| Method | Implementation |
|--------|---------------|
| OTP via SMS | Supabase Auth + Semaphore SMS provider |
| Google OAuth | Supabase Auth (built-in provider) |
| Facebook OAuth | Supabase Auth (built-in provider) |
| Email Magic Link | Supabase Auth (optional) |

### Token Strategy

```
Supabase handles JWT automatically:
- Access Token: JWT (1-hour expiry, configurable)
- Refresh Token: Managed by Supabase (auto-refresh via client SDK)
- Session: Stored in secure HttpOnly cookie (SSR) or localStorage (client)
- Custom Claims: user role & farmer_id injected via database hook
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| `consumer` | Browse, buy, review, chat, manage profile |
| `farmer` | All consumer + sell, manage products, view analytics |
| `restaurant` | All consumer + bulk orders, recurring orders |
| `grocery` | All consumer + wholesale pricing, bulk orders |
| `admin` | Full platform access |
| `super_admin` | Admin + system configuration |

### Access Control Implementation

**Row Level Security (RLS)** — Primary access control at database level:
```sql
-- Enforced by Supabase, no application code needed for basic CRUD
-- Example: Users can only read their own orders
CREATE POLICY "Buyers own orders" ON orders
  FOR SELECT USING (buyer_id = auth.uid());
```

**API Route Protection** — For complex business logic:
```typescript
// app/api/products/route.ts
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Check role from custom claims
  const role = user.app_metadata?.role;
  if (role !== 'farmer') return Response.json({ error: 'Forbidden' }, { status: 403 });

  // Proceed with product creation...
}
```

---

## Services

### AuthService
- OTP generation and verification (6-digit, 5-min expiry)
- JWT token issuance and refresh
- Session management (max 5 concurrent sessions)
- Password hashing (bcrypt, 12 rounds)
- Rate limiting on auth endpoints

### UserService
- Profile CRUD operations
- Avatar upload and management
- Address management (max 10 per user)
- Account deactivation/deletion (GDPR-compliant)

### FarmerService
- Farmer registration and verification workflow
- Farm profile management
- Document upload and verification queue
- Payout management
- Performance metrics

### ProductService
- Product CRUD with image management
- Full-text search (PostgreSQL tsvector + trigram)
- Category-based filtering
- Price history tracking
- Stock management with low-stock alerts
- Bulk product import (CSV)

### OrderService
- Order creation with inventory reservation
- Status lifecycle management
- Order splitting (multi-seller)
- Cancellation handling with refund logic
- Reorder functionality

### PaymentService
- Multi-gateway integration (GCash, Maya, Bank Transfer, COD)
- Payment intent creation
- Webhook handling for payment confirmations
- Refund processing
- Farmer payout scheduling (daily/weekly)
- Transaction ledger

### ChatService
- Supabase Realtime-based messaging (PostgreSQL changes → WebSocket)
- Message persistence in `messages` table
- File/image sharing via Supabase Storage
- Online status tracking via Supabase Presence
- Message read receipts (database update → Realtime broadcast)
- Chat history pagination via Supabase queries

### NotificationService
- Multi-channel dispatch (push, SMS, email, in-app)
- Template-based notifications
- Notification preferences per user
- Batch processing for bulk notifications
- Delivery tracking and retry

### DeliveryService
- Delivery zone management
- Fee calculation based on distance/weight
- Third-party logistics API integration
- Real-time tracking updates
- Proof of delivery (photo upload)

### AnalyticsService
- Event tracking and aggregation
- Farmer revenue reports
- Platform-wide metrics
- Custom date range queries
- Export to CSV/PDF

---

## Security

### Input Validation
- All request bodies validated via Zod schemas
- Query parameters sanitized
- File uploads validated (type, size) via Supabase Storage policies
- SQL injection prevention via Supabase client (parameterized by default)

### API Security
- HTTPS enforced (Vercel automatic SSL)
- CORS configured in Next.js config
- Security headers in vercel.json
- Request size limits (4.5MB max body for Vercel Functions)
- Content-Type validation

### Data Protection
- Supabase Auth handles password hashing (bcrypt)
- Data encrypted at rest (Supabase infrastructure)
- PII: Masked in logs, protected by RLS
- Tokens: Managed by Supabase Auth (secure session handling)
- API keys: Vercel environment variables, never in code

### Vulnerability Protection
- Rate limiting via Upstash Redis (`@upstash/ratelimit`)
- XSS prevention via React rendering + Content Security Policy
- Brute force protection (Supabase Auth built-in rate limiting)
- Dependency scanning (pnpm audit, Snyk)
- Row Level Security prevents unauthorized data access at DB level

---

## File Upload System

### Architecture

```
Client → Supabase Storage (direct upload or via API route) → CDN
```

### Configuration

| Parameter | Value |
|-----------|-------|
| Max file size | 5MB per image |
| Max files per request | 8 |
| Allowed types | JPEG, PNG, WebP |
| Storage | Supabase Storage (S3-compatible) |
| CDN | Supabase CDN (auto) |
| Processing | Supabase Image Transformations (resize on-the-fly) |

### Image Processing
Supabase Storage supports on-the-fly transformations via URL parameters:
```
# Original
https://xxxxx.supabase.co/storage/v1/object/public/product-images/farmer1/tomato.jpg

# Thumbnail (150x150)
https://xxxxx.supabase.co/storage/v1/render/image/public/product-images/farmer1/tomato.jpg?width=150&height=150&resize=cover

# Medium (400x400)
...?width=400&height=400&resize=cover

# WebP format
...?width=800&height=800&format=origin
```

No pre-processing pipeline needed — transformations happen at request time and are cached.

### Folder Structure (Supabase Storage)
```
Buckets:
├── product-images/{farmerId}/{productId}/
├── avatars/{userId}/
├── farm-photos/{farmerId}/
├── verification-docs/{farmerId}/  (private bucket)
├── chat-media/{conversationId}/
├── review-images/{reviewId}/
└── delivery-proofs/{orderId}/
```

---

## Notifications

### Channels

| Channel | Use Cases | Provider |
|---------|-----------|----------|
| Push (Mobile) | Order updates, messages, promotions | Firebase Cloud Messaging |
| SMS | OTP, critical order updates, payment confirmations | Semaphore (PH) |
| Email | Receipts, account security, weekly summaries | Resend |
| In-App (Realtime) | All notifications (persistent, live) | Supabase Realtime |

### Notification Templates

```typescript
enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  PAYOUT_PROCESSED = 'payout_processed',
  NEW_MESSAGE = 'new_message',
  NEW_REVIEW = 'new_review',
  PRICE_DROP = 'price_drop',
  LOW_STOCK = 'low_stock',
  VERIFICATION_APPROVED = 'verification_approved',
  VERIFICATION_REJECTED = 'verification_rejected',
  PROMO_OFFER = 'promo_offer',
}
```

### Priority Levels
- **Critical** (OTP, payment issues): Immediate delivery via SMS + Push
- **High** (order updates): Push + In-App within 30 seconds
- **Medium** (messages, reviews): Push + In-App within 2 minutes
- **Low** (promotions, tips): In-App, batched delivery

---

## Payment Integration

### Supported Payment Methods

| Method | Provider | Type |
|--------|----------|------|
| GCash | PayMongo | E-Wallet |
| Maya | PayMongo | E-Wallet |
| Bank Transfer | PayMongo | Direct Debit |
| Credit/Debit Card | PayMongo | Card |
| Cash on Delivery | Internal | Cash |

### Payment Flow

```
1. Buyer initiates checkout
2. System creates payment intent (PayMongo)
3. Buyer redirected to payment gateway
4. Payment processed
5. Webhook received → order confirmed
6. Funds held in escrow
7. Delivery confirmed
8. Funds released to farmer (minus commission)
```

### Farmer Payout Schedule
- **Daily Payout**: Orders delivered and confirmed (24hr hold)
- **Minimum Payout**: ₱100
- **Payout Methods**: GCash, Maya, Bank Transfer
- **Commission Deduction**: 3-5% per transaction

### Refund Policy
- Full refund if cancelled before shipping
- Partial refund for quality issues (with photo evidence)
- Refund processed within 3-5 business days
- Refund to original payment method

---

## Logging

### Logging Strategy

```typescript
// Structured JSON logging
{
  "timestamp": "2026-07-06T10:30:00.000Z",
  "level": "info",
  "service": "order-service",
  "traceId": "abc-123-def",
  "userId": "user_456",
  "action": "order_created",
  "metadata": { "orderId": "ord_789", "amount": 1500 },
  "duration": 234
}
```

### Log Levels
- **error**: System failures, unhandled exceptions
- **warn**: Degraded performance, rate limit hits, failed validations
- **info**: Business events (orders, payments, registrations)
- **debug**: Detailed execution flow (development only)

### Log Storage
- **Application Logs**: Vercel Function Logs + Better Stack (log drain)
- **Access Logs**: Vercel Analytics + Supabase Dashboard
- **Audit Logs**: PostgreSQL audit table via Supabase (permanent)
- **Error Tracking**: Sentry integration

---

## Monitoring

### Health Checks
- `/api/health` — Basic liveness (responds 200)
- `/api/health/db` — Supabase database connectivity
- `/api/health/redis` — Upstash Redis connectivity

### Monitoring Stack
- **Vercel Analytics**: Web Vitals, function duration, error rates
- **Supabase Dashboard**: Database health, auth events, storage usage, realtime connections
- **Sentry**: Error tracking with full stack traces
- **Checkly**: External uptime monitoring + API checks
- **Better Stack**: Log aggregation via Vercel log drain

### Alerting Rules

| Metric | Threshold | Severity |
|--------|-----------|----------|
| Error rate | > 5% for 5 minutes | Critical |
| Response time p95 | > 2 seconds for 5 minutes | Warning |
| Supabase DB CPU | > 80% sustained | Warning |
| Payment failure rate | > 10% | Critical |
| Auth failure spike | > 50 in 5 min | Warning |

---

## Rate Limiting

### Configuration

| Endpoint Group | Limit | Window |
|---------------|-------|--------|
| Auth (OTP request) | 5 requests | 15 minutes |
| Auth (login attempt) | 10 requests | 15 minutes |
| API (authenticated) | 100 requests | 1 minute |
| API (unauthenticated) | 30 requests | 1 minute |
| File upload | 20 uploads | 1 hour |
| Search | 60 requests | 1 minute |
| Chat messages | 30 messages | 1 minute |

### Implementation
- Redis-based sliding window counter
- Per-user and per-IP limits
- Custom headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 response with retry-after header

---

## Caching

### Cache Layers

| Layer | Technology | TTL | Use Case |
|-------|-----------|-----|----------|
| CDN | Supabase CDN + Vercel Edge | 24h | Static assets, product images |
| Application | Upstash Redis (Vercel KV) | 5-60min | API responses, computed data |
| Database | PostgreSQL | N/A | Materialized views for analytics |
| Client | HTTP Cache-Control | 5min | Category lists, static content |

### Cache Strategy

| Data | Strategy | TTL | Invalidation |
|------|----------|-----|--------------|
| Product listings | Cache-aside | 5 min | On product update |
| Categories | Cache-aside | 1 hour | On admin change |
| User profile | Cache-aside | 15 min | On profile update |
| Search results | Cache-aside | 2 min | Time-based |
| Farmer analytics | Write-through | 30 min | On new order |
| Market prices | Cache-aside | 10 min | Time-based |

### Cache Key Patterns
```
product:{id}
products:category:{categoryId}:page:{page}
user:{userId}:profile
farmer:{farmerId}:analytics:{period}
search:{hash(query+filters)}
cart:{userId}
```

---

## Background Jobs

### Job Processing (Supabase Edge Functions + Vercel Cron)

| Job Type | Platform | Trigger |
|----------|----------|---------|
| Payment webhook processing | Supabase Edge Function | HTTP (PayMongo webhook) |
| Farmer payout processing | Vercel Cron + API Route | Daily 6:00 AM PHT |
| Send push notifications | Supabase Edge Function | Database trigger (INSERT on notifications) |
| Send email | Supabase Edge Function | Database trigger |
| Cart cleanup (expired) | Vercel Cron | Every 4 hours |
| Analytics aggregation | Vercel Cron | Daily 2:00 AM PHT |
| Low stock alerts | Supabase Database Function | Trigger on stock update |
| Update market price index | Vercel Cron | Every 30 minutes |

### Vercel Cron Configuration
```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/payouts", "schedule": "0 22 * * *" },
    { "path": "/api/cron/cleanup-carts", "schedule": "0 */4 * * *" },
    { "path": "/api/cron/analytics", "schedule": "0 18 * * *" },
    { "path": "/api/cron/price-index", "schedule": "*/30 * * * *" }
  ]
}
```
Note: Cron schedules in UTC. PHT = UTC+8.

### Supabase Database Triggers
```sql
-- Auto-send notification when order status changes
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      NEW.buyer_id,
      'order_' || NEW.status,
      'Order Update',
      'Your order #' || NEW.order_number || ' is now ' || NEW.status,
      jsonb_build_object('orderId', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_change();
```

---

## Deployment Architecture

### Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| Development | Local development | Supabase CLI (local) + Next.js dev |
| Preview | PR review & testing | Vercel Preview + Supabase branching |
| Production | Live platform | Vercel + Supabase |

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (Global CDN)             │
├─────────────────────────────────────────────────────────┤
│            Automatic SSL + DDoS Protection                │
├─────────────────────────────────────────────────────────┤
│         Vercel Serverless Functions (Auto-scaling)        │
│    ┌──────────────┐  ┌──────────────────────────┐       │
│    │ API Routes   │  │ Admin Dashboard (Next.js)│       │
│    │ (Next.js)    │  │ Web PWA (Next.js)        │       │
│    └──────────────┘  └──────────────────────────┘       │
├─────────────────────────────────────────────────────────┤
│                        SUPABASE                           │
│    ┌─────────────┐  ┌────────────┐  ┌────────────┐     │
│    │ PostgreSQL  │  │ Supabase   │  │ Supabase   │     │
│    │ + RLS       │  │ Auth       │  │ Storage    │     │
│    └─────────────┘  └────────────┘  └────────────┘     │
│    ┌─────────────┐  ┌────────────┐                      │
│    │ Supabase    │  │ Edge       │                      │
│    │ Realtime    │  │ Functions  │                      │
│    └─────────────┘  └────────────┘                      │
├─────────────────────────────────────────────────────────┤
│    ┌────────────┐                                        │
│    │ Upstash    │  (Caching & Rate Limiting)             │
│    │ Redis      │                                        │
│    └────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

### Serverless Configuration
- **API Functions**: Vercel, 1024MB RAM, 30s max duration, auto-scaling
- **Realtime/WebSocket**: Supabase Realtime (managed, no separate server needed)
- **Background Jobs**: Supabase Edge Functions + Vercel Cron

### Auto-Scaling
- Vercel Functions: Automatic, scales to thousands of concurrent executions
- Supabase: Auto-scales compute on Pro plan (0.25 → 4 CU)
- No manual scaling configuration required
