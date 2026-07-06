# AgriPulse Marketplace — API Specification

## Base URL
- **Production**: `https://api.agripulse.ph/v1`
- **Staging**: `https://api-staging.agripulse.ph/v1`

## Common Headers
```
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <uuid>
Accept-Language: en | fil
```

## Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ { "field": "price", "message": "Must be > 0" } ]
  }
}
```

---

## Authentication APIs

### POST /auth/otp/request
**Description**: Request OTP code via SMS for login/registration.
**Auth Required**: No

**Request Body**:
```json
{
  "phone": "+639171234567"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "expiresIn": 300,
    "isNewUser": false
  }
}
```

**Errors**:
- `400` — Invalid phone format
- `429` — Too many OTP requests (max 5 per 15 minutes)

---

### POST /auth/otp/verify
**Description**: Verify OTP and receive access/refresh tokens.
**Auth Required**: No

**Request Body**:
```json
{
  "phone": "+639171234567",
  "otp": "123456"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 900,
    "user": {
      "id": "clx1abc...",
      "phone": "+639171234567",
      "firstName": "Juan",
      "lastName": "Dela Cruz",
      "role": "consumer",
      "isVerified": true
    },
    "isNewUser": false
  }
}
```

**Errors**:
- `400` — Invalid or expired OTP
- `401` — OTP verification failed
- `429` — Too many attempts

---

### POST /auth/refresh
**Description**: Refresh expired access token.
**Auth Required**: No (uses refresh token)

**Request Body**:
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "bmV3IHJlZnJlc2ggdG9r...",
    "expiresIn": 900
  }
}
```

**Errors**:
- `401` — Invalid or expired refresh token

---

### POST /auth/logout
**Description**: Invalidate current session.
**Auth Required**: Yes

**Response (200)**:
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

## User APIs

### GET /users/me
**Description**: Get current user profile.
**Auth Required**: Yes

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "clx1abc...",
    "phone": "+639171234567",
    "email": "juan@email.com",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "avatarUrl": "https://cdn.agripulse.ph/avatars/...",
    "role": "consumer",
    "isVerified": true,
    "locale": "en",
    "createdAt": "2026-01-15T08:00:00Z"
  }
}
```

---

### PATCH /users/me
**Description**: Update current user profile.
**Auth Required**: Yes

**Request Body**:
```json
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "email": "newemail@email.com",
  "locale": "fil"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": { "...updated user object..." }
}
```

**Errors**:
- `400` — Validation errors
- `409` — Email already in use

---

### POST /users/me/avatar
**Description**: Upload profile avatar.
**Auth Required**: Yes
**Content-Type**: multipart/form-data

**Request Body**: Form data with `avatar` file field (max 5MB, JPEG/PNG/WebP)

**Response (200)**:
```json
{
  "success": true,
  "data": { "avatarUrl": "https://cdn.agripulse.ph/avatars/..." }
}
```

---

## Products APIs

### GET /products
**Description**: List products with filtering, sorting, and pagination.
**Auth Required**: No

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 50) |
| categoryId | string | Filter by category |
| farmerId | string | Filter by farmer |
| search | string | Full-text search query |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| isOrganic | boolean | Filter organic products |
| sortBy | string | price_asc, price_desc, rating, newest, popular |
| province | string | Filter by farmer province |

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clx2def...",
      "name": "Fresh Tomatoes",
      "description": "Vine-ripened tomatoes from Benguet...",
      "price": 85.00,
      "unit": "kg",
      "availableQuantity": 500,
      "minimumOrder": 1,
      "harvestDate": "2026-07-04",
      "isOrganic": true,
      "ratingAverage": 4.7,
      "totalReviews": 23,
      "totalSold": 1200,
      "primaryImage": "https://cdn.agripulse.ph/products/...",
      "farmer": {
        "id": "clx3ghi...",
        "farmName": "Tonyo's Farm",
        "province": "Benguet",
        "verificationStatus": "approved",
        "ratingAverage": 4.8
      },
      "category": {
        "id": "clx4jkl...",
        "name": "Vegetables",
        "slug": "vegetables"
      }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 342, "totalPages": 18 }
}
```

---

