import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bike, Clock, MapPin, Package, Phone, TrendingUp, Mail, Lock, UserRound, Phone as PhoneIcon, Car, CreditCard } from 'lucide-react';
import { deliveryJobs, deliveryPartners } from '../../data/mockData.js';
import { useSession } from '../../context/SessionContext.jsx';
import { AuthCard, AuthShell, AuthSecureNote } from '../../components/auth/AuthLayout.jsx';
import { AuthInput, AuthPrimaryButton } from '../../components/auth/AuthInput.jsx';

const JOBS_KEY = 'am_delivery_jobs';

function loadJobs() {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? JSON.parse(raw) : deliveryJobs;
  } catch {
    return deliveryJobs;
  }
}

function saveJobs(jobs) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

function StatusPill({ status }) {
  const colors = {
    Pending: 'bg-amber-100 text-amber-800',
    Active: 'bg-sky-100 text-sky-800',
    Pickup: 'bg-violet-100 text-violet-800',
    'Out for Delivery': 'bg-orange-100 text-orange-800',
    Delivered: 'bg-emerald-100 text-emerald-800',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

function DashCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <Icon size={18} className="text-brand-600" />
      </div>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function DeliveryLoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({ email: '', password: '' });

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">Sign in to manage deliveries, earnings, and active orders.</p>
        </div>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            login('delivery', { email: form.email });
            navigate('/delivery/dashboard');
          }}
        >
          <AuthInput label="Email address" type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="delivery@adirai.com" />
          <AuthInput label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <AuthPrimaryButton>Sign In</AuthPrimaryButton>
          <p className="auth-footer-link">
            New partner? <Link to="/delivery/register" className="auth-link">Register</Link>
          </p>
          <AuthSecureNote />
        </form>
      </AuthCard>
    </AuthShell>
  );
}

export function DeliveryRegisterPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '', vehicle: 'Bike', vehicleNo: '', license: '', address: '',
  });
  const [accepted, setAccepted] = useState(false);

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Create partner account</h1>
          <p className="auth-subtitle">Join Adirai Minutes as a delivery partner and start earning.</p>
        </div>
        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!accepted) return;
            login('delivery', form);
            navigate('/delivery/dashboard');
          }}
        >
          <AuthInput label="Full Name" icon={UserRound} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          <AuthInput label="Mobile Number" icon={PhoneIcon} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 90000 00000" />
          <AuthInput label="Email address" type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <AuthInput label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <label className="auth-field">
            <span className="auth-field-label">Vehicle Type</span>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><Car size={18} /></span>
              <select className="auth-select" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                <option>Bike</option><option>Scooter</option><option>Van</option>
              </select>
            </div>
          </label>
          <AuthInput label="Vehicle Number" icon={CreditCard} value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })} placeholder="TN 09 AB 1234" />
          <AuthInput label="Driving License" icon={CreditCard} value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} placeholder="License number" />
          <AuthInput label="Address" icon={MapPin} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your address" />
          <label className="auth-checkbox">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="auth-checkbox-input" />
            <span className="auth-checkbox-box" />
            <span>I agree to the <Link to="/delivery/login" className="auth-link">Terms of Service</Link> and <Link to="/delivery/login" className="auth-link">Privacy Policy</Link></span>
          </label>
          <AuthPrimaryButton>Get Started</AuthPrimaryButton>
          <p className="auth-footer-link">
            Already registered? <Link to="/delivery/login" className="auth-link">Login</Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}

