# AgriPulse Marketplace — Database Design

## Database Overview

- **Engine**: PostgreSQL 15 (Supabase-managed)
- **Hosting**: Supabase (ap-southeast-1, Singapore)
- **Client**: Supabase JS Client (`@supabase/supabase-js`)
- **Type Generation**: `supabase gen types typescript` (auto-generated from schema)
- **Naming Convention**: snake_case for tables and columns
- **Primary Keys**: UUID v4 (`gen_random_uuid()`)
- **Timestamps**: All tables include `created_at` and `updated_at`
- **Soft Deletes**: Critical tables use `deleted_at` column
- **Row Level Security**: Enabled on ALL tables
- **Realtime**: Enabled on `messages`, `orders`, `notifications` tables

---

## ERD Description

```
Users 1──N Addresses
Users 1──1 Farmers (optional)
Users 1──N Orders
Users 1──N Reviews
Users 1──N Wishlist
Users 1──N Notifications
Users N──N Chats (via ChatParticipants)

Farmers 1──N Products
Farmers 1──1 FarmerVerification

Products N──1 Categories
Products 1──N ProductImages
Products 1──N OrderItems
Products 1──N Reviews
Products 1──N Wishlist

Orders 1──N OrderItems
Orders 1──1 Payments
Orders 1──1 DeliveryTracking
Orders N──1 Addresses

Categories 1──N Categories (self-referencing for subcategories)

Chats 1──N Messages
```

---

## Tables

### 1. Users

**Description**: Core user accounts for all platform participants.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| phone | VARCHAR(15) | UNIQUE, NOT NULL | Philippine mobile (+63) |
| email | VARCHAR(255) | UNIQUE, NULLABLE | Optional email |
| password_hash | VARCHAR(255) | NULLABLE | Bcrypt hash (null for OTP-only) |
| first_name | VARCHAR(50) | NOT NULL | User's first name |
| last_name | VARCHAR(50) | NOT NULL | User's last name |
| avatar_url | VARCHAR(500) | NULLABLE | Profile picture CDN URL |
| role | ENUM | NOT NULL, DEFAULT 'consumer' | consumer, farmer, restaurant, grocery, admin |
| is_verified | BOOLEAN | DEFAULT false | Phone/email verified |
| is_active | BOOLEAN | DEFAULT true | Account active status |
| last_login_at | TIMESTAMP | NULLABLE | Last login timestamp |
| locale | VARCHAR(5) | DEFAULT 'en' | Preferred language (en, fil) |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMP | AUTO | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Relationships**: Has many Addresses, Orders, Reviews, Notifications. Has one Farmer (optional).

**Indexes**:
- `idx_users_phone` UNIQUE on (phone)
- `idx_users_email` UNIQUE on (email) WHERE email IS NOT NULL
- `idx_users_role` on (role)
- `idx_users_created_at` on (created_at)

**Constraints**:
- Phone must match Philippine format
- Role must be valid enum value
- Either phone or email must be present

---

### 2. Farmers

**Description**: Extended profile for users with farmer role. Contains farm details and verification status.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| user_id | UUID | FK → users.id, UNIQUE | Associated user account |
| farm_name | VARCHAR(100) | NOT NULL | Name of the farm |
| farm_size_hectares | DECIMAL(10,2) | NOT NULL | Farm area |
| province | VARCHAR(100) | NOT NULL | Farm province |
| municipality | VARCHAR(100) | NOT NULL | Farm municipality |
| barangay | VARCHAR(100) | NOT NULL | Farm barangay |
| latitude | DECIMAL(10,8) | NULLABLE | GPS latitude |
| longitude | DECIMAL(11,8) | NULLABLE | GPS longitude |
| primary_crops | TEXT[] | NOT NULL | Array of primary crop types |
| farming_experience_years | INTEGER | NOT NULL | Years of experience |
| farm_photo_url | VARCHAR(500) | NULLABLE | Farm photo |
| cooperative_name | VARCHAR(100) | NULLABLE | If part of cooperative |
| verification_status | ENUM | DEFAULT 'pending' | pending, approved, rejected |
| is_premium | BOOLEAN | DEFAULT false | Premium subscription active |
| rating_average | DECIMAL(3,2) | DEFAULT 0.00 | Average rating (0-5) |
| total_reviews | INTEGER | DEFAULT 0 | Total review count |
| total_sales | INTEGER | DEFAULT 0 | Lifetime sales count |
| payout_method | ENUM | NULLABLE | gcash, maya, bank_transfer |
| payout_account_number | VARCHAR(50) | NULLABLE | Payout destination |
| created_at | TIMESTAMP | DEFAULT NOW() | Registration date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to User. Has many Products. Has one FarmerVerification.

