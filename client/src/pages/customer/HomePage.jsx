import { Bell, MapPin, Truck, Clock, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories, products } from '../../data/mockData.js';
import { ProductCard, PromotionalBanner, CategoryCard, FeatureCard, PromoCard, Footer } from '../../components/UiLibrary.jsx';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="am-content">
      {/* Mobile Header - only visible on mobile */}
      <header className="sticky top-0 z-40 border-b border-soft-200 bg-white px-3 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm">☰</button>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-sm font-extrabold text-white">AM</div>
          </div>
          <button type="button" className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-soft-600 shadow-sm">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-500" />
          </button>
        </div>

        <div className="mt-4 rounded-[1.4rem] bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-soft-500">
            <span className="flex items-center gap-2 text-brand-700"><MapPin size={12} /> Deliver to</span>
            <button type="button" className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-700">Change</button>
          </div>
          <div className="mt-2 text-sm font-extrabold text-ink">Anna Nagar, Adirai</div>
        </div>
      </header>

      <main className="relative">
        {/* Desktop Container */}
        <div className="hidden am-container py-8 md:block">
          {/* Hero Banner - Desktop */}
          <PromotionalBanner
            title="We deliver happiness at your doorstep"
            subtitle="Fresh groceries delivered in 30-40 minutes. Fast, safe, and trusted."
            cta="Shop Now"
            desktop={true}
          />
        </div>

        {/* Mobile Container */}
        <div className="space-y-5 px-3 pb-24 pt-4 md:hidden">
          <PromotionalBanner
            title="We deliver happiness at your doorstep"
            subtitle="Fast • Safe • Trusted"
          />
        </div>

        {/* Categories Section */}
        <div className="am-container py-8 md:py-12">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="section-title">Shop by Category</h2>
            <button
              type="button"
              className="text-sm font-semibold text-brand-700 transition hover:text-brand-800 md:text-base"
              onClick={() => navigate('/categories')}
            >
              View all →
            </button>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => navigate(`/products?category=${category.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Popular Products Section */}
        <div className="am-container py-8 md:py-12">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h2 className="section-title">Popular This Week</h2>
            <button
              type="button"
              className="text-sm font-semibold text-brand-700 transition hover:text-brand-800 md:text-base"
              onClick={() => navigate('/products')}
            >
              View all →
            </button>
          </div>
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Special Promotion Section */}
        <div className="hidden am-container py-8 md:py-12 md:block">
          <div className="grid gap-6 md:grid-cols-2">
            <PromoCard
              badge="LIMITED OFFER"
              title="Free Delivery"
              description="Get free delivery on your first order above ₹299. Use code WELCOME299"
              cta="Order Now"
              icon="🚚"
            />
            <PromoCard
              badge="MEMBERS ONLY"
              title="20% Off"
              description="Subscribe to our membership for exclusive discounts on premium products"
              cta="Join Now"
              icon="⭐"
            />
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="hidden am-container py-8 md:py-12 md:block">
          <div className="mb-8 text-center">
            <h2 className="section-title inline-block">Why Choose Adirai Minutes?</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            <FeatureCard
              icon={<Truck size={24} />}
              title="Fast Delivery"
              description="Get your groceries delivered in 30-40 minutes"
            />
            <FeatureCard
              icon={<CheckCircle size={24} />}
              title="Quality Assured"
              description="Fresh products sourced from trusted suppliers"
            />
            <FeatureCard
              icon={<Clock size={24} />}
              title="24/7 Available"
              description="Order anytime, we're always ready to deliver"
            />
            <FeatureCard
              icon={<Star size={24} />}
              title="Best Prices"
              description="Competitive pricing with daily offers and discounts"
            />
          </div>
        </div>

        {/* Bottom padding for mobile nav */}
        <div className="h-4 md:hidden" />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation - only visible on mobile */}
      <nav className="bottom-nav">
        <div className="px-2 pb-3 pt-2">
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: 'Home', icon: '⌂', to: '/home' },
              { label: 'Categories', icon: '▣', to: '/categories' },
              { label: 'Cart', icon: '🛒', to: '/cart' },
              { label: 'Orders', icon: '▤', to: '/orders' },
              { label: 'Profile', icon: '◉', to: '/profile' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold text-soft-500 transition hover:text-brand-700"
                onClick={() => navigate(item.to)}
              >
                <span className={item.to === '/home' ? 'text-brand-700' : 'text-soft-500'}>{item.icon}</span>
                <span className={item.to === '/home' ? 'text-brand-700' : ''}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
