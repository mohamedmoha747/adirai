import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { ProductCard, ShopCard } from '../../components/Cards.jsx';

export function HomePage() {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/shops').then(({ data }) => setShops(data.data.shops || []));
    api.get('/products').then(({ data }) => setProducts((data.data.products || []).slice(0, 8)));
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white md:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">Order & delivery</p>
        <h1 className="mt-3 max-w-xl font-display text-4xl md:text-6xl">From neighbourhood shops to your door, with a live trail.</h1>
        <p className="mt-4 max-w-lg text-stone-300">Browse kitchens and marts, pay UPI/card/COD, then watch pickup → on the way → delivered.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/shops" className="btn-accent">Browse shops</Link>
          <Link to="/track" className="btn-outline border-white/20 bg-white/10 text-white hover:bg-white hover:text-ink">Track an order</Link>
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-3xl">Open shops</h2>
          <Link to="/shops" className="text-sm font-semibold text-brand-700">See all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-3xl">Popular today</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
