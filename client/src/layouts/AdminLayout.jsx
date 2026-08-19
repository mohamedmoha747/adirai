import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Bike, LayoutDashboard, LogOut, Package, Settings, Users } from 'lucide-react';
import { useSession } from '../context/SessionContext.jsx';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery-partners', label: 'Delivery Partners', icon: Bike },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/payments', label: 'Payments', icon: Package },
  { to: '/admin/revenue', label: 'Revenue', icon: BarChart3 },
  { to: '/admin/offers', label: 'Offers', icon: Package },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-5">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">AM</div>
            <div>
              <div className="font-bold text-slate-900">Admin Console</div>
              <div className="text-xs text-slate-500">Adirai Minutes</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={() => { logout(); navigate('/admin/login'); }} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <h1 className="font-bold text-slate-900">Platform Management</h1>
          <span className="text-sm text-slate-500">{user?.email || 'admin@adirai.com'}</span>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminAuthLayout() {
  return <Outlet />;
}
