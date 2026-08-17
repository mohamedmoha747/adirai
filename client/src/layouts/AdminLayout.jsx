import {
  BarChart3,
  Bike,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4" /> },
  { to: '/admin/delivery', label: 'Delivery', icon: <Bike className="h-4 w-4" /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users className="h-4 w-4" /> },
  { to: '/admin/reports', label: 'Reports', icon: <BarChart3 className="h-4 w-4" /> },
];

export function AdminLayout() {
  return <DashboardLayout title="Admin" links={links} />;
}
