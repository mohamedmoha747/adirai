import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';
import { ProductCard } from '../../components/Cards.jsx';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);

  const filters = useMemo(
    () => ({
      search: params.get('search') || '',
      category: params.get('category') || '',
      shop: params.get('shop') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
    }),
    [params],
  );

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  useEffect(() => {
    api.get('/shops').then(({ data }) => setShops(data.data.shops || []));
  }, []);

  useEffect(() => {
    api.get('/products', { params: filters }).then(({ data }) => {
      setProducts(data.data.products || []);
      setCategories(data.data.categories || []);
    });
  }, [filters.search, filters.category, filters.shop, filters.minPrice, filters.maxPrice]);

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="card h-fit space-y-4 p-4">
        <h2 className="font-semibold">Filters</h2>
        <input className="input" placeholder="Search" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
        <select className="input" value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={filters.shop} onChange={(e) => setFilter('shop', e.target.value)}>
          <option value="">All shops</option>
          {shops.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Min ₹" value={filters.minPrice} onChange={(e) => setFilter('minPrice', e.target.value)} />
          <input className="input" placeholder="Max ₹" value={filters.maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} />
        </div>
      </aside>
      <div>
        <h1 className="mb-4 font-display text-4xl">Products</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        {products.length === 0 && <p className="text-stone-500">No products match those filters.</p>}
      </div>
    </div>
  );
}
