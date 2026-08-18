import { MessageSquare, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderStatuses } from '../../data/mockData.js';
import { AppHeader, OrderStatusTimeline, Footer } from '../../components/UiLibrary.jsx';

export function TrackPage() {
  const { orderNumber = 'AM1025' } = useParams();
  const navigate = useNavigate();
  const stepIndex = 4;

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader title="Order Tracking" onBack={() => navigate('/orders')} />
      </div>

      {/* Desktop Header */}
      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>
          <h1 className="text-3xl font-extrabold text-ink">Track Your Order</h1>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          {/* Desktop 2-Column Layout */}
          <div className="hidden grid gap-8 md:grid md:grid-cols-3">
            {/* Left Column (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              {/* Order Status Timeline */}
              <div className="am-card-lg p-6">
                <h3 className="mb-6 text-lg font-extrabold text-ink">Order Status</h3>
                <OrderStatusTimeline steps={orderStatuses} activeStep={stepIndex} />
              </div>

              {/* Delivery Partner */}
              <div className="am-card-lg p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-ink">Delivery Partner</h3>
                  <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f6f1ff] p-4">
                  <div>
                    <p className="font-extrabold text-ink md:text-lg">Karthik</p>
                    <p className="mt-1 text-sm text-soft-500">(12 reviews)</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-700 shadow-sm transition hover:bg-soft-50">
                      <Phone size={18} />
                    </button>
                    <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-700 shadow-sm transition hover:bg-soft-50">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (1 col) */}
            <div className="md:col-span-1">
              <div className="sticky top-32 rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-soft-500">Order Number</p>
                  <p className="mt-2 text-2xl font-extrabold text-ink">{orderNumber}</p>
                </div>
                <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                  <span className="text-sm text-emerald-700">Status</span>
                  <span className="font-bold text-emerald-700">Placed</span>
                </div>
                <div className="border-t border-soft-200 pt-4">
                  <p className="text-sm text-soft-600">Estimated Delivery Time</p>
                  <p className="mt-2 text-xl font-extrabold text-ink">30-40 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="space-y-4 px-3 pb-5 pt-4 md:hidden">
            <div className="am-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-soft-500">
                    Order Number
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-ink">{orderNumber}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Placed
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-soft-600">
                <span>Estimated Delivery Time</span>
                <span className="font-extrabold text-ink">30-40 min</span>
              </div>
            </div>

            <div className="am-card p-4">
              <div className="mb-3 text-sm font-extrabold text-ink">Order Status</div>
              <OrderStatusTimeline steps={orderStatuses} activeStep={stepIndex} />
            </div>

            <div className="am-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-extrabold text-ink">Delivery Partner</span>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-[#f6f1ff] p-3">
                <div>
                  <p className="text-sm font-extrabold text-ink">Karthik</p>
                  <p className="text-xs text-soft-500">(12 reviews)</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
                    <Phone size={16} />
                  </button>
                  <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
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
