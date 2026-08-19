import { ChevronRight, Bell, HelpCircle, LogOut, MapPinned, ShieldCheck, Truck, UserRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';

const iconMap = {
  'My Addresses': MapPinned,
  'Payment Methods': ShieldCheck,
  'My Orders': Truck,
  Notifications: Bell,
  'Help & Support': HelpCircle,
  'About AM': UserRound,
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useSession();

  const menuItems = [
    { label: 'My Addresses', action: () => navigate('/customer/addresses') },
    { label: 'Payment Methods', action: () => navigate('/customer/payment-methods') },
    { label: 'My Orders', action: () => navigate('/customer/orders') },
    { label: 'Notifications', action: () => navigate('/customer/notifications') },
    { label: 'Help & Support', action: () => navigate('/customer/help') },
    { label: 'About AM', action: () => navigate('/customer/about') },
    {
      label: 'Logout',
      icon: LogOut,
      action: () => {
        logout();
        navigate('/customer/login');
      },
    },
  ];

  const displayName = user?.name || 'Guest User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="am-content">
      <div className="hidden bg-white md:block">
        <div className="am-container py-6">
          <button type="button" onClick={() => navigate('/customer/home')} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700">
            <ArrowLeft size={18} /> Back to Home
          </button>
          <div className="flex items-end gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-4xl font-extrabold text-white">
              {initial}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-ink">{displayName}</h1>
              <p className="mt-1 text-soft-600">{user?.phone || user?.email || 'Sign in for full access'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="purple-gradient px-4 pb-6 pt-5 text-white md:hidden">
        <div className="flex items-center justify-between">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white" onClick={() => navigate('/customer/home')}>←</button>
          {!user && (
            <button type="button" className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold" onClick={() => navigate('/customer/login')}>Login</button>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-xl font-extrabold">{initial}</div>
          <div>
            <div className="text-xl font-extrabold">{displayName}</div>
            <div className="text-sm text-white/80">{user?.phone || 'Browse as guest'}</div>
          </div>
        </div>
      </div>

      <div className="relative pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map(({ label, icon: IconOverride, action }) => {
              const Icon = IconOverride || iconMap[label] || UserRound;
              return (
                <button key={label} type="button" className="am-card-lg flex items-center justify-between gap-4 p-5 text-left transition hover:shadow-lg" onClick={action}>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#f3ebff] text-brand-700"><Icon size={20} /></div>
                    <span className="font-bold text-ink">{label}</span>
                  </div>
                  <ChevronRight size={18} className="text-soft-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
