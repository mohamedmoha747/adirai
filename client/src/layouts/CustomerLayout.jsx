import { Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DesktopHeader } from '../components/UiLibrary.jsx';

export function CustomerLayout() {
  const location = useLocation();
  const isMobileOnly = ['/', '/login', '/register', '/splash-screen'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* Desktop Header - hidden on mobile */}
      <DesktopHeader />
      
      {/* Main Content */}
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}
