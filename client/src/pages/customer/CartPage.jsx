import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useCart } from '../../context/CartContext.jsx';
import { formatMoney } from '../../utils/format.js';

export function CartPage() {
  const { cart, refresh, total } = useCart();
  const navigate = useNavigate();

  async function updateQty(item, quantity) {
    await api.patch(`/cart/${item._id}`, { quantity });
    await refresh();
  }

  async function remove(item) {
    await api.delete(`/cart/${item._id}`);
    await refresh();
  }

  if (!cart.length) {
    return (
      <div className="card p-10 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <Link to="/products" className="btn-primary mt-4">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item._id} className="card flex gap-4 p-4">
            <img src={item.product?.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product?.name}</h3>
              <p className="text-sm text-stone-500">{item.product?.shop?.name}</p>
              <p className="font-bold">{formatMoney(item.product?.price)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <input
                type="number"
                min="1"
                className="input w-20"
                value={item.quantity}
                onChange={(e) => updateQty(item, Number(e.target.value))}
              />
              <button className="text-xs font-semibold text-rose-600" onClick={() => remove(item)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="card h-fit p-5">
        <h2 className="font-display text-2xl">Summary</h2>
        <div className="mt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => navigate('/checkout')}>
          Checkout
        </button>
      </aside>
    </div>
  );
}
