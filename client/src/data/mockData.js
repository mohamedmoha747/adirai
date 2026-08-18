export const categories = [
  { id: 'grocery', name: 'Grocery', icon: '🥬', color: '#F59E0B' },
  { id: 'snacks', name: 'Snacks', icon: '🍟', color: '#F97316' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#22C55E' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', color: '#A78BFA' },
  { id: 'household', name: 'Household', icon: '🧽', color: '#38BDF8' },
  { id: 'bakery', name: 'Bakery', icon: '🥐', color: '#FB7185' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: '#60A5FA' },
  { id: 'fruits-veg', name: 'Fruits & Veg', icon: '🥕', color: '#34D399' },
  { id: 'meat-fish', name: 'Meat & Fish', icon: '🐟', color: '#F59E0B' },
  { id: 'baby-care', name: 'Baby Care', icon: '🍼', color: '#E879F9' },
  { id: 'stationery', name: 'Stationery', icon: '📚', color: '#FBBF24' },
  { id: 'pet-care', name: 'Pet Care', icon: '🐾', color: '#8B5CF6' },
];

export const products = [
  { id: 'p1', name: 'Sunflower Oil', category: 'Grocery', price: 165, unit: '1 L', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80' },
  { id: 'p2', name: 'Aashirvaad Atta', category: 'Grocery', price: 225, unit: '5 kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { id: 'p3', name: 'Parle-G', category: 'Snacks', price: 40, unit: 'Pack', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80' },
  { id: 'p4', name: 'Biscuit Pack', category: 'Bakery', price: 120, unit: '250 g', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' },
  { id: 'p5', name: 'Coca-Cola', category: 'Beverages', price: 70, unit: '600 ml', image: 'https://images.unsplash.com/photo-1622483767028-3f66f2b49cf2?auto=format&fit=crop&w=800&q=80' },
  { id: 'p6', name: 'Laundry Detergent', category: 'Household', price: 320, unit: '1 L', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
  { id: 'p7', name: 'Toothpaste', category: 'Personal Care', price: 90, unit: '150 g', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80' },
  { id: 'p8', name: 'Milk', category: 'Dairy', price: 55, unit: '1 L', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
  { id: 'p9', name: 'Apples', category: 'Fruits & Veg', price: 180, unit: '1 kg', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80' },
  { id: 'p10', name: 'Chicken Breast', category: 'Meat & Fish', price: 260, unit: '500 g', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80' },
  { id: 'p11', name: 'Baby Wipes', category: 'Baby Care', price: 140, unit: '80 pcs', image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80' },
  { id: 'p12', name: 'Writing Pad', category: 'Stationery', price: 75, unit: '1 pack', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
];

export const cartItems = [
  { id: 'ci1', name: 'Aashirvaad Atta', price: 225, quantity: 1, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { id: 'ci2', name: 'Sunflower Oil', price: 165, quantity: 1, image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80' },
  { id: 'ci3', name: 'Milk', price: 55, quantity: 2, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80' },
];

export const addressList = [
  { id: 'a1', type: 'Home', name: 'Faheem Ibrahim', phone: '+91 98765 43210', line1: '12, North Street, Anna Nagar,', line2: 'Adirai, Pudukkottai - 622201', isDefault: true },
  { id: 'a2', type: 'Work', name: 'Faheem Ibrahim', phone: '+91 98765 43210', line1: '45, Main Road,', line2: 'Adirai, Pudukkottai - 622201', isDefault: false },
  { id: 'a3', type: 'Other', name: 'Faheem Ibrahim', phone: '+91 98765 43210', line1: '7, New Street,', line2: 'Adirai, Pudukkottai - 622201', isDefault: false },
];

export const orderStatuses = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const orders = [
  { id: 'AM1025', date: '15 Aug 2026, 10:30 AM', status: 'Delivered', total: 680, isCancelled: false },
  { id: 'AM1024', date: '13 Aug 2026, 6:00 PM', status: 'Processing', total: 420, isCancelled: false },
  { id: 'AM1023', date: '12 Aug 2026, 11:40 AM', status: 'Cancelled', total: 320, isCancelled: true },
  { id: 'AM1022', date: '10 Aug 2026, 9:15 AM', status: 'Delivered', total: 540, isCancelled: false },
];

export const profileMenu = [
  'My Addresses',
  'Payment Methods',
  'My Orders',
  'Notifications',
  'Help & Support',
  'About AM',
  'Logout',
];

export const notifications = [
  { id: 1, title: 'Your order is packed', time: '10 min ago' },
  { id: 2, title: 'Fresh groceries ready nearby', time: '45 min ago' },
  { id: 3, title: 'Flash offer: 15% off', time: '2 hours ago' },
];
