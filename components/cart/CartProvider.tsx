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
import { LIMITS } from "@/lib/security";
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
  ready: boolean;
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
          parsed.slice(0, LIMITS.cartLines).map((item) => ({
            ...item,
            quantity: Math.min(LIMITS.quantity, Math.max(1, Math.floor(item.quantity) || 1)),
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
      const addQty = Math.min(LIMITS.quantity, Math.max(1, Math.floor(item.quantity) || 1));
      if (existing) {
        return prev.map((i) =>
          cartLineKey(i) === key
            ? {
                ...i,
                quantity: Math.min(LIMITS.quantity, i.quantity + addQty),
                note: item.note ?? i.note,
              }
            : i
        );
      }
      if (prev.length >= LIMITS.cartLines) return prev;
      return [...prev, { ...item, quantity: addQty }];
    });
  }, []);

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => cartLineKey(i) !== lineKey)
        : prev.map((i) =>
            cartLineKey(i) === lineKey
              ? { ...i, quantity: Math.min(LIMITS.quantity, Math.floor(quantity) || 1) }
              : i
          )
    );
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((i) => cartLineKey(i) !== lineKey));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    return { items, count, total, ready: hydrated, addItem, updateQuantity, removeItem, clearCart };
  }, [items, hydrated, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  return ctx;
}
