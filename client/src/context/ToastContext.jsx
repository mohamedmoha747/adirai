import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TTL = 3200;
const MAX_VISIBLE = 3;

const TONES = {
  success: { icon: CheckCircle2, ring: 'ring-emerald-200', accent: 'text-emerald-600', bar: 'bg-emerald-500' },
  error: { icon: AlertTriangle, ring: 'ring-rose-200', accent: 'text-rose-600', bar: 'bg-rose-500' },
  info: { icon: Info, ring: 'ring-brand-200', accent: 'text-brand-600', bar: 'bg-brand-500' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback((message, type = 'success') => {
    if (!message) return null;
    const id = `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), { id, message, type }]);
    timers.current.set(id, setTimeout(() => dismiss(id), TOAST_TTL));
    return id;
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
  }, []);

  const value = useMemo(
    () => ({
      push,
      dismiss,
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-3 top-3 z-[60] flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2 sm:right-5 sm:top-5"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.type] || TONES.info;
          const Icon = tone.icon;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl bg-white p-3 pr-2 shadow-lg ring-1 ${tone.ring}`}
            >
              <span className={`mt-0.5 shrink-0 ${tone.accent}`}>
                <Icon size={18} />
              </span>
              <p className="flex-1 text-sm font-semibold leading-snug text-slate-700">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
