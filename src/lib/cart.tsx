import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { Product } from "./store";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  oldPrice: number | null;
  size: string;
  color: string;
  tone: string;
  image: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "triplez-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const oldLines = JSON.parse(raw) as CartLine[];
        // Migrate old cart items without image field
        const migratedLines = oldLines.map((line) => ({
          ...line,
          image: line.image || "/north.png", // Add fallback image if missing
        }));
        setLines(migratedLines);
      }
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>((product, opts) => {
    console.log('Adding to cart:', product);
    const size = opts?.size ?? product.sizes[0] ?? "M";
    const color = opts?.color ?? product.colors[0]?.name ?? "Black";
    const qty = opts?.qty ?? 1;
    const key = `${product.id}-${size}-${color}`;
    const imageUrl = product.images?.[0] ?? "/north.png";
    
    setLines((prev) => {
      const existing = prev.find((line) => line.key === key);
      if (existing) {
        return prev.map((line) => (line.key === key ? { ...line, qty: line.qty + qty } : line));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
          oldPrice: product.old_price === null ? null : Number(product.old_price),
          size,
          color,
          tone: "tone-1",
          image: imageUrl,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add,
      setQty: (key, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((line) => line.key !== key)
            : prev.map((line) => (line.key === key ? { ...line, qty } : line)),
        ),
      remove: (key) => setLines((prev) => prev.filter((line) => line.key !== key)),
      clear: () => setLines([]),
    };
  }, [lines, isOpen, add]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
