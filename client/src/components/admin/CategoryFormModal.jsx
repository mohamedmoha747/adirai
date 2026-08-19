import { useEffect, useState } from 'react';
import { CATEGORY_ACCENT } from '../../utils/catalog.js';
import { AdminModal, ErrorBanner, Field, ImagePickerField, ModalFooter, ToggleGroup } from './AdminUi.jsx';

const EMOJI_SUGGESTIONS = ['🥬', '🍟', '🥤', '🧴', '🧽', '🥐', '🥛', '🥕', '🐟', '🍼', '📚', '🐾'];

const EMPTY = {
  name: '',
  icon: '',
  image: '',
  color: CATEGORY_ACCENT,
  description: '',
  status: 'Active',
};

export function CategoryFormModal({ open, mode = 'add', initial, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { ...EMPTY, ...initial } : { ...EMPTY });
    setErrors({});
    setBanner('');
    setBusy(false);
  }, [open, initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setBanner('');
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Category name is required.';
    else if (form.name.trim().length < 2) nextErrors.name = 'Use at least 2 characters.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    const result = await Promise.resolve(
      onSubmit({
        name: form.name.trim(),
        icon: form.icon.trim(),
        image: form.image,
        color: form.color || CATEGORY_ACCENT,
        description: form.description.trim(),
        status: form.status,
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

  return (
    <AdminModal
      open={open}
      title={mode === 'edit' ? 'Edit category' : 'Add category'}
      subtitle={mode === 'edit' ? 'Update how this category appears across the storefront.' : 'Create a new category for organising products.'}
      onClose={onClose}
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <ErrorBanner message={banner} onDismiss={() => setBanner('')} />

          <Field label="Category name" error={errors.name} required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. Fruits & Vegetables"
              autoFocus
            />
          </Field>

          <ImagePickerField
            label="Category image"
            value={form.image}
            emoji={form.icon}
            onChange={(value) => setField('image', value)}
            onError={(message) => setErrors((prev) => ({ ...prev, image: message }))}
            error={errors.image}
            hint="Optional. The emoji icon below is used when no image is set."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Icon (emoji)" hint="Shown wherever no image is available.">
              <input
                className="input"
                value={form.icon}
                onChange={(e) => setField('icon', e.target.value)}
                placeholder="🥬"
                maxLength={4}
              />
            </Field>
            <Field label="Accent colour" hint="Used for category tints.">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setField('color', e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-xl border border-soft-200 bg-white p-1"
                  aria-label="Accent colour"
                />
                <input
                  className="input"
                  value={form.color}
                  onChange={(e) => setField('color', e.target.value)}
                  placeholder={CATEGORY_ACCENT}
                />
              </div>
            </Field>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setField('icon', emoji)}
                className={`h-9 w-9 rounded-lg text-lg transition ${
                  form.icon === emoji ? 'bg-brand-100 ring-2 ring-brand-400' : 'bg-slate-100 hover:bg-slate-200'
                }`}
                aria-label={`Use ${emoji} icon`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <Field label="Description" hint="Optional short summary for internal reference.">
            <textarea
              className="input min-h-[90px] resize-y"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="What kind of products belong to this category?"
            />
          </Field>

          <ToggleGroup
            label="Status"
            value={form.status}
            onChange={(value) => setField('status', value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
          />
          <p className="-mt-3 text-xs text-slate-400">Inactive categories cannot be assigned to new products.</p>
        </div>

        <ModalFooter onCancel={onClose} busy={busy} submitLabel={mode === 'edit' ? 'Save changes' : 'Create category'} />
      </form>
    </AdminModal>
  );
}