### GET /products/:id
**Description**: Get single product with full details.
**Auth Required**: No

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "clx2def...",
    "name": "Fresh Tomatoes",
    "description": "Vine-ripened tomatoes from Benguet highlands...",
    "price": 85.00,
    "unit": "kg",
    "availableQuantity": 500,
    "minimumOrder": 1,
    "harvestDate": "2026-07-04",
    "isOrganic": true,
    "isFeatured": false,
    "ratingAverage": 4.7,
    "totalReviews": 23,
    "totalSold": 1200,
    "viewCount": 5400,
    "images": [
      { "id": "img1", "imageUrl": "...", "thumbnailUrl": "...", "isPrimary": true }
    ],
    "farmer": {
      "id": "clx3ghi...",
      "farmName": "Tonyo's Farm",
      "province": "Benguet",
      "municipality": "La Trinidad",
      "verificationStatus": "approved",
      "ratingAverage": 4.8,
      "totalReviews": 89,
      "avatarUrl": "..."
    },
    "category": { "id": "clx4jkl...", "name": "Vegetables", "slug": "vegetables" },
    "isInWishlist": false,
    "createdAt": "2026-06-20T10:00:00Z"
  }
}
```

---

### POST /products
**Description**: Create a new product listing.
**Auth Required**: Yes (farmer role)
**Content-Type**: multipart/form-data

**Request Body**:
```json
{
  "name": "Fresh Tomatoes",
  "description": "Vine-ripened tomatoes from Benguet highlands...",
  "categoryId": "clx4jkl...",
  "price": 85.00,
  "unit": "kg",
  "availableQuantity": 500,
  "minimumOrder": 1,
  "harvestDate": "2026-07-04",
  "isOrganic": true,
  "images": "[File uploads, 1-8 images]"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": { "...created product object..." }
}
```

**Errors**:
- `400` — Validation errors
- `403` — Not a verified farmer

---

### PATCH /products/:id
**Description**: Update product listing.
**Auth Required**: Yes (product owner)

**Request Body** (partial update):
```json
{
  "price": 90.00,
  "availableQuantity": 300
}
```

**Response (200)**: Updated product object.

**Errors**:
- `403` — Not the product owner
- `404` — Product not found

---

### DELETE /products/:id
**Description**: Soft-delete a product listing.
**Auth Required**: Yes (product owner or admin)

**Response (200)**:
```json
{ "success": true, "data": { "message": "Product deleted" } }
```

---

## Categories APIs

### GET /categories
**Description**: Get all categories with subcategories.
**Auth Required**: No

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "clx4jkl...",
      "name": "Vegetables",
      "slug": "vegetables",
      "iconUrl": "https://cdn.agripulse.ph/icons/vegetables.svg",
      "subcategories": [
        { "id": "clx5mno...", "name": "Leafy Greens", "slug": "leafy-greens" },
        { "id": "clx5pqr...", "name": "Root Vegetables", "slug": "root-vegetables" }
      ]
    },
    {
      "id": "clx4stu...",
      "name": "Fruits",
      "slug": "fruits",
      "iconUrl": "https://cdn.agripulse.ph/icons/fruits.svg",
      "subcategories": [ ... ]
    }
  ]
}
```

---

## Cart APIs

### GET /cart
**Description**: Get current user's cart.
**Auth Required**: Yes

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_1",
        "product": { "id": "...", "name": "Fresh Tomatoes", "price": 85.00, "unit": "kg", "primaryImage": "..." },
        "farmer": { "id": "...", "farmName": "Tonyo's Farm" },
        "quantity": 5,
        "subtotal": 425.00
      }
    ],
    "summary": {
      "itemCount": 3,
      "subtotal": 1250.00,
      "estimatedDelivery": 100.00,
      "estimatedTotal": 1350.00
    }
  }
}
```

---

### POST /cart/items
**Description**: Add item to cart.
**Auth Required**: Yes

**Request Body**:
```json
{
  "productId": "clx2def...",
  "quantity": 5
}
```

**Response (201)**: Updated cart object.

**Errors**:
- `400` — Quantity below minimum or exceeds stock
- `404` — Product not found or inactive

---

### PATCH /cart/items/:itemId
**Description**: Update cart item quantity.
**Auth Required**: Yes

**Request Body**:
```json
{ "quantity": 10 }
```

---

### DELETE /cart/items/:itemId
**Description**: Remove item from cart.
**Auth Required**: Yes

---

### DELETE /cart
**Description**: Clear entire cart.
**Auth Required**: Yes

---

## Wishlist APIs

### GET /wishlist
**Description**: Get user's wishlist products.
**Auth Required**: Yes

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "wish_1",
      "product": { "id": "...", "name": "...", "price": 85.00, "primaryImage": "..." },
      "addedAt": "2026-07-01T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 12 }
}
```

