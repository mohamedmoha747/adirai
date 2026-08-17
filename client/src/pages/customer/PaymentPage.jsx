import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { formatMoney } from '../../utils/format.js';

export function PaymentPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const payment = state?.payment;
  const order = state?.order;
  const [cardLast4, setCardLast4] = useState('4242');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function confirm(success = true) {
    setBusy(true);
    setError('');
    try {
      await api.post(`/payments/${id}/confirm`, { success, cardLast4 });
      navigate(`/orders/confirmation/${order?._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!payment) {
    return <p>Payment session missing. Return to checkout.</p>;
  }

  return (
    <div className="mx-auto max-w-lg card p-6">
      <h1 className="font-display text-3xl">Complete payment</h1>
      <p className="mt-2 text-stone-500">Amount {formatMoney(payment.amount)} · {payment.method}</p>
      {payment.method === 'UPI' && (
        <div className="mt-5 rounded-2xl bg-stone-100 p-4 text-sm">
          <p className="font-semibold">UPI intent</p>
          <p className="mt-2 break-all text-xs">{payment.meta?.qrPayload}</p>
          <div className="mt-4 grid h-40 place-items-center rounded-xl bg-white text-stone-400">QR preview (scan in a UPI app)</div>
        </div>
      )}
      {payment.method === 'CARD' && (
        <div className="mt-5 space-y-3">
          <input className="input" placeholder="Card number" defaultValue="4242 4242 4242 4242" />
          <input className="input" placeholder="Last 4" value={cardLast4} onChange={(e) => setCardLast4(e.target.value)} />
        </div>
      )}
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-5 flex gap-3">
        <button className="btn-primary flex-1" disabled={busy} onClick={() => confirm(true)}>
          Verify payment
        </button>
        <button className="btn-outline" disabled={busy} onClick={() => confirm(false)}>
          Simulate fail
        </button>
      </div>
      <p className="mt-3 text-xs text-stone-400">Verification runs on the server. The browser cannot mark an order as paid by itself.</p>
    </div>
  );
}

export function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data.data.order);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [id]);

  if (!loaded) return <p>Loading…</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Confirmed</p>
      <h1 className="mt-2 font-display text-4xl">Order {order.orderNumber}</h1>
      <p className="mt-3 text-stone-600">We’ll notify you as the shop accepts and a rider is assigned.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button className="btn-primary" onClick={() => navigate(`/track/${order.orderNumber}`)}>
          Track order
        </button>
        <button className="btn-outline" onClick={() => navigate('/orders')}>
          My orders
        </button>
      </div>
    </div>
  );
}
