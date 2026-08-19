import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthCard, AuthShell } from '../../components/auth/AuthLayout.jsx';
import { AuthCheckbox, AuthInput, AuthPrimaryButton } from '../../components/auth/AuthInput.jsx';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!accepted) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setBusy(true);
    try {
      const path = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: 'CUSTOMER',
      });
      navigate(path === '/' ? '/home' : path);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-card-head">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join Adirai Minutes for fast, safe grocery delivery at your doorstep.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <AuthInput
            label="Full name"
            name="name"
            type="text"
            icon={UserRound}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
          />

          <AuthInput
            label="Email address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />

          <AuthInput
            label="Mobile number"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            autoComplete="new-password"
          />

          <AuthInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            icon={Lock}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />

          <AuthCheckbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
            I agree to the{' '}
            <Link to="/login" className="auth-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/login" className="auth-link">
              Privacy Policy
            </Link>
          </AuthCheckbox>

          {error && <p className="auth-error-banner">{error}</p>}

          <AuthPrimaryButton loading={busy}>Get Started</AuthPrimaryButton>

          <p className="auth-footer-link">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
