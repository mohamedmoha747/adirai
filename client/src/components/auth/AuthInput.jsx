import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function AuthInput({
  label,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  name,
  error,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;

  return (
    <label className="auth-field">
      {label && <span className="auth-field-label">{label}</span>}
      <div className={`auth-input-wrap ${error ? 'auth-input-wrap-error' : ''}`}>
        {Icon && (
          <span className="auth-input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="auth-input"
        />
        {isPassword && (
          <button
            type="button"
            className="auth-input-action"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
      {error && <span className="auth-field-error">{error}</span>}
    </label>
  );
}

export function AuthPrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button type="submit" className={`auth-primary-btn ${className}`} disabled={loading} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function AuthCheckbox({ checked, onChange, children }) {
  return (
    <label className="auth-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} className="auth-checkbox-input" />
      <span className="auth-checkbox-box" />
      <span className="auth-checkbox-text">{children}</span>
    </label>
  );
}
