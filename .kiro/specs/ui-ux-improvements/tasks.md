# Implementation Plan: UI/UX Improvements

## Overview

This plan implements four coordinated UI/UX improvements for the AgriPulse marketplace: replacing emojis with Lucide React icons, seeding sample products, replacing OTP auth with email magic links, and adding animations/micro-interactions. Tasks are ordered so foundational changes (icons, CSS) come first, data seeding follows, and auth refactoring builds on the updated UI components.

## Tasks

- [x] 1. Replace emojis with Lucide React icons across the application
  - [x] 1.1 Update the registration page to use Lucide icons for role selection
    - Replace emoji strings in the `ROLES` array with Lucide icon components (`ShoppingCart`, `Wheat`, `UtensilsCrossed`, `Store`)
    - Update the role button render to use `<Icon className="h-6 w-6" />` instead of emoji `<span>`
    - Replace the 🌱 brand mark with `Sprout` icon at `h-7 w-7` in the brand container
    - File: `src/app/(auth)/register/page.tsx`
    - _Requirements: 1.2, 1.3, 1.6_

  - [x] 1.2 Update the login page to use Lucide icon for brand mark
    - Replace the 🌱 emoji in the brand container with `Sprout` from lucide-react at `h-7 w-7`
    - Ensure the icon inherits the parent element text color
    - File: `src/app/(auth)/login/page.tsx`
    - _Requirements: 1.3, 1.6_

  - [x] 1.3 Update the EmptyState component interface to accept Lucide icon components
    - Change the `icon` prop type from `string` to `React.ComponentType<{ className?: string }>`
    - Update the render logic to instantiate the icon component at `h-10 w-10`
    - Update all usages of `EmptyState` across the app to pass Lucide icon components instead of emoji strings
    - Files: `src/components/ui/empty-state.tsx`, all files importing EmptyState
    - _Requirements: 1.4, 1.6, 1.7_

  - [x] 1.4 Add Lucide icons to marketplace category chip buttons
    - Create a `CATEGORY_ICONS` map keyed by category slug (`vegetables` → `Leaf`, `fruits` → `Apple`, `rice-grains` → `Wheat`, `root-crops` → `Carrot`, `poultry-meat` → `Drumstick`, `seafood` → `Fish`, `herbs-spices` → `Flower2`, `dairy-eggs` → `Egg`)
    - Render the icon at `h-4 w-4` inline before category name text in each chip button
    - Preserve existing hover/focus/selected interactive states
    - File: `src/app/(buyer)/marketplace/marketplace-content.tsx`
    - _Requirements: 1.5, 1.6, 1.7_

  - [ ]* 1.5 Write unit tests for icon replacements
    - Verify each role button renders the correct Lucide SVG icon
    - Verify brand mark renders `Sprout` icon at correct size
    - Verify EmptyState accepts and renders a component icon prop
    - Verify category chips render correct icons at `h-4 w-4`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Add CSS animations, micro-interactions, and visual polish
  - [x] 2.1 Define animation keyframes and utility classes in globals.css
    - Add `@keyframes shimmer` with background-position animation (1500ms linear infinite)
    - Add `@keyframes fade-in-up` with opacity 0→1 and translateY 8px→0 (300ms ease-out)
    - Add `@media (prefers-reduced-motion: reduce)` rule zeroing all animation/transition durations
    - Add `.animate-shimmer` and `.animate-fade-in-up` utility classes in `@layer utilities`
    - File: `src/styles/globals.css`
    - _Requirements: 4.1, 4.8_

  - [x] 2.2 Apply fade-in-up animation to product cards in the marketplace grid
    - Add `animate-fade-in-up` class to each `ProductCard` wrapper in the grid
    - Apply stagger delay of 75ms per card using inline `animation-delay` style (index * 75ms)
    - Ensure `opacity: 0` initial state so cards animate in properly
    - File: `src/app/(buyer)/marketplace/marketplace-content.tsx`
    - _Requirements: 4.2_

  - [x] 2.3 Add micro-interactions to buttons and cards
    - Add `active:scale-95` and `hover:scale-[1.02]` with `transition-transform duration-150 ease-in-out` to interactive card components
    - Apply same scale transforms to primary action buttons where appropriate
    - Ensure transforms work with existing Tailwind class composition
    - Files: `src/components/product-card.tsx`, relevant button usage files
    - _Requirements: 4.4_

  - [x] 2.4 Add active-state indicator animation to the bottom navigation
    - Add a visual active indicator (underline or dot) to the active nav item
    - Apply `transition-all duration-200 ease-out` for smooth animated transition between nav items
    - File: `src/components/bottom-nav.tsx`
    - _Requirements: 4.5_

  - [x] 2.5 Apply consistent card styling and gradient accents
    - Ensure all card components use `shadow-md`, `rounded-lg` (8px), and `p-4` (16px padding) consistently
    - Add gradient background using primary color palette to the marketplace hero/header area
    - File: `src/app/(buyer)/marketplace/marketplace-content.tsx`, card components
    - _Requirements: 4.3, 4.6_

  - [x] 2.6 Add selected-state transition to category chip buttons
    - Add `transition-colors duration-200 ease-in-out` to category chip buttons
    - Show a visible icon accent (color change or highlight) on the selected chip
    - File: `src/app/(buyer)/marketplace/marketplace-content.tsx`
    - _Requirements: 4.7_

  - [ ]* 2.7 Write unit tests for animations and reduced motion
    - Verify globals.css contains `@keyframes shimmer` and `@keyframes fade-in-up`
    - Verify product cards receive animation classes
    - Verify `prefers-reduced-motion` media query is present in globals.css
    - _Requirements: 4.1, 4.2, 4.8_

