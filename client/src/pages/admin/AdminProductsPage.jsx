import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { compareText, stockLevel } from '../../utils/catalog.js';
import { formatMoney } from '../../utils/format.js';
import { ProductFormModal } from '../../components/admin/ProductFormModal.jsx';
import {
  ActionButton,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  FilterSelect,
  PageHeader,
  SearchInput,
  SortTh,
  StatTile,
  StatusPill,
  StockPill,
  TableShell,
  TableSkeleton,
  Th,
  Thumb,
  Toolbar,
} from '../../components/admin/AdminUi.jsx';

const STOCK_FILTERS = [
  { value: 'All', label: 'All stock levels' },
  { value: 'in', label: 'In stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'out', label: 'Out of stock' },
];

const STATUS_FILTERS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active only' },
  { value: 'Inactive', label: 'Inactive only' },
];

const FEATURED_FILTERS = [
  { value: 'All', label: 'Featured & regular' },
  { value: 'yes', label: 'Featured only' },
  { value: 'no', label: 'Not featured' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'name:asc', label: 'Name A–Z' },
  { value: 'name:desc', label: 'Name Z–A' },
  { value: 'price:asc', label: 'Price low → high' },
  { value: 'price:desc', label: 'Price high → low' },
  { value: 'stock:asc', label: 'Stock low → high' },
  { value: 'stock:desc', label: 'Stock high → low' },
];

