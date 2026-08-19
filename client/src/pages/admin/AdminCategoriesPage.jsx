import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { compareText, formatShortDate } from '../../utils/catalog.js';
import { CategoryFormModal } from '../../components/admin/CategoryFormModal.jsx';
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
  TableShell,
  TableSkeleton,
  Th,
  Thumb,
  Toolbar,
} from '../../components/admin/AdminUi.jsx';

const STATUS_FILTERS = [
  { value: 'All', label: 'All statuses' },
  { value: 'Active', label: 'Active only' },
  { value: 'Inactive', label: 'Inactive only' },
];

export function AdminCategoriesPage() {
  const {
    categories,
    productCounts,
    loading,
    storageError,
    dismissStorageError,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  } = useCatalog();
  const toast = useToast();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [editor, setEditor] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [blockedDelete, setBlockedDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const stats = useMemo(() => {
    const active = categories.filter((category) => category.status === 'Active').length;
    return {
      total: categories.length,
      active,
      inactive: categories.length - active,
      linked: Object.values(productCounts).reduce((sum, count) => sum + count, 0),
    };
  }, [categories, productCounts]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = categories.filter((category) => {
      const matchesQuery =
        !needle ||
        category.name.toLowerCase().includes(needle) ||
        category.description.toLowerCase().includes(needle);
      const matchesStatus = status === 'All' || category.status === status;
      return matchesQuery && matchesStatus;
    });

    const direction = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (sort.field === 'name') return compareText(a.name, b.name) * direction;
      if (sort.field === 'products') {
        return ((productCounts[a.id] || 0) - (productCounts[b.id] || 0)) * direction;
      }
      if (sort.field === 'status') return compareText(a.status, b.status) * direction;
      return (new Date(a.createdAt) - new Date(b.createdAt)) * direction;
    });
  }, [categories, productCounts, query, sort, status]);

  function onSort(field) {
    setSort((prev) => ({
      field,
      dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  }

  function handleSubmit(data) {
    if (editor?.mode === 'edit') {
      const result = updateCategory(editor.category.id, data);
      if (result.ok) toast.success(`"${result.category.name}" updated.`);
      return result;
    }
    const result = createCategory(data);
    if (result.ok) toast.success(`"${result.category.name}" added to categories.`);
    return result;
  }

  function requestDelete(category) {
    const count = productCounts[category.id] || 0;
    if (count > 0) {
      setBlockedDelete({ category, count });
      return;
    }
    setPendingDelete(category);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const result = deleteCategory(pendingDelete.id);
    setDeleting(false);
    if (result.ok) toast.success(`"${pendingDelete.name}" deleted.`);
    else toast.error(result.error);
    setPendingDelete(null);
  }

  function handleToggle(category) {
    const result = toggleCategoryStatus(category.id);
    if (result.ok) toast.info(`"${category.name}" is now ${result.status.toLowerCase()}.`);
    else toast.error(result.error);
  }

  const hasFilters = Boolean(query.trim()) || status !== 'All';

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" subtitle="Organise your catalogue and control which categories are available to products.">
        <button type="button" onClick={() => setEditor({ mode: 'add' })} className="btn btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </PageHeader>

      <ErrorBanner message={storageError} onDismiss={dismissStorageError} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total categories" value={stats.total} />
        <StatTile label="Active" value={stats.active} tone="success" />
        <StatTile label="Inactive" value={stats.inactive} tone="warning" />
        <StatTile label="Linked products" value={stats.linked} tone="brand" />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search categories..." label="Search categories" />
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <FilterSelect label="Filter by status" value={status} onChange={setStatus} options={STATUS_FILTERS} />
          <FilterSelect
            label="Sort categories"
            value={`${sort.field}:${sort.dir}`}
            onChange={(value) => {
              const [field, dir] = value.split(':');
              setSort({ field, dir });
            }}
            options={[
              { value: 'createdAt:desc', label: 'Newest first' },
              { value: 'createdAt:asc', label: 'Oldest first' },
              { value: 'name:asc', label: 'Name A–Z' },
              { value: 'name:desc', label: 'Name Z–A' },
              { value: 'products:desc', label: 'Most products' },
              { value: 'products:asc', label: 'Fewest products' },
            ]}
          />
        </div>
      </Toolbar>

      {!loading && categories.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No categories yet"
          message="Categories help customers browse your catalogue. Create your first one to start adding products."
          actionLabel="Add Category"
          onAction={() => setEditor({ mode: 'add' })}
        />
      ) : !loading && visible.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No categories match your filters"
          message="Try a different search term or clear the filters to see all categories."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery('');
            setStatus('All');
          }}
        />
      ) : (
        <TableShell footer={loading ? 'Loading categories...' : `Showing ${visible.length} of ${categories.length} categories`}>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <SortTh label="Category" field="name" sort={sort} onSort={onSort} />
                <SortTh label="Products" field="products" sort={sort} onSort={onSort} />
                <SortTh label="Status" field="status" sort={sort} onSort={onSort} />
                <SortTh label="Created" field="createdAt" sort={sort} onSort={onSort} className="hidden md:table-cell" />
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton rows={6} columns={5} />
            ) : (
              <tbody>
                {visible.map((category) => {
                  const count = productCounts[category.id] || 0;
                  return (
                    <tr key={category.id} className="border-t border-slate-100 align-middle hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumb src={category.image} emoji={category.icon} alt={category.name} color={category.color} />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">{category.name}</p>
                            {category.description ? (
                              <p className="mt-0.5 line-clamp-1 max-w-[22rem] text-xs text-slate-500">{category.description}</p>
                            ) : (
                              <p className="mt-0.5 text-xs text-slate-400">No description</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {count > 0 ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/products?category=${encodeURIComponent(category.id)}`)}
                            className="font-bold text-brand-700 hover:underline"
                          >
                            {count} {count === 1 ? 'product' : 'products'}
                          </button>
                        ) : (
                          <span className="text-slate-400">0 products</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={category.status} />
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-slate-500 md:table-cell">
                        {formatShortDate(category.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton
                            icon={category.status === 'Active' ? ToggleRight : ToggleLeft}
                            label={category.status === 'Active' ? 'Deactivate category' : 'Activate category'}
                            tone={category.status === 'Active' ? 'warning' : 'default'}
                            onClick={() => handleToggle(category)}
                          />
                          <ActionButton
                            icon={Pencil}
                            label="Edit category"
                            tone="brand"
                            onClick={() => setEditor({ mode: 'edit', category })}
                          />
                          <ActionButton icon={Trash2} label="Delete category" tone="danger" onClick={() => requestDelete(category)} />
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
          <button
            type="button"
            className="font-semibold text-brand-700 hover:underline"
            onClick={() => {
              setQuery('');
              setStatus('All');
            }}
          >
            Clear all
          </button>
        </p>
      )}

      <CategoryFormModal
        open={Boolean(editor)}
        mode={editor?.mode || 'add'}
        initial={editor?.category}
        onSubmit={handleSubmit}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name || ''}"?`}
        message="This category will be removed from the catalogue. This action cannot be undone."
        confirmLabel="Delete category"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={Boolean(blockedDelete)}
        tone="warning"
        acknowledgeOnly
        title="Category is in use"
        message={`This category contains products. Please move or remove those ${blockedDelete?.count || 0} product${
          blockedDelete?.count === 1 ? '' : 's'
        } before deleting the category.`}
        confirmLabel="View products"
        cancelLabel="Close"
        onConfirm={() => {
          const target = blockedDelete?.category?.id;
          setBlockedDelete(null);
          if (target) navigate(`/admin/products?category=${encodeURIComponent(target)}`);
        }}
        onCancel={() => setBlockedDelete(null)}
      />
    </div>
  );
}
