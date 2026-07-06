# AgriPulse Marketplace — Wireframes & Page Descriptions

## 1. Splash Screen

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│      [AgriPulse Logo]   │
│                         │
│   "The Heartbeat of     │
│    Smarter Farming."    │
│                         │
│      [Loading...]       │
│                         │
│                         │
└─────────────────────────┘
```

**Components**:
- Centered AgriPulse logo (animated fade-in)
- Tagline below logo
- Loading indicator (subtle pulse animation)
- Green gradient background (#2E7D32 → #4CAF50)
- Duration: 2 seconds, then auto-navigate

---

## 2. Onboarding (3 Slides)

```
┌─────────────────────────┐
│  [Skip]                 │
│                         │
│   [Illustration:        │
│    Farmer with phone]   │
│                         │
│  "Farm to Market"       │
│  Sell your produce      │
│  directly to buyers     │
│  at fair prices.        │
│                         │
│      ● ○ ○              │
│                         │
│     [Next →]            │
└─────────────────────────┘
```

**Slide 1**: Farm to Market — Farmer illustration
**Slide 2**: Fresh & Direct — Consumer receiving produce
**Slide 3**: Fair Prices — Price comparison visual

**Components**:
- Full-screen illustration (60% of screen)
- Title (heading-lg, bold)
- Description (body-lg, neutral-600)
- Dot indicators (active = primary-800)
- Skip button (top-right, ghost)
- Next/Get Started button (bottom, primary)

---

## 3. Login Screen

```
┌─────────────────────────┐
│                         │
│     [AgriPulse Logo]    │
│                         │
│  Welcome back!          │
│                         │
│  ┌───────────────────┐  │
│  │ +63 | Phone Number│  │
│  └───────────────────┘  │
│                         │
│  [  Send OTP Code   ]   │
│                         │
│  ─── or continue with ──│
│                         │
│  [G] Google  [f] Facebook│
│                         │
│  Don't have an account? │
│  Register here           │
│                         │
└─────────────────────────┘
```

**Components**:
- Logo at top (smaller than splash)
- Welcome heading
- Phone input with +63 country prefix
- Primary CTA: Send OTP Code
- Divider with "or continue with"
- Social login buttons (Google, Facebook)
- Register link at bottom
- Keyboard-aware layout (input moves up)

---

## 4. Register Screen

```
┌─────────────────────────┐
│ ←  Create Account       │
│                         │
│  ┌───────────────────┐  │
│  │ First Name        │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Last Name         │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ +63 | Phone       │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Email (optional)  │  │
│  └───────────────────┘  │
│                         │
│  I am a:                │
│  [Consumer] [Farmer]    │
│  [Restaurant] [Grocery] │
│                         │
│  ☐ I agree to Terms     │
│                         │
│  [  Create Account   ]  │
└─────────────────────────┘
```

**Components**:
- Back navigation arrow
- Form inputs (floating labels)
- Role selector (chip/pill selection)
- Terms checkbox with link
- Create Account primary button
- Form scrollable if keyboard open

---

## 5. Home Screen

```
┌─────────────────────────┐
│ 📍 Manila  [🔔3] [🛒2] │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 🔍 Search produce...│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │  [Banner Carousel]  │ │
│ │  "Fresh Picks This  │ │
│ │   Week — Up to 20%  │ │
│ │   Off!"             │ │
│ │      ● ○ ○          │ │
│ └─────────────────────┘ │
│                         │
│ Categories              │
│ [🥬][🍎][🌾][🥕][🐔][→]│
│ Veg  Fruit Rice Root Meat│
│                         │
│ Nearby Farmers    See all│
│ ┌──────┐ ┌──────┐      │
│ │[Ava] │ │[Ava] │      │
│ │Farm1 │ │Farm2 │      │
│ │★4.8  │ │★4.6  │      │
│ └──────┘ └──────┘      │
│                         │
│ Fresh Today      See all│
│ ┌─────┐ ┌─────┐        │
│ │[img]│ │[img]│        │
│ │Tomato│ │Mango│        │
│ │₱85/kg│ │₱120 │        │
│ │★4.7 │ │★4.5 │        │
│ └─────┘ └─────┘        │
│                         │
├─────────────────────────┤
│ 🏠  🛍️  🛒  📦  👤    │
│Home Mkt Cart Orders Me  │
└─────────────────────────┘
```

**Components**:
- Top bar: Location, notifications (badge), cart (badge)
- Prominent search bar
- Banner carousel (auto-scroll, 5s interval)
- Category horizontal scroll (icons + labels)
- Nearby farmers horizontal cards
- Fresh Today product grid (2 columns)
- Bottom tab navigation (5 tabs)

---

## 6. Marketplace Screen

```
┌─────────────────────────┐
│ ← Marketplace    [⊞][≡]│
├─────────────────────────┤
│ [🔍 Search...]   [Filter]│
│                         │
│ [All][Veg][Fruit][Rice] │
│ (category chip scroll)  │
│                         │
│ Sort: Relevance ▼  234  │
│                 products│
│                         │
│ ┌─────┐ ┌─────┐        │
│ │[img]│ │[img]│        │
│ │♥    │ │♥    │        │
│ │Name │ │Name │        │
│ │₱85  │ │₱120 │        │
│ │★4.7 │ │★4.5 │        │
│ │📍Ben│ │📍Pam│        │
│ │[Add]│ │[Add]│        │
│ └─────┘ └─────┘        │
│ ┌─────┐ ┌─────┐        │
│ │[img]│ │[img]│        │
│ │...  │ │...  │        │
│ └─────┘ └─────┘        │
│                         │
│ [Loading more...]       │
├─────────────────────────┤
│ 🏠  🛍️  🛒  📦  👤    │
└─────────────────────────┘
```

**Components**:
- Grid/list view toggle
- Search with filter button
- Category chips (horizontal scroll)
- Sort dropdown
- Product count
- Product grid (2 columns, infinite scroll)
- Each card: image, wishlist heart, name, price, rating, location, add-to-cart
- Loading indicator at bottom

---

## 7. Search Screen

```
┌─────────────────────────┐
│ ← [🔍 tomatoes    ][X]  │
├─────────────────────────┤
│                         │
│ Recent Searches         │
│  🕐 mangoes             │
│  🕐 organic vegetables  │
│  🕐 rice nueva ecija    │
│                         │
│ ─── After typing: ───   │
│                         │
│ Suggestions:            │
│  🔍 tomatoes benguet    │
│  🔍 cherry tomatoes     │
│  🔍 tomato sauce        │
│                         │
│ ─── After search: ───   │
│                         │
│ "tomatoes" — 45 results │
│                         │
│ [Filter] [Sort ▼]       │
│                         │
│ ┌─────┐ ┌─────┐        │
│ │[Product Grid]│        │
│ └─────┘ └─────┘        │
│                         │
└─────────────────────────┘
```

**Components**:
- Auto-focus search input
- Clear button (X)
- Recent searches (clock icon, tappable)
- Auto-suggest as user types
- Results with filter/sort
- Empty state if no results ("No products found. Try different keywords.")

---

## 8. Categories Screen

```
┌─────────────────────────┐
│ ← Categories            │
├─────────────────────────┤
│                         │
│ ┌──────┐ ┌──────┐      │
│ │ 🥬   │ │ 🍎   │      │
│ │Vegeta│ │Fruits │      │
│ │bles  │ │       │      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │ 🌾   │ │ 🥕   │      │
│ │Rice & │ │Root  │      │
│ │Grains│ │Crops │      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │ 🐔   │ │ 🐟   │      │
│ │Poultry│ │Sea-  │      │
│ │& Meat│ │food  │      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │ 🌿   │ │ 🥚   │      │
│ │Herbs │ │Dairy │      │
│ │& Spice│ │& Eggs│      │
│ └──────┘ └──────┘      │
│                         │
└─────────────────────────┘
```

**Components**:
- 2-column grid of category cards
- Each card: icon, category name
- Tap → shows subcategories or product list
- Clean, visual navigation

---

## 9. Product Details Screen

```
┌─────────────────────────┐
│ ← [Share] [♥] [🛒2]    │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   [Product Image    │ │
│ │    Gallery]         │ │
│ │                     │ │
│ │      ● ○ ○ ○       │ │
│ └─────────────────────┘ │
│                         │
│ Fresh Tomatoes          │
│ ₱85.00 / kg            │
│ ★ 4.7 (23 reviews)     │
│ 🌿 Organic  📅 Jul 4   │
│                         │
│ ─────────────────────── │
│ Farmer:                 │
│ [👤] Tonyo's Farm ✓     │
│      📍 Benguet         │
│      ★ 4.8 │ [Visit]   │
│ ─────────────────────── │
│                         │
│ Description             │
│ Vine-ripened tomatoes   │
│ from Benguet highlands..│
│ [Read more]             │
│                         │
│ ─────────────────────── │
│ Reviews (23)    See all │
│ [Review cards...]       │
│                         │
│ Related Products        │
│ [horizontal scroll]     │
│                         │
├─────────────────────────┤
│ [-] 1 kg [+]  [Add ₱85]│
└─────────────────────────┘
```

**Components**:
- Image gallery (swipeable, dot indicators)
- Product name (heading-lg)
- Price with unit (price-lg, accent)
- Rating with review count
- Badges (organic, freshness)
- Farmer info card (avatar, name, verified badge, location)
- Visit farmer profile button
- Description (expandable)
- Reviews section (2-3 preview cards)
- Related products (horizontal scroll)
- Sticky bottom bar: quantity selector + Add to Cart button
- Chat with farmer FAB (floating action button)

---

## 10. Cart Screen

```
┌─────────────────────────┐
│ ← My Cart (3 items)     │
├─────────────────────────┤
│                         │
│ 🌾 Tonyo's Farm         │
│ ┌─────────────────────┐ │
│ │[img] Tomatoes       │ │
│ │      ₱85/kg         │ │
│ │      [-] 5 kg [+]   │ │
│ │      Subtotal: ₱425 │ │
│ │               [🗑️]  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[img] Eggplant       │ │
│ │      ₱60/kg         │ │
│ │      [-] 3 kg [+]   │ │
│ │      Subtotal: ₱180 │ │
│ │               [🗑️]  │ │
│ └─────────────────────┘ │
│                         │
│ 🌾 Maria's Garden       │
│ ┌─────────────────────┐ │
│ │[img] Lettuce        │ │
│ │      ₱120/kg        │ │
│ │      [-] 2 kg [+]   │ │
│ │      Subtotal: ₱240 │ │
│ │               [🗑️]  │ │
│ └─────────────────────┘ │
│                         │
│ ─────────────────────── │
│ Subtotal:       ₱845.00 │
│ Delivery (est): ₱100.00 │
│ ─────────────────────── │
│ Total:          ₱945.00 │
│                         │
├─────────────────────────┤
│ [ Checkout (₱945.00) ]  │
└─────────────────────────┘
```

**Components**:
- Grouped by seller/farmer
- Each item: thumbnail, name, price/unit, quantity selector, subtotal, delete
- Summary section: subtotal, estimated delivery, total
- Checkout CTA button (fixed bottom, shows total)
- Empty state: illustration + "Your cart is empty" + Browse button

---

## 11. Checkout Screen

```
┌─────────────────────────┐
│ ← Checkout              │
├─────────────────────────┤
│                         │
│ 📍 Delivery Address     │
│ ┌─────────────────────┐ │
│ │ Home (Default) ✓    │ │
│ │ Juan Dela Cruz      │ │
│ │ 123 Main St, Brgy   │ │
│ │ Quezon City, MM     │ │
│ │           [Change]  │ │
│ └─────────────────────┘ │
│                         │
│ 📅 Delivery Schedule    │
│ ┌─────────────────────┐ │
│ │ Date: July 8, 2026  │ │
│ │ Time: 8AM - 12PM    │ │
│ │           [Change]  │ │
│ └─────────────────────┘ │
│                         │
│ 💳 Payment Method       │
│ ┌─────────────────────┐ │
│ │ ○ GCash             │ │
│ │ ○ Maya              │ │
│ │ ○ Bank Transfer     │ │
│ │ ● Cash on Delivery  │ │
│ └─────────────────────┘ │
│                         │
│ 🏷️ Promo Code          │
│ ┌──────────────┐[Apply] │
│ │ Enter code   │        │
│ └──────────────┘        │
│                         │
│ Order Summary           │
│ Items (3):      ₱845.00 │
│ Delivery:       ₱100.00 │
│ Service Fee:     ₱50.00 │
│ Discount:       -₱0.00  │
│ ─────────────────────── │
│ TOTAL:          ₱995.00 │
│                         │
│ 📝 Special instructions │
│ ┌─────────────────────┐ │
│ │ Add notes...        │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [  Place Order ₱995  ]  │
└─────────────────────────┘
```

**Components**:
- Address card (changeable)
- Delivery schedule picker
- Payment method radio selection
- Promo code input + apply
- Order summary (all fees broken down)
- Special instructions textarea
- Place Order CTA (fixed bottom)

---

## 12. Orders Screen

```
┌─────────────────────────┐
│ My Orders               │
├─────────────────────────┤
│ [Active] [Completed]    │
│ [Cancelled]             │
│                         │
│ ┌─────────────────────┐ │
│ │ #AP-20260706-001    │ │
│ │ July 6 │ ●In Transit│ │
│ │─────────────────────│ │
│ │[img][img] +1 more   │ │
│ │                     │ │
│ │ Total: ₱995.00      │ │
│ │ [Track]  [Details]  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ #AP-20260705-003    │ │
│ │ July 5 │ ●Confirmed │ │
│ │─────────────────────│ │
│ │[img] Fresh Tomatoes │ │
│ │                     │ │
│ │ Total: ₱425.00      │ │
│ │ [Cancel] [Details]  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Completed tab:      │ │
│ │ [Reorder] [Review]  │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 🏠  🛍️  🛒  📦  👤    │
└─────────────────────────┘
```

**Components**:
- Tab filter: Active / Completed / Cancelled
- Order cards with: number, date, status badge, product thumbnails, total
- Action buttons vary by status (Track, Cancel, Reorder, Review)
- Empty state per tab

---

## 13. Notifications Screen

```
┌─────────────────────────┐
│ ← Notifications [Read all]│
├─────────────────────────┤
│                         │
│ Today                   │
│ ┌─────────────────────┐ │
│ │● 📦 Order Shipped   │ │
│ │  Your order #001 is │ │
│ │  on its way!        │ │
│ │  2 hours ago        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │● 💬 New Message     │ │
│ │  Tonyo's Farm: "Yes │ │
│ │  po, available!"    │ │
│ │  3 hours ago        │ │
│ └─────────────────────┘ │
│                         │
│ Yesterday               │
│ ┌─────────────────────┐ │
│ │○ 🏷️ Price Drop     │ │
│ │  Mangoes now ₱100/kg│ │
│ │  (was ₱130)         │ │
│ │  1 day ago          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │○ ✅ Order Delivered  │ │
│ │  Rate your purchase │ │
│ │  1 day ago          │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

