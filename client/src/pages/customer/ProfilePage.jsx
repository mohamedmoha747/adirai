import { ChevronRight, Bell, HelpCircle, LogOut, MapPinned, ShieldCheck, Truck, UserRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { profileMenu } from '../../data/mockData.js';
import { Footer } from '../../components/UiLibrary.jsx';

export function ProfilePage() {
  const navigate = useNavigate();
  const menuItems = [
    { label: 'My Addresses', icon: MapPinned, action: () => navigate('/addresses') },
    { label: 'Payment Methods', icon: ShieldCheck, action: () => navigate('/checkout') },
    { label: 'My Orders', icon: Truck, action: () => navigate('/orders') },
    { label: 'Notifications', icon: Bell, action: () => navigate('/orders') },
    { label: 'Help & Support', icon: HelpCircle, action: () => navigate('/orders') },
    { label: 'About AM', icon: UserRound, action: () => navigate('/home') },
    { label: 'Logout', icon: LogOut, action: () => navigate('/login') },
  ];

  return (
    <div className="am-content">
      {/* Desktop Profile Header */}
      <div className="hidden bg-white md:block">
        <div className="am-container py-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <div className="flex items-end gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-4xl font-extrabold text-white">
              F
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-ink">Faheem Ibrahim</h1>
              <p className="mt-1 text-soft-600">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile Header */}
      <div className="purple-gradient px-4 pb-6 pt-5 text-white md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white"
            onClick={() => navigate('/home')}
          >
            ←
          </button>
          <button type="button" className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            Edit Profile
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 text-xl font-extrabold text-white">
            F
          </div>
          <div>
            <div className="text-xl font-extrabold">Faheem Ibrahim</div>
            <div className="text-sm text-white/80">+91 98765 43210</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="relative pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          {/* Desktop Grid Layout */}
          <div className="hidden grid gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                className="am-card-lg flex flex-col items-start justify-between gap-4 p-6 text-left transition hover:shadow-lg"
                onClick={action}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f3ebff] text-brand-700 flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="text-base font-bold text-ink">{label}</span>
                </div>
                <ChevronRight size={18} className="text-soft-400 self-end" />
              </button>
            ))}
          </div>

          {/* Mobile Stack Layout */}
          <div className="-mt-4 space-y-3 px-3 pb-4 md:hidden">
            {menuItems.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                className="am-card flex w-full items-center justify-between gap-3 p-3 text-left"
                onClick={action}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f3ebff] text-brand-700">
                    <Icon size={17} />
                  </div>
                  <span className="text-sm font-bold text-ink">{label}</span>
                </div>
                <ChevronRight size={16} className="text-soft-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
