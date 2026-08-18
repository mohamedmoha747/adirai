import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="am-screen">
      <div className="am-screen-inner mx-auto flex min-h-[calc(100vh-24px)] items-center justify-center">
        <div className="w-full max-w-[360px] rounded-[2rem] bg-white p-6 text-center shadow-[0_24px_48px_-24px_rgba(75,49,160,0.35)]">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#f1ebff] bg-gradient-to-br from-brand-100 to-white shadow-inner">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-3xl font-extrabold text-white">AM</div>
          </div>
          <div className="mt-5 text-3xl font-extrabold tracking-tight text-ink">Adirai Minutes</div>
          <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">Fast • Safe • Trusted</div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500 [animation-delay:0s]" />
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-300 [animation-delay:150ms]" />
            <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-200 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}
