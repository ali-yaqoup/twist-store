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
import type { Product, WishlistItem } from "@/lib/types";

const STORAGE_KEY = "twist-wishlist-v1";

export function toWishlistItem(product: Product): WishlistItem {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0] ?? null,
    sizes: product.sizes,
    colors: product.colors,
    embroidery_or_print_type: product.embroidery_or_print_type,
  };
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isSaved: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  removeItem: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        setItems(
          parsed
            .filter(
              (item) => item && typeof item.productId === "string" && item.name
            )
            .map((item) => ({
              productId: item.productId,
              name: item.name,
              price: Number(item.price) || 0,
              image: item.image ?? null,
              sizes: Array.isArray(item.sizes) ? item.sizes : [],
              colors: Array.isArray(item.colors) ? item.colors : [],
              embroidery_or_print_type: item.embroidery_or_print_type ?? "both",
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

  const isSaved = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.productId === product.id);
      if (exists) return prev.filter((i) => i.productId !== product.id);
      return [...prev, toWishlistItem(product)];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isSaved,
      toggleItem,
      removeItem,
    }),
    [items, isSaved, toggleItem, removeItem]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist يجب أن يُستخدم داخل WishlistProvider");
  return ctx;
}
