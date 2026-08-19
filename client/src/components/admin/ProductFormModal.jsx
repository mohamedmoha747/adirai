import { useEffect, useMemo, useState } from 'react';
import { computeDiscount, toNumber } from '../../utils/catalog.js';
import { formatMoney } from '../../utils/format.js';
import { AdminModal, ErrorBanner, Field, ImagePickerField, ModalFooter, ToggleGroup } from './AdminUi.jsx';

const EMPTY = {
  name: '',
  categoryId: '',
  image: '',
  description: '',
  price: '',
  originalPrice: '',
  unit: '',
  stock: '',
  sku: '',
  status: 'Active',
  featured: false,
};

function toFormValues(product) {
  if (!product) return { ...EMPTY };
  return {
    name: product.name || '',
    categoryId: product.categoryId || '',
    image: product.image || '',
    description: product.description || '',
    price: product.price ? String(product.price) : '',
    originalPrice: product.originalPrice > product.price ? String(product.originalPrice) : '',
    unit: product.unit || '',
    stock: Number.isFinite(product.stock) ? String(product.stock) : '',
    sku: product.sku || '',
    status: product.status || 'Active',
    featured: Boolean(product.featured),
  };
}

export function ProductFormModal({ open, mode = 'add', initial, categories, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(toFormValues(initial));
    setErrors({});
    setBanner('');
    setBusy(false);
  }, [open, initial]);

  // Only active categories are selectable, but an existing product keeps its own
  // category visible so editing never silently reassigns it.
  const categoryOptions = useMemo(() => {
    const options = categories
      .filter((category) => category.status === 'Active')
      .map((category) => ({ value: category.id, label: category.name }));
    const current = initial?.categoryId && categories.find((category) => category.id === initial.categoryId);
    if (current && current.status !== 'Active') {
      options.unshift({ value: current.id, label: `${current.name} (inactive)` });
    }
    return options;
  }, [categories, initial]);

  const price = toNumber(form.price);
  const originalPrice = toNumber(form.originalPrice);
  const discount = computeDiscount(price, originalPrice);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setBanner('');
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Product name is required.';
    if (!form.categoryId) nextErrors.categoryId = 'Select a category.';
    if (!String(form.price).trim()) nextErrors.price = 'Price is required.';
    else if (price <= 0) nextErrors.price = 'Price must be greater than zero.';
    if (String(form.originalPrice).trim() && originalPrice > 0 && originalPrice <= price) {
      nextErrors.originalPrice = 'Original price must be higher than the selling price.';
    }
    if (String(form.stock).trim() && toNumber(form.stock, -1) < 0) {
      nextErrors.stock = 'Stock cannot be negative.';
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    const result = await Promise.resolve(
      onSubmit({
        name: form.name.trim(),
        categoryId: form.categoryId,
        image: form.image,
        description: form.description.trim(),
        price,
        originalPrice: originalPrice > price ? originalPrice : price,
        unit: form.unit.trim(),
        stock: Math.max(0, Math.round(toNumber(form.stock))),
        sku: form.sku.trim(),
        status: form.status,
        featured: form.featured,
      }),
    );
    setBusy(false);

    if (!result?.ok) {
      if (result?.field) setErrors({ [result.field]: result.error });
      else setBanner(result?.error || 'Something went wrong. Please try again.');
      return;
    }
    onClose();
  }

  const noCategories = categoryOptions.length === 0;

  return (
    <AdminModal
      open={open}
      size="lg"
      title={mode === 'edit' ? 'Edit product' : 'Add product'}
      subtitle={mode === 'edit' ? 'Update pricing, stock and visibility for this product.' : 'Add a new product to the catalogue.'}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <ErrorBanner message={banner} onDismiss={() => setBanner('')} />
          {noCategories && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              No active categories yet. Create an active category first so products can be classified.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product name" error={errors.name} required className="sm:col-span-2">
              <input
                className="input"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Fortune Sunflower Oil"
                autoFocus
              />
            </Field>

            <Field label="Category" error={errors.categoryId} required>
              <select
                className="input cursor-pointer"
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
                disabled={noCategories}
              >
                <option value="">Select a category</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="SKU" error={errors.sku} hint="Auto-generated when left blank.">
              <input
                className="input"
                value={form.sku}
                onChange={(e) => setField('sku', e.target.value)}
                placeholder="AM-FOR-P1"
              />
            </Field>
          </div>

          <ImagePickerField
            label="Product image"
            value={form.image}
            onChange={(value) => setField('image', value)}
            onError={(message) => setErrors((prev) => ({ ...prev, image: message }))}
            error={errors.image}
            hint="Upload a file (under 1 MB) or paste an image URL. A placeholder is shown when empty."
          />

          <Field label="Description">
            <textarea
              className="input min-h-[90px] resize-y"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Short product description shown to customers."
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Price (₹)" error={errors.price} required>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="165"
              />
            </Field>
            <Field label="Original price (₹)" error={errors.originalPrice} hint="Optional, for showing a strike-through.">
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                inputMode="decimal"
                value={form.originalPrice}
                onChange={(e) => setField('originalPrice', e.target.value)}
                placeholder="199"
              />
            </Field>
            <div>
              <span className="label">Discount</span>
              <div className="flex min-h-[46px] items-center justify-between rounded-2xl border border-soft-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-extrabold text-slate-900">{discount}%</span>
                {discount > 0 && (
                  <span className="text-xs font-semibold text-emerald-600">
                    Saves {formatMoney(originalPrice - price)}
                  </span>
                )}
              </div>
              <span className="mt-1 block text-xs text-slate-400">Calculated from price & original price.</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Weight / quantity" hint="Pack size shown to customers.">
              <input
                className="input"
                value={form.unit}
                onChange={(e) => setField('unit', e.target.value)}
                placeholder="1 L / 500 g / 6 pcs"
              />
            </Field>
            <Field label="Stock quantity" error={errors.stock} hint="0 marks the product out of stock.">
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => setField('stock', e.target.value)}
                placeholder="40"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ToggleGroup
              label="Status"
              value={form.status}
              onChange={(value) => setField('status', value)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
            <ToggleGroup
              label="Featured product"
              value={form.featured}
              onChange={(value) => setField('featured', value)}
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
            />
          </div>
        </div>

        <ModalFooter onCancel={onClose} busy={busy} submitLabel={mode === 'edit' ? 'Save changes' : 'Create product'} />
      </form>
    </AdminModal>
  );
}
