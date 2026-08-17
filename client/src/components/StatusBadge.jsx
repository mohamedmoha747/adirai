export function StatusBadge({ status }) {
  const map = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-sky-100 text-sky-800',
    ACCEPTED: 'bg-indigo-100 text-indigo-800',
    PREPARING: 'bg-violet-100 text-violet-800',
    READY_FOR_PICKUP: 'bg-teal-100 text-teal-800',
    PICKED_UP: 'bg-cyan-100 text-cyan-900',
    ON_THE_WAY: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-rose-100 text-rose-800',
    PAID: 'bg-emerald-100 text-emerald-800',
    PROCESSING: 'bg-amber-100 text-amber-800',
    FAILED: 'bg-rose-100 text-rose-800',
    COD: 'bg-stone-200 text-stone-800',
    ASSIGNED: 'bg-sky-100 text-sky-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${map[status] || 'bg-stone-100 text-stone-700'}`}>
      {String(status || '').replaceAll('_', ' ')}
    </span>
  );
}