**Indexes**:
- `idx_farmers_user_id` UNIQUE on (user_id)
- `idx_farmers_province` on (province)
- `idx_farmers_verification_status` on (verification_status)
- `idx_farmers_rating` on (rating_average DESC)
- `idx_farmers_location` on (latitude, longitude)

**Constraints**:
- farm_size_hectares must be > 0
- farming_experience_years must be >= 0
- rating_average must be between 0 and 5

---

### 3. Products

**Description**: Agricultural products listed by farmers for sale.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| farmer_id | UUID | FK → farmers.id, NOT NULL | Selling farmer |
| category_id | UUID | FK → categories.id, NOT NULL | Product category |
| name | VARCHAR(100) | NOT NULL | Product name |
| description | TEXT | NOT NULL | Detailed description |
| price | DECIMAL(10,2) | NOT NULL | Price per unit |
| unit | ENUM | NOT NULL | kg, piece, bundle, sack, crate |
| available_quantity | DECIMAL(10,2) | NOT NULL | Stock available |
| minimum_order | DECIMAL(10,2) | DEFAULT 1 | Minimum order quantity |
| harvest_date | DATE | NULLABLE | When produce was harvested |
| is_organic | BOOLEAN | DEFAULT false | Organic certification |
| is_active | BOOLEAN | DEFAULT true | Listing active |
| is_featured | BOOLEAN | DEFAULT false | Featured/promoted |
| rating_average | DECIMAL(3,2) | DEFAULT 0.00 | Average rating |
| total_reviews | INTEGER | DEFAULT 0 | Review count |
| total_sold | INTEGER | DEFAULT 0 | Units sold |
| view_count | INTEGER | DEFAULT 0 | Product views |
| search_vector | TSVECTOR | GENERATED | Full-text search vector |
| created_at | TIMESTAMP | DEFAULT NOW() | Listed date |
| updated_at | TIMESTAMP | AUTO | Last update |
| deleted_at | TIMESTAMP | NULLABLE | Soft delete |

**Relationships**: Belongs to Farmer, Category. Has many ProductImages, OrderItems, Reviews, Wishlist entries.

**Indexes**:
- `idx_products_farmer_id` on (farmer_id)
- `idx_products_category_id` on (category_id)
- `idx_products_price` on (price)
- `idx_products_search` GIN on (search_vector)
- `idx_products_active_featured` on (is_active, is_featured)
- `idx_products_created_at` on (created_at DESC)
- `idx_products_rating` on (rating_average DESC) WHERE is_active = true

**Constraints**:
- price must be > 0
- available_quantity must be >= 0
- minimum_order must be > 0

---

### 4. Categories

**Description**: Hierarchical product categories (supports subcategories via self-reference).

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| parent_id | UUID | FK → categories.id, NULLABLE | Parent category (null = top-level) |
| name | VARCHAR(50) | NOT NULL | Category name |
| slug | VARCHAR(60) | UNIQUE, NOT NULL | URL-friendly slug |
| description | VARCHAR(255) | NULLABLE | Category description |
| icon_url | VARCHAR(500) | NULLABLE | Category icon |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT true | Visibility |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Has many Products. Self-references for parent/children.

**Indexes**:
- `idx_categories_parent_id` on (parent_id)
- `idx_categories_slug` UNIQUE on (slug)
- `idx_categories_sort_order` on (sort_order)

**Constraints**:
- Slug must be unique
- Max nesting depth: 2 levels (category → subcategory)

---

### 5. Orders

