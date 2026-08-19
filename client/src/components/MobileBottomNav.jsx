import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, Package, UserRound } from 'lucide-react';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/orders', label: 'Orders', icon: Package },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function MobileBottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="px-2 pb-3 pt-2">
        <div className="grid grid-cols-5 gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold transition ${
                  isActive ? 'text-brand-700' : 'text-soft-500 hover:text-brand-600'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
