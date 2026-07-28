import type { Meal } from './meal';

export type OrderStatus = 'received' | 'preparing' | 'cooking' | 'ready' | 'collected';

export interface OrderItem {
  meal: Meal;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  qrCodeUrl?: string;
  estimatedWaitMinutes?: number;
  createdAt: string;
}

export interface CreateOrderPayload {
  items: Array<{ mealId: string; quantity: number }>;
}
