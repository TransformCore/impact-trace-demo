'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CartLine = { slug: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'impact-trace-demo:cart';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLines(JSON.parse(stored) as CartLine[]);
      }
    } catch {
      // A corrupt or unavailable store just means an empty cart.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore private-mode storage failures.
    }
  }, [lines]);

  const add = useCallback((slug: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { slug, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      add,
      remove,
      clear,
    }),
    [lines, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