**Components**:
- Mark all as read button
- Grouped by date (Today, Yesterday, This Week)
- Each notification: unread indicator (●), icon, title, preview, time
- Tap → deep link to relevant screen
- Swipe left to delete

---

## 14. Chat Screen

```
┌─────────────────────────┐
│ ← Tonyo's Farm  ●Online│
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ RE: Fresh Tomatoes  │ │
│ │ ₱85/kg  [View]      │ │
│ └─────────────────────┘ │
│                         │
│         Hi po! Available│
│         pa ba yung      │
│         tomatoes?       │
│              10:30 AM ✓✓│
│                         │
│ Yes po, available!      │
│ Bagong harvest kahapon. │
│ 10:32 AM                │
│                         │
│         Okay sige po,   │
│         I'll order 5kg  │
│              10:33 AM ✓✓│
│                         │
│ Salamat po! 🙏          │
│ 10:34 AM                │
│                         │
│                         │
├─────────────────────────┤
│ [📷] [Type message...  ]│
│                    [➤]  │
└─────────────────────────┘
```

**Components**:
- Header: Farmer name, online status, back button
- Product reference card (linked product context)
- Message bubbles (right = self, left = other)
- Timestamps
- Read receipts (✓✓)
- Input bar: camera button, text input, send button
- Support for images in chat

