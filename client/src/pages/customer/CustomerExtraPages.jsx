import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bell, HelpCircle, Mail, Phone, Search, Shield } from 'lucide-react';
import { notifications, products, profileMenu } from '../../data/mockData.js';
import { ProductCard } from '../../components/UiLibrary.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { AuthCard, AuthShell } from '../../components/auth/AuthLayout.jsx';
import { AuthInput, AuthPrimaryButton } from '../../components/auth/AuthInput.jsx';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <header className="border-b border-soft-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">AM</div>
            <span className="text-lg font-extrabold text-ink">Adirai Minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/customer/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">Login</Link>
            <Link to="/customer/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Grocery delivery platform</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink lg:text-5xl">
              Fresh groceries delivered to your doorstep in minutes
            </h1>
            <p className="mt-4 text-lg text-soft-600">
              Shop daily essentials, snacks, dairy, and more from AM Adirai Minutes — fast, safe, and trusted delivery across the city.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary px-8" onClick={() => navigate('/customer/home')}>
                Start Shopping
              </button>
              <button type="button" className="btn btn-secondary px-8" onClick={() => navigate('/delivery/login')}>
                Delivery Partner
              </button>
              <Link to="/admin/login" className="btn btn-secondary px-8 inline-flex items-center justify-center">
                Admin Console
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-soft-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {['🥬 Fresh produce', '🥤 Beverages', '🧴 Personal care', '🥐 Bakery'].map((item) => (
                <div key={item} className="rounded-xl bg-brand-50 p-4 text-sm font-semibold text-brand-800">{item}</div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-soft-500">Free delivery on orders above ₹299</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Forgot password</h1>
          <p className="auth-subtitle">Enter your email and we&apos;ll send a reset link.</p>
        </div>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/customer/verify-otp');
          }}
        >
          <AuthInput label="Email address" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <AuthPrimaryButton>Send reset link</AuthPrimaryButton>
          <p className="auth-footer-link">
            <Link to="/customer/login" className="auth-link">Back to login</Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle">Enter the 4-digit code sent to your mobile.</p>
        </div>
        <div className="flex justify-center gap-3 py-2">
          {otp.map((d, i) => (
            <input
              key={i}
              className="h-14 w-14 rounded-2xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              maxLength={1}
              value={d}
              onChange={(e) => {
                const next = [...otp];
                next[i] = e.target.value;
                setOtp(next);
              }}
            />
          ))}
        </div>
        <button type="button" className="auth-primary-btn mt-4 w-full" onClick={() => navigate('/customer/login')}>
          Verify & Continue
        </button>
        <p className="auth-footer-link mt-4">
          <Link to="/customer/login" className="auth-link">Back to login</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}

export function SearchResultsPage() {
  const [params] = useSearchParams();
  const { addToCart } = useCart();
  const q = (params.get('q') || '').toLowerCase();

  const results = useMemo(
    () => products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
    [q],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-ink">Search results</h1>
      <p className="mt-1 text-sm text-soft-600">{results.length} products for &quot;{params.get('q') || 'all'}&quot;</p>
      <div className="product-grid mt-8">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => (product.inStock ? addToCart(product.id, 1) : null)}
          />
        ))}
      </div>
      {results.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-soft-200 bg-white py-16 text-center">
          <Search className="mx-auto text-soft-400" size={40} />
          <p className="mt-4 font-semibold text-ink">No products found</p>
        </div>
      )}
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-ink">Notifications</h1>
      <div className="mt-6 space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-xl border border-soft-200 bg-white p-4 ${n.read ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-3">
              <Bell size={18} className="mt-0.5 text-brand-600" />
              <div>
                <p className="font-semibold text-ink">{n.title}</p>
                <p className="text-xs text-soft-500">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HelpSupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-ink">Help & Support</h1>
      <div className="mt-6 space-y-4">
        {[
          { q: 'How fast is delivery?', a: 'Most orders arrive within 30–40 minutes.' },
          { q: 'Can I cancel my order?', a: 'Yes, before it is out for delivery from the Orders page.' },
          { q: 'What payment methods are supported?', a: 'COD, UPI, cards, and wallet.' },
        ].map((item) => (
          <div key={item.q} className="rounded-xl border border-soft-200 bg-white p-5">
            <div className="flex items-center gap-2 font-bold text-ink"><HelpCircle size={16} className="text-brand-600" /> {item.q}</div>
            <p className="mt-2 text-sm text-soft-600">{item.a}</p>
          </div>
        ))}
        <div className="rounded-xl border border-soft-200 bg-brand-50 p-5">
          <p className="font-bold text-ink">Contact us</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-soft-600"><Phone size={14} /> +91 44 1234 5678</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-soft-600"><Mail size={14} /> support@adirai.com</p>
        </div>
      </div>
    </div>
  );
}

export function PaymentMethodsPage() {
  const methods = [
    { id: 'upi', title: 'UPI', detail: 'GPay, PhonePe, Paytm' },
    { id: 'card', title: 'Credit / Debit Card', detail: 'Visa, Mastercard, RuPay' },
    { id: 'cod', title: 'Cash on Delivery', detail: 'Pay when order arrives' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-ink">Payment Methods</h1>
      <div className="mt-6 space-y-3">
        {methods.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl border border-soft-200 bg-white p-4">
            <div>
              <p className="font-bold text-ink">{m.title}</p>
              <p className="text-sm text-soft-600">{m.detail}</p>
            </div>
            <Shield size={18} className="text-brand-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-ink">About AM Adirai Minutes</h1>
      <p className="mt-4 text-soft-600 leading-relaxed">
        AM Adirai Minutes is a professional grocery delivery platform serving Chennai and surrounding areas.
        We partner with trusted stores and delivery partners to bring fresh products to your home quickly and safely.
      </p>
      <ul className="mt-6 space-y-2 text-sm text-soft-600">
        {profileMenu.map((item) => (
          <li key={item.label}><Link to={item.path} className="font-semibold text-brand-700 hover:underline">{item.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('am_orders') || '[]');
  const order = stored.find((o) => o.id === id) || { id, status: 'Processing', total: 0, date: '—', items: 0 };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <button type="button" onClick={() => navigate('/customer/orders')} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700">
        <ArrowLeft size={16} /> Back to orders
      </button>
      <h1 className="text-2xl font-extrabold text-ink">Order {order.id}</h1>
      <div className="mt-6 rounded-xl border border-soft-200 bg-white p-5 space-y-2">
        <p><span className="text-soft-500">Status:</span> <strong>{order.status}</strong></p>
        <p><span className="text-soft-500">Date:</span> {order.date}</p>
        <p><span className="text-soft-500">Items:</span> {order.items}</p>
        <p><span className="text-soft-500">Total:</span> ₹{order.total}</p>
      </div>
      <button type="button" className="btn btn-primary mt-6 w-full sm:w-auto" onClick={() => navigate(`/customer/track/${order.id}`)}>
        Track order
      </button>
    </div>
  );
}
