# AgriPulse Marketplace — User Flows

## 1. Buyer Registration Flow

```
[App Open] → [Splash Screen (2s)]
    │
    ├── First Launch → [Onboarding Slides (3)]
    │                       │
    │                       ▼
    │               [Get Started Button]
    │                       │
    └── Returning → ────────┘
                            │
                            ▼
                    [Login/Register Screen]
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        [Phone OTP]   [Google]    [Facebook]
              │
              ▼
        [Enter Phone (+63)]
              │
              ▼
        [Receive SMS OTP]
              │
              ▼
        [Enter 6-digit OTP]
              │
              ├── Existing User → [Home Screen]
              │
              └── New User → [Complete Profile]
                                    │
                                    ▼
                            [Enter Name]
                                    │
                                    ▼
                            [Select Role]
                            ┌───┴───┐
                            ▼       ▼
                     [Consumer] [Farmer]
                         │         │
                         ▼         ▼
                    [Home]   [Farmer Onboarding]
```

### Key Decisions:
- Phone-first registration (most Filipino farmers use prepaid mobile)
- OTP instead of password (lower friction, higher security)
- Role selection upfront to personalize experience immediately

---

## 2. Farmer Registration Flow

```
[Select "I'm a Farmer" during registration]
    │
    ▼
[Step 1: Farm Details]
  - Farm name
  - Farm size (hectares)
  - Primary crops (multi-select)
  - Farming experience (years)
    │
    ▼
[Step 2: Farm Location]
  - Province (dropdown)
  - Municipality (dropdown, filtered)
  - Barangay (dropdown, filtered)
  - Optional: Pin on map
    │
    ▼
[Step 3: Verification Documents]
  - Upload valid government ID (camera/gallery)
  - Optional: Farm certification
  - Optional: DTI/Cooperative registration
  - Upload farm photo
    │
    ▼
[Step 4: Payout Setup]
  - Select payout method (GCash/Maya/Bank)
  - Enter account details
    │
    ▼
[Submission Confirmation]
  "Your application is under review.
   You'll be notified within 24-48 hours."
    │
    ▼
[Home Screen (Limited Access)]
  - Can browse marketplace
  - Cannot list products until verified
    │
    ▼ (After admin approval)
[Push Notification: "Congratulations! You're verified!"]
    │
    ▼
[Full Farmer Dashboard Access]
  - Can list products
  - Can receive orders
```

### Key Decisions:
- Multi-step form to avoid overwhelming low-tech users
- Progress indicator (Step 1 of 4)
- Allow browsing while pending verification
- Clear communication about verification timeline

---

## 3. Product Listing Flow (Farmer)

```
[Farmer Dashboard] → [My Products] → [+ Add Product]
    │
    ▼
[Step 1: Basic Info]
  - Product name
  - Category (dropdown) → Subcategory
  - Description (textarea with tips)
    │
    ▼
[Step 2: Photos]
  - Take photo (camera)
  - Or choose from gallery
  - Upload 1-8 images
  - Drag to reorder
  - Set primary image (first = primary)
    │
    ▼
[Step 3: Pricing & Stock]
  - Price per unit
  - Select unit (kg, piece, bundle, sack, crate)
  - Available quantity
  - Minimum order quantity
  - Harvest date (date picker)
  - Is organic? (toggle)
    │
    ▼
[Preview Product Listing]
  - Shows how buyers will see it
  - [Edit] or [Publish]
    │
    ▼
[Product Published! 🎉]
  - Option: Share to Facebook/Messenger
  - [View Listing] or [Add Another]
```

### Key Decisions:
- Camera-first for photo upload (farmers photograph from field)
- Preview before publishing builds confidence
- Social sharing built-in for organic promotion
- Simple pricing model (one price, one unit)

---

## 4. Browsing Products Flow (Buyer)

```
[Home Screen]
    │
    ├── [Search Bar] → [Type query] → [Auto-suggest] → [Results]
    │
    ├── [Category Grid] → [Select Category] → [Filtered Products]
    │
    ├── [Banner Carousel] → [Promo/Featured Products]
    │
    ├── [Nearby Farmers Section] → [Location-based products]
    │
    └── [Trending/Seasonal Section] → [Popular items]
            │
            ▼
    [Product Grid/List]
      - Toggle grid (2-col) / list view
      - Sort: Relevance, Price ↑↓, Rating, Newest
      - Filter: Price range, Organic, Province, Rating
      - Infinite scroll pagination
            │
            ▼
    [Tap Product Card]
            │
            ▼
    [Product Detail Page]
      - Image gallery (swipe)
      - Product name, price, unit
      - Harvest date, freshness indicator
      - Farmer info (tap to view profile)
      - Description
      - Reviews section
      - Related products
            │
      ┌─────┼─────┐
      ▼     ▼     ▼
  [Add to  [♥    [💬 Chat
   Cart]  Save]  Farmer]
```

