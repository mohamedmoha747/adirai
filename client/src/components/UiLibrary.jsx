import { ArrowLeft, Bell, ChevronRight, CreditCard, MapPin, Minus, Plus, Search, ShoppingBag, Star, Truck, Wallet, MessageSquare, Phone, MoreHorizontal, CircleCheckBig, Sparkles, PackageCheck, X, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function DesktopHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-soft-200 bg-white/95 backdrop-blur-sm md:block">
      <div className="am-container">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-sm font-extrabold text-white">
              AM
            </div>
            <span className="hidden text-lg font-extrabold text-ink lg:inline">Adirai Minutes</span>
          </button>

          {/* Location */}
          <button type="button" className="hidden items-center gap-2 rounded-full bg-soft-50 px-4 py-2.5 text-sm text-ink transition hover:bg-soft-100 lg:flex">
            <MapPin size={16} className="text-brand-600" />
            <span className="font-semibold">Deliver to</span>
            <span className="text-soft-600">Anna Nagar</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 rounded-full bg-soft-50 px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-brand-500/20">
              <Search size={18} className="text-soft-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-soft-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-soft-600 transition hover:bg-soft-100"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-soft-600 transition hover:bg-soft-100"
            >
              <ShoppingBag size={20} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-100 text-soft-600 transition hover:bg-soft-200"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppHeader({ title, subtitle, onBack, rightSlot, showSearch = false }) {
  return (
    <header className="px-4 pb-4 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm" onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            {title && <h1 className="text-lg font-extrabold text-ink">{title}</h1>}
            {subtitle && <p className="text-[11px] text-soft-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm">
              <Search size={18} />
            </button>
          )}
          {rightSlot}
        </div>
      </div>
    </header>
  );
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={cn('btn btn-primary w-full', className)} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={cn('btn btn-secondary w-full', className)} {...props}>
      {children}
    </button>
  );
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center text-sm font-medium text-soft-500">
      <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-soft-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ebff] text-brand-600">
        <ShoppingBag size={22} />
      </div>
      <h3 className="text-base font-extrabold text-ink">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-soft-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
      {message}
    </div>
  );
}

