import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { OrderTimeline } from '../../components/OrderTimeline.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { MapView } from '../../components/MapView.jsx';
import { formatMoney } from '../../utils/format.js';
import { getSocket } from '../../services/socket.js';

export function TrackPage() {
  const { orderNumber: paramNumber } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(paramNumber || '');
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');

  async function load(number) {
    if (!number) return;
    setError('');
    try {
      const { data } = await api.get(`/orders/track/${number}`);
      setPayload(data.data);
    } catch (err) {
      setPayload(null);
      setError(err.message);
    }
  }

  useEffect(() => {
    if (paramNumber) load(paramNumber);
  }, [paramNumber]);

  useEffect(() => {
    const number = payload?.order?.orderNumber;
    if (!number) return;
    const socket = getSocket() || undefined;
    socket?.emit('join:track', number);
    const onUpdate = () => load(number);
    const onLoc = (loc) => {
      setPayload((p) =>
        p
          ? {
              ...p,
              delivery: p.delivery ? { ...p.delivery, currentLocation: loc.location } : p.delivery,
            }
          : p,
      );
    };
    socket?.on('order:updated', onUpdate);
    socket?.on('delivery:location', onLoc);
    const timer = setInterval(() => load(number), 20000);
    return () => {
      socket?.emit('leave:order', number);
      socket?.off('order:updated', onUpdate);
      socket?.off('delivery:location', onLoc);
      clearInterval(timer);
    };
  }, [payload?.order?.orderNumber]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card p-6">
        <h1 className="font-display text-4xl">Track order</h1>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/track/${input.trim().toUpperCase()}`);
          }}
        >
          <input className="input" placeholder="Order Number" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="btn-primary">Track</button>
        </form>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        {payload && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={payload.order.orderStatus} />
              <StatusBadge status={payload.order.paymentStatus} />
            </div>
            <p className="text-sm text-stone-500">
              {payload.order.shop?.name} · ETA about {payload.order.estimatedDeliveryMinutes} min
            </p>
            <OrderTimeline current={payload.order.orderStatus} cancelled={payload.order.orderStatus === 'CANCELLED'} />
            <ul className="text-sm">
              {payload.order.items.map((item, i) => (
                <li key={i} className="flex justify-between py-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="font-bold">Total {formatMoney(payload.order.totalAmount)}</div>
            <p className="text-sm text-stone-500">
              Rider: {payload.order.deliveryPartner ? `${payload.order.deliveryPartner.name}` : 'Not assigned yet'}
            </p>
          </div>
        )}
      </div>
      <div className="card p-4">
        <h2 className="mb-3 px-2 font-semibold">Live location</h2>
        {payload ? (
          <MapView
            pickup={payload.order.shop?.location}
            drop={payload.delivery?.deliveryLocation}
            current={payload.delivery?.currentLocation}
            height={420}
          />
        ) : (
          <div className="grid h-80 place-items-center text-sm text-stone-400">Enter an order number to see tracking.</div>
        )}
      </div>
    </div>
  );
}
