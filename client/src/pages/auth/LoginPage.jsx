import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function LoginPage({ mode = 'login' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const path = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password });
      navigate(path);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-10 md:grid-cols-2">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Adirai</p>
        <h1 className="mt-3 font-display text-5xl leading-tight">City orders, live delivery, one login.</h1>
        <p className="mt-4 text-stone-600">
          Customers, shop owners, riders and ops use the same platform — roles are enforced on the server.
        </p>
      </div>
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        <h2 className="font-display text-2xl">{isRegister ? 'Create account' : 'Welcome back'}</h2>
        {isRegister && (
          <>
            <label className="block">
              <span className="label">Name</span>
              <input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} />
            </label>
            <label className="block">
              <span className="label">Phone</span>
              <input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </label>
            <label className="block">
              <span className="label">Role</span>
              <select className="input" value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller / Shop</option>
                <option value="DELIVERY_PARTNER">Delivery partner</option>
              </select>
            </label>
          </>
        )}
        <label className="block">
          <span className="label">Email</span>
          <input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input className="input" type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} />
        </label>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Please wait…' : isRegister ? 'Register' : 'Login'}
        </button>
        <p className="text-center text-sm text-stone-500">
          {isRegister ? (
            <>Already registered? <Link className="font-semibold text-brand-700" to="/login">Login</Link></>
          ) : (
            <>New here? <Link className="font-semibold text-brand-700" to="/register">Create an account</Link></>
          )}
        </p>
        <p className="text-center text-xs text-stone-400">Demo: admin@adirai.com / Admin@123</p>
      </form>
    </div>
  );
}
