import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Meal } from '@/types/meal';

export interface CartItem {
  meal: Meal;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (meal: Meal, quantity?: number) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  removeItem: (mealId: string) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (meal: Meal, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.meal.id === meal.id);
      if (existing) {
        return current.map((item) =>
          item.meal.id === meal.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { meal, quantity }];
    });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(mealId);
      return;
    }
    setItems((current) => current.map((item) => (item.meal.id === mealId ? { ...item, quantity } : item)));
  };

  const removeItem = (mealId: string) => {
    setItems((current) => current.filter((item) => item.meal.id !== mealId));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.meal.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