### Key Decisions:
- Multiple discovery paths (search, browse, recommendations)
- Freshness indicator is unique selling point
- One-tap add to cart from product detail
- Easy farmer profile access to build trust

---

## 5. Checkout Flow

```
[Cart Screen]
  - Review items (quantity edit, remove)
  - See subtotal per seller
  - See total summary
    │
    ▼
[Tap "Checkout" Button]
    │
    ▼
[Select/Confirm Delivery Address]
  ├── Use default address
  ├── Choose from saved addresses
  └── Add new address
    │
    ▼
[Select Delivery Schedule]
  - Choose delivery date (calendar)
  - Choose time slot (Morning/Afternoon/Evening)
    │
    ▼
[Select Payment Method]
  ├── GCash
  ├── Maya
  ├── Bank Transfer
  ├── Credit/Debit Card
  └── Cash on Delivery
    │
    ▼
[Apply Promo Code] (optional)
  - Enter code → validate → show discount
    │
    ▼
[Order Summary]
  - Items breakdown
  - Subtotal
  - Delivery fee
  - Service fee
  - Discount (if applicable)
  - TOTAL (highlighted)
  - Special instructions (optional text)
    │
    ▼
[Tap "Place Order"]
    │
    ├── COD → [Order Confirmed! ✓]
    │
    └── Digital Payment → [Redirect to Payment Gateway]
                                │
                          ┌─────┴─────┐
                          ▼           ▼
                    [Payment     [Payment
                     Success]     Failed]
                        │           │
                        ▼           ▼
                  [Order       [Retry or Choose
                  Confirmed!]   Different Method]
```

### Key Decisions:
- Linear checkout (no tabs/accordion) for simplicity
- Address confirmation before payment selection
- Clear fee breakdown for transparency
- Payment failure recovery path

---

## 6. Payments Flow

```
[Order Placed with Digital Payment]
    │
    ▼
[Payment Intent Created (Backend)]
    │
    ▼
[Redirect to Payment Gateway UI]
    │
    ├── GCash: Open GCash app → Confirm → Return
    ├── Maya: Open Maya app → Confirm → Return
    ├── Bank: Select bank → Login → Authorize → Return
    └── Card: Enter details → 3DS verification → Return
    │
    ▼
[Payment Webhook Received (Backend)]
    │
    ├── Success → [Update Order Status: "Confirmed"]
    │              [Send confirmation to buyer (Push + SMS)]
    │              [Notify farmer(s) of new order]
    │
    └── Failed → [Update Order Status: "Payment Failed"]
                 [Show retry option to buyer]
                 [Release reserved inventory]
    │
    ▼ (After delivery confirmation)
[Funds Released to Farmer]
  - Commission deducted (3-5%)
  - Net amount credited to payout account
  - Farmer notified of payout
```

### Key Decisions:
- Escrow model — funds held until delivery confirmed
- Multiple payment options for broad accessibility
- COD option critical for farmer/rural adoption
- Daily automatic payouts for farmer trust

---

## 7. Order Tracking Flow

```
[Orders Tab] → [Select Active Order]
    │
    ▼
[Order Detail Screen]
    │
    ▼
[Order Timeline / Status Tracker]

  ○ Order Placed ─────── July 6, 10:30 AM ✓
  │
  ○ Payment Confirmed ── July 6, 10:32 AM ✓
  │
  ○ Farmer Confirmed ─── July 6, 11:00 AM ✓
  │
  ○ Harvesting ────────── July 7, 6:00 AM ✓
  │
  ● Being Packed ──────── July 7, 2:00 PM (current)
  │
  ○ In Transit ────────── Estimated July 8
  │
  ○ Delivered ─────────── Estimated July 8, 8AM-12PM

    │
    ▼ (When "In Transit")
[Live Map Tracking]
  - Map with delivery route
  - Courier current location (pin)
  - ETA countdown
  - Courier name and phone (tap to call)
    │
    ▼ (When "Delivered")
[Delivery Confirmation]
  - Photo proof of delivery shown
  - [Confirm Received] button
  - Option to report issue
    │
    ▼
[Rate & Review Prompt]
  - Star rating
  - Written review
  - Photo upload (optional)
  - Submit
```

---

## 8. Product Reviews Flow

```
[Order Delivered] → [Push: "How was your order? Rate now!"]
    │
    ▼
[Order Detail] → [Rate & Review Button]
    │
    ▼
[Review Screen]
  - Product image + name
  - Star rating (tap 1-5 stars)
  - Comment textbox
  - Add photos (optional, up to 5)
  - Toggle: "Post anonymously"
  - [Submit Review]
    │
    ▼
[Review Published! Thank you 🙏]
    │
    ▼ (Farmer receives notification)
[Farmer can reply to review]
  - [Reply] button on review
  - Type response
  - Submit → visible to all
```

