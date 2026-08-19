import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { products as catalog } from '../data/mockData.js';
import { calcFees } from '../utils/cart.js';

const STORAGE_KEY = 'am_cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    if (!feedback) return undefined;
    const t = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [feedback]);

  const addToCart = useCallback((productId, quantity = 1) => {
    const product = catalog.find((p) => p.id === productId);
    if (!product) {
      setFeedback({ type: 'error', message: 'Product not found.' });
      return false;
    }
    if (!product.inStock || product.stock <= 0) {
      setFeedback({ type: 'error', message: 'This product is out of stock.' });
      return false;
    }

    setBusy(true);
    let ok = true;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      const nextQty = (existing?.quantity || 0) + quantity;
      if (nextQty > product.stock) {
        ok = false;
        setFeedback({ type: 'error', message: `Only ${product.stock} available in stock.` });
        return prev;
      }
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: nextQty } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            unit: product.unit,
            category: product.category,
            stock: product.stock,
          },
        },
      ];
    });
    setBusy(false);
    if (ok) {
      setFeedback({ type: 'success', message: `${product.name} added to cart.` });
    }
    return ok;
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const product = catalog.find((p) => p.id === productId);
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    if (product && quantity > product.stock) {
      setFeedback({ type: 'error', message: `Maximum ${product.stock} allowed.` });
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    setFeedback({ type: 'success', message: 'Item removed from cart.' });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const fees = calcFees(subtotal);

  const value = useMemo(
    () => ({
      cart,
      count,
      subtotal,
      ...fees,
      busy,
      feedback,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      setFeedback,
    }),
    [cart, count, subtotal, fees, busy, feedback, addToCart, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
