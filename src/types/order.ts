import type { Meal } from './meal';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'DECLINED';

export type PaymentMethod =
  | 'CASH'
  | 'CHECK'
  | 'NFC'
  | 'RESTAURANT_TICKET';

export interface OrderItem {
  meal: Meal;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber?: number;

  items: OrderItem[];

  totalPrice: number;

  status: OrderStatus;

  paymentMethod: PaymentMethod;

  qrCode?: string;

  declineReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  paymentMethod: PaymentMethod;

  items: Array<{
    mealId: string;
    quantity: number;
  }>;
}