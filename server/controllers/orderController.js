import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { OrderStatusLog } from '../models/OrderStatusLog.js';
import { Payment } from '../models/Payment.js';
import { Delivery } from '../models/Delivery.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { generateOrderNumber } from '../utils/ids.js';
import { toPoint } from '../utils/geo.js';
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, ROLES } from '../utils/constants.js';
import { PaymentService } from '../services/payment.js';
import { changeOrderStatus, ensureSellerOwnsOrder, ensureDeliveryOwnsOrder } from '../services/order.js';
import { NotificationService } from '../services/notification.js';
import { emitOrderUpdate } from '../services/socket.js';
import { NOTIFICATION_CHANNEL } from '../utils/constants.js';

const orderPopulate = [
  { path: 'customer', select: 'name email phone' },
  { path: 'shop', select: 'name address phone location image owner' },
  { path: 'deliveryPartner', select: 'name phone isAvailable location' },
];

export const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    populate: { path: 'shop' },
  });

  if (!user.cart.length) throw new ApiError(400, 'Cart is empty');

  const { customerName, customerPhone, deliveryAddress, lng, lat, paymentMethod, notes } = req.body;

  const items = [];
  let total = 0;
  let shopId = null;

  for (const cartItem of user.cart) {
    const product = cartItem.product;
    if (!product || !product.isAvailable) throw new ApiError(400, 'A product in your cart is unavailable');
    if (product.stock < cartItem.quantity) throw new ApiError(400, `Not enough stock for ${product.name}`);
    if (!shopId) shopId = product.shop._id || product.shop;
    if (String(product.shop._id || product.shop) !== String(shopId)) {
      throw new ApiError(400, 'Cart items must belong to a single shop');
    }
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
      image: product.image,
    });
    total += product.price * cartItem.quantity;
    product.stock -= cartItem.quantity;
    if (product.stock === 0) product.isAvailable = false;
    await product.save();
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: user._id,
    shop: shopId,
    items,
    totalAmount: total,
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryLocation: toPoint(lng, lat) || undefined,
    paymentMethod,
    paymentStatus: PAYMENT_STATUS.PENDING,
    orderStatus: ORDER_STATUS.PENDING,
    notes: notes || '',
  });

  await OrderStatusLog.create({
    order: order._id,
    previousStatus: null,
    newStatus: ORDER_STATUS.PENDING,
    changedBy: user._id,
    changedByRole: ROLES.CUSTOMER,
    note: 'Order placed',
  });

  const initiated = await PaymentService.initiate(paymentMethod, {
    amount: total,
    orderNumber: order.orderNumber,
    orderId: order._id,
  });

  const payment = await Payment.create({
    order: order._id,
    amount: total,
    method: paymentMethod,
    transactionId: initiated.transactionId,
    status: initiated.status,
    meta: initiated.meta || {},
    paidAt: initiated.paidAt || null,
  });

  if (paymentMethod === PAYMENT_METHOD.COD) {
    order.paymentStatus = PAYMENT_STATUS.COD;
    order.orderStatus = ORDER_STATUS.CONFIRMED;
    await order.save();
    await OrderStatusLog.create({
      order: order._id,
      previousStatus: ORDER_STATUS.PENDING,
      newStatus: ORDER_STATUS.CONFIRMED,
      changedBy: user._id,
      changedByRole: 'SYSTEM',
      note: 'COD order confirmed',
    });
  } else {
    order.paymentStatus = PAYMENT_STATUS.PROCESSING;
    await order.save();
  }

  user.cart = [];
  await user.save();

  const populated = await Order.findById(order._id).populate(orderPopulate);
  emitOrderUpdate(populated);

  await NotificationService.notify({
    user: user._id,
    order: order._id,
    title: `Order ${order.orderNumber} placed`,
    message: paymentMethod === PAYMENT_METHOD.COD
      ? 'Your cash-on-delivery order is confirmed and waiting for the shop.'
      : 'Complete payment to confirm your order.',
    channels: [NOTIFICATION_CHANNEL.IN_APP, NOTIFICATION_CHANNEL.EMAIL],
    email: user.email,
    phone: user.phone,
  });

  if (populated.shop?.owner) {
    await NotificationService.notify({
      user: populated.shop.owner,
      order: order._id,
      title: 'New order received',
      message: `${order.orderNumber} • ₹${total}`,
      channels: [NOTIFICATION_CHANNEL.IN_APP],
    });
  }

  return success(
    res,
    { order: populated, payment: { ...payment.toObject(), meta: initiated.meta } },
    201,
    'Order created',
  );
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate(orderPopulate)
    .sort({ createdAt: -1 });
  return success(res, { orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(orderPopulate);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = String(order.customer._id) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;
  const isSeller = req.user.role === ROLES.SELLER && String(order.shop.owner) === String(req.user._id);
  const isRider = req.user.role === ROLES.DELIVERY_PARTNER && String(order.deliveryPartner?._id || '') === String(req.user._id);
  if (!isOwner && !isAdmin && !isSeller && !isRider) throw new ApiError(403, 'Not allowed');

  const logs = await OrderStatusLog.find({ order: order._id }).sort({ createdAt: 1 });
  const payment = await Payment.findOne({ order: order._id });
  const delivery = await Delivery.findOne({ order: order._id }).populate('deliveryPartner', 'name phone location');
  return success(res, { order, logs, payment, delivery });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() }).populate(orderPopulate);
  if (!order) throw new ApiError(404, 'Order not found');
  const logs = await OrderStatusLog.find({ order: order._id }).sort({ createdAt: 1 });
  const delivery = await Delivery.findOne({ order: order._id }).select(
    'status currentLocation pickupLocation deliveryLocation pickedUpAt deliveredAt deliveryPartner',
  );
  return success(res, {
    order: {
      orderNumber: order.orderNumber,
      shop: { name: order.shop?.name, address: order.shop?.address, location: order.shop?.location },
      items: order.items,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
      createdAt: order.createdAt,
      deliveryPartner: order.deliveryPartner
        ? { name: order.deliveryPartner.name, phone: order.deliveryPartner.phone }
        : null,
      deliveryAddress: order.deliveryAddress,
    },
    logs: logs.map((l) => ({
      previousStatus: l.previousStatus,
      newStatus: l.newStatus,
      createdAt: l.createdAt,
      note: l.note,
    })),
    delivery: delivery
      ? {
          status: delivery.status,
          currentLocation: delivery.currentLocation,
          pickupLocation: delivery.pickupLocation,
          deliveryLocation: delivery.deliveryLocation,
        }
      : null,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  if (req.user.role === ROLES.SELLER) await ensureSellerOwnsOrder(req.user, order);
  if (req.user.role === ROLES.DELIVERY_PARTNER) await ensureDeliveryOwnsOrder(req.user, order);
  if (req.user.role === ROLES.CUSTOMER && String(order.customer) !== String(req.user._id)) {
    throw new ApiError(403, 'Not your order');
  }

  const updated = await changeOrderStatus({
    order,
    nextStatus: req.body.status,
    actor: req.user,
    role: req.user.role,
    note: req.body.note || '',
  });
  return success(res, { order: updated }, 200, 'Status updated');
});
