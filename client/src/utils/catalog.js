export const LOW_STOCK_THRESHOLD = 10;
export const CATEGORY_ACCENT = '#7a2cea';
export const STATUS_OPTIONS = ['Active', 'Inactive'];

/** Data URLs are stored in localStorage, so keep uploads well inside the ~5 MB quota. */
export const MAX_IMAGE_BYTES = 1024 * 1024;

const SEED_EPOCH = Date.parse('2026-01-06T09:30:00.000Z');
const DAY_MS = 86_400_000;

export function seedTimestamp(index = 0) {
  return new Date(SEED_EPOCH + index * DAY_MS).toISOString();
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureUniqueId(base, taken) {
  const seed = base || 'item';
  if (!taken.has(seed)) return seed;
  let suffix = 2;
  while (taken.has(`${seed}-${suffix}`)) suffix += 1;
  return `${seed}-${suffix}`;
}

export function computeDiscount(price, originalPrice) {
  const current = toNumber(price);
  const original = toNumber(originalPrice);
  if (original <= 0 || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function stockLevel(stock) {
  const value = toNumber(stock);
  if (value <= 0) return 'out';
  if (value <= LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
}

export const STOCK_LABELS = {
  in: 'In Stock',
  low: 'Low Stock',
  out: 'Out of Stock',
};

export function autoSku(name, id) {
  const letters = slugify(name).replace(/-/g, '').slice(0, 3).toUpperCase() || 'PRD';
  const tail = String(id || '').replace(/[^a-z0-9]/gi, '').slice(-4).toUpperCase() || '0001';
  return `AM-${letters}-${tail}`;
}

function normalizeStatus(status) {
  return status === 'Inactive' ? 'Inactive' : 'Active';
}

export function normalizeCategory(raw, index = 0) {
  const name = String(raw?.name || '').trim();
  const created = raw?.createdAt || seedTimestamp(index);
  return {
    id: raw?.id || slugify(name) || `category-${index + 1}`,
    name,
    icon: String(raw?.icon || '').trim(),
    image: raw?.image || '',
    color: raw?.color || CATEGORY_ACCENT,
    description: String(raw?.description || '').trim(),
    status: normalizeStatus(raw?.status),
    createdAt: created,
    updatedAt: raw?.updatedAt || created,
  };
}

export function normalizeProduct(raw, index = 0) {
  const name = String(raw?.name || '').trim();
  const id = raw?.id || `p${index + 1}`;
  const price = Math.max(0, toNumber(raw?.price));
  const originalRaw = toNumber(raw?.originalPrice);
  const originalPrice = originalRaw > price ? originalRaw : price;
  const stock = Math.max(0, Math.round(toNumber(raw?.stock)));
  const created = raw?.createdAt || seedTimestamp(index);
  return {
    id,
    name,
    categoryId: raw?.categoryId || slugify(raw?.category) || '',
    category: String(raw?.category || '').trim(),
    image: raw?.image || '',
    description: String(raw?.description || '').trim(),
    price,
    originalPrice,
    discount: computeDiscount(price, originalPrice),
    unit: String(raw?.unit || '').trim(),
    stock,
    inStock: stock > 0,
    sku: String(raw?.sku || '').trim() || autoSku(name, id),
    status: normalizeStatus(raw?.status),
    featured: Boolean(raw?.featured),
    rating: toNumber(raw?.rating),
    reviews: Math.max(0, Math.round(toNumber(raw?.reviews))),
    createdAt: created,
    updatedAt: raw?.updatedAt || created,
  };
}

export function formatShortDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function compareText(a, b) {
  return String(a || '').localeCompare(String(b || ''), 'en', { sensitivity: 'base' });
}
