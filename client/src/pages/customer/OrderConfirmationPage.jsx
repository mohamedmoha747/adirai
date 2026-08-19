import { Link, useNavigate } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order || { id: orderId, total: 0 };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-xl border border-soft-200 bg-white p-8">
        <CheckCircle size={56} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-ink">Order Placed!</h1>
        <p className="mt-2 text-soft-600">Your order <strong>{order.id}</strong> has been confirmed.</p>
        <p className="mt-1 text-lg font-bold text-brand-700">₹{order.total}</p>
        <p className="mt-4 text-sm text-soft-500">A delivery partner will be assigned shortly.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/customer/track/${order.id}`)}>
            Track Order
          </button>
          <Link to="/customer/orders" className="btn btn-secondary">
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
