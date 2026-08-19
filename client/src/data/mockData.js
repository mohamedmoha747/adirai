export const categories = [
  { id: 'grocery', name: 'Grocery', icon: '🥬', color: '#F59E0B' },
  { id: 'snacks', name: 'Snacks', icon: '🍟', color: '#F97316' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#22C55E' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', color: '#A78BFA' },
  { id: 'household', name: 'Household', icon: '🧽', color: '#38BDF8' },
  { id: 'bakery', name: 'Bakery', icon: '🥐', color: '#FB7185' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: '#60A5FA' },
  { id: 'fruits-veg', name: 'Fruits & Vegetables', icon: '🥕', color: '#34D399' },
  { id: 'meat-fish', name: 'Meat & Fish', icon: '🐟', color: '#F59E0B' },
  { id: 'baby-care', name: 'Baby Care', icon: '🍼', color: '#E879F9' },
  { id: 'stationery', name: 'Stationery', icon: '📚', color: '#FBBF24' },
  { id: 'pet-care', name: 'Pet Care', icon: '🐾', color: '#8B5CF6' },
];

export const products = [
  { id: 'p1', name: 'Fortune Sunflower Oil', category: 'Grocery', categoryId: 'grocery', price: 165, unit: '1 L', stock: 40, inStock: true, rating: 4.6, reviews: 128, image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80', description: 'Refined sunflower oil for everyday cooking with a light taste.' },
  { id: 'p2', name: 'Aashirvaad Atta', category: 'Grocery', categoryId: 'grocery', price: 225, unit: '5 kg', stock: 25, inStock: true, rating: 4.8, reviews: 342, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', description: 'Premium whole wheat flour for soft rotis and parathas.' },
  { id: 'p3', name: 'Parle-G Biscuits', category: 'Snacks', categoryId: 'snacks', price: 40, unit: '250 g', stock: 60, inStock: true, rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80', description: 'Classic glucose biscuits loved by all ages.' },
  { id: 'p4', name: 'Britannia Good Day', category: 'Bakery', categoryId: 'bakery', price: 120, unit: '400 g', stock: 30, inStock: true, rating: 4.5, reviews: 210, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80', description: 'Butter cookies with a rich, crunchy texture.' },
  { id: 'p5', name: 'Coca-Cola', category: 'Beverages', categoryId: 'beverages', price: 70, unit: '600 ml', stock: 50, inStock: true, rating: 4.4, reviews: 156, image: 'https://images.unsplash.com/photo-1622483767028-3f66f2b49cf2?auto=format&fit=crop&w=800&q=80', description: 'Chilled soft drink for instant refreshment.' },
  { id: 'p6', name: 'Surf Excel Liquid', category: 'Household', categoryId: 'household', price: 320, unit: '1 L', stock: 18, inStock: true, rating: 4.3, reviews: 98, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', description: 'Powerful laundry liquid for tough stains.' },
  { id: 'p7', name: 'Colgate MaxFresh', category: 'Personal Care', categoryId: 'personal-care', price: 90, unit: '150 g', stock: 45, inStock: true, rating: 4.6, reviews: 267, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80', description: 'Cool mint toothpaste for fresh breath all day.' },
  { id: 'p8', name: 'Aavin Toned Milk', category: 'Dairy', categoryId: 'dairy', price: 55, unit: '1 L', stock: 35, inStock: true, rating: 4.5, reviews: 412, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', description: 'Fresh toned milk delivered chilled.' },
  { id: 'p9', name: 'Fresh Apples', category: 'Fruits & Vegetables', categoryId: 'fruits-veg', price: 180, unit: '1 kg', stock: 20, inStock: true, rating: 4.4, reviews: 89, image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80', description: 'Crisp Kashmiri apples, handpicked daily.' },
  { id: 'p10', name: 'Chicken Breast', category: 'Meat & Fish', categoryId: 'meat-fish', price: 260, unit: '500 g', stock: 12, inStock: true, rating: 4.2, reviews: 76, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80', description: 'Boneless chicken breast, cleaned and packed fresh.' },
  { id: 'p11', name: 'Huggies Baby Wipes', category: 'Baby Care', categoryId: 'baby-care', price: 140, unit: '80 pcs', stock: 22, inStock: true, rating: 4.7, reviews: 134, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80', description: 'Gentle wipes for sensitive baby skin.' },
  { id: 'p12', name: 'Classmate Notebook', category: 'Stationery', categoryId: 'stationery', price: 75, unit: '1 pack', stock: 0, inStock: false, rating: 4.1, reviews: 45, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', description: 'Single line notebook for school and office.' },
];

export const addressList = [
  { id: 'a1', type: 'Home', name: 'Harun', phone: '+91 98765 43210', line1: '12, North Street', area: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', isDefault: true },
  { id: 'a2', type: 'Work', name: 'Harun', phone: '+91 98765 43210', line1: '45, IT Park Road, OMR', area: 'Sholinganallur', city: 'Chennai', state: 'Tamil Nadu', pincode: '600096', isDefault: false },
  { id: 'a3', type: 'Other', name: 'Harun', phone: '+91 98765 43210', line1: '7, Lake View Apartments', area: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028', isDefault: false },
];

export const orderStatuses = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const orders = [
  { id: 'AM1025', date: '19 Aug 2026, 10:30 AM', status: 'Delivered', total: 680, items: 4, partner: 'Arun Kumar', isCancelled: false },
  { id: 'AM1024', date: '18 Aug 2026, 6:00 PM', status: 'Processing', total: 420, items: 3, partner: 'Divya R', isCancelled: false },
  { id: 'AM1023', date: '17 Aug 2026, 11:40 AM', status: 'Cancelled', total: 320, items: 2, partner: null, isCancelled: true },
  { id: 'AM1022', date: '15 Aug 2026, 9:15 AM', status: 'Delivered', total: 540, items: 5, partner: 'Arun Kumar', isCancelled: false },
];

export const deliveryPartners = [
  { id: 'dp1', name: 'Arun Kumar', phone: '+91 90000 00004', vehicle: 'Bike', vehicleNo: 'TN 09 AB 1234', status: 'Active', todayDeliveries: 8, earnings: 1240 },
  { id: 'dp2', name: 'Divya R', phone: '+91 90000 00005', vehicle: 'Scooter', vehicleNo: 'TN 09 CD 5678', status: 'On Delivery', todayDeliveries: 5, earnings: 890 },
  { id: 'dp3', name: 'Karthik M', phone: '+91 90000 00008', vehicle: 'Bike', vehicleNo: 'TN 09 EF 9012', status: 'Available', todayDeliveries: 3, earnings: 520 },
];

export const deliveryJobs = [
  { id: 'DJ101', orderId: 'AM1024', customer: 'Harun', pickup: 'AM Store, Anna Nagar', drop: '12, North Street', amount: 420, status: 'Active', payment: 'COD' },
  { id: 'DJ102', orderId: 'AM1026', customer: 'Priya S', pickup: 'AM Store, T Nagar', drop: 'Besant Nagar', amount: 310, status: 'Pending', payment: 'UPI' },
];

export const adminStats = {
  totalCustomers: 1248,
  totalOrders: 3842,
  todayOrders: 86,
  revenue: 2845600,
  activeDeliveries: 14,
  deliveryPartners: 42,
  products: 156,
  categories: 12,
};

export const customers = [
  { id: 'c1', name: 'Harun', email: 'customer@adirai.com', phone: '+91 98765 43210', orders: 12, joined: 'Jan 2026' },
  { id: 'c2', name: 'Priya S', email: 'priya@adirai.com', phone: '+91 98765 43211', orders: 8, joined: 'Feb 2026' },
  { id: 'c3', name: 'Rahul V', email: 'rahul@adirai.com', phone: '+91 98765 43212', orders: 5, joined: 'Mar 2026' },
];

export const notifications = [
  { id: 1, title: 'Your order AM1024 is out for delivery', time: '10 min ago', read: false },
  { id: 2, title: 'Fresh vegetables restocked near you', time: '45 min ago', read: false },
  { id: 3, title: 'Flash offer: Free delivery above ₹299', time: '2 hours ago', read: true },
];

export const profileMenu = [
  { label: 'My Addresses', path: '/customer/addresses' },
  { label: 'Payment Methods', path: '/customer/payment-methods' },
  { label: 'My Orders', path: '/customer/orders' },
  { label: 'Notifications', path: '/customer/notifications' },
  { label: 'Help & Support', path: '/customer/help' },
  { label: 'About AM', path: '/customer/about' },
];