---

## 9. Farmer Dashboard Flow

```
[Farmer Tab / Dashboard Icon]
    │
    ▼
[Dashboard Home]
  ┌─────────────────────────────────┐
  │ Revenue This Month: ₱15,250    │
  │ Pending Orders: 3               │
  │ Rating: ★ 4.8                   │
  │ [Revenue Chart - Last 30 days]  │
  └─────────────────────────────────┘
    │
    ├── [Pending Orders] → [Order List (pending)]
    │     │
    │     ▼
    │   [Order Detail]
    │     - [Confirm Order] → Status: Harvesting
    │     - [Mark as Packed] → Status: Packed
    │     - [Hand to Courier] → Status: In Transit
    │
    ├── [My Products] → [Product List]
    │     ├── [+ Add New]
    │     ├── [Edit Product]
    │     ├── [Toggle Active/Inactive]
    │     └── [Delete Product]
    │
    ├── [Analytics] → [Performance Page]
    │     - Top selling products
    │     - Revenue by product
    │     - Customer demographics
    │     - Rating breakdown
    │
    └── [Payouts] → [Payout History]
          - List of payouts with dates
          - Pending balance
          - Commission breakdown
          - [Update Payout Method]
```

---

## 10. Admin Management Flow

```
[Admin Login] → [Admin Dashboard]
    │
    ├── [Overview]
    │     - Total users, orders, revenue cards
    │     - Growth charts
    │     - Real-time activity feed
    │
    ├── [Farmer Verification Queue]
    │     │
    │     ▼
    │   [Verification List (Pending)]
    │     │
    │     ▼
    │   [Review Application]
    │     - View submitted documents
    │     - View farm details
    │     - [Approve] → Farmer gets verified badge
    │     - [Reject + Reason] → Farmer notified to resubmit
    │
    ├── [User Management]
    │     - Search/filter users
    │     - View user details
    │     - Suspend/Ban account
    │     - Change role
    │
    ├── [Order Management]
    │     - View all orders
    │     - Handle disputes
    │     - Process refunds
    │
    ├── [Product Moderation]
    │     - Reported products
    │     - Remove inappropriate listings
    │
    ├── [Analytics]
    │     - Platform-wide metrics
    │     - Revenue reports
    │     - User growth charts
    │     - Export reports (CSV)
    │
    └── [Settings]
          - Category management
          - Promo code creation
          - Delivery zone configuration
          - Commission rate settings
```

---

## 11. Notifications Flow

```
[Notification Event Triggered (Backend)]
    │
    ▼
[Notification Dispatched]
  ├── Push notification (device)
  ├── In-app notification (stored)
  └── SMS (critical only)
    │
    ▼
[User Receives Notification]
    │
    ├── From Push → Tap → Deep link to relevant screen
    │
    └── From In-App → [Bell Icon Badge Count]
                           │
                           ▼
                    [Notification Center]
                      - Grouped by type
                      - Unread highlighted
                      - Tap → Navigate to context
                      - Swipe → Mark as read
                      - [Mark All Read] button

Notification Types & Deep Links:
  - Order update → Order detail screen
  - New message → Chat room
  - Price drop → Product detail
  - New review → Review on farmer dashboard
  - Verification result → Farmer profile
  - Payout processed → Payout history
  - Promotion → Promo product listing
```

---

## 12. Chat System Flow

```
[Buyer on Product Page] → [💬 Chat with Farmer]
    │
    ▼
[Chat Room Opens]
  - Product reference card at top
  - Message input at bottom
  - Send text messages
  - Send images (camera/gallery)
  - Send product links
    │
    ▼
[Real-time Message Exchange]
  - Messages appear instantly (WebSocket)
  - Typing indicator shown
  - Read receipts (blue ticks)
  - Online/offline status of farmer
    │
    ▼
[Farmer Replies]
  - Buyer gets push notification
  - Unread badge on chat tab
    │
    ▼
[Conversation Continues]
  - Chat history preserved
  - Accessible from Chat tab (list of conversations)
  - Search within conversations
  - Can start order from chat context

Chat List Screen:
  - All conversations sorted by last message
  - Farmer avatar + name
  - Last message preview + time
  - Unread count badge
  - Tap → Open chat room
```

### Key Decisions:
- Product context maintained in chat (what they're asking about)
- Real-time with offline message queuing
- Image sharing for quality confirmation (farmer sends fresh photos)
- Simple interface suitable for low-tech users
