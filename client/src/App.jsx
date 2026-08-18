import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { HomePage } from './pages/customer/HomePage.jsx';
import { CategoryPage } from './pages/customer/CategoryPage.jsx';
import { ProductsPage } from './pages/customer/ProductsPage.jsx';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.jsx';
import { CartPage } from './pages/customer/CartPage.jsx';
import { CheckoutPage } from './pages/customer/CheckoutPage.jsx';
import { OrdersPage } from './pages/customer/OrdersPage.jsx';
import { TrackPage } from './pages/customer/TrackPage.jsx';
import { ProfilePage } from './pages/customer/ProfilePage.jsx';
import { AddressPage } from './pages/customer/AddressPage.jsx';
import { SplashScreen } from './pages/customer/SplashScreen.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage mode="register" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/track/:orderNumber" element={<TrackPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addresses" element={<AddressPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