**Description**: Purchase orders placed by buyers.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| order_number | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable order number (AP-YYYYMMDD-XXXXX) |
| buyer_id | UUID | FK → users.id, NOT NULL | Purchasing user |
| address_id | UUID | FK → addresses.id, NOT NULL | Delivery address |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending, confirmed, harvesting, packed, in_transit, delivered, cancelled, refunded |
| subtotal | DECIMAL(12,2) | NOT NULL | Items total before fees |
| delivery_fee | DECIMAL(10,2) | NOT NULL | Delivery charge |
| service_fee | DECIMAL(10,2) | DEFAULT 0 | Platform service fee |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 | Promo discount |
| total_amount | DECIMAL(12,2) | NOT NULL | Final total |
| payment_method | ENUM | NOT NULL | gcash, maya, bank_transfer, cod, card |
| payment_status | ENUM | DEFAULT 'pending' | pending, paid, failed, refunded |
| delivery_date | DATE | NULLABLE | Requested delivery date |
| delivery_time_slot | VARCHAR(20) | NULLABLE | e.g., "8AM-12PM" |
| special_instructions | TEXT | NULLABLE | Buyer notes |
| cancelled_at | TIMESTAMP | NULLABLE | Cancellation time |
| cancellation_reason | TEXT | NULLABLE | Why cancelled |
| delivered_at | TIMESTAMP | NULLABLE | Delivery confirmation time |
| created_at | TIMESTAMP | DEFAULT NOW() | Order placement time |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to User (buyer), Address. Has many OrderItems. Has one Payment, DeliveryTracking.

**Indexes**:
- `idx_orders_order_number` UNIQUE on (order_number)
- `idx_orders_buyer_id` on (buyer_id)
- `idx_orders_status` on (status)
- `idx_orders_created_at` on (created_at DESC)
- `idx_orders_payment_status` on (payment_status)
- `idx_orders_buyer_status` on (buyer_id, status)

**Constraints**:
- total_amount must be > 0
- delivery_date must be in the future (at creation time)

---

### 6. OrderItems

**Description**: Individual line items within an order.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| order_id | UUID | FK → orders.id, NOT NULL | Parent order |
| product_id | UUID | FK → products.id, NOT NULL | Product purchased |
| farmer_id | UUID | FK → farmers.id, NOT NULL | Selling farmer |
| product_name | VARCHAR(100) | NOT NULL | Snapshot of product name |
| unit_price | DECIMAL(10,2) | NOT NULL | Price at time of purchase |
| quantity | DECIMAL(10,2) | NOT NULL | Quantity ordered |
| unit | ENUM | NOT NULL | Unit type at purchase |
| subtotal | DECIMAL(12,2) | NOT NULL | unit_price × quantity |
| status | ENUM | DEFAULT 'pending' | Item-level status |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |

**Relationships**: Belongs to Order, Product, Farmer.

**Indexes**:
- `idx_order_items_order_id` on (order_id)
- `idx_order_items_product_id` on (product_id)
- `idx_order_items_farmer_id` on (farmer_id)

**Constraints**:
- quantity must be > 0
- subtotal = unit_price × quantity

---

### 7. Addresses

**Description**: Delivery addresses stored by users.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | Address owner |
| label | VARCHAR(30) | NOT NULL | Home, Office, Custom label |
| recipient_name | VARCHAR(100) | NOT NULL | Delivery recipient |
| phone | VARCHAR(15) | NOT NULL | Contact number |
| street_address | VARCHAR(255) | NOT NULL | Street/building details |
| barangay | VARCHAR(100) | NOT NULL | Barangay |
| municipality | VARCHAR(100) | NOT NULL | City/municipality |
| province | VARCHAR(100) | NOT NULL | Province |
| postal_code | VARCHAR(10) | NOT NULL | ZIP code |
| latitude | DECIMAL(10,8) | NULLABLE | GPS latitude |
| longitude | DECIMAL(11,8) | NULLABLE | GPS longitude |
| is_default | BOOLEAN | DEFAULT false | Default address flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to User. Has many Orders.

**Indexes**:
- `idx_addresses_user_id` on (user_id)
- `idx_addresses_user_default` on (user_id, is_default)

**Constraints**:
- Max 10 addresses per user
- Only one default address per user (enforced via trigger)

---

### 8. Reviews

