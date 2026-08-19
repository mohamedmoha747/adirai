import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useSession } from '../../../context/SessionContext.jsx';
import { AuthCard, AuthShell } from '../../../components/auth/AuthLayout.jsx';
import { AuthCheckbox, AuthInput, AuthPrimaryButton } from '../../../components/auth/AuthInput.jsx';

export function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '', address: '' });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (!accepted) return setError('Accept terms to continue.');
    login('customer', form);
    navigate('/customer/home');
  }

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join Adirai Minutes for grocery delivery at your doorstep.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <AuthInput label="Full Name" icon={UserRound} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <AuthInput label="Mobile Number" icon={Phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
          <AuthInput label="Email address" type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <AuthInput label="Delivery Address" icon={MapPin} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <AuthInput label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          <AuthInput label="Confirm password" type="password" icon={Lock} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" />
          <AuthCheckbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
            I agree to the <Link to="/customer/login" className="auth-link">Terms</Link> and <Link to="/customer/login" className="auth-link">Privacy Policy</Link>
          </AuthCheckbox>
          {error && <p className="auth-error-banner">{error}</p>}
          <AuthPrimaryButton>Get Started</AuthPrimaryButton>
          <p className="auth-footer-link">Already have an account? <Link to="/customer/login" className="auth-link">Login</Link></p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
