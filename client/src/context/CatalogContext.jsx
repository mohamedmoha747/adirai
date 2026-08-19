import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { categories as seedCategories, products as seedProducts } from '../data/mockData.js';
import {
  autoSku,
  compareText,
  computeDiscount,
  ensureUniqueId,
  normalizeCategory,
  normalizeProduct,
  slugify,
  toNumber,
} from '../utils/catalog.js';

const CATEGORY_KEY = 'am_catalog_categories';
const PRODUCT_KEY = 'am_catalog_products';

const STORAGE_FULL_MESSAGE =
  'Changes could not be saved to this browser — storage is full. Try using a smaller image or removing unused items.';

const CatalogContext = createContext(null);

function loadList(key, seed, normalize) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(normalize);
    }
  } catch {
    /* fall back to seed data */
  }
  return seed.map(normalize);
}

function persist(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return null;
  } catch {
    return STORAGE_FULL_MESSAGE;
  }
}

function newProductId(taken) {
  return ensureUniqueId(`p${Date.now().toString(36)}`, taken);
}

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);
  const hydrated = useRef(false);

  useEffect(() => {
    setCategories(loadList(CATEGORY_KEY, seedCategories, normalizeCategory));
    setProducts(loadList(PRODUCT_KEY, seedProducts, normalizeProduct));
    hydrated.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    setStorageError(persist(CATEGORY_KEY, categories) || persist(PRODUCT_KEY, products));
  }, [categories, products]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const productCounts = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      if (!product.categoryId) return;
      counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.status === 'Active').sort((a, b) => compareText(a.name, b.name)),
    [categories],
  );

  const createCategory = useCallback((data) => {
    const name = String(data?.name || '').trim();
    if (!name) return { ok: false, error: 'Category name is required.', field: 'name' };
    if (categories.some((category) => compareText(category.name, name) === 0)) {
      return { ok: false, error: 'A category with this name already exists.', field: 'name' };
    }

    const taken = new Set(categories.map((category) => category.id));
    const now = new Date().toISOString();
    const category = normalizeCategory({
      ...data,
      name,
      id: ensureUniqueId(slugify(name), taken),
      createdAt: now,
      updatedAt: now,
    });
    setCategories((prev) => [category, ...prev]);
    return { ok: true, category };
  }, [categories]);

  const updateCategory = useCallback((id, data) => {
    const existing = categories.find((category) => category.id === id);
    if (!existing) return { ok: false, error: 'This category no longer exists.' };

    const name = String(data?.name || '').trim();
    if (!name) return { ok: false, error: 'Category name is required.', field: 'name' };
    if (categories.some((category) => category.id !== id && compareText(category.name, name) === 0)) {
      return { ok: false, error: 'A category with this name already exists.', field: 'name' };
    }

    const category = normalizeCategory({
      ...existing,
      ...data,
      name,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    setCategories((prev) => prev.map((item) => (item.id === id ? category : item)));

    // Products store the display name for the table/customer UI, so keep it in sync on rename.
    if (category.name !== existing.name) {
      setProducts((prev) =>
        prev.map((product) => (product.categoryId === id ? { ...product, category: category.name } : product)),
      );
    }

    return { ok: true, category };
  }, [categories]);

  const deleteCategory = useCallback((id) => {
    const existing = categories.find((category) => category.id === id);
    if (!existing) return { ok: false, error: 'This category no longer exists.' };

    const linked = products.filter((product) => product.categoryId === id);
    if (linked.length) {
      return {
        ok: false,
        productCount: linked.length,
        error: 'This category contains products. Please move or remove those products before deleting the category.',
      };
    }

    setCategories((prev) => prev.filter((category) => category.id !== id));
    return { ok: true, category: existing };
  }, [categories, products]);

  const toggleCategoryStatus = useCallback((id) => {
    const existing = categories.find((category) => category.id === id);
    if (!existing) return { ok: false, error: 'This category no longer exists.' };
    const status = existing.status === 'Active' ? 'Inactive' : 'Active';
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, status, updatedAt: new Date().toISOString() } : category,
      ),
    );
    return { ok: true, status, category: { ...existing, status } };
  }, [categories]);

  const buildProduct = useCallback((data, base) => {
    const category = categoryMap.get(data.categoryId);
    const price = Math.max(0, toNumber(data.price));
    const original = toNumber(data.originalPrice);
    const originalPrice = original > price ? original : price;
    return normalizeProduct({
      ...base,
      ...data,
      category: category?.name || base?.category || '',
      price,
      originalPrice,
      discount: computeDiscount(price, originalPrice),
    });
  }, [categoryMap]);

  const validateProduct = useCallback((data, id = null) => {
    const name = String(data?.name || '').trim();
    if (!name) return { error: 'Product name is required.', field: 'name' };
    if (!data?.categoryId || !categoryMap.has(data.categoryId)) {
      return { error: 'Select a category for this product.', field: 'categoryId' };
    }
    if (toNumber(data.price) <= 0) return { error: 'Enter a price greater than zero.', field: 'price' };

    const sku = String(data?.sku || '').trim();
    if (sku && products.some((product) => product.id !== id && compareText(product.sku, sku) === 0)) {
      return { error: 'This SKU is already used by another product.', field: 'sku' };
    }
    return null;
  }, [categoryMap, products]);

  const createProduct = useCallback((data) => {
    const invalid = validateProduct(data);
    if (invalid) return { ok: false, ...invalid };

    const taken = new Set(products.map((product) => product.id));
    const id = newProductId(taken);
    const now = new Date().toISOString();
    const product = buildProduct(
      { ...data, sku: String(data.sku || '').trim() || autoSku(data.name, id) },
      { id, createdAt: now, updatedAt: now, rating: 0, reviews: 0 },
    );
    setProducts((prev) => [product, ...prev]);
    return { ok: true, product };
  }, [buildProduct, products, validateProduct]);

  const updateProduct = useCallback((id, data) => {
    const existing = products.find((product) => product.id === id);
    if (!existing) return { ok: false, error: 'This product no longer exists.' };

    const invalid = validateProduct(data, id);
    if (invalid) return { ok: false, ...invalid };

    const product = buildProduct(
      { ...data, sku: String(data.sku || '').trim() || autoSku(data.name, id) },
      { ...existing, id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() },
    );
    setProducts((prev) => prev.map((item) => (item.id === id ? product : item)));
    return { ok: true, product };
  }, [buildProduct, products, validateProduct]);

  const deleteProduct = useCallback((id) => {
    const existing = products.find((product) => product.id === id);
    if (!existing) return { ok: false, error: 'This product no longer exists.' };
    setProducts((prev) => prev.filter((product) => product.id !== id));
    return { ok: true, product: existing };
  }, [products]);

  const toggleProductFeatured = useCallback((id) => {
    const existing = products.find((product) => product.id === id);
    if (!existing) return { ok: false, error: 'This product no longer exists.' };
    const featured = !existing.featured;
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, featured, updatedAt: new Date().toISOString() } : product,
      ),
    );
    return { ok: true, featured, product: { ...existing, featured } };
  }, [products]);

  const dismissStorageError = useCallback(() => setStorageError(null), []);

  const value = useMemo(
    () => ({
      categories,
      products,
      activeCategories,
      categoryMap,
      productCounts,
      loading,
      storageError,
      dismissStorageError,
      createCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryStatus,
      createProduct,
      updateProduct,
      deleteProduct,
      toggleProductFeatured,
    }),
    [
      categories,
      products,
      activeCategories,
      categoryMap,
      productCounts,
      loading,
      storageError,
      dismissStorageError,
      createCategory,
      updateCategory,
      deleteCategory,
      toggleCategoryStatus,
      createProduct,
      updateProduct,
      deleteProduct,
      toggleProductFeatured,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