---

## 15. Profile Screen

```
┌─────────────────────────┐
│ Profile                 │
├─────────────────────────┤
│                         │
│     [Avatar Photo]      │
│     Juan Dela Cruz      │
│     +63 917 123 4567    │
│     [Edit Profile]      │
│                         │
│ ─────────────────────── │
│                         │
│ 📍 My Addresses      →  │
│ ♥  My Wishlist (12)  →  │
│ ⭐ My Reviews        →  │
│ 🌙 Dark Mode     [toggle]│
│ 🌐 Language: English →  │
│ 🔔 Notifications     →  │
│ ❓ Help & Support    →  │
│ 📋 Terms & Privacy   →  │
│ ℹ️  About AgriPulse   →  │
│                         │
│ [  Log Out  ]           │
│                         │
│ v1.0.0                  │
│                         │
├─────────────────────────┤
│ 🏠  🛍️  🛒  📦  👤    │
└─────────────────────────┘
```

**Components**:
- User avatar (tappable to change)
- Name and phone display
- Edit profile button
- Menu items with icons and arrows
- Dark mode toggle inline
- Language selector
- Logout button (danger style)
- App version at bottom

---

## 16. Farmer Dashboard

```
┌─────────────────────────┐
│ 🌾 Farmer Dashboard     │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ Revenue This Month  │ │
│ │ ₱15,250.00     ↑12% │ │
│ └─────────────────────┘ │
│                         │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │ 3  │ │ 18 │ │4.8 │   │
│ │Pend│ │Prod│ │★   │   │
│ │ing │ │ucts│ │Rate│   │
│ └────┘ └────┘ └────┘   │
│                         │
│ ┌─────────────────────┐ │
│ │ [Revenue Line Chart]│ │
│ │ Last 30 days        │ │
│ └─────────────────────┘ │
│                         │
│ Pending Orders          │
│ ┌─────────────────────┐ │
│ │ Order #001          │ │
│ │ 5kg Tomatoes ₱425   │ │
│ │ [Confirm] [Reject]  │ │
│ └─────────────────────┘ │
│                         │
│ Quick Actions           │
│ [+ Add Product]         │
│ [View All Orders]       │
│ [View Payouts]          │
│                         │
└─────────────────────────┘
```

