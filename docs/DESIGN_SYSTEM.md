# AgriPulse Marketplace — Design System

## Brand Identity

- **Company Name**: AgriPulse
- **Tagline**: "The Heartbeat of Smarter Farming."
- **Theme**: Modern agricultural marketplace — fresh, trustworthy, accessible
- **Design Feel**: Shopee + Lazada + GrabFood + Modern Agriculture
- **Logo**: Green gradient with agricultural motifs (fields, sun, tractor), combining technology with nature

---

## Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | #E8F5E9 | Light backgrounds, hover states |
| `primary-100` | #C8E6C9 | Borders, dividers |
| `primary-200` | #A5D6A7 | Disabled states |
| `primary-300` | #81C784 | Secondary buttons |
| `primary-400` | #66BB6A | Icons, links |
| `primary-500` | #4CAF50 | Secondary brand color |
| `primary-600` | #43A047 | Button hover |
| `primary-700` | #388E3C | Active states |
| `primary-800` | #2E7D32 | **Primary brand color** |
| `primary-900` | #1B5E20 | Dark text on light bg |

### Secondary/Accent Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-300` | #FFF176 | Highlights |
| `accent-400` | #FFEE58 | Badges, tags |
| `accent-500` | #F9A825 | **Accent color** — CTAs, prices, promotions |
| `accent-600` | #F57F17 | Hover on accent |
| `accent-700` | #E65100 | Urgent alerts |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | #F8F9FA | **Page background** |
| `neutral-100` | #F1F3F5 | Card backgrounds |
| `neutral-200` | #E9ECEF | Borders |
| `neutral-300` | #DEE2E6 | Disabled text |
| `neutral-400` | #ADB5BD | Placeholder text |
| `neutral-500` | #6C757D | Secondary text |
| `neutral-600` | #495057 | Body text |
| `neutral-700` | #343A40 | Headings |
| `neutral-800` | #1F2937 | **Primary text** |
| `neutral-900` | #111827 | High emphasis text |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | #2E7D32 | Success states, verified badges |
| `warning` | #F9A825 | Warnings, low stock |
| `error` | #D32F2F | Errors, destructive actions |
| `info` | #1976D2 | Informational messages |
| `organic` | #558B2F | Organic product badge |
| `fresh` | #00897B | Freshness indicator |

---

## Typography

