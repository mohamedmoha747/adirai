import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const LABELS = ['Home', 'Work', 'Other'];

const EMPTY = {
  type: 'Home',
  name: '',
  phone: '',
  line1: '',
  area: '',
  city: '',
  state: 'Tamil Nadu',
  pincode: '',
  makeDefault: false,
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  else if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid 10-digit phone number.';
  if (!form.line1.trim()) errors.line1 = 'Address line is required.';
  if (!form.area.trim()) errors.area = 'Area is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.state.trim()) errors.state = 'State is required.';
  if (!form.pincode.trim()) errors.pincode = 'Pincode is required.';
  else if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Pincode must be 6 digits.';
  return errors;
}

export function AddressFormModal({ open, mode = 'add', initial, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { ...EMPTY, ...initial, makeDefault: false } : { ...EMPTY });
    setErrors({});
  }, [open, initial]);

  if (!open) return null;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">{mode === 'edit' ? 'Edit address' : 'Add new address'}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-soft-500 hover:bg-soft-50" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <span className="label">Address label</span>
            <div className="mt-1 flex gap-2">
              {LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setField('type', label)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${form.type === label ? 'bg-brand-600 text-white' : 'bg-soft-100 text-soft-600 hover:bg-soft-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Full name" error={errors.name}>
            <input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your name" />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <input className="input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Address line" error={errors.line1}>
            <input className="input" value={form.line1} onChange={(e) => setField('line1', e.target.value)} placeholder="House no., street name" />
          </Field>
          <Field label="Area" error={errors.area}>
            <input className="input" value={form.area} onChange={(e) => setField('area', e.target.value)} placeholder="Anna Nagar" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city}>
              <input className="input" value={form.city} onChange={(e) => setField('city', e.target.value)} placeholder="Chennai" />
            </Field>
            <Field label="State" error={errors.state}>
              <input className="input" value={form.state} onChange={(e) => setField('state', e.target.value)} placeholder="Tamil Nadu" />
            </Field>
          </div>
          <Field label="Pincode" error={errors.pincode}>
            <input className="input" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} placeholder="600040" maxLength={6} />
          </Field>

          {mode === 'add' && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-soft-600">
              <input type="checkbox" checked={form.makeDefault} onChange={(e) => setField('makeDefault', e.target.checked)} className="rounded border-soft-300 text-brand-600" />
              Set as default delivery address
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {mode === 'edit' ? 'Save changes' : 'Add address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-soft-600">{message}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="btn btn-outline flex-1">Cancel</button>
          <button type="button" onClick={onConfirm} className="btn flex-1 bg-rose-600 text-white hover:bg-rose-700">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
