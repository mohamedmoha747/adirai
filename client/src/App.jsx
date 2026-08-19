import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout.jsx';
import { DeliveryLayout, DeliveryAuthLayout } from './layouts/DeliveryLayout.jsx';
import { AdminLayout, AdminAuthLayout } from './layouts/AdminLayout.jsx';
import { RequireRole, GuestOnly } from './routes/SessionRoute.jsx';

import { CustomerLoginPage } from './pages/customer/auth/CustomerLoginPage.jsx';
import { CustomerRegisterPage } from './pages/customer/auth/CustomerRegisterPage.jsx';
import { SplashScreen } from './pages/customer/SplashScreen.jsx';
import { HomePage } from './pages/customer/HomePage.jsx';
import { CategoryPage } from './pages/customer/CategoryPage.jsx';
import { ProductsPage } from './pages/customer/ProductsPage.jsx';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.jsx';
import { CartPage } from './pages/customer/CartPage.jsx';
import { CheckoutPage } from './pages/customer/CheckoutPage.jsx';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage.jsx';
import { OrdersPage } from './pages/customer/OrdersPage.jsx';
import { TrackPage } from './pages/customer/TrackPage.jsx';
import { ProfilePage } from './pages/customer/ProfilePage.jsx';
import { AddressPage } from './pages/customer/AddressPage.jsx';
import {
  LandingPage,
  ForgotPasswordPage,
  VerifyOtpPage,
  SearchResultsPage,
  NotificationsPage,
  HelpSupportPage,
  PaymentMethodsPage,
  AboutPage,
  OrderDetailsPage,
} from './pages/customer/CustomerExtraPages.jsx';

import {
  DeliveryLoginPage,
  DeliveryRegisterPage,
  DeliveryDashboardPage,
  DeliveryListPage,
  DeliveryDetailPage,
  DeliveryHistoryPage,
  DeliveryEarningsPage,
  DeliveryProfilePage,
  DeliveryNotificationsPage,
  DeliverySupportPage,
} from './pages/delivery/DeliveryPortal.jsx';

import {
  AdminLoginPage,
  AdminDashboardPage,
  AdminCustomersPage,
  AdminDeliveryPartnersPage,
  AdminProductsPage,
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminPaymentsPage,
  AdminRevenuePage,
  AdminOffersPage,
  AdminDeliveryMgmtPage,
  AdminReportsPage,
  AdminNotificationsPage,
  AdminSettingsPage,
  AdminProfilePage,
} from './pages/admin/AdminPortal.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />

      {/* Customer website */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<CustomerLoginPage />} />
        <Route path="register" element={<CustomerRegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="track" element={<TrackPage />} />
        <Route path="track/:orderNumber" element={<TrackPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="addresses" element={<AddressPage />} />
        <Route path="payment-methods" element={<PaymentMethodsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="help" element={<HelpSupportPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* Delivery partner portal */}
      <Route path="/delivery">
        <Route element={<GuestOnly role="DELIVERY_PARTNER" redirectTo="/delivery/dashboard" />}>
          <Route element={<DeliveryAuthLayout />}>
            <Route path="login" element={<DeliveryLoginPage />} />
            <Route path="register" element={<DeliveryRegisterPage />} />
          </Route>
        </Route>
        <Route element={<RequireRole role="DELIVERY_PARTNER" />}>
          <Route element={<DeliveryLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DeliveryDashboardPage />} />
            <Route path="deliveries" element={<DeliveryListPage />} />
            <Route path="deliveries/:id" element={<DeliveryDetailPage />} />
            <Route path="history" element={<DeliveryHistoryPage />} />
            <Route path="earnings" element={<DeliveryEarningsPage />} />
            <Route path="profile" element={<DeliveryProfilePage />} />
            <Route path="notifications" element={<DeliveryNotificationsPage />} />
            <Route path="support" element={<DeliverySupportPage />} />
          </Route>
        </Route>
      </Route>

      {/* Admin console */}
      <Route path="/admin">
        <Route element={<GuestOnly role="ADMIN" redirectTo="/admin/dashboard" />}>
          <Route element={<AdminAuthLayout />}>
            <Route path="login" element={<AdminLoginPage />} />
          </Route>
        </Route>
        <Route element={<RequireRole role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="delivery-partners" element={<AdminDeliveryPartnersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="delivery" element={<AdminDeliveryMgmtPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}