- [x] 3. Checkpoint - Verify icons and animations
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Extend Prisma seed script with sample products
  - [x] 4.1 Add sample farmer users and profiles to the seed script
    - Define 2-3 sample farmer users with email, firstName, lastName, role=farmer, isActive=true
    - Define corresponding Farmer profiles with farmName, province, municipality, barangay, farmSizeHectares, primaryCrops, farmingExperienceYears
    - Use `upsert` keyed on email for idempotency
    - File: `prisma/seed.ts`
    - _Requirements: 2.4, 2.7_

  - [x] 4.2 Add 12+ sample products spanning 6+ categories
    - Define at least 12 products with Filipino agricultural product names
    - Each product: name (1-100 chars), description (10-500 chars), price (₱5-₱10,000), unit (kg/piece/bundle/sack/crate), availableQuantity (1-9,999), minimumOrder (≥1, ≤ availableQuantity)
    - Set isActive=true, deletedAt=null for all products
    - Use `upsert` keyed on a unique identifier (name + farmerId) for idempotency
    - Distribute products across at least 6 of the 8 categories
    - File: `prisma/seed.ts`
    - _Requirements: 2.1, 2.2, 2.3, 2.7_

  - [x] 4.3 Add product images for each sample product
    - Create at least one ProductImage record per product with a valid public image URL
    - Use placeholder image URLs from a reliable CDN (e.g., Unsplash or picsum.photos)
    - Set isPrimary=true for the first image of each product
    - Use `upsert` for idempotency
    - File: `prisma/seed.ts`
    - _Requirements: 2.5, 2.7_

  - [x] 4.4 Add error handling and transaction safety to the seed script
    - Wrap product seeding in a transaction to prevent partial data on failure
    - Exit with non-zero code on failure, log descriptive error message
    - Ensure the script is idempotent — running multiple times produces identical results
    - File: `prisma/seed.ts`
    - _Requirements: 2.7, 2.8_

  - [ ]* 4.5 Write property test for seed data field constraints (Property 1)
    - **Property 1: Seed data field constraints**
    - Use fast-check to generate random product data and verify all field constraints hold (name length, description length, price range, valid unit, quantity range, minimumOrder ≤ availableQuantity)
    - Install fast-check as dev dependency if not present
    - **Validates: Requirements 2.3**

  - [ ]* 4.6 Write property test for seed data relational integrity (Property 2)
    - **Property 2: Seed data relational integrity**
    - Verify every seeded product references a farmer with isActive=true, non-empty farmName, non-empty province, and has at least one ProductImage with non-empty imageUrl
    - **Validates: Requirements 2.4, 2.5**

  - [ ]* 4.7 Write property test for category filtering correctness (Property 3)
    - **Property 3: Category filtering correctness**
    - Use fast-check to generate random product arrays and category selections
    - Verify filtering by categoryId returns only matching products
    - Verify null category returns all products unchanged
    - **Validates: Requirements 2.6**

