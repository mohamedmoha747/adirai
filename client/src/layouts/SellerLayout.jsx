import { LayoutDashboard, Package, Receipt, Store, Wallet } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout.jsx';

const links = [
  { to: '/seller', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: '/seller/shop', label: 'Shop profile', icon: <Store className="h-4 w-4" /> },
  { to: '/seller/products', label: 'Products', icon: <Package className="h-4 w-4" /> },
  { to: '/seller/orders', label: 'Orders', icon: <Receipt className="h-4 w-4" /> },
  { to: '/seller/sales', label: 'Sales', icon: <Wallet className="h-4 w-4" /> },
];

export function SellerLayout() {
  return <DashboardLayout title="Seller" links={links} />;
}
