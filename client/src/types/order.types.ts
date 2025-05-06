/**
 * Order item representing a product in an order
 */
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  options?: Record<string, string>[];
}

/**
 * Address structure for order shipping
 */
export interface OrderAddress {
  recipientName: string;
  streetAddress: string;
  additionalInfo?: string;
  city: string;
  postalCode: string;
  state?: string;
  country: string;
  phoneNumber: string;
}

/**
 * Order statuses
 */
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/**
 * Payment information
 */
export interface PaymentInfo {
  method: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  date: string;
}

/**
 * Complete order structure
 */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  payment: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response for a single order
 */
export interface OrderResponse {
  success: boolean;
  message?: string;
  data: Order;
}

/**
 * API response for multiple orders
 */
export interface OrdersResponse {
  success: boolean;
  message?: string;
  data: {
    orders: Order[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
