import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api.js';
import { StatCard } from '../../components/Cards.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatDate, formatMoney } from '../../utils/format.js';
import { getSocket } from '../../services/socket.js';

export function AdminDashboard() {
  const [data, setData] = useState(null);

  async function load() {
    const res = await api.get('/admin/dashboard');
    setData(res.data.data);
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    socket?.on('order:updated', load);
    return () => socket?.off('order:updated', load);
  }, []);

  if (!data) return <p>Loading dashboard…</p>;
  const s = data.stats;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Operations overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={s.totalOrders} />
        <StatCard label="New orders" value={s.newOrders} />
        <StatCard label="Active" value={s.activeOrders} />
        <StatCard label="Completed" value={s.completedOrders} />
        <StatCard label="Cancelled" value={s.cancelledOrders} />
        <StatCard label="Total sales" value={formatMoney(s.totalSales)} />
        <StatCard label="Delivery orders" value={s.deliveryOrders} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-semibold">7-day volume</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={data.trend}>
                <XAxis dataKey="_id" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-semibold">Recent orders</h2>
          <div className="space-y-2">
            {data.recentOrders.map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                <span className="font-semibold">{order.orderNumber}</span>
                <StatusBadge status={order.orderStatus} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const [tab, setTab] = useState('new');
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState('');

  async function load(nextTab = tab) {
    const { data } = await api.get('/admin/orders', { params: { tab: nextTab, q } });
    setOrders(data.data.orders || []);
  }

  useEffect(() => {
    load(tab);
    const socket = getSocket();
    const refresh = () => load(tab);
    socket?.on('order:updated', refresh);
    return () => socket?.off('order:updated', refresh);
  }, [tab]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['new', 'active', 'completed', 'cancelled'].map((t) => (
          <button key={t} className={tab === t ? 'btn-primary' : 'btn-outline'} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
        <form
          className="ml-auto flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            load(tab);
          }}
        >
          <input className="input" placeholder="Order number" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
      </div>
      <div className="overflow-x-auto card">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              {['Order', 'Customer', 'Products', 'Amount', 'Payment', 'Date', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName || order.customer?.name}</td>
                <td className="px-4 py-3">{order.items.map((i) => i.name).join(', ')}</td>
                <td className="px-4 py-3">{formatMoney(order.totalAmount)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.paymentStatus} /></td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.orderStatus} /></td>
                <td className="px-4 py-3"><Link className="font-semibold text-teal-800" to={`/admin/orders/${order._id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [partners, setPartners] = useState([]);
  const [partnerId, setPartnerId] = useState('');

  async function load() {
    const [{ data }, p] = await Promise.all([api.get(`/orders/${id}`), api.get('/admin/delivery-partners')]);
    setItem(data.data);
    setPartners(p.data.data.partners || []);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!item) return <p>Loading…</p>;
  const { order, logs } = item;

  async function status(next, note) {
    await api.patch(`/admin/orders/${order._id}/status`, { status: next, note });
    await load();
  }

  async function assign() {
    await api.post(`/admin/orders/${order._id}/assign`, { deliveryPartnerId: partnerId });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5 space-y-3">
        <h1 className="font-display text-2xl">{order.orderNumber}</h1>
        <StatusBadge status={order.orderStatus} />
        <p>{order.customerName} · {order.customerPhone}</p>
        <p className="text-sm text-slate-500">{order.deliveryAddress}</p>
        <ul className="text-sm">
          {order.items.map((i, idx) => (
            <li key={idx}>{i.name} × {i.quantity}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {order.orderStatus === 'CONFIRMED' && (
            <>
              <button className="btn-primary" onClick={() => status('ACCEPTED')}>Accept</button>
              <button className="btn-outline" onClick={() => status('CANCELLED', 'Rejected by admin')}>Reject</button>
            </>
          )}
          {order.orderStatus === 'DELIVERED' && (
            <button className="btn-primary" onClick={() => status('COMPLETED')}>Mark completed</button>
          )}
        </div>
        <div className="flex gap-2">
          <select className="input" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
            <option value="">Assign rider</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.isBusy ? '(busy)' : p.isAvailable ? '(available)' : ''}
              </option>
            ))}
          </select>
          <button className="btn-outline" disabled={!partnerId} onClick={assign}>
            Assign
          </button>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold">Status log</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {logs.map((log) => (
            <li key={log._id} className="rounded-xl bg-slate-50 p-2">
              {log.previousStatus || '—'} → {log.newStatus} · {log.changedByRole}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
