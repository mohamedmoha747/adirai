import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminStats, categories, customers, deliveryPartners, orders, products } from '../../data/mockData.js';
import { useSession } from '../../context/SessionContext.jsx';
import { StatCard } from '../../components/Cards.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { AuthCard, AuthShell, AuthSecureNote } from '../../components/auth/AuthLayout.jsx';
import { AuthInput, AuthPrimaryButton } from '../../components/auth/AuthInput.jsx';
import { Lock, Mail } from 'lucide-react';
import { formatMoney } from '../../utils/format.js';

const trend = [
  { day: 'Mon', orders: 72, revenue: 42000 },
  { day: 'Tue', orders: 81, revenue: 48000 },
  { day: 'Wed', orders: 86, revenue: 51000 },
  { day: 'Thu', orders: 78, revenue: 46000 },
  { day: 'Fri', orders: 94, revenue: 58000 },
  { day: 'Sat', orders: 102, revenue: 62000 },
  { day: 'Sun', orders: 88, revenue: 53000 },
];

function TableShell({ children }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">{children}</div>;
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({ email: 'admin@adirai.com', password: '' });
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Enter admin email and password.');
      return;
    }
    login('admin', { email: form.email.trim() });
    navigate('/admin/dashboard');
  }

  return (
    <AuthShell forceLight>
      <AuthCard>
        <div className="auth-card-head">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">Admin Console</p>
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-subtitle">Secure access to platform operations, orders, and delivery management.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <AuthInput
            label="Admin email"
            type="email"
            icon={Mail}
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
            placeholder="admin@adirai.com"
            autoComplete="email"
          />
          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            value={form.password}
            onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {error && <p className="auth-error-banner">{error}</p>}
          <AuthPrimaryButton>Sign In</AuthPrimaryButton>
          <p className="auth-footer-link">
            <Link to="/customer" className="auth-link">← Back to customer website</Link>
          </p>
          <AuthSecureNote />
        </form>
      </AuthCard>
    </AuthShell>
  );
}

export function AdminDashboardPage() {
  const s = adminStats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customers" value={s.totalCustomers.toLocaleString()} />
        <StatCard label="Total Orders" value={s.totalOrders.toLocaleString()} />
        <StatCard label="Today's Orders" value={s.todayOrders} />
        <StatCard label="Revenue" value={formatMoney(s.revenue)} />
        <StatCard label="Active Deliveries" value={s.activeDeliveries} />
        <StatCard label="Delivery Partners" value={s.deliveryPartners} />
        <StatCard label="Products" value={s.products} />
        <StatCard label="Categories" value={s.categories} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">7-day order volume</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#5a2ac6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Recent orders</h2>
          <div className="mt-4 space-y-2">
            {orders.slice(0, 4).map((o) => (
              <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold">{o.id}</span>
                <StatusBadge status={o.status === 'Delivered' ? 'DELIVERED' : o.status === 'Processing' ? 'PROCESSING' : 'CANCELLED'} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminCustomersPage() {
  const [q, setQ] = useState('');
  const filtered = customers.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Customers</h1>
      <input className="input max-w-sm" placeholder="Search customers..." value={q} onChange={(e) => setQ(e.target.value)} />
      <TableShell>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Joined</th></tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.orders}</td>
                <td className="px-4 py-3">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}

export function AdminDeliveryPartnersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Delivery Partners</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deliveryPartners.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold">{p.name}</p>
              <StatusBadge status={p.status === 'Active' ? 'ACCEPTED' : p.status === 'On Delivery' ? 'ON_THE_WAY' : 'PENDING'} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{p.phone}</p>
            <p className="text-sm text-slate-600">{p.vehicle} · {p.vehicleNo}</p>
            <p className="mt-3 text-sm font-semibold">Today: {p.todayDeliveries} deliveries · ₹{p.earnings}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <button type="button" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Add Product</button>
      </div>
      <TableShell>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3"><StatusBadge status={p.inStock ? 'ACCEPTED' : 'CANCELLED'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}

export function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <div className="text-3xl">{c.icon}</div>
            <p className="mt-2 font-bold">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminOrdersPage() {
  const [tab, setTab] = useState('All');
  const stored = JSON.parse(localStorage.getItem('am_orders') || '[]');
  const allOrders = useMemo(() => [...stored, ...orders.map((o) => ({ ...o, items: o.items }))], [stored]);
  const filtered = allOrders.filter((o) => tab === 'All' || o.status === tab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Orders</h1>
      <div className="flex gap-2">
        {['All', 'Processing', 'Delivered', 'Cancelled'].map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === t ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white'}`}>{t}</button>
        ))}
      </div>
      <TableShell>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{o.id}</td>
                <td className="px-4 py-3">{o.date}</td>
                <td className="px-4 py-3">{o.items}</td>
                <td className="px-4 py-3">₹{o.total}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status === 'Delivered' ? 'DELIVERED' : o.status === 'Processing' ? 'PROCESSING' : 'CANCELLED'} /></td>
                <td className="px-4 py-3"><Link to={`/admin/orders/${o.id}`} className="font-semibold text-brand-700">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id) || { id, status: 'Processing', total: 420, date: 'Today', items: 3, partner: 'Arun Kumar' };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <h1 className="text-xl font-extrabold">{order.id}</h1>
        <StatusBadge status={order.status === 'Delivered' ? 'DELIVERED' : 'PROCESSING'} />
        <p className="text-sm text-slate-600">Date: {order.date}</p>
        <p className="text-sm text-slate-600">Items: {order.items}</p>
        <p className="text-sm font-bold">Total: ₹{order.total}</p>
        <p className="text-sm text-slate-600">Partner: {order.partner || 'Unassigned'}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Assign partner</button>
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">Cancel order</button>
        </div>
      </div>
    </div>
  );
}