### Font Family
- **Primary**: Inter (Google Fonts) — clean, modern, highly legible
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'JetBrains Mono' (for prices, order numbers)

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display-lg` | 32px | 700 | 40px | Hero headlines |
| `display-md` | 28px | 700 | 36px | Page titles |
| `heading-lg` | 24px | 600 | 32px | Section headers |
| `heading-md` | 20px | 600 | 28px | Card titles |
| `heading-sm` | 18px | 600 | 24px | Subsections |
| `body-lg` | 16px | 400 | 24px | Primary body text |
| `body-md` | 14px | 400 | 20px | Secondary body, descriptions |
| `body-sm` | 12px | 400 | 16px | Captions, metadata |
| `label` | 14px | 500 | 20px | Form labels, buttons |
| `caption` | 11px | 400 | 14px | Timestamps, fine print |
| `price-lg` | 24px | 700 | 28px | Product price (primary) |
| `price-md` | 18px | 600 | 24px | Cart/list price |
| `price-sm` | 14px | 600 | 18px | Inline price |

---

## Spacing

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | No spacing |
| `space-1` | 4px | Tight inner padding |
| `space-2` | 8px | Icon gaps, compact spacing |
| `space-3` | 12px | Input padding, small gaps |
| `space-4` | 16px | Standard padding, card padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Card gaps, larger sections |
| `space-8` | 32px | Page margins (mobile) |
| `space-10` | 40px | Section separators |
| `space-12` | 48px | Large vertical spacing |
| `space-16` | 64px | Page top/bottom padding |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Sharp edges |
| `radius-sm` | 4px | Small buttons, tags |
| `radius-md` | 8px | Cards, inputs |
| `radius-lg` | 12px | Modals, dialogs |
| `radius-xl` | 16px | Bottom sheets |
| `radius-2xl` | 24px | Floating buttons |
| `radius-full` | 9999px | Pills, avatars, badges |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle lift |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.07) | Cards, elevated elements |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.10) | Dropdowns, popovers |
| `shadow-xl` | 0 20px 25px rgba(0,0,0,0.12) | Modals |
| `shadow-bottom` | 0 -2px 8px rgba(0,0,0,0.06) | Bottom navigation |
| `shadow-top` | 0 2px 8px rgba(0,0,0,0.06) | Sticky headers |

---

## Icons

### Icon Library: Phosphor Icons (Regular + Fill variants)
- Consistent 24px base size
- 1.5px stroke weight
- Green tint for agriculture-related icons
- Filled variants for selected/active states

### Custom Icons
| Icon | Description |
|------|-------------|
| Leaf | Organic indicator |
| Tractor | Farm/farmer |
| Sprout | Fresh produce |
| Scale | Weight/pricing |
| Basket | Cart/shopping |
| Sun | Harvest freshness |
| Map Pin | Location/delivery |
| Shield Check | Verified farmer |
| Pulse | AgriPulse brand icon |

---

## Buttons

### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | primary-800 | white | none | Main CTAs (Add to Cart, Buy Now) |
| Secondary | white | primary-800 | primary-800 | Secondary actions (View, Follow) |
| Accent | accent-500 | white | none | Promotions, urgency |
| Ghost | transparent | primary-800 | none | Tertiary actions |
| Danger | error | white | none | Destructive (Cancel, Delete) |
| Disabled | neutral-200 | neutral-400 | none | Inactive buttons |

### Sizes

| Size | Height | Font | Padding | Usage |
|------|--------|------|---------|-------|
| Small | 32px | 12px | 12px 16px | Compact areas, tags |
| Medium | 40px | 14px | 12px 20px | Standard buttons |
| Large | 48px | 16px | 14px 24px | Primary CTAs |
| XLarge | 56px | 16px | 16px 32px | Full-width CTAs |

### States
- Default → Hover (darken 10%) → Active (darken 20%) → Disabled (opacity 0.5)
- Focus: 3px outline with primary-200 ring
- Loading: Spinner replaces text, button disabled

---

## Inputs

### Text Input

| State | Border | Background | Label |
|-------|--------|-----------|-------|
| Default | neutral-200 | white | neutral-500 |
| Focus | primary-500 | white | primary-700 |
| Error | error | error-50 | error |
| Disabled | neutral-100 | neutral-50 | neutral-300 |
| Filled | neutral-300 | white | primary-700 |

### Input Specifications
- Height: 48px (large touch target)
- Border radius: radius-md (8px)
- Padding: 12px 16px
- Label: Floating label pattern (animates from placeholder to top)
- Helper text: 12px below input
- Error text: 12px below input, error color
- Icons: Left (prefix) or right (suffix), 20px size

### Input Types
- Text input
- Password (with show/hide toggle)
- Phone number (with +63 prefix)
- Number (with increment/decrement for quantities)
- Textarea (expandable)
- Select/Dropdown
- Date picker
- Search input (with clear button)
- OTP input (6 separate boxes)

---

## Cards

### Product Card
```
┌────────────────────────┐
│  [Image 4:3 ratio]     │
│  ♥ (wishlist overlay)  │
├────────────────────────┤
│  Product Name           │
│  ₱85.00/kg             │
│  ★ 4.7 (23 reviews)   │
│  📍 Benguet            │
│  🌿 Organic  ✓Verified │
│  [Add to Cart]          │
└────────────────────────┘
```
- Width: 50% of screen (2-column grid)
- Image: 4:3 aspect ratio, rounded top corners
- Shadow: shadow-md
- Border radius: radius-md
- Padding: space-3

### Order Card
```
┌────────────────────────────────────┐
│  Order #AP-20260706-001  │ Status │
│  ─────────────────────────────────│
│  [img] Product 1  ₱425.00        │
│  [img] Product 2  ₱300.00        │
│  ─────────────────────────────────│
│  Total: ₱825.00    [Track Order]  │
└────────────────────────────────────┘
```

### Farmer Card
```
┌────────────────────────────────────┐
│  [Avatar] Farm Name  ✓Verified    │
│           📍 Province              │
│           ★ 4.8 (89 reviews)      │
│           🌱 12 products           │
│                        [Follow]    │
└────────────────────────────────────┘
```

---

## Modals

### Bottom Sheet (Mobile-Primary Pattern)
- Rounded top corners (radius-xl)
- Handle bar: 40px × 4px, neutral-300, centered
- Max height: 85% of screen
- Backdrop: rgba(0,0,0,0.5)
- Animation: Slide up 300ms ease-out
- Swipe down to dismiss

### Dialog (Centered)
- Used for confirmations and alerts
- Max width: 320px
- Border radius: radius-lg
- Shadow: shadow-xl
- Backdrop: rgba(0,0,0,0.5)
- Actions: Right-aligned buttons

### Full-screen Modal
- Used for complex flows (checkout, product creation)
- Close button: Top-left X or "Back"
- No backdrop

---

## Navigation

### Bottom Tab Bar
- 5 tabs: Home, Marketplace, Cart, Orders, Profile
- Height: 64px (safe area aware)
- Active: primary-800 icon + label
- Inactive: neutral-400 icon + label
- Cart badge: accent-500 circle with count
- Shadow: shadow-bottom

### Top App Bar
- Height: 56px
- Left: Back arrow or hamburger
- Center: Screen title or logo
- Right: Action icons (Search, Notifications, Cart)
- Shadow: shadow-sm on scroll

### Search Bar (Home)
- Prominent search bar at top of home screen
- Height: 44px
- Border radius: radius-full
- Background: neutral-100
- Placeholder: "Search fresh produce..."
- Icon: Left-aligned search icon

---

## Dark Mode

### Color Mapping

| Light | Dark | Token |
|-------|------|-------|
| #F8F9FA (bg) | #121212 | surface-primary |
| #FFFFFF (card) | #1E1E1E | surface-secondary |
| #1F2937 (text) | #F8F9FA | text-primary |
| #6C757D (secondary) | #ADB5BD | text-secondary |
| #2E7D32 (primary) | #66BB6A | brand-primary |
| #F9A825 (accent) | #FDD835 | brand-accent |

### Dark Mode Rules
- System preference detection (auto switch)
- Manual toggle in settings
- All images maintain original colors
- Reduce shadow intensity (30% opacity reduction)
- Maintain WCAG contrast ratios

---

## Animations

### Micro-interactions
| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Button press | Scale down 0.95 | 100ms | ease-in-out |
| Card tap | Opacity 0.7 | 150ms | ease |
| Heart (wishlist) | Scale bounce 1.3 → 1.0 | 300ms | spring |
| Add to cart | Fly to cart icon | 400ms | ease-out |
| Pull to refresh | Spinner rotation | continuous | linear |
| Skeleton loading | Shimmer left→right | 1.5s | linear (repeat) |
| Tab switch | Fade + slide | 200ms | ease-out |
| Bottom sheet | Slide up | 300ms | ease-out |
| Toast notification | Slide down + fade | 300ms | spring |

### Page Transitions
- Forward navigation: Slide left (200ms)
- Back navigation: Slide right (200ms)
- Modal open: Fade + scale from 0.9 (300ms)
- Modal close: Fade + scale to 0.9 (200ms)

### Loading States
- Skeleton screens (not spinners) for content areas
- Inline spinners only for buttons and small actions
- Progressive image loading (blur-up technique)

---

## Accessibility Guidelines

### Color & Contrast
- Text contrast: minimum 4.5:1 (body), 3:1 (large text)
- Non-text contrast: minimum 3:1 for UI components
- Never rely on color alone to convey meaning (add icons/text)
- Color blindness safe: Use patterns/shapes alongside colors

### Touch & Interaction
- Minimum touch target: 44×44dp
- Touch targets spacing: minimum 8dp between
- Swipe gestures always have button alternatives
- Long press actions always have menu alternatives

### Screen Reader Support
- All images have descriptive alt text
- Interactive elements have accessible labels
- Form inputs associated with labels
- Status changes announced via live regions
- Navigation landmarks properly defined
- Reading order matches visual order

### Motion & Cognitive
- Respect `prefers-reduced-motion`
- Provide option to disable animations
- Avoid flashing content (no more than 3 flashes/second)
- Use clear, simple language (literacy considerations for farmers)
- Provide Filipino language option throughout

### Text & Readability
- Support system font scaling (up to 200%)
- Minimum body text: 14px
- Line length: 50-75 characters maximum
- Paragraph spacing: at least 1.5x font size

---

## Component Variants

### Badge Variants
| Variant | Background | Text | Usage |
|---------|-----------|------|-------|
| Verified | success | white | Verified farmer badge |
| Organic | organic | white | Organic product |
| Fresh | fresh | white | Recently harvested |
| Sale | accent-500 | white | Discounted items |
| New | info | white | New listings |
| Premium | primary-800 | white | Premium farmer |
| Sold Out | neutral-500 | white | Out of stock |

### Status Badge Variants (Orders)
| Status | Color | Icon |
|--------|-------|------|
| Pending | warning | Clock |
| Confirmed | info | Check |
| Harvesting | organic | Leaf |
| Packed | primary-500 | Package |
| In Transit | accent-500 | Truck |
| Delivered | success | CheckCircle |
| Cancelled | error | XCircle |

### Rating Display
- ★ filled: accent-500
- ☆ empty: neutral-200
- Sizes: 12px (compact), 16px (default), 20px (detail page)
- Always show numeric value alongside stars

### Price Display Variants
- Regular: `₱85.00/kg` (body-lg, primary-800)
- Discounted: `~~₱100.00~~ ₱85.00/kg` (strikethrough + accent)
- Bulk: `₱75.00/kg (min 10kg)` (body-md, neutral-600)
- Free delivery: `Free Delivery` (success, bold)
