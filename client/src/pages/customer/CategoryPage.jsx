import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { categories } from '../../data/mockData.js';
import { AppHeader, CategoryCard, PromotionalBanner, Footer } from '../../components/UiLibrary.jsx';

export function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('grocery');

  const visible = useMemo(() => {
    if (selected === 'all') return categories;
    return categories.filter((item) => item.id === selected);
  }, [selected]);

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader
          title="All Categories"
          onBack={() => navigate('/home')}
          rightSlot={
            <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm">
              <Search size={18} />
            </button>
          }
        />
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
          <h1 className="text-3xl font-extrabold text-ink">All Categories</h1>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        {/* Desktop View */}
        <div className="hidden am-container py-8 md:block">
          <div className="category-grid mb-12">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={selected === category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
              />
            ))}
          </div>

          {/* Promotional Banner */}
          <PromotionalBanner
            title="Fast Delivery"
            subtitle="For All Orders"
            cta="Shop Now"
            desktop={true}
          />
        </div>

        {/* Mobile View */}
        <div className="space-y-4 px-3 pb-5 pt-4 md:hidden">
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                selected={selected === category.id}
                onClick={() => setSelected(category.id)}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-soft-500">
            <span>Popular</span>
            <button type="button" className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-soft-600 shadow-sm">
              <SlidersHorizontal size={12} /> Filter
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {visible.map((category) => (
              <button
                key={category.id}
                type="button"
                className="am-card flex items-center gap-3 p-3 text-left transition hover:shadow-md"
                onClick={() => navigate(`/products?category=${category.id}`)}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f6f0ff] text-lg">
                  {category.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-ink">{category.name}</p>
                  <p className="text-[11px] text-soft-500">Fresh picks</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <PromotionalBanner title="Free Delivery" subtitle="On orders above ₹299" />
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