**Description**: Product and farmer reviews from buyers.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | Reviewer |
| product_id | UUID | FK → products.id, NOT NULL | Reviewed product |
| order_item_id | UUID | FK → order_items.id, NOT NULL | Associated purchase |
| rating | SMALLINT | NOT NULL, CHECK(1-5) | Star rating |
| comment | TEXT | NOT NULL | Review text |
| is_anonymous | BOOLEAN | DEFAULT false | Hide reviewer name |
| is_visible | BOOLEAN | DEFAULT true | Moderation status |
| farmer_reply | TEXT | NULLABLE | Farmer's response |
| farmer_replied_at | TIMESTAMP | NULLABLE | Reply timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Review date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to User, Product, OrderItem.

**Indexes**:
- `idx_reviews_product_id` on (product_id)
- `idx_reviews_user_id` on (user_id)
- `idx_reviews_rating` on (product_id, rating)
- `idx_reviews_created_at` on (created_at DESC)

**Constraints**:
- Rating must be between 1 and 5
- One review per order item (UNIQUE on order_item_id)
- Comment minimum 10 characters

---

### 9. Chats

**Description**: Chat conversations between buyers and farmers.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| order_id | UUID | FK → orders.id, NULLABLE | Related order (optional) |
| product_id | UUID | FK → products.id, NULLABLE | Related product (optional) |
| last_message_at | TIMESTAMP | NULLABLE | Last message timestamp |
| last_message_preview | VARCHAR(100) | NULLABLE | Preview text |
| is_active | BOOLEAN | DEFAULT true | Chat active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Chat initiated |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Has many Messages. Referenced by Order and Product (optional).

**Indexes**:
- `idx_chats_last_message_at` on (last_message_at DESC)
- `idx_chats_order_id` on (order_id)

---

### 10. Messages

**Description**: Individual messages within a chat conversation.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| chat_id | UUID | FK → chats.id, NOT NULL | Parent chat |
| sender_id | UUID | FK → users.id, NOT NULL | Message sender |
| content | TEXT | NULLABLE | Message text (null if image-only) |
| message_type | ENUM | DEFAULT 'text' | text, image, product_link, system |
| image_url | VARCHAR(500) | NULLABLE | Attached image URL |
| is_read | BOOLEAN | DEFAULT false | Read by recipient |
| read_at | TIMESTAMP | NULLABLE | When read |
| created_at | TIMESTAMP | DEFAULT NOW() | Sent timestamp |

**Relationships**: Belongs to Chat, User (sender).

**Indexes**:
- `idx_messages_chat_id` on (chat_id, created_at)
- `idx_messages_sender_id` on (sender_id)
- `idx_messages_unread` on (chat_id, is_read) WHERE is_read = false

**Constraints**:
- Either content or image_url must be present

---

### 11. Notifications

**Description**: In-app notifications for users.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | Notification recipient |
| type | VARCHAR(50) | NOT NULL | Notification type enum |
| title | VARCHAR(100) | NOT NULL | Notification title |
| body | TEXT | NOT NULL | Notification body text |
| data | JSONB | NULLABLE | Additional payload (orderId, productId, etc.) |
| is_read | BOOLEAN | DEFAULT false | Read status |
| read_at | TIMESTAMP | NULLABLE | When read |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |

**Relationships**: Belongs to User.

**Indexes**:
- `idx_notifications_user_id` on (user_id, created_at DESC)
- `idx_notifications_unread` on (user_id, is_read) WHERE is_read = false
- `idx_notifications_type` on (user_id, type)

**Constraints**:
- Notifications auto-deleted after 90 days (background job)

---

### 12. Payments

