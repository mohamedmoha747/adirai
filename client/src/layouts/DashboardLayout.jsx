import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export function DashboardLayout({ title, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-slate-950 p-4 text-white transition md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 px-2 font-display text-2xl">Adirai {title}</div>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/5'}`
              }
            >
              {link.icon || <LayoutDashboard className="h-4 w-4" />}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="mt-10 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="md:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button className="rounded-xl p-2 md:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm font-semibold">{user?.name}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{user?.role?.replaceAll('_', ' ')}</div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
