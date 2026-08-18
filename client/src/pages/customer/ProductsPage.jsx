import { Search, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categories, products } from '../../data/mockData.js';
import { ProductCard, CategoryCard } from '../../components/UiLibrary.jsx';

export function ProductsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategory = params.get('category') || 'grocery';
  const filteredProducts = products.filter((product) => product.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('-', ' ')) || selectedCategory === 'all');

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 border-b border-soft-200 bg-white px-3 py-4 md:hidden">
        <div className="flex items-center gap-3">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm" onClick={() => navigate('/home')}>
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 rounded-full bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-soft-500">
              <Search size={16} />
              <input className="w-full border-0 bg-transparent text-sm outline-none" placeholder="Search" defaultValue="" />
            </div>
          </div>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </header>

      <main className="relative">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="border-b border-soft-200 bg-white py-6">
            <div className="am-container">
              <h1 className="mb-4 text-3xl font-extrabold text-ink">Shop Products</h1>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-full bg-soft-50 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-soft-500">
                    <Search size={18} />
                    <input
                      className="w-full border-0 bg-transparent text-sm outline-none"
                      placeholder="Search products..."
                    />
                  </div>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-100 text-soft-600 transition hover:bg-soft-200">
                  <SlidersHorizontal size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="am-container py-8">
            <div className="category-grid mb-8">
              <CategoryCard
                key="all"
                category={{ id: 'all', name: 'All', icon: '⭐' }}
                selected={selectedCategory === 'all'}
                onClick={() => navigate('/products?category=all')}
              />
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  selected={selectedCategory === category.id}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                />
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => navigate(`/products/${product.id}`)} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="space-y-4 md:hidden">
          <div className="px-3 pb-4 pt-4">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold ${selectedCategory === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-soft-600 shadow-sm'}`}
                onClick={() => navigate('/products?category=all')}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold ${selectedCategory === category.id ? 'bg-brand-600 text-white' : 'bg-white text-soft-600 shadow-sm'}`}
                  onClick={() => navigate(`/products?category=${category.id}`)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => navigate(`/products/${product.id}`)} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
