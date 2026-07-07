# Requirements Document

## Introduction

This feature spec covers a set of UI/UX improvements for the AgriPulse marketplace application. The changes include replacing all emoji characters with proper Lucide React icons, populating the marketplace with sample product data so users see actual product cards instead of an empty state, changing the authentication flow from phone/OTP verification to email-based verification with magic links, and adding visual polish through animations, sparkle effects, and improved visual hierarchy for a more premium look and feel.

## Glossary

- **App**: The AgriPulse marketplace web application built with Next.js 15, React 19, Supabase, Prisma, Tailwind CSS, and Radix UI
- **Icon_System**: The Lucide React icon library already installed in the project (lucide-react package)
- **Marketplace**: The buyer-facing product browsing page showing categories and product cards
- **Product_Card**: A UI component displaying a product's image, name, price, unit, farmer info, and add-to-cart action
- **Sample_Products**: Pre-seeded placeholder product records representing agricultural items across all categories
- **Auth_Flow**: The registration and sign-in user journey including identity collection and verification
- **Email_Verification**: Supabase email-based authentication using magic links or confirmation emails instead of SMS OTP
- **Visual_Polish**: CSS animations, gradient effects, micro-interactions, and sparkle effects that enhance the perceived premium quality of the interface
- **Buyer**: A user with the consumer, restaurant, or grocery role who browses and purchases products
- **Farmer**: A user with the farmer role who lists and sells products
- **Bottom_Nav**: The fixed bottom navigation bar in the buyer layout with Home, Shop, Cart, Orders, and Profile links
- **Category_Chip**: A horizontally scrollable filter button representing a product category in the marketplace

## Requirements

### Requirement 1: Replace Emojis with Lucide React Icons

**User Story:** As a user, I want to see consistent, professional vector icons throughout the app, so that the interface feels polished and visually cohesive across all devices and operating systems.

#### Acceptance Criteria

1. WHEN the App renders any UI component that previously displayed an emoji character, THE Icon_System SHALL render a corresponding Lucide React SVG icon in its place, using the inherited text color of the parent element
2. THE App SHALL use Lucide React icons for all role selection indicators on the registration page (replacing 🛒, 🌾, 🍽️, 🏪 emojis), rendered at h-6 w-6 size within the existing role selection buttons
3. THE App SHALL use a Lucide React icon for the AgriPulse brand mark on login and registration pages (replacing the 🌱 emoji), rendered at h-7 w-7 size within the existing brand container
4. WHEN the EmptyState component renders, THE Icon_System SHALL accept a Lucide React icon component (typed as React.ComponentType with className prop support) as the icon prop instead of an emoji string, rendered at h-10 w-10 size
5. THE App SHALL use Lucide React icons for all category representations in the marketplace category chip buttons, rendered at h-4 w-4 size inline before the category name text
6. THE Icon_System SHALL apply a stroke-width of 2 to all Lucide React icons and maintain three size tiers: h-4 w-4 for inline elements within compact controls, h-6 w-6 for standard interactive elements, and h-10 w-10 for featured or empty-state illustrations
7. IF a UI component previously rendering an emoji is updated to use a Lucide React icon, THEN THE Icon_System SHALL preserve the existing interactive states (hover, focus, disabled) and accessibility attributes of the parent element without visual regression

### Requirement 2: Populate Marketplace with Sample Products

**User Story:** As a buyer visiting the marketplace for the first time, I want to see actual product listings with realistic agricultural items, so that I can understand how the marketplace works and explore available produce.

#### Acceptance Criteria

1. THE Sample_Products SHALL include a minimum of 12 product entries spanning at least 6 of the 8 defined categories (Vegetables, Fruits, Rice & Grains, Root Crops, Poultry & Meat, Seafood, Herbs & Spices, Dairy & Eggs)
2. WHEN the marketplace page loads, THE Marketplace SHALL display Product_Card components for all Sample_Products that have isActive set to true and deletedAt set to null, instead of the "No products found" empty state
3. THE Sample_Products SHALL each contain a Filipino product name (1 to 100 characters), a description (10 to 500 characters), a price in PHP between 5.00 and 10,000.00, a unit type (kg, piece, bundle, sack, or crate), an available quantity between 1 and 9,999, and a minimum order amount that is greater than or equal to 1 and less than or equal to the available quantity
4. THE Sample_Products SHALL each reference a farmer record that has isActive set to true on its associated user, a farm name, and a province, so that the Product_Card displays farmer attribution
5. THE Sample_Products SHALL each have at least one associated ProductImage record with an image URL that returns an HTTP 200 response, so that Product_Card components render visible imagery rather than broken image indicators
6. WHEN a user selects a Category_Chip button, THE Marketplace SHALL display only Sample_Products whose categoryId matches the selected category, and WHEN the "All" chip is selected, THE Marketplace SHALL display all active Sample_Products
7. THE Sample_Products SHALL be created through a Prisma seed script that is idempotent, producing the same dataset without duplicates when executed multiple times in any environment
8. IF the Prisma seed script fails during execution, THEN THE seed script SHALL exit with a non-zero exit code and log an error message indicating the failure reason without leaving partially-seeded product data committed to the database

