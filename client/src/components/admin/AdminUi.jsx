import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronsUpDown,
  ImagePlus,
  Package,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { MAX_IMAGE_BYTES, STOCK_LABELS, stockLevel } from '../../utils/catalog.js';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
    </div>
  );
}

const TILE_TONES = {
  default: 'text-slate-900',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-rose-600',
  brand: 'text-brand-700',
};

export function StatTile({ label, value, tone = 'default', hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-1.5 text-2xl font-extrabold ${TILE_TONES[tone] || TILE_TONES.default}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Toolbar({ children }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
      {children}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search...', label = 'Search' }) {
  return (
    <div className="relative w-full lg:max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        className="input py-2.5 pl-10 pr-9"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        className="input w-full cursor-pointer appearance-none py-2.5 pr-9 text-sm font-semibold text-slate-700 lg:w-auto"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export function TableShell({ children, footer }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">{children}</div>
      {footer && <div className="border-t border-slate-100 px-4 py-3 text-xs font-medium text-slate-500">{footer}</div>}
    </div>
  );
}

export function Th({ children, className = '' }) {
  return <th scope="col" className={`px-4 py-3 font-bold ${className}`}>{children}</th>;
}

export function SortTh({ label, field, sort, onSort, className = '' }) {
  const active = sort.field === field;
  const Icon = active ? (sort.dir === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown;
  return (
    <th scope="col" className={`px-4 py-3 font-bold ${className}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1.5 rounded transition hover:text-brand-700 ${active ? 'text-brand-700' : ''}`}
      >
        {label}
        <Icon size={13} className={active ? '' : 'text-slate-400'} />
      </button>
    </th>
  );
}

export function StatusPill({ status }) {
  const active = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${
        active ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

const STOCK_STYLES = {
  in: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  low: 'bg-amber-50 text-amber-700 ring-amber-200',
  out: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export function StockPill({ stock }) {
  const level = stockLevel(stock);
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${STOCK_STYLES[level]}`}
    >
      {STOCK_LABELS[level]}
    </span>
  );
}

export function Thumb({ src, emoji, alt = '', color, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const dimensions = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50`}
      style={!showImage && color ? { backgroundColor: `${color}1f` } : undefined}
    >
      {showImage ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} loading="lazy" />
      ) : emoji ? (
        <span className={size === 'lg' ? 'text-2xl' : 'text-xl'} aria-hidden="true">{emoji}</span>
      ) : (
        <Package size={size === 'lg' ? 22 : 18} className="text-slate-400" aria-hidden="true" />
      )}
    </div>
  );
}

export function ActionButton({ icon: Icon, label, onClick, tone = 'default', disabled = false }) {
  const tones = {
    default: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    brand: 'text-brand-600 hover:bg-brand-50 hover:text-brand-700',
    danger: 'text-rose-500 hover:bg-rose-50 hover:text-rose-700',
    warning: 'text-amber-500 hover:bg-amber-50 hover:text-amber-700',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`rounded-lg p-2 transition disabled:pointer-events-none disabled:opacity-40 ${tones[tone]}`}
    >
      <Icon size={16} />
    </button>
  );
}

export function EmptyState({ icon: Icon = Package, title, message, actionLabel, onAction, secondaryLabel, onSecondary }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h3>
      {message && <p className="mt-1.5 max-w-md text-sm text-slate-500">{message}</p>}
      {(actionLabel || secondaryLabel) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {actionLabel && (
            <button type="button" onClick={onAction} className="btn btn-primary">
              {actionLabel}
            </button>
          )}
          {secondaryLabel && (
            <button type="button" onClick={onSecondary} className="btn btn-outline">
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-t border-slate-100">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              <div className="h-3.5 animate-pulse rounded-full bg-slate-100" style={{ width: colIndex === 0 ? '70%' : '45%' }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-600" />
      <p className="flex-1 text-sm font-semibold text-rose-700">{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="rounded-lg p-1 text-rose-500 transition hover:bg-rose-100" aria-label="Dismiss">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function AdminModal({ open, title, subtitle, onClose, size = 'md', children }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${
          size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const CONFIRM_TONES = {
  danger: { icon: Trash2, wrap: 'bg-rose-50 text-rose-600', confirm: 'bg-rose-600 text-white hover:bg-rose-700' },
  warning: { icon: AlertTriangle, wrap: 'bg-amber-50 text-amber-600', confirm: 'bg-amber-500 text-white hover:bg-amber-600' },
};

export function ConfirmDialog({
  open,
  tone = 'danger',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
  acknowledgeOnly = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const styles = CONFIRM_TONES[tone] || CONFIRM_TONES.danger;
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-900/50 p-4" role="alertdialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.wrap}`}>
          <Icon size={20} />
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          {acknowledgeOnly ? (
            <>
              {cancelLabel && (
                <button type="button" onClick={onCancel} className="btn btn-outline flex-1">
                  {cancelLabel}
                </button>
              )}
              <button type="button" onClick={onConfirm} className="btn btn-primary flex-1">
                {confirmLabel}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={onCancel} disabled={busy} className="btn btn-outline flex-1">
                {cancelLabel}
              </button>
              <button type="button" onClick={onConfirm} disabled={busy} className={`btn flex-1 ${styles.confirm}`}>
                {busy ? 'Working...' : confirmLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, error, hint, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      )}
    </label>
  );
}

export function ToggleGroup({ label, value, onChange, options, required }) {
  return (
    <div>
      <span className="label">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ImagePickerField({ label = 'Image', value, onChange, onError, emoji, hint, error }) {
  const inputRef = useRef(null);

  function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError?.('Choose an image file (PNG, JPG, WEBP or SVG).');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onError?.('That image is larger than 1 MB. Please pick a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.onerror = () => onError?.('That image could not be read. Try another file.');
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-start gap-4">
        <Thumb src={value} emoji={emoji} alt="" size="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-soft px-3.5 py-2 text-xs">
              {value ? <Upload size={14} /> : <ImagePlus size={14} />}
              {value ? 'Replace image' : 'Upload image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="btn btn-outline px-3.5 py-2 text-xs">
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
          <input
            className="input py-2.5 text-xs"
            placeholder="Or paste an image URL"
            value={value?.startsWith('data:') ? '' : value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} URL`}
          />
          {value?.startsWith('data:') && <p className="text-xs text-slate-400">Uploaded from this device.</p>}
          {error ? (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          ) : (
            hint && <p className="text-xs text-slate-400">{hint}</p>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} tabIndex={-1} />
    </div>
  );
}

export function ModalFooter({ onCancel, submitLabel, busy, cancelLabel = 'Cancel' }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} disabled={busy} className="btn btn-outline sm:min-w-[120px]">
        {cancelLabel}
      </button>
      <button type="submit" disabled={busy} className="btn btn-primary sm:min-w-[160px]">
        {busy ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
}
