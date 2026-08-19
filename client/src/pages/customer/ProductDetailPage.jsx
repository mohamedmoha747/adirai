import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Heart, Share2, Star, Truck } from 'lucide-react';
import { products } from '../../data/mockData.js';
import { useCart } from '../../context/CartContext.jsx';
import { CustomerFooter } from '../../components/customer/CustomerChrome.jsx';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, busy, feedback } = useCart();
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const related = useMemo(
    () => products.filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 4),
    [product],
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <h1 className="text-xl font-bold text-ink">Product not found</h1>
        <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/customer/products')}>
          Browse products
        </button>
      </div>
    );
  }

  const canAdd = product.inStock && product.stock > 0;

  async function handleAdd() {
    if (!canAdd) return;
    addToCart(product.id, qty);
  }

  function handleBuyNow() {
    if (!canAdd) return;
    if (addToCart(product.id, qty)) {
      navigate('/customer/checkout');
    }
  }

  return (
    <div>
      <div className="border-b border-soft-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg p-2 text-soft-600">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold text-ink">Product Details</span>
          <button type="button" onClick={() => setLiked(!liked)} className="rounded-lg p-2 text-soft-600">
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-brand-600' : ''} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
        <button type="button" onClick={() => navigate(-1)} className="mb-6 hidden items-center gap-2 text-sm font-semibold text-soft-600 hover:text-ink md:flex">
          <ArrowLeft size={16} /> Back to products
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="overflow-hidden rounded-xl border border-soft-200 bg-white">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-3 hidden gap-2 md:grid md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-soft-200">
                  <img src={product.image} alt="" className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{product.category}</span>
            <h1 className="mt-2 text-2xl font-extrabold text-ink lg:text-3xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-soft-300'} />
                ))}
              </div>
              <span className="text-sm text-soft-600">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-ink">₹{product.price}</span>
              <span className="text-sm text-soft-500">{product.unit}</span>
            </div>

            <div className="mt-3">
              {canAdd ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <Check size={16} /> In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-sm font-semibold text-rose-600">Out of stock</span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-soft-600">{product.description}</p>

            <div className="mt-6 space-y-3 rounded-xl border border-soft-200 bg-white p-4">
              <div className="flex gap-3 text-sm">
                <Truck size={18} className="shrink-0 text-brand-600" />
                <div><p className="font-semibold text-ink">Free delivery above ₹299</p><p className="text-soft-500">Standard fee ₹25 below</p></div>
              </div>
              <div className="flex gap-3 text-sm">
                <Clock size={18} className="shrink-0 text-brand-600" />
                <div><p className="font-semibold text-ink">Delivery in 30–40 mins</p><p className="text-soft-500">Fresh & fast</p></div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold text-ink">Quantity</span>
              <div className="flex items-center rounded-lg border border-soft-200">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 font-bold text-soft-600">−</button>
                <span className="min-w-[2rem] text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} disabled={!canAdd} className="px-3 py-2 font-bold text-soft-600 disabled:opacity-40">+</button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={!canAdd || busy} onClick={handleAdd} className="btn btn-primary flex-1 py-3 disabled:opacity-50">
                {busy ? 'Adding…' : 'Add to Cart'}
              </button>
              <button type="button" disabled={!canAdd} onClick={handleBuyNow} className="btn btn-secondary flex-1 py-3 disabled:opacity-50">
                Buy Now
              </button>
            </div>

            {feedback && (
              <p className={`mt-3 text-sm font-semibold ${feedback.type === 'error' ? 'text-rose-600' : 'text-brand-700'}`}>
                {feedback.message}
              </p>
            )}

            <div className="mt-10 hidden space-y-6 border-t border-soft-200 pt-8 lg:block">
              <section>
                <h3 className="font-bold text-ink">Why choose this?</h3>
                <ul className="mt-2 space-y-1 text-sm text-soft-600">
                  <li>• Quality checked before packing</li>
                  <li>• Best before date guaranteed</li>
                  <li>• Easy returns on damaged items</li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-ink">Storage</h3>
                <p className="mt-1 text-sm text-soft-600">Store in a cool, dry place away from direct sunlight.</p>
              </section>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12 border-t border-soft-200 pt-10">
            <h2 className="text-xl font-extrabold text-ink">Related Products</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/customer/products/${p.id}`)}
                  className="rounded-xl border border-soft-200 bg-white p-3 text-left transition hover:shadow-md"
                >
                  <img src={p.image} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                  <p className="mt-2 text-sm font-bold text-ink">{p.name}</p>
                  <p className="text-sm font-semibold text-brand-700">₹{p.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="hidden md:block">
        <CustomerFooter />
      </div>
    </div>
  );
}