---

### POST /wishlist
**Description**: Add product to wishlist.
**Auth Required**: Yes

**Request Body**:
```json
{ "productId": "clx2def..." }
```

---

### DELETE /wishlist/:productId
**Description**: Remove product from wishlist.
**Auth Required**: Yes

---

## Orders APIs

### POST /orders
**Description**: Place a new order from cart.
**Auth Required**: Yes

**Request Body**:
```json
{
  "addressId": "addr_123",
  "deliveryDate": "2026-07-08",
  "deliveryTimeSlot": "8AM-12PM",
  "paymentMethod": "gcash",
  "promoCode": "FRESH10",
  "specialInstructions": "Please handle with care"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "ord_789",
    "orderNumber": "AP-20260706-00123",
    "status": "pending",
    "items": [ ... ],
    "subtotal": 1250.00,
    "deliveryFee": 100.00,
    "serviceFee": 50.00,
    "discountAmount": 125.00,
    "totalAmount": 1275.00,
    "paymentMethod": "gcash",
    "paymentUrl": "https://payment.paymongo.com/...",
    "createdAt": "2026-07-06T10:30:00Z"
  }
}
```

**Errors**:
- `400` — Invalid address, past delivery date, empty cart
- `402` — Insufficient stock for one or more items
- `422` — Invalid promo code

---

### GET /orders
**Description**: Get order history.
**Auth Required**: Yes

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status |

---

### GET /orders/:id
**Description**: Get order details.
**Auth Required**: Yes (order owner or farmer involved)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "ord_789",
    "orderNumber": "AP-20260706-00123",
    "status": "in_transit",
    "items": [
      {
        "id": "item_1",
        "productName": "Fresh Tomatoes",
        "unitPrice": 85.00,
        "quantity": 5,
        "unit": "kg",
        "subtotal": 425.00,
        "farmer": { "id": "...", "farmName": "Tonyo's Farm" }
      }
    ],
    "address": { "...full address..." },
    "payment": { "method": "gcash", "status": "completed", "paidAt": "..." },
    "delivery": { "courierName": "...", "trackingNumber": "...", "estimatedDelivery": "..." },
    "timeline": [
      { "status": "pending", "timestamp": "2026-07-06T10:30:00Z" },
      { "status": "confirmed", "timestamp": "2026-07-06T10:35:00Z" },
      { "status": "in_transit", "timestamp": "2026-07-07T08:00:00Z" }
    ],
    "subtotal": 1250.00,
    "deliveryFee": 100.00,
    "totalAmount": 1275.00,
    "createdAt": "2026-07-06T10:30:00Z"
  }
}
```

---

### POST /orders/:id/cancel
**Description**: Cancel an order.
**Auth Required**: Yes (order owner)

**Request Body**:
```json
{ "reason": "Changed my mind" }
```

**Errors**:
- `400` — Order already shipped/delivered, cannot cancel

---

## Payments APIs

### POST /payments/webhook
**Description**: Receive payment confirmation from gateway (PayMongo).
**Auth Required**: No (verified via webhook signature)

---

### GET /payments/orders/:orderId
**Description**: Get payment details for an order.
**Auth Required**: Yes (order owner)

---

### GET /farmers/me/payouts
**Description**: Get farmer's payout history.
**Auth Required**: Yes (farmer role)

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "payout_1",
      "amount": 5250.00,
      "method": "gcash",
      "status": "completed",
      "ordersCount": 12,
      "commission": 262.50,
      "netAmount": 4987.50,
      "processedAt": "2026-07-06T06:00:00Z"
    }
  ]
}
```

---

## Reviews APIs

### GET /products/:productId/reviews
**Description**: Get reviews for a product.
**Auth Required**: No

**Query Parameters**: page, limit, sortBy (newest, highest, lowest)

---

### POST /products/:productId/reviews
**Description**: Submit a review for a purchased product.
**Auth Required**: Yes

**Request Body**:
```json
{
  "orderItemId": "item_1",
  "rating": 5,
  "comment": "Very fresh tomatoes, exactly as described!",
  "isAnonymous": false,
  "images": "[optional file uploads]"
}
```

**Errors**:
- `400` — Already reviewed this order item
- `403` — Did not purchase this product

---

### POST /reviews/:id/reply
**Description**: Farmer replies to a review.
**Auth Required**: Yes (farmer who owns the product)

**Request Body**:
```json
{ "reply": "Thank you for your kind review! Happy to serve you again." }
```

