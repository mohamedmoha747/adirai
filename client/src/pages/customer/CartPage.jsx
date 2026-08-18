import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartItems } from '../../data/mockData.js';
import { AppHeader, PrimaryButton, Footer } from '../../components/UiLibrary.jsx';

export function CartPage() {
  const navigate = useNavigate();
  const items = cartItems;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 25;
  const packingFee = 15;
  const total = subtotal + deliveryFee + packingFee;

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader title="My Cart" onBack={() => navigate('/home')} rightSlot={<button className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm"><Trash2 size={16} /></button>} />
      </div>

      {/* Desktop Header */}
      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            <ArrowLeft size={18} />
            Back to Shopping
          </button>
          <h1 className="text-3xl font-extrabold text-ink">Shopping Cart</h1>
        </div>
      </div>

      <div className="relative pb-24 md:pb-6">
        {/* Desktop Layout - 2 Column */}
        <div className="hidden am-container gap-8 py-8 md:grid md:grid-cols-3">
          {/* Cart Items - Left Side (2 columns) */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="am-card-lg flex gap-4 p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover md:h-28 md:w-28"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-extrabold text-ink md:text-lg">{item.name}</h3>
                        <p className="mt-1 text-sm text-soft-500 md:text-base">1 kg</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-soft-200 bg-white">
                          <button type="button" className="grid h-8 w-8 place-items-center text-brand-700">
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[24px] text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <button type="button" className="grid h-8 w-8 place-items-center text-brand-700">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-extrabold text-ink md:text-lg">
                            ₹{item.price * item.quantity}
                          </p>
                          <button type="button" className="text-sm font-bold text-rose-500 transition hover:text-rose-700">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white">
                  <p className="text-lg text-soft-500">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Bill Details - Right Side (1 column) */}
          <div className="md:col-span-1">
            <div className="sticky top-20 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-extrabold text-ink">Bill Details</h3>
              <div className="space-y-3 border-b border-soft-200 pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Item Total</span>
                  <span className="font-semibold text-ink">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Delivery Fee</span>
                  <span className="font-semibold text-ink">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Packing Fee</span>
                  <span className="font-semibold text-ink">₹{packingFee}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-b border-soft-200 pb-4">
                <span className="font-semibold text-ink">Subtotal</span>
                <span className="text-lg font-extrabold text-ink">₹{total}</span>
              </div>
              <div className="mt-6">
                <PrimaryButton onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="space-y-3 px-3 pb-4 pt-4 md:hidden">
          {items.map((item) => (
            <div key={item.id} className="am-card flex gap-3 p-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded-[1rem] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-ink">{item.name}</p>
                    <p className="mt-1 text-[11px] text-soft-500">1 kg</p>
                  </div>
                  <button type="button" className="text-[11px] font-bold text-rose-500">
                    Remove
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center rounded-full border border-soft-200 bg-white">
                    <button type="button" className="grid h-8 w-8 place-items-center text-brand-700">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[20px] text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button type="button" className="grid h-8 w-8 place-items-center text-brand-700">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-extrabold text-ink">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mx-3 rounded-[1.5rem] bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-extrabold text-ink">Bill Details</div>
            <div className="space-y-2 text-sm text-soft-600">
              <div className="flex items-center justify-between">
                <span>Item Total</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Packing Fee</span>
                <span>₹{packingFee}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-soft-200 pt-3 text-base font-extrabold text-ink">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
            <div className="mt-4">
              <PrimaryButton onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
