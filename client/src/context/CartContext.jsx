import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!user || user.role !== 'CUSTOMER') {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data.data.cart || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user?._id || user?.id]);

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({ cart, setCart, refresh, total, count, loading }), [cart, total, count, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartContext');
  return ctx;
}
