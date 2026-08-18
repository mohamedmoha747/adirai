import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppHeader, PaymentMethodCard, PrimaryButton, Footer } from '../../components/UiLibrary.jsx';

export function CheckoutPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('Cash on Delivery');

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader title="Checkout" onBack={() => navigate('/cart')} />
      </div>

      {/* Desktop Header */}
      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>
          <h1 className="text-3xl font-extrabold text-ink">Checkout</h1>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        {/* Desktop 2-Column Layout */}
        <div className="hidden am-container gap-8 py-8 md:grid md:grid-cols-3">
          {/* Checkout Form - Left (2 columns) */}
          <div className="md:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="am-card-lg p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-ink">Delivery Address</h3>
                <button type="button" className="text-sm font-bold text-brand-700 transition hover:text-brand-800">
                  Change
                </button>
              </div>
              <div className="rounded-xl bg-[#f8f6ff] p-4">
                <div className="mb-3">
                  <span className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
                    Home
                  </span>
                </div>
                <p className="font-extrabold text-ink md:text-lg">Faheem Ibrahim</p>
                <p className="mt-2 text-sm text-soft-600 md:text-base">+91 98765 43210</p>
                <p className="mt-2 text-sm text-soft-600 md:text-base">
                  12, North Street, Anna Nagar, Adirai, Pudukkottai - 622201
                </p>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="am-card-lg p-6">
              <h3 className="mb-4 text-lg font-extrabold text-ink">Delivery Instructions</h3>
              <textarea
                className="input min-h-[100px] bg-soft-50 md:min-h-[120px]"
                placeholder="E.g. Leave at the door"
              />
            </div>

            {/* Payment Method */}
            <div className="am-card-lg p-6">
              <h3 className="mb-4 text-lg font-extrabold text-ink">Payment Method</h3>
              <div className="space-y-3">
                <PaymentMethodCard
                  title="Cash on Delivery"
                  icon="💵"
                  selected={method === 'Cash on Delivery'}
                  onClick={() => setMethod('Cash on Delivery')}
                />
                <PaymentMethodCard
                  title="UPI / GPay / PhonePe"
                  icon="📱"
                  selected={method === 'UPI / GPay / PhonePe'}
                  onClick={() => setMethod('UPI / GPay / PhonePe')}
                />
                <PaymentMethodCard
                  title="Card Payment"
                  icon="💳"
                  selected={method === 'Card Payment'}
                  onClick={() => setMethod('Card Payment')}
                />
                <PaymentMethodCard
                  title="Wallet"
                  icon="👜"
                  selected={method === 'Wallet'}
                  onClick={() => setMethod('Wallet')}
                />
              </div>
            </div>
          </div>

          {/* Bill Summary - Right (1 column) */}
          <div className="md:col-span-1">
            <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-extrabold text-ink">Bill Details</h3>
              <div className="space-y-3 border-b border-soft-200 pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Item Total</span>
                  <span className="font-semibold text-ink">₹680</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Delivery Fee</span>
                  <span className="font-semibold text-ink">₹25</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-soft-600">Packing Fee</span>
                  <span className="font-semibold text-ink">₹15</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-b border-soft-200 pb-4">
                <span className="font-semibold text-ink">Subtotal</span>
                <span className="text-xl font-extrabold text-ink">₹720</span>
              </div>
              <div className="mt-6">
                <PrimaryButton onClick={() => navigate('/track/AM1025')}>
                  Place Order
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="space-y-4 px-3 pb-5 pt-4 md:hidden">
          {/* Delivery Address */}
          <div className="am-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-extrabold text-ink">Delivery Address</span>
              <button type="button" className="text-[11px] font-bold text-brand-700">
                Change
              </button>
            </div>
            <div className="rounded-[1.2rem] bg-[#f8f6ff] p-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Home
                </span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-ink">Faheem Ibrahim</p>
              <p className="mt-1 text-sm text-soft-600">+91 98765 43210</p>
              <p className="mt-2 text-sm text-soft-600">
                12, North Street, Anna Nagar, Adirai, Pudukkottai - 622201
              </p>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="am-card p-4">
            <div className="mb-3 text-sm font-extrabold text-ink">Delivery Instructions</div>
            <textarea
              className="input min-h-[80px] bg-soft-50"
              placeholder="E.g. Leave at the door"
            />
          </div>

          {/* Payment Method */}
          <div className="am-card p-4">
            <div className="mb-3 text-sm font-extrabold text-ink">Payment Method</div>
            <div className="space-y-2">
              <PaymentMethodCard
                title="Cash on Delivery"
                icon="💵"
                selected={method === 'Cash on Delivery'}
                onClick={() => setMethod('Cash on Delivery')}
              />
              <PaymentMethodCard
                title="UPI / GPay / PhonePe"
                icon="📱"
                selected={method === 'UPI / GPay / PhonePe'}
                onClick={() => setMethod('UPI / GPay / PhonePe')}
              />
              <PaymentMethodCard
                title="Card Payment"
                icon="💳"
                selected={method === 'Card Payment'}
                onClick={() => setMethod('Card Payment')}
              />
              <PaymentMethodCard
                title="Wallet"
                icon="👜"
                selected={method === 'Wallet'}
                onClick={() => setMethod('Wallet')}
              />
            </div>
          </div>

          {/* Bill Details */}
          <div className="am-card p-4">
            <div className="mb-3 text-sm font-extrabold text-ink">Bill Details</div>
            <div className="space-y-2 text-sm text-soft-600">
              <div className="flex items-center justify-between">
                <span>Item Total</span>
                <span>₹680</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span>₹25</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Packing Fee</span>
                <span>₹15</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-soft-200 pt-3 text-base font-extrabold text-ink">
                <span>Total Amount</span>
                <span>₹720</span>
              </div>
            </div>
            <div className="mt-4">
              <PrimaryButton onClick={() => navigate('/track/AM1025')}>
                Place Order
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
