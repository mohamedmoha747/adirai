import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, subtotal, deliveryFee, packingFee, total, updateQuantity, removeItem, clearCart, loading } = useCart();

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-16 text-center text-soft-500">Loading cart…</div>;
  }

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-xl border border-dashed border-soft-300 bg-white p-10">
          <h1 className="text-xl font-extrabold text-ink">Your cart is empty</h1>
          <p className="mt-2 text-sm text-soft-600">Add groceries to get started.</p>
          <Link to="/customer/products" className="btn btn-primary mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button type="button" onClick={() => navigate('/customer/products')} className="mb-2 hidden items-center gap-2 text-sm font-semibold text-brand-700 md:flex">
            <ArrowLeft size={16} /> Continue shopping
          </button>
          <h1 className="text-2xl font-extrabold text-ink lg:text-3xl">Shopping Cart</h1>
          <p className="text-sm text-soft-500">{cart.length} item(s)</p>
        </div>
        <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-soft-200 bg-white p-4">
              <img src={item.product.image} alt={item.product.name} className="h-24 w-24 shrink-0 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-bold text-ink">{item.product.name}</h3>
                  <p className="text-sm text-soft-500">{item.product.unit}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">₹{item.product.price} each</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border border-soft-200">
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 text-brand-700">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 text-brand-700">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-ink">₹{item.product.price * item.quantity}</span>
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-sm font-semibold text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-soft-200 bg-white p-6">
            <h2 className="text-lg font-extrabold text-ink">Bill Details</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-soft-600"><span>Item Total</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-soft-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-soft-600"><span>Packing Fee</span><span>₹{packingFee}</span></div>
            </div>
            <div className="mt-4 flex justify-between border-t border-soft-200 pt-4 font-extrabold text-ink">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            {subtotal < 299 && (
              <p className="mt-2 text-xs text-brand-700">Add ₹{299 - subtotal} more for free delivery</p>
            )}
            <button type="button" className="btn btn-primary mt-6 w-full py-3" onClick={() => navigate('/customer/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
