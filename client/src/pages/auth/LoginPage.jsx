import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, MessageCircleMore, PhoneCall } from 'lucide-react';

export function LoginPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('+91 98765 43210');
  const isRegister = mode === 'register';

  function submit() {
    navigate('/home');
  }

  return (
    <div className="am-screen">
      <div className="am-screen-inner flex min-h-screen items-center justify-center px-3 py-8">
        <div className="w-full max-w-[380px] rounded-[2rem] bg-white p-5 shadow-[0_22px_38px_-26px_rgba(82,52,170,0.35)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-3xl font-extrabold text-white shadow-lg shadow-brand-500/25">AM</div>

          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">Adirai Minutes</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink">{isRegister ? 'Welcome' : 'Welcome Back!'}</h1>
            <p className="mt-1 text-sm text-soft-500">{isRegister ? 'Create your account' : 'Login to continue'}</p>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block">
              <span className="label">Mobile Number</span>
              <div className="flex items-center gap-2 rounded-[1rem] border border-soft-200 bg-soft-50 px-3 py-3">
                <span className="text-sm font-bold text-soft-500">🇮🇳</span>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-soft-400" placeholder="+91 98765 43210" />
              </div>
            </label>

            <button type="button" className="btn btn-primary w-full" onClick={submit}>
              Send OTP <ArrowRight size={16} />
            </button>

            <div className="flex items-center gap-3 pt-3 text-xs font-semibold text-soft-400">
              <div className="h-px flex-1 bg-soft-200" />
              <span>or</span>
              <div className="h-px flex-1 bg-soft-200" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button type="button" className="flex flex-col items-center gap-2 rounded-[1rem] border border-soft-200 bg-white py-3 text-[10px] font-semibold text-soft-600">
                <Smartphone size={18} className="text-brand-700" /> Google
              </button>
              <button type="button" className="flex flex-col items-center gap-2 rounded-[1rem] border border-soft-200 bg-white py-3 text-[10px] font-semibold text-soft-600">
                <PhoneCall size={18} className="text-brand-700" /> Phone
              </button>
              <button type="button" className="flex flex-col items-center gap-2 rounded-[1rem] border border-soft-200 bg-white py-3 text-[10px] font-semibold text-soft-600">
                <MessageCircleMore size={18} className="text-brand-700" /> WhatsApp
              </button>
            </div>

            <div className="pt-2 text-center text-sm text-soft-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link to={isRegister ? '/login' : '/register'} className="font-extrabold text-brand-700">
                {isRegister ? 'Sign In' : 'Sign Up'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