---

## Notifications APIs

### GET /notifications
**Description**: Get user's notifications.
**Auth Required**: Yes

**Query Parameters**: page, limit, isRead (boolean)

---

### PATCH /notifications/:id/read
**Description**: Mark a notification as read.
**Auth Required**: Yes

---

### POST /notifications/read-all
**Description**: Mark all notifications as read.
**Auth Required**: Yes

---

### GET /notifications/unread-count
**Description**: Get count of unread notifications.
**Auth Required**: Yes

**Response (200)**:
```json
{ "success": true, "data": { "count": 7 } }
```

---

## Chat APIs

### GET /chats
**Description**: Get user's chat conversations.
**Auth Required**: Yes

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "chat_1",
      "participant": { "id": "...", "name": "Tonyo's Farm", "avatarUrl": "..." },
      "lastMessage": { "content": "Yes, available po!", "createdAt": "..." },
      "unreadCount": 2
    }
  ]
}
```

---

### GET /chats/:id/messages
**Description**: Get messages in a conversation.
**Auth Required**: Yes (chat participant)

**Query Parameters**: page, limit, before (cursor-based pagination)

---

### POST /chats
**Description**: Start a new conversation.
**Auth Required**: Yes

**Request Body**:
```json
{
  "recipientId": "user_456",
  "productId": "clx2def...",
  "message": "Hi, is this product still available?"
}
```

---

### POST /chats/:id/messages
**Description**: Send a message in a conversation.
**Auth Required**: Yes (chat participant)

**Request Body**:
```json
{
  "content": "Yes po, available!",
  "messageType": "text"
}
```

---

## Farmer Dashboard APIs

### GET /farmers/me/dashboard
**Description**: Get farmer's dashboard summary.
**Auth Required**: Yes (farmer role)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 125000.00,
      "totalOrders": 234,
      "pendingOrders": 5,
      "activeProducts": 18,
      "averageRating": 4.8
    },
    "revenueChart": [
      { "date": "2026-07-01", "revenue": 5200.00 },
      { "date": "2026-07-02", "revenue": 3800.00 }
    ],
    "topProducts": [
      { "id": "...", "name": "Fresh Tomatoes", "totalSold": 450, "revenue": 38250.00 }
    ],
    "recentOrders": [ ... ]
  }
}
```

---

### GET /farmers/me/orders
**Description**: Get orders for farmer's products.
**Auth Required**: Yes (farmer role)

**Query Parameters**: page, limit, status

---

### PATCH /farmers/me/orders/:id/status
**Description**: Update order item status (confirm, pack, ship).
**Auth Required**: Yes (farmer role)

**Request Body**:
```json
{ "status": "packed" }
```

---

## Admin Dashboard APIs

### GET /admin/dashboard
**Description**: Get platform-wide admin dashboard.
**Auth Required**: Yes (admin role)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "users": { "total": 30000, "newToday": 45, "farmers": 5200, "consumers": 24800 },
    "orders": { "total": 150000, "today": 234, "pendingAmount": 2500000 },
    "revenue": { "totalGMV": 45000000, "platformRevenue": 2250000, "todayGMV": 150000 },
    "verification": { "pending": 23, "approved": 5100, "rejected": 77 }
  }
}
```

---

### GET /admin/users
**Description**: List and search all users.
**Auth Required**: Yes (admin role)

**Query Parameters**: page, limit, role, search, isActive

---

### GET /admin/verifications
**Description**: Get pending farmer verifications.
**Auth Required**: Yes (admin role)

---

### PATCH /admin/verifications/:id
**Description**: Approve or reject farmer verification.
**Auth Required**: Yes (admin role)

**Request Body**:
```json
{
  "status": "approved",
  "notes": "All documents verified"
}
```

---

## Analytics APIs

### GET /analytics/market-prices
**Description**: Get current market price averages by category.
**Auth Required**: No

**Response (200)**:
```json
{
  "success": true,
  "data": [
    { "category": "Vegetables", "product": "Tomatoes", "avgPrice": 82.50, "unit": "kg", "trend": "up" },
    { "category": "Fruits", "product": "Mango", "avgPrice": 120.00, "unit": "kg", "trend": "stable" }
  ]
}
```

---

### GET /analytics/farmer/:farmerId/performance
**Description**: Farmer performance metrics.
**Auth Required**: Yes (farmer owner or admin)

**Query Parameters**: period (7d, 30d, 90d, 1y)
