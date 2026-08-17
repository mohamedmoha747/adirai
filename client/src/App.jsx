import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { SellerLayout } from './layouts/SellerLayout.jsx';
import { DeliveryLayout } from './layouts/DeliveryLayout.jsx';
import { GuestOnly, ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { HomePage } from './pages/customer/HomePage.jsx';
import { ShopsPage } from './pages/customer/ShopsPage.jsx';
import { ShopDetailPage } from './pages/customer/ShopDetailPage.jsx';
import { ProductsPage } from './pages/customer/ProductsPage.jsx';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.jsx';
import { CartPage } from './pages/customer/CartPage.jsx';
import { CheckoutPage } from './pages/customer/CheckoutPage.jsx';
import { OrderConfirmationPage, PaymentPage } from './pages/customer/PaymentPage.jsx';
import { OrdersPage } from './pages/customer/OrdersPage.jsx';
import { TrackPage } from './pages/customer/TrackPage.jsx';
import { ProfilePage } from './pages/customer/ProfilePage.jsx';
import { AdminDashboard, AdminOrderDetail, AdminOrders } from './pages/admin/AdminPages.jsx';
import {
  AdminCustomerDetailPage,
  AdminCustomersPage,
  AdminDeliveryPage,
  AdminReportsPage,
} from './pages/admin/AdminMore.jsx';
import {
  SellerDashboard,
  SellerOrdersPage,
  SellerProductForm,
  SellerProductsPage,
  SellerSalesPage,
  SellerShopPage,
} from './pages/seller/SellerPages.jsx';
import { DeliveryHistoryPage, DeliveryHomePage, DeliveryOrderPage } from './pages/delivery/DeliveryPages.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/shops/:id" element={<ShopDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/track/:orderNumber" element={<TrackPage />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage mode="register" />} />
        </Route>
        <Route element={<ProtectedRoute roles={['CUSTOMER']} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pay/:id" element={<PaymentPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/delivery" element={<AdminDeliveryPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/customers/:id" element={<AdminCustomerDetailPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['SELLER']} />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/shop" element={<SellerShopPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<SellerProductForm />} />
          <Route path="/seller/products/:id" element={<SellerProductForm />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/sales" element={<SellerSalesPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['DELIVERY_PARTNER']} />}>
        <Route element={<DeliveryLayout />}>
          <Route path="/delivery" element={<DeliveryHomePage />} />
          <Route path="/delivery/history" element={<DeliveryHistoryPage />} />
          <Route path="/delivery/orders/:id" element={<DeliveryOrderPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
