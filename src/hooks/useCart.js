import { useEffect, useState } from 'react';

const STORAGE_KEY = "livia_cart_v1";

// Cart item shape: { productId, name, image, category, pres: {qty, unit, label, price}, qty }
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  const addItem = (product, pres, qty = 1) => {
    setCart(prev => {
      // If same product + same presentation already in cart, merge
      const idx = prev.findIndex(
        i => i.productId === product.id && i.pres.label === pres.label
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        pres,
        qty,
      }];
    });
  };

  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));

  const updateQty = (idx, delta) => setCart(prev => prev.map((it, i) =>
    i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it
  ));

  const clear = () => setCart([]);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.pres.price * i.qty, 0);

  return { cart, addItem, removeItem, updateQty, clear, count, subtotal };
}