- [x] 5. Checkpoint - Verify seed script and data properties
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Replace OTP authentication with email magic link flow
  - [x] 6.1 Rewrite the login page for email-based magic link authentication
    - Replace phone input with email input field
    - Remove OTP digit entry, country code prefix (+63), and phone formatting logic
    - Implement `signInWithOtp({ email })` via Supabase client for magic link
    - Add email format validation with inline error display
    - Add pending verification state with "check your inbox" message and resend button (throttled 60s)
    - Replace brand emoji with `Sprout` icon (if not already done in task 1.2)
    - File: `src/app/(auth)/login/page.tsx`
    - _Requirements: 3.1, 3.2, 3.3, 3.9, 3.10_

  - [x] 6.2 Rewrite the registration page for email-based flow
    - Replace phone input with email input field in the details step
    - Remove OTP step entirely, country code prefix, and phone formatting
    - Keep role selection (step 1) and personal details with first name, last name, email, role (step 2)
    - Implement `signUp` or `signInWithOtp({ email, options: { data: { first_name, last_name, role } } })`
    - Add pending verification state with resend button (throttled 60s)
    - Handle "email already registered" error with appropriate message
    - File: `src/app/(auth)/register/page.tsx`
    - _Requirements: 3.4, 3.5, 3.8, 3.9, 3.10_

  - [x] 6.3 Create the email verification callback route
    - Create `src/app/auth/callback/route.ts` with GET handler
    - Extract `code` from URL search params
    - Call `supabase.auth.exchangeCodeForSession(code)`
    - Redirect to `/marketplace` for consumer/restaurant/grocery roles, `/dashboard` for farmer role
    - Redirect to `/auth/verify-expired` on invalid/expired link
    - File: `src/app/auth/callback/route.ts`
    - _Requirements: 3.6, 3.7_

  - [x] 6.4 Create the expired verification link page
    - Create `src/app/auth/verify-expired/page.tsx`
    - Display message indicating the link has expired
    - Provide a button/link to request a new verification email or return to login
    - File: `src/app/auth/verify-expired/page.tsx`
    - _Requirements: 3.7_

  - [ ]* 6.5 Write property test for email validation rejection (Property 5)
    - **Property 5: Email validation rejection**
    - Use fast-check to generate random invalid email strings (missing @, missing domain, missing TLD, >255 chars, invalid chars)
    - Verify validation function rejects all invalid formats
    - Verify valid emails pass validation
    - **Validates: Requirements 3.3**

  - [ ]* 6.6 Write property test for role-based redirect after verification (Property 6)
    - **Property 6: Role-based redirect after verification**
    - Use fast-check to generate random roles from the valid set
    - Verify consumer/restaurant/grocery → /marketplace, farmer → /dashboard
    - **Validates: Requirements 3.6**

  - [ ]* 6.7 Write integration tests for authentication flow
    - Test login form submits email and shows pending state
    - Test registration form collects all fields and triggers email verification
    - Test callback route redirects correctly based on role
    - Test expired link page renders with resend option
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The design uses TypeScript/React throughout — all implementation follows existing project patterns
- Lucide icons are already installed (`lucide-react` in dependencies) — no additional installation needed
- fast-check needs to be installed as a dev dependency for property-based tests

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "2.1"] },
    { "id": 1, "tasks": ["1.3", "1.4", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 2, "tasks": ["1.5", "2.7", "4.1"] },
    { "id": 3, "tasks": ["4.2"] },
    { "id": 4, "tasks": ["4.3", "4.4"] },
    { "id": 5, "tasks": ["4.5", "4.6", "4.7"] },
    { "id": 6, "tasks": ["6.1", "6.2"] },
    { "id": 7, "tasks": ["6.3", "6.4"] },
    { "id": 8, "tasks": ["6.5", "6.6", "6.7"] }
  ]
}
```
