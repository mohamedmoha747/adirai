import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { orders as mockOrders } from '../../data/mockData.js';
import { AppHeader, OrderCard } from '../../components/UiLibrary.jsx';

export function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const tabs = ['All', 'Processing', 'Delivered', 'Cancelled'];

  const allOrders = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('am_orders') || '[]');
    const merged = [...stored, ...mockOrders];
    const seen = new Set();
    return merged.filter((o) => {
      if (seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
  }, []);

  const filtered = allOrders.filter((order) => tab === 'All' || order.status === tab);

  return (
    <div className="am-content">
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader title="My Orders" onBack={() => navigate('/customer/home')} />
      </div>

      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button type="button" onClick={() => navigate('/customer/home')} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700">
            <ArrowLeft size={18} /> Back to Home
          </button>
          <h1 className="text-3xl font-extrabold text-ink">My Orders</h1>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          <div className="mb-6 flex gap-2 overflow-x-auto md:mb-8">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${tab === item ? 'bg-brand-600 text-white' : 'bg-white text-soft-600 shadow-sm hover:bg-soft-50'}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={() => navigate('/customer/products')}
                onView={() => navigate(`/customer/track/${order.id}`)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-soft-200 bg-white py-16 text-center">
              <p className="font-semibold text-ink">No orders in this category</p>
              <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/customer/products')}>Start shopping</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