export function AdminProductsPage() {
  const {
    products,
    categories,
    categoryMap,
    loading,
    storageError,
    dismissStorageError,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductFeatured,
  } = useCatalog();
  const toast = useToast();

  // The category filter lives in the URL so the categories page can deep-link into it.
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const [query, setQuery] = useState('');
  const [stock, setStock] = useState('All');
  const [status, setStatus] = useState('All');
  const [featured, setFeatured] = useState('All');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function setCategory(value) {
    const next = new URLSearchParams(searchParams);
    if (value === 'All') next.delete('category');
    else next.set('category', value);
    setSearchParams(next, { replace: true });
  }

  const categoryFilters = useMemo(
    () => [
      { value: 'All', label: 'All categories' },
      ...[...categories]
        .sort((a, b) => compareText(a.name, b.name))
        .map((item) => ({
          value: item.id,
          label: item.status === 'Active' ? item.name : `${item.name} (inactive)`,
        })),
    ],
    [categories],
  );

  const stats = useMemo(() => {
    let active = 0;
    let low = 0;
    let out = 0;
    let featuredCount = 0;
    products.forEach((product) => {
      if (product.status === 'Active') active += 1;
      const level = stockLevel(product.stock);
      if (level === 'low') low += 1;
      if (level === 'out') out += 1;
      if (product.featured) featuredCount += 1;
    });
    return { total: products.length, active, low, out, featured: featuredCount };
  }, [products]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = products.filter((product) => {
      const matchesQuery =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.sku.toLowerCase().includes(needle);
      const matchesCategory = category === 'All' || product.categoryId === category;
      const matchesStock = stock === 'All' || stockLevel(product.stock) === stock;
      const matchesStatus = status === 'All' || product.status === status;
      const matchesFeatured =
        featured === 'All' || (featured === 'yes' ? product.featured : !product.featured);
      return matchesQuery && matchesCategory && matchesStock && matchesStatus && matchesFeatured;
    });

    const direction = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (sort.field === 'name') return compareText(a.name, b.name) * direction;
      if (sort.field === 'price') return (a.price - b.price) * direction;
      if (sort.field === 'stock') return (a.stock - b.stock) * direction;
      if (sort.field === 'category') return compareText(a.category, b.category) * direction;
      if (sort.field === 'status') return compareText(a.status, b.status) * direction;
      if (sort.field === 'featured') return (Number(a.featured) - Number(b.featured)) * direction;
      return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
    });
  }, [category, featured, products, query, sort, status, stock]);

  function onSort(field) {
    setSort((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  }

  function clearFilters() {
    setQuery('');
    setStock('All');
    setStatus('All');
    setFeatured('All');
    setCategory('All');
  }

  function handleSubmit(data) {
    if (editor?.mode === 'edit') {
      const result = updateProduct(editor.product.id, data);
      if (result.ok) toast.success(`"${result.product.name}" updated.`);
      return result;
    }
    const result = createProduct(data);
    if (result.ok) toast.success(`"${result.product.name}" added to products.`);
    return result;
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = deleteProduct(pendingDelete.id);
    setDeleting(false);
    if (result.ok) toast.success(`"${pendingDelete.name}" deleted.`);
    else toast.error(result.error);
    setPendingDelete(null);
  }

  function handleFeatured(product) {
    const result = toggleProductFeatured(product.id);
    if (result.ok) {
      toast.info(result.featured ? `"${product.name}" is now featured.` : `"${product.name}" removed from featured.`);
    } else {
      toast.error(result.error);
    }
  }

  const hasFilters =
    Boolean(query.trim()) || category !== 'All' || stock !== 'All' || status !== 'All' || featured !== 'All';
  const activeCategoryName = category === 'All' ? null : categoryMap.get(category)?.name || 'Unknown category';

  return (
    <div className="space-y-6">
      <PageHeader title="Products" subtitle="Manage your catalogue: pricing, stock, categories and storefront visibility.">
        <button type="button" onClick={() => setEditor({ mode: 'add' })} className="btn btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </PageHeader>

      <ErrorBanner message={storageError} onDismiss={dismissStorageError} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total products" value={stats.total} hint={`${stats.featured} featured`} />
        <StatTile label="Active" value={stats.active} tone="success" />
        <StatTile label="Low stock" value={stats.low} tone="warning" hint="10 units or fewer" />
        <StatTile label="Out of stock" value={stats.out} tone="danger" />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by name or SKU..." label="Search products" />
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <FilterSelect label="Filter by category" value={category} onChange={setCategory} options={categoryFilters} />
          <FilterSelect label="Filter by stock" value={stock} onChange={setStock} options={STOCK_FILTERS} />
          <FilterSelect label="Filter by status" value={status} onChange={setStatus} options={STATUS_FILTERS} />
          <FilterSelect label="Filter by featured" value={featured} onChange={setFeatured} options={FEATURED_FILTERS} />
          <FilterSelect
            label="Sort products"
            value={`${sort.field}:${sort.dir}`}
            onChange={(value) => {
              const [field, dir] = value.split(':');
              setSort({ field, dir });
            }}
            options={SORT_OPTIONS}
          />
        </div>
      </Toolbar>

      {activeCategoryName && (
        <p className="text-sm text-slate-500">
          Showing products in <span className="font-bold text-slate-700">{activeCategoryName}</span>.{' '}
          <button type="button" onClick={() => setCategory('All')} className="font-semibold text-brand-700 hover:underline">
            Show all categories
          </button>
        </p>
      )}

      {!loading && products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          message="Add your first product to start building the catalogue. You can set pricing, stock and images."
          actionLabel="Add Product"
          onAction={() => setEditor({ mode: 'add' })}
        />
      ) : !loading && visible.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products match your filters"
          message="Try a different search term, or clear the filters to see the full catalogue."
          actionLabel="Clear filters"
          onAction={clearFilters}
          secondaryLabel="Add Product"
          onSecondary={() => setEditor({ mode: 'add' })}
        />
      ) : (
        <TableShell footer={loading ? 'Loading products...' : `Showing ${visible.length} of ${products.length} products`}>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <SortTh label="Product" field="name" sort={sort} onSort={onSort} />
                <SortTh label="Category" field="category" sort={sort} onSort={onSort} className="hidden md:table-cell" />
                <SortTh label="Price" field="price" sort={sort} onSort={onSort} />
                <SortTh label="Stock" field="stock" sort={sort} onSort={onSort} />
                <SortTh label="Status" field="status" sort={sort} onSort={onSort} className="hidden sm:table-cell" />
                <SortTh label="Featured" field="featured" sort={sort} onSort={onSort} className="hidden lg:table-cell" />
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton rows={6} columns={7} />
            ) : (
              <tbody>
                {visible.map((product) => {
                  const productCategory = categoryMap.get(product.categoryId);
                  return (
                    <tr key={product.id} className="border-t border-slate-100 align-middle hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumb src={product.image} alt={product.name} />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">{product.name}</p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {product.sku}
                              {product.unit ? ` · ${product.unit}` : ''}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400 md:hidden">
                              {productCategory?.name || product.category || 'Uncategorised'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {productCategory ? (
                          <span className="inline-flex items-center gap-1.5">
                            {productCategory.icon && <span aria-hidden="true">{productCategory.icon}</span>}
                            <span className="font-semibold text-slate-700">{productCategory.name}</span>
                            {productCategory.status !== 'Active' && (
                              <span className="text-xs font-semibold text-amber-600">(inactive)</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">{product.category || 'Uncategorised'}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="font-bold text-slate-900">{formatMoney(product.price)}</p>
                        {product.originalPrice > product.price && (
                          <p className="mt-0.5 text-xs">
                            <span className="text-slate-400 line-through">{formatMoney(product.originalPrice)}</span>{' '}
                            <span className="font-bold text-emerald-600">{product.discount}% off</span>
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="font-bold text-slate-900">{product.stock}</p>
                        <div className="mt-1">
                          <StockPill stock={product.stock} />
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <StatusPill status={product.status} />
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <button
                          type="button"
                          onClick={() => handleFeatured(product)}
                          aria-pressed={product.featured}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 transition ${
                            product.featured
                              ? 'bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'
                          }`}
                          title={product.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star size={12} className={product.featured ? 'fill-amber-500 text-amber-500' : ''} />
                          {product.featured ? 'Featured' : 'Regular'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton
                            icon={Star}
                            label={product.featured ? 'Remove from featured' : 'Mark as featured'}
                            tone={product.featured ? 'warning' : 'default'}
                            onClick={() => handleFeatured(product)}
                          />
                          <ActionButton
                            icon={Pencil}
                            label="Edit product"
                            tone="brand"
                            onClick={() => setEditor({ mode: 'edit', product })}
                          />
                          <ActionButton
                            icon={Trash2}
                            label="Delete product"
                            tone="danger"
                            onClick={() => setPendingDelete(product)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </TableShell>
      )}

      {hasFilters && !loading && visible.length > 0 && (
        <p className="text-xs text-slate-400">
          Filters applied.{' '}
          <button type="button" className="font-semibold text-brand-700 hover:underline" onClick={clearFilters}>
            Clear all
          </button>
        </p>
      )}

      <ProductFormModal
        open={Boolean(editor)}
        mode={editor?.mode || 'add'}
        initial={editor?.product}
        categories={categories}
        onSubmit={handleSubmit}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name || ''}"?`}
        message="This product will be removed from the catalogue. This action cannot be undone."
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
