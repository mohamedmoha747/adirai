import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, MapPin, Search, ShoppingBag, UserRound, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { formatAddressShort, useAddress } from '../../context/AddressContext.jsx';

export function CustomerHeader() {
  const navigate = useNavigate();
  const { count } = useCart();
  const { user } = useSession();
  const { selectedAddress } = useAddress();

  return (
    <header className="sticky top-0 z-50 border-b border-soft-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/customer/home" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">
            AM
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold text-ink">Adirai Minutes</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-soft-500">Grocery Delivery</div>
          </div>
        </Link>

        <Link
          to="/customer/addresses"
          className="hidden items-center gap-2 rounded-lg border border-soft-200 bg-soft-50 px-3 py-2 text-xs font-semibold text-ink hover:border-brand-300 hover:bg-brand-50 lg:flex"
          title="Change delivery location"
        >
          <MapPin size={14} className="text-brand-600" />
          <span className="text-soft-500">Deliver to</span>
          <span className="max-w-[14rem] truncate">
            {selectedAddress ? formatAddressShort(selectedAddress) : 'Add an address'}
          </span>
        </Link>

        <form
          className="hidden flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            const q = e.target.search.value;
            navigate(`/customer/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <div className="flex items-center gap-2 rounded-lg border border-soft-200 bg-soft-50 px-3 py-2.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
            <Search size={16} className="text-soft-400" />
            <input
              name="search"
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-soft-400"
              placeholder="Search groceries, snacks, dairy..."
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavLink to="/customer/categories" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-soft-600 hover:bg-soft-50 hover:text-brand-700 md:inline">
            Categories
          </NavLink>
          <NavLink to="/customer/orders" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-soft-600 hover:bg-soft-50 hover:text-brand-700 md:inline">
            Orders
          </NavLink>
          <Link
            to="/customer/notifications"
            className="relative rounded-lg p-2 text-soft-600 hover:bg-soft-50"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Link>
          <Link to="/customer/cart" className="relative rounded-lg p-2 text-soft-600 hover:bg-soft-50">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            to={user ? '/customer/profile' : '/customer/login'}
            className="flex items-center gap-2 rounded-lg border border-soft-200 px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-soft-50"
          >
            <UserRound size={18} className="text-brand-600" />
            <span className="hidden lg:inline">{user?.name || 'Login'}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function CustomerFooter() {
  return (
    <footer className="mt-auto border-t border-soft-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-extrabold text-white">AM</div>
            <span className="font-extrabold text-ink">Adirai Minutes</span>
          </div>
          <p className="mt-3 text-sm text-soft-600">Fast, safe grocery delivery across the city.</p>
        </div>
        <div>
          <h4 className="font-bold text-ink">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-soft-600">
            <li><Link to="/customer/categories" className="hover:text-brand-700">Categories</Link></li>
            <li><Link to="/customer/products" className="hover:text-brand-700">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-ink">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-soft-600">
            <li><Link to="/customer/orders" className="hover:text-brand-700">My Orders</Link></li>
            <li><Link to="/customer/profile" className="hover:text-brand-700">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-ink">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-soft-600">
            <li><Link to="/customer/help" className="hover:text-brand-700">Help Center</Link></li>
            <li><Link to="/customer/track" className="hover:text-brand-700">Track Order</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-soft-200 py-4 text-center text-xs text-soft-500">
        © 2026 Adirai Minutes. All rights reserved.
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  const items = [
    { to: '/customer/home', label: 'Home', icon: Package },
    { to: '/customer/categories', label: 'Categories', icon: Search },
    { to: '/customer/cart', label: 'Cart', icon: ShoppingBag },
    { to: '/customer/orders', label: 'Orders', icon: Package },
    { to: '/customer/profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-soft-200 bg-white md:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${isActive ? 'text-brand-700' : 'text-soft-500'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function CartToast() {
  const { feedback } = useCart();
  if (!feedback) return null;
  return (
    <div
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg md:bottom-6 ${
        feedback.type === 'error' ? 'bg-rose-600 text-white' : 'bg-brand-600 text-white'
      }`}
    >
      {feedback.message}
    </div>
  );
}
