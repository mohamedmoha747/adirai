import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { OrderStatusLog } from '../models/OrderStatusLog.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { PaymentService } from '../services/payment.js';
import { PAYMENT_STATUS, ORDER_STATUS } from '../utils/constants.js';
import { emitOrderUpdate } from '../services/socket.js';
import { NotificationService } from '../services/notification.js';
import { NOTIFICATION_CHANNEL } from '../utils/constants.js';

export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (String(order.customer) !== String(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not allowed');
  }

  const initiated = await PaymentService.initiate(method || order.paymentMethod, {
    amount: order.totalAmount,
    orderNumber: order.orderNumber,
    orderId: order._id,
  });

  const payment = await Payment.create({
    order: order._id,
    amount: order.totalAmount,
    method: method || order.paymentMethod,
    transactionId: initiated.transactionId,
    status: initiated.status,
    meta: initiated.meta || {},
  });

  order.paymentStatus = initiated.status;
  await order.save();
  return success(res, { payment: { ...payment.toObject(), meta: initiated.meta } }, 201);
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId }).sort({ createdAt: -1 });
  if (!payment) throw new ApiError(404, 'Payment not found');
  return success(res, { payment });
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, 'Payment not found');

  const order = await Order.findById(payment.order).populate('customer', 'name email phone').populate('shop', 'owner name');
  if (!order) throw new ApiError(404, 'Order not found');
  if (String(order.customer._id) !== String(req.user._id) && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Not allowed');
  }
  if (![PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PROCESSING, PAYMENT_STATUS.FAILED].includes(payment.status)) {
    return success(res, { payment, order }, 200, 'Payment already processed');
  }

  const result = await PaymentService.verify(payment.method, {
    transactionId: payment.transactionId,
    success: req.body.success !== false,
    cardLast4: req.body.cardLast4,
  });

  payment.status = result.status;
  payment.paidAt = result.paidAt;
  await payment.save();

  order.paymentStatus = result.status;
  if (result.status === PAYMENT_STATUS.PAID && order.orderStatus === ORDER_STATUS.PENDING) {
    const previous = order.orderStatus;
    order.orderStatus = ORDER_STATUS.CONFIRMED;
    await OrderStatusLog.create({
      order: order._id,
      previousStatus: previous,
      newStatus: ORDER_STATUS.CONFIRMED,
      changedBy: req.user._id,
      changedByRole: 'SYSTEM',
      note: 'Payment verified',
    });
  }
  if (result.status === PAYMENT_STATUS.FAILED) {
    order.paymentStatus = PAYMENT_STATUS.FAILED;
  }
  await order.save();
  emitOrderUpdate(order);

  await NotificationService.notify({
    user: order.customer._id,
    order: order._id,
    title: result.status === PAYMENT_STATUS.PAID ? 'Payment successful' : 'Payment failed',
    message:
      result.status === PAYMENT_STATUS.PAID
        ? `Order ${order.orderNumber} is confirmed.`
        : `Payment for ${order.orderNumber} failed. Try again or choose COD.`,
    channels: [NOTIFICATION_CHANNEL.IN_APP, NOTIFICATION_CHANNEL.EMAIL],
    email: order.customer.email,
    phone: order.customer.phone,
  });

  return success(res, { payment, order }, 200, 'Payment processed');
});
