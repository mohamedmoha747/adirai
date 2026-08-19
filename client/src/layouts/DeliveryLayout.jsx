import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bike, LayoutDashboard, LogOut, Package, User } from 'lucide-react';
import { useSession } from '../context/SessionContext.jsx';

const nav = [
  { to: '/delivery/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/delivery/deliveries', label: 'Deliveries', icon: Package },
  { to: '/delivery/history', label: 'History', icon: Bike },
  { to: '/delivery/earnings', label: 'Earnings', icon: Package },
  { to: '/delivery/notifications', label: 'Notifications', icon: Package },
  { to: '/delivery/support', label: 'Support', icon: Package },
  { to: '/delivery/profile', label: 'Profile', icon: User },
];

export function DeliveryLayout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold">AM</div>
            <div>
              <div className="font-bold">Delivery Portal</div>
              <div className="text-xs text-slate-400">Partner Operations</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={() => { logout(); navigate('/delivery/login'); }} className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <h1 className="font-bold text-slate-900">{user?.name || 'Delivery Partner'}</h1>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">On Duty</span>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DeliveryAuthLayout() {
  return <Outlet />;
}