**Components**:
- Revenue highlight card (current month + growth %)
- Stats row: pending orders, active products, rating
- Revenue chart (line chart, 30 days)
- Pending orders with quick actions (Confirm/Reject)
- Quick action buttons
- Pull to refresh

---

## 17. Product Management (Farmer)

```
┌─────────────────────────┐
│ ← My Products  [+ Add]  │
├─────────────────────────┤
│ [Active(15)] [Inactive(3)]│
│                         │
│ ┌─────────────────────┐ │
│ │[img] Fresh Tomatoes │ │
│ │      ₱85/kg │Active │ │
│ │      Stock: 500kg   │ │
│ │      Sold: 1,200    │ │
│ │      ★ 4.7 (23)     │ │
│ │ [Edit] [⊘ Deactivate]│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │[img] Eggplant       │ │
│ │      ₱60/kg │Active │ │
│ │      Stock: 200kg   │ │
│ │      ⚠️ Low stock    │ │
│ │ [Edit] [⊘ Deactivate]│ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

**Components**:
- Add product FAB/button
- Tab filter: Active / Inactive
- Product list with: thumbnail, name, price, status, stock, sales, rating
- Low stock warning badge
- Actions: Edit, Deactivate/Activate, Delete
- Search within own products

---

## 18. Admin Dashboard

```
┌──────────────────────────────────────────┐
│ AgriPulse Admin           [👤 Admin]     │
├──────────┬───────────────────────────────┤
│          │                               │
│ Dashboard│  Platform Overview            │
│ Users    │  ┌──────┐┌──────┐┌──────┐    │
│ Farmers  │  │30,000││5,200 ││₱45M  │    │
│ Products │  │Users ││Farmer││GMV   │    │
│ Orders   │  └──────┘└──────┘└──────┘    │
│ Verify   │                               │
│ Payments │  ┌────────────────────────┐   │
│ Analytics│  │  [Growth Line Chart]   │   │
│ Settings │  │  Users & Orders        │   │
│          │  └────────────────────────┘   │
│          │                               │
│          │  Pending Verification (23)    │
│          │  ┌────────────────────────┐   │
│          │  │ Mang Tonyo - Nueva Ecija│   │
│          │  │ Submitted: July 5      │   │
│          │  │ [Review] [Approve]     │   │
│          │  └────────────────────────┘   │
│          │                               │
│          │  Recent Activity              │
│          │  • New farmer registration    │
│          │  • Order dispute #045         │
│          │  • Product reported           │
│          │                               │
└──────────┴───────────────────────────────┘
```

**Components** (Web-based responsive layout):
- Side navigation menu
- Stats cards row (users, farmers, GMV, orders)
- Growth chart
- Pending verification queue (quick actions)
- Recent activity feed
- Admin user menu (top-right)
- Responsive: collapses to hamburger menu on mobile

---

## Design Notes

### Empty States
Every screen has a thoughtful empty state:
- **Cart empty**: Basket illustration + "Your cart is empty" + Browse button
- **No orders**: Package illustration + "No orders yet" + Start shopping
- **No notifications**: Bell illustration + "All caught up!"
- **No search results**: Magnifying glass + "No products found" + suggestions
- **No products (farmer)**: Sprout illustration + "List your first product!" + Add button

### Loading States
- Skeleton screens for product grids and lists
- Shimmer animation on skeleton placeholders
- Inline spinners for button actions
- Pull-to-refresh on all list screens

### Error States
- Network error: Cloud-offline illustration + "No internet" + Retry button
- Server error: Server illustration + "Something went wrong" + Retry
- Not found: 404 illustration + "Page not found" + Go Home

### Accessibility Considerations
- All wireframes assume minimum 44px touch targets
- High contrast text on all backgrounds
- Icon + text for all navigation items
- Sufficient spacing between interactive elements
- Large text variants available via system settings
