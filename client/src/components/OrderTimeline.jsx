import { STATUS_FLOW } from '../utils/format.js';

export function OrderTimeline({ current, cancelled }) {
  if (cancelled) {
    return (
      <div className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">This order was cancelled.</div>
    );
  }
  const idx = STATUS_FLOW.indexOf(current);
  const visualIndex = idx === -1 && current === 'PREPARING' ? STATUS_FLOW.indexOf('ACCEPTED') : idx;

  return (
    <ol className="space-y-0">
      {STATUS_FLOW.map((step, i) => {
        const done = visualIndex > i || current === 'COMPLETED' || (step === current && current !== 'ON_THE_WAY' && i < visualIndex);
        const active = step === current || (current === 'PREPARING' && step === 'ACCEPTED');
        const isHere = step === current || (current === 'PREPARING' && step === 'ACCEPTED');
        const reached = visualIndex >= i || current === 'COMPLETED';
        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                  isHere
                    ? 'bg-ember-600 text-white ring-4 ring-orange-100'
                    : reached
                      ? 'bg-brand-700 text-white'
                      : 'bg-stone-200 text-stone-500'
                }`}
              >
                {reached && !isHere ? '✓' : isHere ? '●' : '○'}
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[22px] ${reached ? 'bg-brand-600' : 'bg-stone-200'}`} />
              )}
            </div>
            <div className={`pb-5 pt-1 text-sm ${isHere ? 'font-extrabold text-ember-600' : reached ? 'font-semibold text-ink' : 'text-stone-400'}`}>
              {step.replaceAll('_', ' ')}
              {isHere && <span className="ml-2 text-xs font-bold uppercase tracking-wide">Current</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