export function AdminPaymentsPage() {
  const rows = orders.map((o) => ({ id: o.id, amount: o.total, method: 'COD', status: o.isCancelled ? 'FAILED' : 'PAID' }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Payments</h1>
      <TableShell>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{r.id}</td>
                <td className="px-4 py-3">₹{r.amount}</td>
                <td className="px-4 py-3">{r.method}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}

export function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Revenue</h1>
      <StatCard label="Total revenue" value={formatMoney(adminStats.revenue)} />
      <div className="rounded-xl border border-slate-200 bg-white p-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <XAxis dataKey="day" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#38d1ea" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AdminOffersPage() {
  const offers = [
    { code: 'AM299', title: 'Free delivery above ₹299', status: 'Active' },
    { code: 'FRESH10', title: '10% off on fruits', status: 'Active' },
    { code: 'NEWUSER', title: '₹50 off first order', status: 'Scheduled' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Offers & Coupons</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <div key={o.code} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-bold text-brand-700">{o.code}</p>
            <p className="mt-1 text-sm text-slate-600">{o.title}</p>
            <StatusBadge status={o.status === 'Active' ? 'ACCEPTED' : 'PENDING'} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDeliveryMgmtPage() {
  return <AdminDeliveryPartnersPage />;
}

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Avg. order value" value="₹412" />
        <StatCard label="Fulfillment rate" value="96.4%" />
        <StatCard label="Avg. delivery time" value="34 min" />
      </div>
    </div>
  );
}

export function AdminNotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Notifications</h1>
      {['86 orders placed today', '3 partners pending verification', 'Low stock: Aavin Toned Milk'].map((t) => (
        <div key={t} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold">{t}</div>
      ))}
    </div>
  );
}

export function AdminSettingsPage() {
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold">Settings</h1>
      {['Delivery fee rules', 'Platform commission', 'Notification templates', 'Payment gateway'].map((s) => (
        <div key={s} className="rounded-xl border border-slate-200 bg-white p-4 font-semibold">{s}</div>
      ))}
    </div>
  );
}

export function AdminProfilePage() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold">Admin Profile</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="font-bold">{user?.name || 'Admin'}</p>
        <p className="text-sm text-slate-600">{user?.email || 'admin@adirai.com'}</p>
      </div>
      <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => { logout(); navigate('/admin/login'); }}>Logout</button>
    </div>
  );
}