**Description**: Payment records for orders.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| order_id | UUID | FK → orders.id, UNIQUE | Associated order |
| external_payment_id | VARCHAR(100) | NULLABLE | Payment gateway reference |
| method | ENUM | NOT NULL | gcash, maya, bank_transfer, cod, card |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending, processing, completed, failed, refunded |
| amount | DECIMAL(12,2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | DEFAULT 'PHP' | Currency code |
| gateway_response | JSONB | NULLABLE | Raw gateway response |
| paid_at | TIMESTAMP | NULLABLE | Payment completion time |
| refunded_at | TIMESTAMP | NULLABLE | Refund time |
| refund_amount | DECIMAL(12,2) | NULLABLE | Refund amount |
| refund_reason | TEXT | NULLABLE | Reason for refund |
| created_at | TIMESTAMP | DEFAULT NOW() | Payment initiated |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to Order (one-to-one).

**Indexes**:
- `idx_payments_order_id` UNIQUE on (order_id)
- `idx_payments_external_id` on (external_payment_id)
- `idx_payments_status` on (status)
- `idx_payments_created_at` on (created_at DESC)

**Constraints**:
- amount must be > 0
- One payment per order

---

### 13. Analytics

**Description**: Event tracking for platform analytics.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| event_type | VARCHAR(50) | NOT NULL | Event name (product_view, search, purchase, etc.) |
| user_id | UUID | FK → users.id, NULLABLE | Acting user (null for anonymous) |
| entity_type | VARCHAR(30) | NULLABLE | product, farmer, category, order |
| entity_id | UUID | NULLABLE | Referenced entity ID |
| metadata | JSONB | NULLABLE | Additional event data |
| session_id | VARCHAR(50) | NULLABLE | User session identifier |
| device_type | VARCHAR(20) | NULLABLE | mobile, tablet, web |
| ip_address | INET | NULLABLE | Anonymized IP |
| created_at | TIMESTAMP | DEFAULT NOW() | Event timestamp |

**Relationships**: Optional reference to User.

**Indexes**:
- `idx_analytics_event_type` on (event_type, created_at)
- `idx_analytics_user_id` on (user_id, created_at)
- `idx_analytics_entity` on (entity_type, entity_id)
- `idx_analytics_created_at` on (created_at DESC)

**Constraints**:
- Partitioned by month for performance
- Auto-archived after 12 months

---

### 14. Wishlist

**Description**: User's saved/favorited products.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | Wishlist owner |
| product_id | UUID | FK → products.id, NOT NULL | Saved product |
| created_at | TIMESTAMP | DEFAULT NOW() | Added date |

**Relationships**: Belongs to User, Product.

**Indexes**:
- `idx_wishlist_user_id` on (user_id, created_at DESC)
- `idx_wishlist_user_product` UNIQUE on (user_id, product_id)

**Constraints**:
- Unique combination of user_id + product_id
- Max 200 items per user

---

### 15. ProductImages

**Description**: Multiple images per product listing.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| product_id | UUID | FK → products.id, NOT NULL | Parent product |
| image_url | VARCHAR(500) | NOT NULL | Full-size image URL |
| thumbnail_url | VARCHAR(500) | NOT NULL | Thumbnail URL |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_primary | BOOLEAN | DEFAULT false | Primary display image |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload date |

**Relationships**: Belongs to Product.

**Indexes**:
- `idx_product_images_product_id` on (product_id, sort_order)

**Constraints**:
- Max 8 images per product
- Exactly one primary image per product

---

### 16. FarmerVerification

**Description**: Farmer identity and farm verification documents.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| farmer_id | UUID | FK → farmers.id, UNIQUE | Farmer being verified |
| valid_id_url | VARCHAR(500) | NOT NULL | Government ID document URL |
| valid_id_type | VARCHAR(50) | NOT NULL | Type of ID submitted |
| farm_certification_url | VARCHAR(500) | NULLABLE | Farm certification URL |
| dti_registration_url | VARCHAR(500) | NULLABLE | DTI/SEC registration |
| cooperative_cert_url | VARCHAR(500) | NULLABLE | Cooperative membership cert |
| status | ENUM | DEFAULT 'pending' | pending, under_review, approved, rejected |
| reviewed_by | UUID | FK → users.id, NULLABLE | Admin who reviewed |
| reviewed_at | TIMESTAMP | NULLABLE | Review timestamp |
| rejection_reason | TEXT | NULLABLE | Why rejected |
| notes | TEXT | NULLABLE | Internal admin notes |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Submission date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to Farmer. References User (admin reviewer).

**Indexes**:
- `idx_farmer_verification_farmer_id` UNIQUE on (farmer_id)
- `idx_farmer_verification_status` on (status)
- `idx_farmer_verification_submitted_at` on (submitted_at)

**Constraints**:
- One verification record per farmer
- valid_id_url is required

---

### 17. DeliveryTracking

**Description**: Real-time delivery status and tracking for orders.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| order_id | UUID | FK → orders.id, UNIQUE | Tracked order |
| courier_name | VARCHAR(100) | NULLABLE | Delivery partner/courier |
| courier_phone | VARCHAR(15) | NULLABLE | Courier contact |
| tracking_number | VARCHAR(50) | NULLABLE | External tracking ID |
| current_status | ENUM | DEFAULT 'preparing' | preparing, picked_up, in_transit, out_for_delivery, delivered, failed |
| current_latitude | DECIMAL(10,8) | NULLABLE | Current location lat |
| current_longitude | DECIMAL(11,8) | NULLABLE | Current location lng |
| estimated_delivery | TIMESTAMP | NULLABLE | ETA |
| picked_up_at | TIMESTAMP | NULLABLE | Pickup time |
| delivered_at | TIMESTAMP | NULLABLE | Delivery time |
| delivery_proof_url | VARCHAR(500) | NULLABLE | Photo proof of delivery |
| failed_reason | TEXT | NULLABLE | Why delivery failed |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |
| updated_at | TIMESTAMP | AUTO | Last update |

**Relationships**: Belongs to Order (one-to-one).

**Indexes**:
- `idx_delivery_tracking_order_id` UNIQUE on (order_id)
- `idx_delivery_tracking_status` on (current_status)
- `idx_delivery_tracking_courier` on (courier_name)

---

### 18. ChatParticipants

**Description**: Maps users to chat conversations (supports group chats in future).

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| chat_id | UUID | FK → chats.id, NOT NULL | Chat conversation |
| user_id | UUID | FK → users.id, NOT NULL | Participant |
| unread_count | INTEGER | DEFAULT 0 | Unread messages |
| last_read_at | TIMESTAMP | NULLABLE | Last read timestamp |
| joined_at | TIMESTAMP | DEFAULT NOW() | When joined |

**Relationships**: Belongs to Chat, User.

**Indexes**:
- `idx_chat_participants_chat_user` UNIQUE on (chat_id, user_id)
- `idx_chat_participants_user_id` on (user_id)

---

### 19. PromoCodes

**Description**: Discount/promo codes for orders.

**Fields**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT cuid() | Unique identifier |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Promo code string |
| description | VARCHAR(255) | NOT NULL | Promo description |
| discount_type | ENUM | NOT NULL | percentage, fixed_amount |
| discount_value | DECIMAL(10,2) | NOT NULL | Discount amount or % |
| min_order_amount | DECIMAL(10,2) | DEFAULT 0 | Minimum order to apply |
| max_discount_amount | DECIMAL(10,2) | NULLABLE | Cap for % discounts |
| usage_limit | INTEGER | NULLABLE | Total uses allowed |
| used_count | INTEGER | DEFAULT 0 | Times used |
| per_user_limit | INTEGER | DEFAULT 1 | Uses per user |
| valid_from | TIMESTAMP | NOT NULL | Start date |
| valid_until | TIMESTAMP | NOT NULL | Expiry date |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Created date |

**Indexes**:
- `idx_promo_codes_code` UNIQUE on (code)
- `idx_promo_codes_valid` on (valid_from, valid_until, is_active)

---

## Database Design Decisions

### 1. UUID over Auto-Increment
- Prevents ID enumeration attacks
- Enables distributed ID generation
- Safe for API exposure without information leakage

### 2. Soft Deletes on Critical Tables
- Users, Products, Orders use `deleted_at` for soft deletes
- Maintains referential integrity for historical data
- Required for audit trails and dispute resolution

### 3. Denormalized Counters
- `total_reviews`, `rating_average`, `total_sold` on Products/Farmers
- Updated via database triggers or application events
- Avoids expensive COUNT/AVG queries on read-heavy pages

### 4. JSONB for Flexible Data
- Payment gateway responses (varying structure)
- Analytics metadata (evolving schema)
- Notification data payloads

### 5. Table Partitioning
- Analytics table partitioned by month
- Orders table partitioned by created_at (quarterly)
- Improves query performance for time-range queries

### 6. Full-Text Search
- PostgreSQL tsvector on Products for search
- Supports Filipino and English text
- Trigram index for fuzzy matching (typo tolerance)

### 7. Snapshot Pattern for OrderItems
- Product name and price copied to OrderItems at purchase time
- Preserves order history even if product is updated/deleted

### 8. Time Zone Handling
- All timestamps stored in UTC
- Application converts to Asia/Manila (PHT) for display
- Delivery scheduling uses PHT for user-facing dates
