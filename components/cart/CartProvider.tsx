"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "twist-cart-v1";

/** مفتاح يميز كل سطر بالسلة حسب المنتج وخياراته */
export function cartLineKey(
  item: Pick<CartItem, "productId" | "size" | "color" | "serviceType" | "designUrl">
): string {
  return [
    item.productId,
    item.size ?? "",
    item.color ?? "",
    item.serviceType ?? "",
    item.designUrl ?? "",
  ].join("|");
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(
          parsed.map((item) => ({
            ...item,
            designUrl: item.designUrl ?? null,
          }))
        );
      }
    } catch {
      // تجاهل بيانات تالفة
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = cartLineKey(item);
      const existing = prev.find((i) => cartLineKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartLineKey(i) === key
            ? { ...i, quantity: i.quantity + item.quantity, note: item.note ?? i.note }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => cartLineKey(i) !== lineKey)
        : prev.map((i) => (cartLineKey(i) === lineKey ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((i) => cartLineKey(i) !== lineKey));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return { items, count, total, addItem, updateQuantity, removeItem, clearCart };
  }, [items, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  return ctx;
}
