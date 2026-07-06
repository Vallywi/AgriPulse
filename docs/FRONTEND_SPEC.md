# AgriPulse Marketplace — Frontend Specification

## Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| React Native | Cross-platform mobile development | 0.73+ |
| Expo | Build tooling and native APIs | SDK 50+ |
| TypeScript | Type-safe JavaScript | 5.x |
| React Navigation | Navigation/routing | 6.x |
| Zustand | State management | 4.x |
| TanStack Query (React Query) | Server state & caching | 5.x |
| Supabase JS Client | Database, Auth, Storage, Realtime | 2.x |
| React Hook Form | Form management | 7.x |
| Zod | Schema validation | 3.x |
| React Native Paper | UI component library (Material Design) | 5.x |
| Expo Image | Optimized image loading | 1.x |
| AsyncStorage | Local persistence | 1.x |
| Expo Notifications | Push notifications | Latest |
| React Native Maps | Map integration for delivery tracking | 1.x |
| i18next | Internationalization (Filipino/English) | 23.x |

---

## Architecture

### Pattern: Feature-Based Architecture with Clean Separation

```
┌─────────────────────────────────────────────┐
│                  UI Layer                     │
│  (Screens, Components, Navigation)           │
├─────────────────────────────────────────────┤
│              Application Layer               │
│  (Hooks, State Management, Forms)            │
├─────────────────────────────────────────────┤
│               Domain Layer                   │
│  (Types, Interfaces, Business Logic)         │
├─────────────────────────────────────────────┤
│           Infrastructure Layer               │
│  (API Client, Storage, WebSocket)            │
└─────────────────────────────────────────────┘
```

### Key Architectural Decisions
- **Offline-First Design** — Critical data cached locally for rural connectivity issues
- **Lazy Loading** — Screens loaded on demand to reduce initial bundle size
- **Optimistic Updates** — Cart and wishlist update instantly, sync in background
- **Image Optimization** — Progressive loading, WebP format, responsive sizes
- **Modular Features** — Each feature is self-contained with its own components, hooks, and types

---

## State Management

### Global State (Zustand)
- Authentication state (user, tokens, role)
- Cart state (items, quantities, totals)
- App preferences (language, theme, notifications)
- Network status (online/offline indicator)

### Server State (TanStack Query)
- Product listings with pagination
- Order history and status
- User profile data
- Chat messages
- Notifications
- Farmer dashboard analytics

### Local State (React useState/useReducer)
- Form inputs
- UI toggles (modals, drawers)
- Animation states
- Filter/sort selections

### Persistence Strategy
```
AsyncStorage:
├── auth_tokens (encrypted)
├── user_preferences
├── cached_categories
├── recent_searches
├── draft_product_listings
└── offline_cart
```

---

## Routing

### Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack
│   ├── Splash Screen
│   ├── Onboarding (3 slides)
│   ├── Login
│   ├── Register (Consumer/Farmer selection)
│   ├── OTP Verification
│   └── Forgot Password
│
├── Main Tab Navigator (Bottom Tabs)
│   ├── Home Tab (Stack)
│   │   ├── Home Screen
│   │   ├── Category Products
│   │   ├── Product Details
│   │   ├── Farmer Profile
│   │   └── Search Results
│   │
│   ├── Marketplace Tab (Stack)
│   │   ├── Browse All
│   │   ├── Category View
│   │   └── Filter/Sort
│   │
│   ├── Cart Tab (Stack)
│   │   ├── Cart Screen
│   │   ├── Checkout
│   │   ├── Address Selection
│   │   ├── Payment Method
│   │   └── Order Confirmation
│   │
│   ├── Orders Tab (Stack)
│   │   ├── Order List
│   │   ├── Order Details
│   │   ├── Delivery Tracking
│   │   └── Review/Rate
│   │
│   └── Profile Tab (Stack)
│       ├── Profile Overview
│       ├── Edit Profile
│       ├── Addresses
│       ├── Wishlist
│       ├── Settings
│       └── Help & Support
│
├── Chat Stack (Modal)
│   ├── Conversation List
│   └── Chat Room
│
├── Notifications Stack (Modal)
│   └── Notification Center
│
└── Farmer Dashboard Stack (Conditional)
    ├── Dashboard Overview
    ├── My Products
    ├── Add/Edit Product
    ├── Orders Management
    ├── Analytics
    └── Payouts
