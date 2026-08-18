import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Truck, Clock, Check } from 'lucide-react';
import { products } from '../../data/mockData.js';
import { Footer } from '../../components/UiLibrary.jsx';

export function ProductDetailPage() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  // For now, use mock product data
  const product = products[0] || {
    id: 1,
    name: 'Aashirvaad Atta',
    category: 'Grocery',
    price: 299,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 234,
    inStock: true,
    unit: '1kg',
    description: 'Premium quality whole wheat flour perfect for making chapati, roti, and other Indian bread.',
  };

  const handleAddToCart = () => {
    console.log(`Added ${qty} of ${product.name} to cart`);
  };

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-soft-200 bg-white px-3 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-9 w-9 place-items-center rounded-full text-soft-600"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="font-semibold text-ink">Product Details</span>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-soft-600">
            <Heart size={18} />
          </button>
        </div>
      </header>

      <main className="am-container py-6 md:py-12">
        {/* Desktop Layout: 2 Columns */}
        <div className="mb-8 hidden md:flex md:items-start md:gap-12">
          {/* Back Button - Desktop */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-6 top-6 flex items-center gap-2 text-sm font-semibold text-soft-600 transition hover:text-ink md:relative md:left-0 md:top-0"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Product Image */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="overflow-hidden rounded-2xl bg-soft-100">
              <img
                src={product.image}
                alt={product.name}
                className="h-full max-h-[480px] w-full object-cover"
              />
            </div>

            {/* Thumbnail Images (Mock) */}
            <div className="hidden gap-3 md:flex">
              {[...Array(4)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="h-20 w-20 overflow-hidden rounded-lg border-2 border-soft-200 bg-soft-100 transition hover:border-brand-400"
                >
                  <img src={product.image} alt={`${product.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div>
            {/* Desktop Header Info */}
            <div className="mb-6 hidden md:block">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-brand-700">
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                      liked ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-soft-200 bg-white text-soft-600 hover:border-brand-300'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-soft-200 bg-white text-soft-600 transition hover:border-soft-300"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Name & Rating */}
            <h1 className="text-2xl font-extrabold text-ink md:text-3xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-brand-400 text-brand-400' : 'text-soft-300'} />
                ))}
              </div>
              <span className="text-sm font-semibold text-soft-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price & Unit */}
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-ink">₹{product.price}</span>
              <span className="text-sm font-semibold text-soft-600">{product.unit}</span>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <Check size={16} /> In Stock
                </div>
              ) : (
                <div className="text-sm font-semibold text-brand-700">Out of Stock</div>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-sm leading-relaxed text-soft-600">{product.description}</p>

            {/* Delivery & Support */}
            <div className="mt-8 space-y-3 rounded-xl bg-soft-50 p-4">
              <div className="flex gap-3">
                <Truck size={18} className="flex-shrink-0 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-ink">Free Delivery</p>
                  <p className="text-xs text-soft-600">On orders above ₹299</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={18} className="flex-shrink-0 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-ink">Delivery in 30-40 mins</p>
                  <p className="text-xs text-soft-600">Fresh delivery guaranteed</p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm font-semibold text-ink">Quantity</span>
              <div className="flex items-center gap-1 rounded-lg border border-soft-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="grid h-9 w-9 place-items-center font-semibold text-soft-600 hover:bg-soft-100"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-ink">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="grid h-9 w-9 place-items-center font-semibold text-soft-600 hover:bg-soft-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary flex-1 py-3 text-base font-semibold"
              >
                Add to Cart
              </button>
              <button type="button" className="btn btn-secondary flex-1 py-3 text-base font-semibold">
                Buy Now
              </button>
            </div>

            {/* Additional Info - Desktop Only */}
            <div className="mt-12 hidden space-y-6 border-t border-soft-200 pt-8 md:block">
              <div>
                <h3 className="mb-3 font-semibold text-ink">Why Choose This?</h3>
                <ul className="space-y-2 text-sm text-soft-600">
                  <li className="flex gap-2">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Premium quality whole wheat flour</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <span>No added preservatives or colors</span>
                  </li>
                  <li className="flex gap-2">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Perfect for rotis, parathas & bread</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-ink">Storage Instructions</h3>
                <p className="text-sm text-soft-600">Store in a cool, dry place. Use a sealed container to maintain freshness. Best before 12 months from manufacturing date.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only Description & Features */}
        <div className="mt-8 space-y-6 border-t border-soft-200 pt-8 md:hidden">
          <div>
            <h3 className="mb-3 font-semibold text-ink">About</h3>
            <p className="text-sm text-soft-600">{product.description}</p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-ink">Why Choose This?</h3>
            <ul className="space-y-2 text-sm text-soft-600">
              <li className="flex gap-2">
                <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                <span>Premium quality whole wheat flour</span>
              </li>
              <li className="flex gap-2">
                <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                <span>No added preservatives or colors</span>
              </li>
              <li className="flex gap-2">
                <Check size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                <span>Perfect for rotis, parathas & bread</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
