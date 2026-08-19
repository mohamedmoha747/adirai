import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

const LOGIN = {
  CUSTOMER: '/customer/login',
  DELIVERY_PARTNER: '/delivery/login',
  ADMIN: '/admin/login',
};

const HOME = {
  CUSTOMER: '/customer/home',
  DELIVERY_PARTNER: '/delivery/dashboard',
  ADMIN: '/admin/dashboard',
};

/** Where a signed-in user belongs, or null for roles without a portal of their own. */
function homeFor(user) {
  return (user?.role && HOME[user.role]) || null;
}

/**
 * Keeps a whole portal (customer / delivery / admin) sealed off from the other
 * roles. Guests pass through so public pages and login screens stay reachable.
 */
export function PortalGuard({ portal }) {
  const { user } = useSession();
  const home = homeFor(user);

  if (user && home && user.role !== portal) {
    return <Navigate to={home} replace />;
  }
  return <Outlet />;
}

/** Requires a signed-in user with the given role. */
export function RequireRole({ role }) {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    return <Navigate to={LOGIN[role]} replace state={{ from: location }} />;
  }
  if (user.role !== role) {
    return <Navigate to={homeFor(user) || LOGIN[role]} replace />;
  }
  return <Outlet />;
}

/** Hides login/register screens from users who are already signed in. */
export function GuestOnly({ role, redirectTo }) {
  const { user } = useSession();
  if (user?.role === role) {
    return <Navigate to={redirectTo || HOME[role]} replace />;
  }
  return <Outlet />;
}