```

### Deep Linking
```
agripulse://product/{id}
agripulse://order/{id}
agripulse://farmer/{id}
agripulse://chat/{conversationId}
agripulse://category/{slug}
```

---

## Authentication Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Splash  │───▶│Onboarding│───▶│  Login/  │───▶│   OTP    │
│  Screen  │    │ (first   │    │ Register │    │  Verify  │
│          │    │  launch) │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │  Role Select │
                                              │  (if new)    │
                                              └──────────────┘
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    ▼                  ▼                  ▼
                            ┌──────────┐      ┌──────────┐      ┌──────────┐
                            │ Consumer │      │  Farmer  │      │Restaurant│
                            │   Home   │      │ Onboard  │      │ Onboard  │
                            └──────────┘      └──────────┘      └──────────┘
```

### Token Management
- Supabase handles token management automatically via `@supabase/supabase-js`
- Access Token: JWT (1-hour expiry, auto-refreshed by SDK)
- Refresh Token: Managed by Supabase (stored securely by SDK)
- Session persistence: AsyncStorage (React Native) / Cookies (Web)
- Biometric authentication option for returning users (device-level unlock)

---

## Folder Structure

```
src/
├── app/
│   ├── App.tsx                    # Root component
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   ├── FarmerStack.tsx
│   │   └── linking.ts            # Deep link config
│   └── providers/
│       ├── AuthProvider.tsx
│       ├── QueryProvider.tsx
│       ├── ThemeProvider.tsx
│       └── NotificationProvider.tsx
│
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── products/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── cart/
│   ├── orders/
│   ├── chat/
│   ├── notifications/
│   ├── profile/
│   ├── farmer-dashboard/
│   └── admin/
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Rating.tsx
│   │   ├── ImagePicker.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── OfflineBanner.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNetwork.ts
│   │   ├── useLocation.ts
│   │   ├── useImageUpload.ts
│   │   └── useDebounce.ts
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   ├── validators.ts
│   │   ├── storage.ts
│   │   └── permissions.ts
│   └── constants/
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── config.ts
│
├── services/
│   ├── supabase/
│   │   ├── client.ts              # Supabase client instance
│   │   ├── auth.ts                # Auth helpers
│   │   └── realtime.ts            # Realtime subscriptions
│   └── notifications/
│       └── push.ts
│
├── store/
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── preferencesStore.ts
│
├── types/
│   ├── api.ts
│   ├── models.ts
│   └── navigation.ts
│
├── i18n/
│   ├── config.ts
│   ├── en.json
│   └── fil.json
│
└── assets/
    ├── images/
    ├── icons/
    ├── fonts/
    └── animations/
```

---

## Reusable Components

### ProductCard
- Product image with lazy loading
- Product name, price (per unit)
- Farmer name with verification badge
- Rating stars
- Add to cart button
- Wishlist heart icon
- Freshness indicator (days since harvest)

### FarmerCard
- Farmer avatar with verification badge
- Farm name and location
- Rating and review count
- Product count
- "Follow" button

### OrderCard
- Order ID and date
- Status badge (color-coded)
- Product thumbnails (max 3 + count)
- Total amount
- Action buttons (Track, Reorder, Review)

### SearchBar
- Auto-suggest dropdown
- Recent searches
- Voice search option
- Category filter chips

### AddressCard
- Address label (Home, Office, Custom)
- Full address display
- Default indicator
- Edit/Delete actions

### QuantitySelector
- Minus/Plus buttons
- Direct input field
- Unit display (kg, piece, bundle)
- Min/Max validation

