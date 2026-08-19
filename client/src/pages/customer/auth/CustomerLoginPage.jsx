import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useSession } from '../../../context/SessionContext.jsx';
import { AuthCard, AuthShell, AuthSecureNote } from '../../../components/auth/AuthLayout.jsx';
import { AuthInput, AuthPrimaryButton } from '../../../components/auth/AuthInput.jsx';

export function CustomerLoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Enter email and password.');
      return;
    }
    login('customer', { email: form.email });
    navigate('/customer/home');
  }

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to order fresh groceries delivered fast to your doorstep.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <AuthInput label="Email address" type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <AuthInput label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          {error && <p className="auth-error-banner">{error}</p>}
          <div className="text-right">
            <Link to="/customer/forgot-password" className="auth-link text-sm">Forgot password?</Link>
          </div>
          <AuthPrimaryButton>Sign In</AuthPrimaryButton>
          <p className="auth-footer-link">
            New customer? <Link to="/customer/register" className="auth-link">Create account</Link>
          </p>
          <button type="button" className="auth-link mx-auto block text-sm" onClick={() => navigate('/customer/home')}>
            Browse as guest →
          </button>
          <AuthSecureNote />
        </form>
      </AuthCard>
    </AuthShell>
  );
}
