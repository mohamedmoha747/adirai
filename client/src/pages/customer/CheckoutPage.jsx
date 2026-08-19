import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAddress, formatAddressSummary } from '../../context/AddressContext.jsx';
import { PaymentMethodCard } from '../../components/UiLibrary.jsx';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, deliveryFee, packingFee, total, clearCart } = useCart();
  const { selectedAddress } = useAddress();
  const [method, setMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  if (!cart.length) {
    navigate('/customer/cart', { replace: true });
    return null;
  }

  if (!selectedAddress) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-extrabold text-ink">No delivery address</h1>
        <p className="mt-2 text-sm text-soft-600">Add an address before checkout.</p>
        <button type="button" className="btn btn-primary mt-6" onClick={() => navigate('/customer/addresses')}>
          Add address
        </button>
      </div>
    );
  }

  function placeOrder() {
    setPlacing(true);
    const orderId = `AM${Date.now().toString().slice(-4)}`;
    const order = {
      id: orderId,
      date: new Date().toLocaleString('en-IN'),
      status: 'Processing',
      total,
      items: cart.length,
      payment: method,
      address: formatAddressSummary(selectedAddress),
      addressId: selectedAddress.id,
    };
    const existing = JSON.parse(localStorage.getItem('am_orders') || '[]');
    localStorage.setItem('am_orders', JSON.stringify([order, ...existing]));
    clearCart();
    setPlacing(false);
    navigate(`/customer/order-confirmation/${orderId}`, { state: { order } });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <button type="button" onClick={() => navigate('/customer/cart')} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700">
        <ArrowLeft size={16} /> Back to cart
      </button>
      <h1 className="text-2xl font-extrabold text-ink lg:text-3xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-soft-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-ink">Delivery Address</h2>
              <button type="button" onClick={() => navigate('/customer/addresses')} className="text-sm font-semibold text-brand-700">
                Change
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-brand-50 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">{selectedAddress.type}</span>
                {selectedAddress.isDefault && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">Default</span>
                )}
              </div>
              <p className="mt-2 font-bold text-ink">{selectedAddress.name}</p>
              <p className="text-sm text-soft-600">{selectedAddress.phone}</p>
              <p className="mt-1 text-sm text-soft-600">{formatAddressSummary(selectedAddress)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-soft-200 bg-white p-5">
            <h2 className="font-bold text-ink">Delivery Instructions</h2>
            <textarea className="input mt-3 min-h-[80px]" placeholder="Optional instructions for delivery partner" />
          </div>

          <div className="rounded-xl border border-soft-200 bg-white p-5">
            <h2 className="mb-3 font-bold text-ink">Payment Method</h2>
            <div className="space-y-2">
              {[
                { id: 'COD', title: 'Cash on Delivery', icon: '💵' },
                { id: 'UPI', title: 'UPI / GPay / PhonePe', icon: '📱' },
                { id: 'CARD', title: 'Credit / Debit Card', icon: '💳' },
                { id: 'WALLET', title: 'Wallet', icon: '👛' },
              ].map((m) => (
                <PaymentMethodCard key={m.id} title={m.title} icon={m.icon} selected={method === m.id} onClick={() => setMethod(m.id)} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border border-soft-200 bg-white p-5">
            <h2 className="font-bold text-ink">Order Summary</h2>
            <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
              {cart.map((item) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span className="truncate text-soft-600">{item.product.name} × {item.quantity}</span>
                  <span className="shrink-0 font-semibold">₹{item.product.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-soft-200 pt-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee ? `₹${deliveryFee}` : 'FREE'}</span></div>
              <div className="flex justify-between"><span>Packing</span><span>₹{packingFee}</span></div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-ink"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button type="button" disabled={placing} onClick={placeOrder} className="btn btn-primary mt-5 w-full py-3 disabled:opacity-60">
              {placing ? 'Placing order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