### PriceDisplay
- Original price (strikethrough if discounted)
- Current price (highlighted)
- Unit indicator
- Bulk discount badge

---

## Pages

| Screen | Description | Key Components |
|--------|-------------|----------------|
| Splash | Brand logo animation | Logo, loading indicator |
| Onboarding | 3-slide intro (Farm → Market → Fair Price) | Illustrations, dots, skip/next |
| Login | Phone/email login | Input, OTP button, social login |
| Register | Multi-step registration | Role selector, form steps, progress |
| Home | Personalized feed | Banner carousel, categories, trending, nearby farmers |
| Marketplace | Full product catalog | Grid/list toggle, filters, sort, infinite scroll |
| Search | Search with filters | Search bar, suggestions, results, filters |
| Categories | Category grid | Category icons, subcategory chips |
| Product Details | Full product page | Image gallery, description, farmer info, reviews, add to cart |
| Cart | Shopping cart | Item list, quantity edit, price summary, checkout CTA |
| Checkout | Order placement | Address, schedule, payment, summary |
| Orders | Order history | Tab filters (Active/Completed/Cancelled), order cards |
| Order Details | Single order view | Timeline, items, payment info, actions |
| Delivery Tracking | Live tracking | Map, status updates, driver info |
| Notifications | Notification feed | Grouped by type, mark as read |
| Chat List | Conversations | Farmer avatars, last message, unread count |
| Chat Room | Messaging | Messages, image sharing, product links |
| Profile | User profile | Avatar, stats, menu items |
| Wishlist | Saved products | Product grid, remove, add to cart |
| Farmer Dashboard | Seller overview | Revenue chart, pending orders, alerts |
| Product Management | CRUD products | Product list, add/edit form, status toggle |

---

## Forms

### Registration Form
```typescript
{
  phone: string;          // Required, PH format (+63)
  email?: string;         // Optional
  firstName: string;      // Required, 2-50 chars
  lastName: string;       // Required, 2-50 chars
  role: 'consumer' | 'farmer' | 'restaurant' | 'grocery';
  agreedToTerms: boolean; // Required, must be true
}
```

### Farmer Onboarding Form
```typescript
{
  farmName: string;           // Required
  farmSize: number;           // Required, in hectares
  farmLocation: {
    province: string;
    municipality: string;
    barangay: string;
    coordinates?: [number, number];
  };
  primaryCrops: string[];     // At least 1
  farmingExperience: number;  // Years
  validId: File;              // Required
  farmPhoto?: File;           // Optional
  cooperativeName?: string;   // Optional
}
```

### Product Listing Form
```typescript
{
  name: string;               // Required, 3-100 chars
  description: string;        // Required, 10-2000 chars
  categoryId: string;         // Required
  subcategoryId?: string;
  price: number;              // Required, > 0
  unit: 'kg' | 'piece' | 'bundle' | 'sack' | 'crate';
  availableQuantity: number;  // Required, > 0
  minimumOrder: number;       // Default: 1
  harvestDate?: Date;         // Optional
  isOrganic: boolean;
  images: File[];             // 1-8 images
  variants?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}
```

### Checkout Form
```typescript
{
  addressId: string;          // Required
  deliveryDate: Date;         // Required, must be future
  deliveryTimeSlot: string;   // Required
  paymentMethod: 'gcash' | 'maya' | 'bank_transfer' | 'cod';
  promoCode?: string;
  specialInstructions?: string;
}
```

### Review Form
```typescript
{
  rating: number;             // Required, 1-5
  comment: string;            // Required, 10-500 chars
  images?: File[];            // Optional, max 5
  isAnonymous: boolean;
}
```

---

## Validation

### Validation Rules (Zod Schemas)

