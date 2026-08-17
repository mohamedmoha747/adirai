import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import { StatCard } from '../../components/Cards.jsx';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { formatMoney } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getSocket } from '../../services/socket.js';

export function SellerDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/seller/sales').then(({ data: res }) => setData(res.data));
    const s = getSocket();
    const reload = () => api.get('/seller/sales').then(({ data: res }) => setData(res.data));
    s?.on('order:updated', reload);
    return () => s?.off('order:updated', reload);
  }, []);
  if (!data) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Shop overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incoming" value={data.stats.incoming} />
        <StatCard label="Total orders" value={data.stats.totalOrders} />
        <StatCard label="Completed" value={data.stats.completed} />
        <StatCard label="Sales" value={formatMoney(data.stats.totalSales)} />
      </div>
    </div>
  );
}

export function SellerShopPage() {
  const { shop, setShop } = useAuth();
  const [form, setForm] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    address: shop?.address || '',
    phone: shop?.phone || '',
    category: shop?.category || 'Food',
    image: shop?.image || '',
    openingHours: shop?.openingHours || '',
    lng: shop?.location?.coordinates?.[0] || '',
    lat: shop?.location?.coordinates?.[1] || '',
  });
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    const { data } = await api.put('/seller/shop', form);
    setShop(data.data.shop);
    setMsg('Shop saved');
  }

  return (
    <form className="card max-w-2xl space-y-3 p-6" onSubmit={save}>
      <h1 className="font-display text-3xl">Shop profile</h1>
      {['name', 'phone', 'category', 'address', 'image', 'openingHours'].map((k) => (
        <input key={k} className="input" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      ))}
      <textarea className="input min-h-[90px]" placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button className="btn-primary">Save shop</button>
      {msg && <p className="text-sm text-teal-800">{msg}</p>}
    </form>
  );
}

export function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  async function load() {
    const { data } = await api.get('/seller/products');
    setProducts(data.data.products || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <button className="btn-primary" onClick={() => navigate('/seller/products/new')}>Add product</button>
      </div>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p._id} className="card flex items-center justify-between p-4">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-slate-500">{formatMoney(p.price)} · stock {p.stock}</div>
            </div>
            <div className="flex gap-2">
              <Link className="btn-outline" to={`/seller/products/${p._id}`}>Edit</Link>
              <button className="btn-ghost text-rose-600" onClick={() => remove(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SellerProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: 0, category: 'General', image: '', unit: 'pc', isAvailable: true });

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`).then(({ data }) => {
      const p = data.data.product;
      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category,
        image: p.image,
        unit: p.unit,
        isAvailable: p.isAvailable,
      });
    });
  }, [id]);

  async function save(e) {
    e.preventDefault();
    if (id) await api.patch(`/products/${id}`, form);
    else await api.post('/products', form);
    navigate('/seller/products');
  }

  return (
    <form className="card max-w-xl space-y-3 p-6" onSubmit={save}>
      <h1 className="font-display text-3xl">{id ? 'Edit product' : 'New product'}</h1>
      <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="input" type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
      <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available
      </label>
      <button className="btn-primary">Save</button>
    </form>
  );
}

export function SellerOrdersPage() {
  const [tab, setTab] = useState('incoming');
  const [orders, setOrders] = useState([]);

  async function load(next = tab) {
    const { data } = await api.get('/seller/orders', { params: { tab: next } });
    setOrders(data.data.orders || []);
  }

  useEffect(() => {
    load(tab);
    const s = getSocket();
    const refresh = () => load(tab);
    s?.on('order:updated', refresh);
    return () => s?.off('order:updated', refresh);
  }, [tab]);

  async function nextStatus(order, status) {
    await api.patch(`/seller/orders/${order._id}/status`, { status });
    load(tab);
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {['incoming', 'active', 'completed'].map((t) => (
          <button key={t} className={tab === t ? 'btn-primary' : 'btn-outline'} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{order.orderNumber}</div>
                <div className="text-sm text-slate-500">{order.customer?.name} · {formatMoney(order.totalAmount)}</div>
              </div>
              <StatusBadge status={order.orderStatus} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.orderStatus === 'CONFIRMED' && <button className="btn-primary" onClick={() => nextStatus(order, 'ACCEPTED')}>Accept</button>}
              {order.orderStatus === 'ACCEPTED' && <button className="btn-primary" onClick={() => nextStatus(order, 'PREPARING')}>Start preparing</button>}
              {order.orderStatus === 'PREPARING' && <button className="btn-primary" onClick={() => nextStatus(order, 'READY_FOR_PICKUP')}>Ready for pickup</button>}
              {['CONFIRMED', 'ACCEPTED', 'PREPARING'].includes(order.orderStatus) && (
                <button className="btn-outline" onClick={() => nextStatus(order, 'CANCELLED')}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SellerSalesPage() {
  return <SellerDashboard />;
}
