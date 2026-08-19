import { Outlet, useLocation } from 'react-router-dom';
import { CustomerHeader, CustomerFooter, MobileBottomNav, CartToast } from '../components/customer/CustomerChrome.jsx';

const AUTH_PATHS = ['/customer/login', '/customer/register', '/customer/forgot-password', '/customer/verify-otp'];

export function CustomerLayout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isLanding = pathname === '/customer' || pathname === '/customer/';

  if (isAuth || isLanding) {
    return (
      <>
        <Outlet />
        <CartToast />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fc]">
      <CustomerHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <div className="hidden md:block">
        <CustomerFooter />
      </div>
      <MobileBottomNav />
      <CartToast />
    </div>
  );
}
