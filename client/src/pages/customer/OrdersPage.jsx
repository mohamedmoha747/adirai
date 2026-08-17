import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatDate, formatMoney } from '../../utils/format.js';
import { getSocket } from '../../services/socket.js';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);

  async function load() {
    const { data } = await api.get('/orders');
    setOrders(data.data.orders || []);
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    socket?.on('order:updated', load);
    return () => socket?.off('order:updated', load);
  }, []);

  return (
    <div>
      <h1 className="mb-4 font-display text-4xl">Your orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/track/${order.orderNumber}`} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-semibold">{order.orderNumber}</div>
              <div className="text-sm text-stone-500">{order.shop?.name} · {formatDate(order.createdAt)}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold">{formatMoney(order.totalAmount)}</span>
              <StatusBadge status={order.orderStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
          </Link>
        ))}
        {orders.length === 0 && <p className="text-stone-500">No orders yet.</p>}
      </div>
    </div>
  );
}
