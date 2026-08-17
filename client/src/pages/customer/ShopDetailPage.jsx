import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { ProductCard } from '../../components/Cards.jsx';

export function ShopDetailPage() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/shops/${id}`)
      .then(({ data }) => {
        setShop(data.data.shop);
        setProducts(data.data.products || []);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!shop) return <p>Loading shop…</p>;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="h-52 bg-stone-200">
          {shop.image && <img src={shop.image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="p-6">
          <p className="text-xs font-bold uppercase text-ember-600">{shop.category}</p>
          <h1 className="font-display text-4xl">{shop.name}</h1>
          <p className="mt-2 text-stone-600">{shop.description}</p>
          <p className="mt-2 text-sm text-stone-500">{shop.address} · {shop.openingHours}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={{ ...product, shop }} />
        ))}
      </div>
      <Link to="/shops" className="text-sm font-semibold text-brand-700">Back to shops</Link>
    </div>
  );
}
