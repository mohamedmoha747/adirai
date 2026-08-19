import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const SessionContext = createContext(null);
const STORAGE_KEY = 'am_session';

const DEFAULTS = {
  customer: { id: 'c1', name: 'Harun', email: 'customer@adirai.com', phone: '+91 98765 43210', role: 'CUSTOMER' },
  delivery: { id: 'dp1', name: 'Arun Kumar', email: 'delivery@adirai.com', phone: '+91 90000 00004', role: 'DELIVERY_PARTNER', vehicle: 'Bike' },
  admin: { id: 'a1', name: 'Admin', email: 'admin@adirai.com', role: 'ADMIN' },
};

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const login = useCallback((role, credentials = {}) => {
    const user = { ...DEFAULTS[role], ...credentials };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setSession(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session,
      isCustomer: session?.role === 'CUSTOMER',
      isDelivery: session?.role === 'DELIVERY_PARTNER',
      isAdmin: session?.role === 'ADMIN',
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
