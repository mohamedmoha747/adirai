import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatDate, formatMoney } from '../../utils/format.js';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AdminDeliveryPage() {
  const [data, setData] = useState({ partners: [], history: [] });

  useEffect(() => {
    api.get('/admin/delivery-partners').then(({ data: res }) => setData(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Delivery partners</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {data.partners.map((p) => (
          <div key={p.id} className="card p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-slate-500">{p.phone} · {p.email}</div>
            <div className="mt-2 flex gap-2">
              <StatusBadge status={p.isAvailable ? 'ACCEPTED' : 'PENDING'} />
              {p.isBusy && <StatusBadge status="ON_THE_WAY" />}
            </div>
          </div>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {data.history.map((d) => (
              <tr key={d._id} className="border-t">
                <td className="px-4 py-3">{d.order?.orderNumber}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">{formatDate(d.assignedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminCustomersPage() {
  const [q, setQ] = useState('');
  const [customers, setCustomers] = useState([]);

  async function load(search = q) {
    const { data } = await api.get('/admin/customers', { params: { q: search } });
    setCustomers(data.data.customers || []);
  }

  useEffect(() => {
    load('');
  }, []);

  return (
    <div>
      <h1 className="mb-4 font-display text-3xl">Customers</h1>
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input className="input max-w-sm" placeholder="Search name, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>
      <div className="space-y-2">
        {customers.map((c) => (
          <Link key={c._id} to={`/admin/customers/${c._id}`} className="card flex justify-between p-4">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-slate-500">{c.email} · {c.phone}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AdminCustomerDetailPage() {
  const { id } = useParams();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    api.get(`/admin/customers/${id}`).then(({ data }) => setPayload(data.data));
  }, [id]);

  if (!payload) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{payload.customer.name}</h1>
      <p className="text-slate-500">{payload.customer.email} · {payload.customer.phone}</p>
      <p>{payload.customer.address}</p>
      <h2 className="font-semibold">Order history</h2>
      {payload.orders.map((o) => (
        <Link key={o._id} to={`/admin/orders/${o._id}`} className="card flex justify-between p-4 text-sm">
          <span>{o.orderNumber}</span>
          <span>{formatMoney(o.totalAmount)}</span>
          <StatusBadge status={o.orderStatus} />
        </Link>
      ))}
    </div>
  );
}

export function AdminReportsPage() {
  const [range, setRange] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState(null);

  async function load(next = range) {
    const { data } = await api.get('/admin/reports', { params: { range: next, from, to } });
    setReport(data.data);
  }

  useEffect(() => {
    load('month');
  }, []);

  if (!report) return <p>Loading reports…</p>;
  const s = report.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['today', 'week', 'month', 'custom'].map((r) => (
          <button key={r} className={range === r ? 'btn-primary' : 'btn-outline'} onClick={() => { setRange(r); if (r !== 'custom') load(r); }}>
            {r}
          </button>
        ))}
        {range === 'custom' && (
          <>
            <input type="date" className="input w-auto" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className="input w-auto" value={to} onChange={(e) => setTo(e.target.value)} />
            <button className="btn-primary" onClick={() => load('custom')}>Apply</button>
          </>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Orders</div><div className="text-3xl font-display">{s.orders}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Completed</div><div className="text-3xl font-display">{s.completed}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Cancelled</div><div className="text-3xl font-display">{s.cancelled}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Sales</div><div className="text-3xl font-display">{formatMoney(s.sales)}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Deliveries done</div><div className="text-3xl font-display">{s.deliveryCompleted}/{s.deliveryAssigned}</div></div>
        <div className="card p-4"><div className="text-xs uppercase text-slate-500">Avg delivery min</div><div className="text-3xl font-display">{s.avgDeliveryMinutes}</div></div>
      </div>
      <div className="card p-4">
        <h2 className="mb-3 font-semibold">Payment methods</h2>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={report.payments}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#0f766e" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
