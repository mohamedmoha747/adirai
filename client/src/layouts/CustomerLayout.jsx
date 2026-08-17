import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Bike, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../services/api.js';
import { getSocket } from '../services/socket.js';

export function CustomerLayout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then(({ data }) => setNotes(data.data.notifications || [])).catch(() => {});
    const socket = getSocket();
    socket?.on('notification:new', (n) => setNotes((prev) => [n, ...prev]));
    return () => socket?.off('notification:new');
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f7f3ec]">
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f7f3ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-2xl font-semibold text-brand-900">
            Adirai
          </Link>
          <form
            className="hidden flex-1 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/products?search=${encodeURIComponent(q)}`);
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <input
                className="input pl-10"
                placeholder="Search meals, groceries, shops…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </form>
          <nav className="ml-auto flex items-center gap-2 text-sm font-semibold">
            <NavLink to="/shops" className="hidden rounded-full px-3 py-2 hover:bg-white sm:inline">
              Shops
            </NavLink>
            <NavLink to="/products" className="hidden rounded-full px-3 py-2 hover:bg-white sm:inline">
              Products
            </NavLink>
            <NavLink to="/track" className="hidden rounded-full px-3 py-2 hover:bg-white md:inline">
              Track
            </NavLink>
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-white">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ember-600 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="relative rounded-full p-2 hover:bg-white" title="Notifications">
                  <Bell className="h-5 w-5" />
                  {notes.some((n) => n.status !== 'READ') && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ember-600" />}
                </Link>
                <Link to="/profile" className="rounded-full p-2 hover:bg-white">
                  <UserRound className="h-5 w-5" />
                </Link>
                <button className="btn-ghost hidden sm:inline-flex" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4">
          <Bike className="h-4 w-4" /> Adirai deliveries across the city · Track every stop.
        </div>
      </footer>
    </div>
  );
}
