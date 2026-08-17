import { Link } from 'react-router-dom';
import { formatMoney } from '../utils/format.js';

export function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="card overflow-hidden transition hover:-translate-y-0.5">
      <div className="h-40 bg-stone-200">
        {product.image && <img src={product.image} alt={product.name} className="h-full w-full object-cover" />}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{product.shop?.name || product.category}</p>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{formatMoney(product.price)}</span>
          <span className="text-stone-500">{product.stock} in stock</span>
        </div>
      </div>
    </Link>
  );
}

export function ShopCard({ shop }) {
  return (
    <Link to={`/shops/${shop._id}`} className="card overflow-hidden transition hover:-translate-y-0.5">
      <div className="h-36 bg-stone-200">
        {shop.image && <img src={shop.image} alt={shop.name} className="h-full w-full object-cover" />}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase text-ember-600">{shop.category}</p>
        <h3 className="font-display text-xl">{shop.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-stone-500">{shop.description}</p>
      </div>
    </Link>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
