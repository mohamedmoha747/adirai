import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { ShopCard } from '../../components/Cards.jsx';

export function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [q, setQ] = useState('');

  async function load(search) {
    const { data } = await api.get('/shops', { params: { search } });
    setShops(data.data.shops || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl">Shops near you</h1>
      <form
        className="my-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
      >
        <input className="input max-w-md" placeholder="Search shops" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} />
        ))}
      </div>
    </div>
  );
}
