export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  DELIVERY_PARTNER: 'DELIVERY_PARTNER',
};

export const STATUS_FLOW = ['CONFIRMED', 'ACCEPTED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'COMPLETED'];

export const SELLER_FLOW = ['PENDING', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP'];

export function formatMoney(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function homeForRole(role) {
  if (role === ROLES.ADMIN) return '/admin';
  if (role === ROLES.SELLER) return '/seller';
  if (role === ROLES.DELIVERY_PARTNER) return '/delivery';
  return '/';
}

export function coords(location) {
  if (!location?.coordinates) return null;
  const [lng, lat] = location.coordinates;
  if (lng == null || lat == null) return null;
  return [lat, lng];
}

export function statusLabel(status) {
  return String(status || '').replaceAll('_', ' ');
}
