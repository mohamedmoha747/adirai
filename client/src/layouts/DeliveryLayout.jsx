import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bike, Clock3, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function DeliveryLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between px-4 py-4">
        <div>
          <div className="font-display text-2xl">Adirai Ride</div>
          <div className="text-xs text-slate-400">{user?.name}</div>
        </div>
        <button
          className="rounded-full bg-white/10 p-2"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>
      <main className="px-4 pb-28">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 z-30 grid grid-cols-3 border-t border-white/10 bg-slate-950/95 px-2 py-2 backdrop-blur">
        <NavLink to="/delivery" end className={({ isActive }) => `flex flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
          <Home className="h-5 w-5" /> Assigned
        </NavLink>
        <NavLink to="/delivery/history" className={({ isActive }) => `flex flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>
          <Clock3 className="h-5 w-5" /> History
        </NavLink>
        <div className="flex flex-col items-center gap-1 py-2 text-xs text-slate-500">
          <Bike className="h-5 w-5" /> On road
        </div>
      </nav>
    </div>
  );
}
