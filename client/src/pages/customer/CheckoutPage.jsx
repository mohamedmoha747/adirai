import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { formatMoney } from '../../utils/format.js';

export function CheckoutPage() {
  const { user } = useAuth();
  const { cart, total, refresh } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    deliveryAddress: user?.address || '',
    paymentMethod: 'COD',
    notes: '',
    lng: '',
    lat: '',
  });
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [locMsg, setLocMsg] = useState('');

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function grabLocation() {
    if (!navigator.geolocation) {
      setLocMsg('Geolocation is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lng', pos.coords.longitude);
        set('lat', pos.coords.latitude);
        setLocMsg('Live location captured.');
      },
      () => setLocMsg('Location permission denied. Address will still be used.'),
    );
  }

  async function placeOrder() {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/orders', form);
      await refresh();
      const payment = data.data.payment;
      const order = data.data.order;
      if (form.paymentMethod === 'COD') {
        navigate(`/orders/confirmation/${order._id}`);
      } else {
        navigate(`/pay/${payment._id}`, { state: { order, payment } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!cart.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h1 className="font-display text-3xl">Delivery details</h1>
        <div className="mt-4 space-y-3">
          <input className="input" placeholder="Name" value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
          <input className="input" placeholder="Phone" value={form.customerPhone} onChange={(e) => set('customerPhone', e.target.value)} />
          <textarea className="input min-h-[100px]" placeholder="Delivery address" value={form.deliveryAddress} onChange={(e) => set('deliveryAddress', e.target.value)} />
          <button type="button" className="btn-outline" onClick={grabLocation}>
            Use current location
          </button>
          {locMsg && <p className="text-xs text-stone-500">{locMsg}</p>}
          <select className="input" value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}>
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI / QR</option>
            <option value="CARD">Card</option>
          </select>
        </div>
      </div>
      <aside className="card p-6">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between">
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span>{formatMoney((item.product?.price || 0) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        {step === 'form' ? (
          <button className="btn-primary mt-5 w-full" onClick={() => setStep('confirm')}>
            Review order
          </button>
        ) : (
          <button className="btn-accent mt-5 w-full" disabled={busy} onClick={placeOrder}>
            {busy ? 'Placing…' : 'Place order'}
          </button>
        )}
      </aside>
    </div>
  );
}
