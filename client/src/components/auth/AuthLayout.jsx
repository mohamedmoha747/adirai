import { Moon, ShieldCheck, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export function AmLogo({ size = 'lg' }) {
  const dims = size === 'sm' ? 'h-12 w-12 text-lg rounded-2xl' : 'h-14 w-14 text-xl rounded-[1.1rem]';
  return (
    <div
      className={`mx-auto flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-500 font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(122,44,234,0.65)] ${dims}`}
    >
      AM
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="auth-theme-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Moon size={15} /> : <Sun size={15} />}
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

export function AuthShell({ children, showLogo = true, forceLight = false }) {
  return (
    <div className={forceLight ? 'auth-shell auth-shell-light' : 'auth-shell'}>
      <div className="auth-shell-inner">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1" />
          <ThemeToggle />
        </div>

        {showLogo && (
          <div className="mb-5 mt-1">
            <AmLogo />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children }) {
  return <div className="auth-card">{children}</div>;
}

export function AuthDivider({ label = 'or' }) {
  return (
    <div className="auth-divider">
      <span />
      <p>{label}</p>
      <span />
    </div>
  );
}

export function AuthSecureNote() {
  return (
    <p className="auth-secure-note">
      <ShieldCheck size={14} className="shrink-0 text-brand-500" />
      Your data is 100% secure and protected
    </p>
  );
}
