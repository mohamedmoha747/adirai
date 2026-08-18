import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { orders } from '../../data/mockData.js';
import { AppHeader, OrderCard, Footer } from '../../components/UiLibrary.jsx';

export function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const tabs = ['All', 'Processing', 'Delivered', 'Cancelled'];

  const filtered = orders.filter((order) => tab === 'All' || order.status === tab);

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader title="My Orders" onBack={() => navigate('/home')} />
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
            Back to Home
          </button>
          <h1 className="text-3xl font-extrabold text-ink">My Orders</h1>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto md:mb-8 md:gap-3">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition md:px-5 md:py-2.5 ${
                  tab === item
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-soft-600 shadow-sm hover:bg-soft-50'
                }`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Orders Grid - Desktop */}
          <div className="hidden grid gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={() => navigate('/track/' + order.id)}
                onView={() => navigate('/track/' + order.id)}
              />
            ))}
          </div>

          {/* Orders List - Mobile */}
          <div className="space-y-3 md:hidden">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={() => navigate('/track/' + order.id)}
                onView={() => navigate('/track/' + order.id)}
              />
            ))}
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
