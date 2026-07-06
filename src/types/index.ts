// ═══════════════════════════════════════
// Core Enums (matching DATABASE.md)
// ═══════════════════════════════════════

export type UserRole = "consumer" | "farmer" | "restaurant" | "grocery" | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected" | "under_review";

export type ProductUnit = "kg" | "piece" | "bundle" | "sack" | "crate";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "harvesting"
  | "packed"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "gcash" | "maya" | "bank_transfer" | "cod" | "card";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export type PayoutMethod = "gcash" | "maya" | "bank_transfer";

export type DeliveryStatus =
  | "preparing"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

export type MessageType = "text" | "image" | "product_link" | "system";

// ═══════════════════════════════════════
// Core Interfaces
// ═══════════════════════════════════════

export interface User {
  id: string;
  phone: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  locale: string;
  createdAt: string;
}

export interface Farmer {
  id: string;
  userId: string;
  farmName: string;
  farmSizeHectares: number;
  province: string;
  municipality: string;
  barangay: string;
  latitude: number | null;
  longitude: number | null;
  primaryCrops: string[];
  farmingExperienceYears: number;
  farmPhotoUrl: string | null;
  cooperativeName: string | null;
  verificationStatus: VerificationStatus;
  isPremium: boolean;
  ratingAverage: number;
  totalReviews: number;
  totalSales: number;
  user?: User;
}

export interface Product {
  id: string;
  farmerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit: ProductUnit;
  availableQuantity: number;
  minimumOrder: number;
  harvestDate: string | null;
  isOrganic: boolean;
  isActive: boolean;
  isFeatured: boolean;
  ratingAverage: number;
  totalReviews: number;
  totalSold: number;
  viewCount: number;
  createdAt: string;
  images?: ProductImage[];
  farmer?: Farmer;
  category?: Category;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  thumbnailUrl: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  subcategories?: Category[];
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  addressId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryDate: string | null;
  deliveryTimeSlot: string | null;
  specialInstructions: string | null;
  createdAt: string;
  items?: OrderItem[];
  address?: Address;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  farmerId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  unit: ProductUnit;
  subtotal: number;
  product?: Product;
  farmer?: Farmer;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  barangay: string;
  municipality: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  isVisible: boolean;
  farmerReply: string | null;
  createdAt: string;
  user?: User;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  orderId: string | null;
  productId: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  isActive: boolean;
  participants?: ChatParticipant[];
}

export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  unreadCount: number;
  user?: User;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string | null;
  messageType: MessageType;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: User;
}
