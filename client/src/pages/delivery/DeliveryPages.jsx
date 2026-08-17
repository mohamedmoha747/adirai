import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatDate, formatMoney } from '../../utils/format.js';
import { getSocket } from '../../services/socket.js';

export function DeliveryHomePage() {
  const [orders, setOrders] = useState([]);

  async function load() {
    const { data } = await api.get('/delivery/orders');
    setOrders(data.data.orders || []);
  }

  useEffect(() => {
    load();
    const s = getSocket();
    s?.on('order:updated', load);
    const geo = navigator.geolocation?.watchPosition((pos) => {
      api.patch('/delivery/location', { lng: pos.coords.longitude, lat: pos.coords.latitude }).catch(() => {});
    });
    return () => {
      s?.off('order:updated', load);
      if (geo && navigator.geolocation) navigator.geolocation.clearWatch(geo);
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Assigned jobs</h1>
      {orders.map((order) => (
        <Link key={order._id} to={`/delivery/orders/${order._id}`} className="block rounded-3xl bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{order.orderNumber}</div>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="mt-2 text-sm text-slate-300">{order.shop?.name} → {order.customerName || order.customer?.name}</p>
          <p className="text-sm text-slate-400">{formatMoney(order.totalAmount)} · {order.paymentMethod}</p>
        </Link>
      ))}
      {orders.length === 0 && <p className="text-slate-400">No assigned deliveries right now.</p>}
    </div>
  );
}

export function DeliveryOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data } = await api.get(`/orders/${id}`);
    setOrder(data.data.order);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function accept() {
    await api.post(`/delivery/orders/${id}/accept`);
    setMsg('Assignment accepted');
    load();
  }

  async function status(next) {
    await api.patch(`/delivery/orders/${id}/status`, { status: next });
    load();
  }

  if (!order) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{order.orderNumber}</h1>
      <StatusBadge status={order.orderStatus} />
      <div className="rounded-3xl bg-white/5 p-4 text-sm">
        <p className="font-semibold">Pickup · {order.shop?.name}</p>
        <p className="text-slate-400">{order.shop?.address}</p>
        <p className="mt-3 font-semibold">Drop · {order.customerName}</p>
        <p className="text-slate-400">{order.deliveryAddress}</p>
        <p className="mt-3">{formatMoney(order.totalAmount)} · {order.paymentMethod}</p>
      </div>
      {msg && <p className="text-teal-300 text-sm">{msg}</p>}
      <div className="grid gap-3">
        <button className="h-14 rounded-2xl bg-white/10 text-lg font-bold" onClick={accept}>Accept</button>
        <button className="h-14 rounded-2xl bg-teal-600 text-lg font-bold" onClick={() => status('PICKED_UP')}>Pick Up</button>
        <button className="h-14 rounded-2xl bg-orange-500 text-lg font-bold" onClick={() => status('ON_THE_WAY')}>On The Way</button>
        <button className="h-14 rounded-2xl bg-emerald-600 text-lg font-bold" onClick={() => status('DELIVERED')}>Delivered</button>
      </div>
    </div>
  );
}

export function DeliveryHistoryPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.get('/delivery/history').then(({ data }) => setOrders(data.data.orders || []));
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-display text-3xl">History</h1>
      {orders.map((order) => (
        <div key={order._id} className="rounded-3xl bg-white/5 p-4">
          <div className="flex justify-between">
            <span className="font-semibold">{order.orderNumber}</span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="text-sm text-slate-400">{order.customer?.name} · {formatDate(order.updatedAt)}</p>
        </div>
      ))}
    </div>
  );
}
