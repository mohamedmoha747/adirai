import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Bike,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Ticket,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { useSession } from '../context/SessionContext.jsx';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery-partners', label: 'Delivery Partners', icon: Bike },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
  { to: '/admin/offers', label: 'Offers', icon: Ticket },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function navLinkClass({ isActive }) {
  return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
  }`;
}

function AdminSidebar({ onNavigate, onLogout }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-5">
        <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">AM</div>
          <div>
            <div className="font-bold text-slate-900">Admin Console</div>
            <div className="text-xs text-slate-500">Adirai Minutes</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navLinkClass} onClick={onNavigate}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-slate-200 p-3">
        <NavLink to="/admin/profile" className={navLinkClass} onClick={onNavigate}>
          <UserRound size={18} /> Admin Profile
        </NavLink>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <AdminSidebar onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <h1 className="truncate font-bold text-slate-900">Platform Management</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/admin/profile"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <UserRound size={16} className="text-brand-600" />
              <span className="hidden max-w-[16rem] truncate sm:inline">{user?.email || 'admin@adirai.com'}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminAuthLayout() {
  return <Outlet />;
}
