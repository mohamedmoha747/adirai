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

export function RequireRole({ role }) {
  const { user } = useSession();
  const location = useLocation();

  if (!user || user.role !== role) {
    return <Navigate to={LOGIN[role]} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function GuestOnly({ role, redirectTo }) {
  const { user } = useSession();
  if (user?.role === role) {
    return <Navigate to={redirectTo || HOME[role]} replace />;
  }
  return <Outlet />;
}
