import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { formatMoney } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refresh } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.data.product));
  }, [id]);

  async function add() {
    if (!user) return navigate('/login');
    try {
      await api.post('/cart', { productId: product._id, quantity: qty });
      await refresh();
      setMsg('Added to cart');
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (!product) return <p>Loading…</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-stone-200">
        {product.image && <img src={product.image} alt="" className="h-full max-h-[480px] w-full object-cover" />}
      </div>
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">{product.shop?.name} · {product.category}</p>
        <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
        <p className="mt-3 text-stone-600">{product.description}</p>
        <p className="mt-4 font-display text-4xl">{formatMoney(product.price)}</p>
        <p className="text-sm text-stone-500">{product.stock} available</p>
        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min="1"
            max={product.stock}
            className="input w-24"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <button className="btn-primary" onClick={add} disabled={!product.isAvailable || product.stock < 1}>
            Add to cart
          </button>
        </div>
        {msg && <p className="mt-3 text-sm font-semibold text-brand-800">{msg}</p>}
      </div>
    </div>
  );
}