export function DeliveryDashboardPage() {
  const [jobs] = useState(loadJobs);
  const stats = useMemo(() => ({
    today: jobs.filter((j) => j.status !== 'Delivered').length + 6,
    active: jobs.filter((j) => j.status === 'Active' || j.status === 'Out for Delivery').length,
    completed: 6,
    earnings: 1240,
    pending: jobs.filter((j) => j.status === 'Pending').length,
  }), [jobs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Today&apos;s delivery overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashCard label="Today's Deliveries" value={stats.today} icon={Package} />
        <DashCard label="Active Orders" value={stats.active} icon={Clock} />
        <DashCard label="Completed" value={stats.completed} icon={TrendingUp} />
        <DashCard label="Today's Earnings" value={`₹${stats.earnings}`} icon={Bike} />
        <DashCard label="Pending Requests" value={stats.pending} icon={Package} hint="Awaiting acceptance" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-slate-900">Recent assignments</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr><th className="pb-3 pr-4">Order</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Amount</th><th className="pb-3">Status</th></tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((j) => (
                <tr key={j.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-semibold"><Link to={`/delivery/deliveries/${j.id}`} className="text-brand-700">{j.orderId}</Link></td>
                  <td className="py-3 pr-4">{j.customer}</td>
                  <td className="py-3 pr-4">₹{j.amount}</td>
                  <td className="py-3"><StatusPill status={j.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function DeliveryListPage() {
  const [jobs, setJobs] = useState(loadJobs);
  const [tab, setTab] = useState('all');

  const filtered = jobs.filter((j) => tab === 'all' || j.status.toLowerCase().includes(tab));

  function accept(id) {
    const next = jobs.map((j) => (j.id === id ? { ...j, status: 'Active' } : j));
    setJobs(next);
    saveJobs(next);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Available Deliveries</h1>
      <div className="flex gap-2">
        {['all', 'pending', 'active'].map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((j) => (
          <div key={j.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{j.orderId}</span>
              <StatusPill status={j.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600"><MapPin size={14} className="inline mr-1" />{j.pickup} → {j.drop}</p>
            <p className="mt-1 text-sm font-semibold">₹{j.amount} · {j.payment}</p>
            <div className="mt-4 flex gap-2">
              {j.status === 'Pending' && (
                <button type="button" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => accept(j.id)}>Accept</button>
              )}
              <Link to={`/delivery/deliveries/${j.id}`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">View details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeliveryDetailPage() {
  const { id } = useParams();
  const [jobs, setJobs] = useState(loadJobs);
  const job = jobs.find((j) => j.id === id);

  if (!job) return <p className="text-slate-500">Delivery not found.</p>;

  function updateStatus(status) {
    const next = jobs.map((j) => (j.id === id ? { ...j, status } : j));
    setJobs(next);
    saveJobs(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
        <h1 className="text-xl font-extrabold">{job.orderId}</h1>
        <StatusPill status={job.status} />
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Pickup</p>
          <p className="font-semibold">{job.pickup}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Drop</p>
          <p className="font-semibold">{job.drop}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Customer</p>
          <p className="font-semibold">{job.customer}</p>
          <p className="flex items-center gap-1 text-sm text-slate-600"><Phone size={14} /> +91 98765 43210</p>
        </div>
        <p className="font-bold">₹{job.amount} · {job.payment}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold">Update status</h2>
        <div className="mt-4 grid gap-2">
          {['Active', 'Pickup', 'Out for Delivery', 'Delivered'].map((s) => (
            <button key={s} type="button" className="rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50" onClick={() => updateStatus(s)}>
              Mark as {s}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-lg bg-slate-100 p-4 text-center text-sm text-slate-600">
          <MapPin className="mx-auto mb-2 text-brand-600" />
          Navigation map placeholder — integrate maps API in production
        </div>
      </div>
    </div>
  );
}

export function DeliveryHistoryPage() {
  const jobs = loadJobs().filter((j) => j.status === 'Delivered');
  const completed = jobs.length ? jobs : [{ id: 'h1', orderId: 'AM1025', customer: 'Harun', amount: 680, status: 'Delivered', date: '19 Aug 2026' }];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Delivery History</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {completed.map((j) => (
              <tr key={j.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{j.orderId}</td>
                <td className="px-4 py-3">{j.customer}</td>
                <td className="px-4 py-3">₹{j.amount}</td>
                <td className="px-4 py-3"><StatusPill status="Delivered" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DeliveryEarningsPage() {
  const rows = [
    { day: 'Mon', amount: 980 },
    { day: 'Tue', amount: 1120 },
    { day: 'Wed', amount: 1240 },
    { day: 'Thu', amount: 890 },
    { day: 'Fri', amount: 1450 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Earnings</h1>
      <DashCard label="This week" value="₹6,680" icon={TrendingUp} hint="8% vs last week" />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold">Daily breakdown</h2>
        <div className="mt-4 space-y-3">
          {rows.map((r) => (
            <div key={r.day} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="font-semibold">{r.day}</span>
              <span className="font-bold text-emerald-700">₹{r.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeliveryProfilePage() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const partner = deliveryPartners[0];

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-extrabold">Profile</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
        <p className="font-bold text-lg">{user?.name || partner.name}</p>
        <p className="text-sm text-slate-600">{user?.email}</p>
        <p className="text-sm text-slate-600">{user?.phone || partner.phone}</p>
        <p className="text-sm text-slate-600">Vehicle: {user?.vehicle || partner.vehicle} · {partner.vehicleNo}</p>
      </div>
      <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => { logout(); navigate('/delivery/login'); }}>
        Logout
      </button>
    </div>
  );
}

export function DeliveryNotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Notifications</h1>
      {['New delivery request AM1026', 'Payout processed for last week', 'Complete safety training module'].map((t) => (
        <div key={t} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold">{t}</div>
      ))}
    </div>
  );
}

export function DeliverySupportPage() {
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold">Support</h1>
      <p className="text-sm text-slate-600">Partner helpline: +91 44 9999 8888</p>
      <p className="text-sm text-slate-600">Email: partners@adirai.com</p>
    </div>
  );
}
