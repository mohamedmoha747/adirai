import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { connectSocket, disconnectSocket } from '../services/socket.js';
import { homeForRole } from '../utils/format.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem('adirai_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      disconnectSocket();
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      setShop(data.data.shop || null);
      connectSocket(token);
    } catch {
      localStorage.removeItem('adirai_token');
      setUser(null);
      disconnectSocket();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('adirai_token', data.data.token);
    setUser(data.data.user);
    setShop(data.data.shop || null);
    connectSocket(data.data.token);
    return homeForRole(data.data.user.role);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('adirai_token', data.data.token);
    setUser(data.data.user);
    connectSocket(data.data.token);
    return homeForRole(data.data.user.role);
  }

  function logout() {
    localStorage.removeItem('adirai_token');
    setUser(null);
    setShop(null);
    disconnectSocket();
  }

  const value = useMemo(
    () => ({ user, shop, setShop, loading, login, register, logout, reload: loadMe }),
    [user, shop, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