```typescript
// Phone number (Philippine format)
z.string().regex(/^(\+63|0)\d{10}$/, 'Invalid Philippine phone number')

// Price
z.number().positive('Price must be greater than 0').max(999999, 'Price too high')

// Product name
z.string().min(3, 'Too short').max(100, 'Too long').trim()

// Image file
z.instanceof(File)
  .refine(f => f.size <= 5 * 1024 * 1024, 'Max 5MB')
  .refine(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type), 'Invalid format')
```

### Validation UX
- Real-time validation on field blur
- Inline error messages below fields
- Error summary at form top for accessibility
- Disabled submit button until valid
- Filipino/English error messages based on locale

---

## Responsive Design Strategy

### Approach: Mobile-First with Tablet Optimization

| Breakpoint | Target | Layout |
|-----------|--------|--------|
| 320-375px | Small phones | Single column, compact cards |
| 376-428px | Standard phones | Single column, standard spacing |
| 429-768px | Large phones/small tablets | 2-column grid for products |
| 769-1024px | Tablets | 3-column grid, side navigation |

### Key Responsive Patterns
- **Product Grid**: 2 columns on phone, 3-4 on tablet
- **Navigation**: Bottom tabs on phone, side rail on tablet
- **Product Details**: Stacked on phone, side-by-side on tablet
- **Chat**: Full screen on phone, split view on tablet
- **Forms**: Full width on phone, centered card on tablet

### Font Scaling
- Respect system font size settings
- Maximum scale factor: 1.5x
- Minimum touch target: 44x44px

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for large text
- **Touch Targets**: Minimum 44x44dp
- **Screen Reader**: All interactive elements labeled
- **Focus Management**: Logical tab order, visible focus indicators
- **Text Alternatives**: Alt text for all images
- **Motion**: Respect reduced motion preferences

### Specific Implementations
- Semantic headings structure
- Form labels associated with inputs
- Error announcements via live regions
- Image descriptions for products (auto-generated + manual)
- High contrast mode toggle
- Large text mode option
- Voice search for low-literacy users

---

## Performance Optimization

### Targets
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s on 3G
- Bundle size: < 10MB initial download
- Image load: Progressive with blur placeholder

### Strategies
- **Code Splitting**: Lazy load screens and heavy components
- **Image Optimization**: WebP format, responsive sizes, CDN delivery
- **List Virtualization**: FlatList with windowSize optimization for long product lists
- **Memoization**: React.memo for expensive product card renders
- **Prefetching**: Prefetch next page of products on scroll
- **Offline Cache**: Cache categories, recent products, and user data
- **Bundle Analysis**: Regular bundle size audits, tree-shaking unused code
- **Hermes Engine**: Use Hermes for faster JS execution on Android

---

## Error Handling

### Error Boundary Strategy
```
App Level Error Boundary
├── Navigation Error Boundary (per stack)
│   ├── Screen-level try/catch for async operations
│   └── Component-level error boundaries for critical UI
```

### Error Types & Handling

| Error Type | User-Facing Behavior |
|-----------|---------------------|
| Network Error | "No internet connection" banner + retry button |
| API 401 | Silent token refresh → retry, or redirect to login |
| API 404 | "Item not found" screen with back/home options |
| API 422 | Inline form validation errors |
| API 500 | "Something went wrong" screen with retry |
| Timeout | "Taking too long" message with retry |
| Payment Failure | Specific payment error message + alternative methods |

### Retry Strategy
- Auto-retry: 3 attempts with exponential backoff for network errors
- Manual retry: Button for user-initiated retry
- Queue failed mutations: Sync when back online (cart, wishlist)

---

## SEO and PWA Requirements

### PWA Features (Web Version)
- Service Worker for offline caching
- Web App Manifest
- Add to Home Screen prompt
- Background sync for pending actions
- Push notifications via Web Push API

### SEO (Web Version)
- Server-side rendering for product pages
- Dynamic meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD) for products
- Sitemap generation
- Canonical URLs
- Mobile-friendly viewport

### App Store Optimization (ASO)
- Keyword-optimized title and description
- Localized listings (Filipino, English)
- Screenshot optimization
- Regular rating prompts (after successful orders)