export function PromotionalBanner({ title, subtitle, cta = 'Order now', compact = false, desktop = false }) {
  return (
    <div
      className={cn(
        'purple-gradient relative overflow-hidden rounded-2xl text-white shadow-[0_18px_38px_-22px_rgba(95,44,207,0.9)]',
        desktop ? 'min-h-[320px] md:min-h-[400px]' : compact ? 'min-h-[110px]' : 'min-h-[140px]'
      )}
    >
      <div className="absolute -right-4 -top-5 h-28 w-28 rounded-full bg-white/10 md:-right-12 md:-top-12 md:h-48 md:w-48" />
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-cyan-300/20 md:-left-16 md:h-40 md:w-40" />
      <div className="relative flex h-full flex-col justify-between gap-4 p-6 md:p-10">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 md:text-xs">
            Fast • Safe • Trusted
          </p>
          <h3 className={cn('font-extrabold leading-tight', desktop ? 'text-3xl md:text-4xl max-w-sm' : 'text-lg max-w-[180px]')}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn('mt-2 text-white/80', desktop ? 'text-base md:text-lg max-w-md' : 'text-xs')}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-2xl shadow-lg backdrop-blur-sm md:h-16 md:w-16">
            <Sparkles size={24} />
          </div>
          {cta && (
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/80 md:text-xs">
              {cta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CategoryCard({ category, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center rounded-[1.5rem] border px-3 py-4 text-center transition md:rounded-2xl md:px-4 md:py-5',
        selected ? 'border-brand-200 bg-[#f3ecff] text-brand-700' : 'border-soft-200 bg-white text-ink hover:border-brand-200 hover:bg-soft-50'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7f1ff] text-2xl md:h-14 md:w-14 md:text-3xl">
        {category.icon}
      </div>
      <span className="mt-2 text-[11px] font-semibold leading-tight md:text-xs">{category.name}</span>
    </button>
  );
}

export function ProductCard({ product, onAdd, compact = false }) {
  return (
    <div className="am-card-lg group overflow-hidden transition hover:shadow-lg">
      <div className="relative h-40 overflow-hidden bg-[#f3f5f9] md:h-48">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <button
          type="button"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-brand-700 shadow-md transition hover:scale-110 md:h-12 md:w-12"
          onClick={onAdd}
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="p-4 md:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-500">
          {product.category}
        </p>
        <h3 className="mt-2 line-clamp-2 text-sm font-extrabold text-ink md:text-base">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-soft-500 md:text-sm">{product.unit}</p>
            <p className="mt-1 text-base font-extrabold text-ink md:text-lg">
              ₹{product.price}
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-brand-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-brand-700 md:px-4 md:py-2.5 md:text-sm"
            onClick={onAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuantitySelector({ value, onDecrease, onIncrease, compact = false }) {
  return (
    <div className={cn('inline-flex items-center rounded-full border border-soft-200 bg-white', compact ? 'h-9 px-1.5' : 'h-10 px-2')}>
      <button type="button" className="grid h-7 w-7 place-items-center rounded-full text-brand-700" onClick={onDecrease}>
        <Minus size={14} />
      </button>
      <span className="min-w-[22px] text-center text-sm font-bold text-ink">{value}</span>
      <button type="button" className="grid h-7 w-7 place-items-center rounded-full text-brand-700" onClick={onIncrease}>
        <Plus size={14} />
      </button>
    </div>
  );
}

export function PriceDisplay({ amount, size = 'base' }) {
  return <span className={cn('font-extrabold text-ink', size === 'lg' ? 'text-xl' : 'text-sm')}>₹{amount}</span>;
}

export function AddressCard({ address, selected = false, onSelect, onEdit }) {
  return (
    <div className={cn('am-card p-3', selected && 'border-brand-200 bg-[#f8f3ff]')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]', selected ? 'bg-brand-600 text-white' : 'bg-soft-100 text-soft-600')}>{address.type}</span>
          {address.isDefault && <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-600">Default</span>}
        </div>
        {onEdit && (
          <button type="button" className="text-[11px] font-bold text-brand-700" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="mt-1 rounded-full bg-[#f1ebff] p-2 text-brand-700"><MapPin size={14} /></span>
        <div className="flex-1 text-sm text-soft-600">
          <p className="font-extrabold text-ink">{address.name}</p>
          <p className="mt-1">{address.line1}</p>
          <p>{address.line2}</p>
          <p className="mt-1 text-soft-500">{address.phone}</p>
        </div>
      </div>
      <button type="button" onClick={onSelect} className={cn('mt-3 w-full rounded-full px-3 py-2 text-sm font-semibold', selected ? 'bg-brand-600 text-white' : 'bg-soft-100 text-soft-700')}>
        {selected ? 'Selected' : 'Select address'}
      </button>
    </div>
  );
}

export function OrderCard({ order, type = 'default', onReorder, onView }) {
  const statusStyle = {
    Delivered: 'bg-emerald-100 text-emerald-700',
    Processing: 'bg-amber-100 text-amber-700',
    Cancelled: 'bg-rose-100 text-rose-700',
    default: 'bg-brand-50 text-brand-700',
  };

  return (
    <div className="am-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-soft-500">Order {order.id}</p>
          <p className="mt-1 text-[11px] text-soft-500">{order.date}</p>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]', statusStyle[order.status] || statusStyle.default)}>{order.status}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-soft-200 pt-3">
        <div>
          <p className="text-[11px] text-soft-500">Total Amount</p>
          <p className="text-lg font-extrabold text-ink">₹{order.total}</p>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'Cancelled' ? (
            <button type="button" className="btn btn-outline px-3 py-2 text-[11px]" onClick={onView}>View</button>
          ) : (
            <button type="button" className="btn btn-soft px-3 py-2 text-[11px]" onClick={onReorder}>Reorder</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OrderStatusTimeline({ steps, activeStep }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isDone = index <= activeStep;
        const isActive = index === activeStep;

        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('grid h-6 w-6 place-items-center rounded-full border', isDone ? 'border-brand-600 bg-brand-600 text-white' : 'border-soft-300 bg-white text-soft-400')}>
                {isDone ? <CircleCheckBig size={12} /> : <span className="h-2 w-2 rounded-full bg-soft-300" />}
              </div>
              {index < steps.length - 1 && <div className={cn('mt-1 h-8 w-px', isDone ? 'bg-brand-500' : 'bg-soft-200')} />}
            </div>
            <div className={cn('pt-0.5 text-sm font-semibold', isActive ? 'text-brand-700' : isDone ? 'text-soft-600' : 'text-soft-400')}>
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PaymentMethodCard({ title, icon, selected = false, onClick }) {
  return (
    <button type="button" className={cn('flex w-full items-center justify-between rounded-[1.2rem] border p-3 text-left', selected ? 'border-brand-200 bg-[#f7f2ff]' : 'border-soft-200 bg-white')} onClick={onClick}>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f3ebff] text-brand-700">{icon}</span>
        <span className="text-sm font-bold text-ink">{title}</span>
      </div>
      <span className={cn('h-4 w-4 rounded-full border', selected ? 'border-brand-600 bg-brand-600' : 'border-soft-300 bg-white')} />
    </button>
  );
}

export function BottomNavigation() {
  const nav = [
    { to: '/home', label: 'Home', icon: Sparkles },
    { to: '/categories', label: 'Categories', icon: Search },
    { to: '/cart', label: 'Cart', icon: ShoppingBag },
    { to: '/orders', label: 'Orders', icon: PackageCheck },
    { to: '/profile', label: 'Profile', icon: Bell },
  ];

  return (
    <nav className="border-t border-soft-200 bg-white/95 px-2 pb-3 pt-2 backdrop-blur-sm">
      <div className="grid grid-cols-5 gap-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <button key={to} type="button" className="flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold text-soft-500 transition hover:text-brand-700">
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h4 className="font-semibold text-ink">{title}</h4>
      <p className="mt-2 text-sm text-soft-600">{description}</p>
    </div>
  );
}

export function PromoCard({ badge, title, description, cta = 'Shop Now', icon }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg">
      <div className="flex gap-6 p-6 md:p-8">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-brand-700 mb-3">
            {badge}
          </span>
          <h3 className="text-xl font-extrabold text-ink md:text-2xl">{title}</h3>
          <p className="mt-2 text-sm text-soft-600 md:text-base">{description}</p>
          <button className="btn btn-primary mt-4 px-6 py-2.5 text-sm">
            {cta}
          </button>
        </div>
        {icon && <div className="flex-shrink-0 text-5xl">{icon}</div>}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="hidden border-t border-soft-200 bg-white md:block">
      <div className="am-container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-sm font-extrabold text-white">
                AM
              </div>
              <span className="font-extrabold text-ink">Adirai Minutes</span>
            </div>
            <p className="text-sm text-soft-600">Fast, safe, and trusted grocery delivery at your doorstep.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-extrabold text-ink">Shop</h4>
            <ul className="space-y-2 text-sm text-soft-600">
              <li><a href="#" className="transition hover:text-brand-700">Categories</a></li>
              <li><a href="#" className="transition hover:text-brand-700">All Products</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Special Offers</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Deals</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-extrabold text-ink">Company</h4>
            <ul className="space-y-2 text-sm text-soft-600">
              <li><a href="#" className="transition hover:text-brand-700">About Us</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Blog</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Careers</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-extrabold text-ink">Support</h4>
            <ul className="space-y-2 text-sm text-soft-600">
              <li><a href="#" className="transition hover:text-brand-700">Contact Us</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Help & FAQ</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Track Order</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-extrabold text-ink">Legal</h4>
            <ul className="space-y-2 text-sm text-soft-600">
              <li><a href="#" className="transition hover:text-brand-700">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Terms of Service</a></li>
              <li><a href="#" className="transition hover:text-brand-700">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-soft-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-soft-600 md:text-left">
              © 2026 Adirai Minutes. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-soft-600 transition hover:text-brand-700">📘</a>
              <a href="#" className="text-soft-600 transition hover:text-brand-700">🐦</a>
              <a href="#" className="text-soft-600 transition hover:text-brand-700">📷</a>
              <a href="#" className="text-soft-600 transition hover:text-brand-700">🎥</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