### Requirement 3: Replace OTP Authentication with Email Verification

**User Story:** As a new user, I want to register and sign in using my email address with a verification link, so that I can authenticate without needing SMS-based OTP codes.

#### Acceptance Criteria

1. WHEN a user navigates to the login page, THE Auth_Flow SHALL present an email input field instead of a phone number input field
2. WHEN a user submits an email address on the login page that conforms to standard email format (local-part@domain with a valid top-level domain, maximum 255 characters), THE Auth_Flow SHALL send an email containing a magic link for authentication via Supabase email auth
3. IF a user submits a login email address that does not conform to standard email format, THEN THE Auth_Flow SHALL display an inline validation error below the email field indicating the expected format and SHALL NOT send an authentication email
4. WHEN a user navigates to the registration page, THE Auth_Flow SHALL collect first name (1 to 50 characters), last name (1 to 50 characters), email address, and role selection (consumer, farmer, restaurant, or grocery) instead of phone number
5. WHEN a user submits the registration form with all fields valid, THE Auth_Flow SHALL send a verification email to the provided email address with a confirmation link that expires after 60 minutes
6. WHEN a user clicks a valid, non-expired email verification link, THE Auth_Flow SHALL confirm the account and redirect the user to the marketplace page for consumer, restaurant, and grocery roles, or to the farmer dashboard for the farmer role
7. IF a user clicks an email verification link that has expired, THEN THE Auth_Flow SHALL display a message indicating the link has expired and provide an option to request a new verification email
8. IF a user submits an email address that is already registered, THEN THE Auth_Flow SHALL display an error message indicating the email is already in use
9. WHILE a user has not yet verified their email, THE Auth_Flow SHALL display a pending verification state with instructions to check their inbox and a resend button that allows requesting a new verification email no more than once per 60 seconds
10. THE Auth_Flow SHALL remove all phone number input fields, country code prefixes (+63), and OTP digit entry components from both login and registration pages

### Requirement 4: Enhance Visual Design with Animations and Premium Styling

**User Story:** As a user, I want the app to feel modern and premium with smooth animations and visual effects, so that my browsing experience feels engaging and polished.

#### Acceptance Criteria

1. THE Visual_Polish SHALL include a shimmer/sparkle CSS animation keyframe defined in the global stylesheet that produces a cyclic glowing highlight effect with a duration of 1500ms and linear timing repeating infinitely
2. WHEN a Product_Card component mounts in the viewport, THE Visual_Polish SHALL apply a fade-in-up entrance animation with a duration of 300ms using ease-out easing and a stagger delay of 75ms between each successive card in the grid
3. THE Visual_Polish SHALL apply a gradient background using the primary color palette to featured section headers and the marketplace hero area
4. WHEN a user hovers over or presses a button or card element, THE Visual_Polish SHALL apply a scale transform (scale 0.95 on press, scale 1.02 on hover) with a duration of 150ms and ease-in-out easing providing tactile feedback
5. THE Bottom_Nav SHALL include an active-state indicator with an animated transition of 200ms duration and ease-out easing when switching between navigation items
6. THE Visual_Polish SHALL apply shadow-md depth from the design system tokens, border radius of radius-md (8px), and spacing of space-4 (16px) padding consistently across all card components to create visual layering
7. WHEN a Category_Chip component is selected, THE Category_Chip SHALL display a background-color transition with a duration of 200ms and ease-in-out easing along with a visible icon accent indicating the selected state
8. THE Visual_Polish SHALL ensure all animations respect the prefers-reduced-motion media query by removing animated transitions and replacing them with instant state changes for users who request reduced motion
