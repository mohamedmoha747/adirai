import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Shop } from '../models/Shop.js';
import { Delivery } from '../models/Delivery.js';
import { Payment } from '../models/Payment.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { ROLES, ORDER_STATUS, PAYMENT_STATUS, DELIVERY_STATUS } from '../utils/constants.js';
import { toPoint } from '../utils/geo.js';
import { changeOrderStatus } from '../services/order.js';
import { emitOrderUpdate } from '../services/socket.js';
import { NotificationService } from '../services/notification.js';
import { NOTIFICATION_CHANNEL } from '../utils/constants.js';

function rangeFilter(query) {
  const { range = 'month', from, to } = query;
  const now = new Date();
  let start;
  let end = now;
  if (range === 'today') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === 'week') {
    start = new Date(now);
    start.setDate(now.getDate() - 7);
  } else if (range === 'custom' && from) {
    start = new Date(from);
    end = to ? new Date(to) : now;
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return { createdAt: { $gte: start, $lte: end } };
}

const orderPopulate = [
  { path: 'customer', select: 'name email phone' },
  { path: 'shop', select: 'name address phone location' },
  { path: 'deliveryPartner', select: 'name phone isAvailable' },
];

export const dashboard = asyncHandler(async (_req, res) => {
  const [total, pending, active, completed, cancelled, salesAgg, deliveryCount, recent] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED] } }),
    Order.countDocuments({
      orderStatus: {
        $in: [
          ORDER_STATUS.ACCEPTED,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY_FOR_PICKUP,
          ORDER_STATUS.PICKED_UP,
          ORDER_STATUS.ON_THE_WAY,
        ],
      },
    }),
    Order.countDocuments({ orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED] } }),
    Order.countDocuments({ orderStatus: ORDER_STATUS.CANCELLED }),
    Order.aggregate([
      { $match: { paymentStatus: { $in: [PAYMENT_STATUS.PAID, PAYMENT_STATUS.COD] }, orderStatus: { $ne: ORDER_STATUS.CANCELLED } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ deliveryPartner: { $ne: null } }),
    Order.find().populate(orderPopulate).sort({ createdAt: -1 }).limit(8),
  ]);

  const trend = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return success(res, {
    stats: {
      totalOrders: total,
      newOrders: pending,
      activeOrders: active,
      completedOrders: completed,
      cancelledOrders: cancelled,
      totalSales: salesAgg[0]?.total || 0,
      deliveryOrders: deliveryCount,
    },
    trend,
    recentOrders: recent,
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, q, tab } = req.query;
  const filter = {};
  if (tab === 'new') filter.orderStatus = { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED] };
  if (tab === 'active') {
    filter.orderStatus = {
      $in: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.PICKED_UP, ORDER_STATUS.ON_THE_WAY],
    };
  }
  if (tab === 'completed') filter.orderStatus = { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED] };
  if (tab === 'cancelled') filter.orderStatus = ORDER_STATUS.CANCELLED;
  if (status) filter.orderStatus = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (q) filter.orderNumber = { $regex: q, $options: 'i' };

  const orders = await Order.find(filter).populate(orderPopulate).sort({ createdAt: -1 });
  return success(res, { orders });
});

export const listCustomers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = { role: ROLES.CUSTOMER };
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
    ];
  }
  const customers = await User.find(filter).select('-password -cart').sort({ createdAt: -1 });
  return success(res, { customers });
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: ROLES.CUSTOMER }).select('-password -cart');
  if (!customer) throw new ApiError(404, 'Customer not found');
  const orders = await Order.find({ customer: customer._id }).populate('shop', 'name').sort({ createdAt: -1 });
  return success(res, { customer, orders });
});

export const listDeliveryPartners = asyncHandler(async (_req, res) => {
  const partners = await User.find({ role: ROLES.DELIVERY_PARTNER }).select('-password -cart');
  const activeIds = await Order.distinct('deliveryPartner', {
    orderStatus: {
      $in: [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.PICKED_UP, ORDER_STATUS.ON_THE_WAY],
    },
  });
  const history = await Delivery.find().populate('order', 'orderNumber orderStatus totalAmount').sort({ updatedAt: -1 }).limit(40);
  return success(res, {
    partners: partners.map((p) => ({
      ...p.toPublicJSON(),
      isBusy: activeIds.some((id) => String(id) === String(p._id)),
    })),
    history,
  });
});

export const assignDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('shop');
  if (!order) throw new ApiError(404, 'Order not found');
  const partner = await User.findOne({ _id: req.body.deliveryPartnerId, role: ROLES.DELIVERY_PARTNER, isActive: true });
  if (!partner) throw new ApiError(404, 'Delivery partner not found');
  if (![ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP].includes(order.orderStatus)) {
    throw new ApiError(400, 'Order is not ready to assign a delivery partner');
  }

  order.deliveryPartner = partner._id;
  await order.save();

  const pickup = order.shop?.location || toPoint(80.2707, 13.0827);
  await Delivery.findOneAndUpdate(
    { order: order._id },
    {
      order: order._id,
      deliveryPartner: partner._id,
      pickupLocation: pickup,
      deliveryLocation: order.deliveryLocation,
      currentLocation: pickup,
      status: DELIVERY_STATUS.ASSIGNED,
      assignedAt: new Date(),
    },
    { upsert: true, returnDocument: 'after' },
  );

  emitOrderUpdate(order);
  await NotificationService.notify({
    user: partner._id,
    order: order._id,
    title: 'New delivery assigned',
    message: `Pickup ${order.orderNumber} from ${order.shop?.name || 'shop'}`,
    channels: [NOTIFICATION_CHANNEL.IN_APP, NOTIFICATION_CHANNEL.SMS],
    phone: partner.phone,
  });
  return success(res, { order }, 200, 'Delivery partner assigned');
});

export const reports = asyncHandler(async (req, res) => {
  const dateFilter = rangeFilter(req.query);
  const orders = await Order.find(dateFilter);
  const completed = orders.filter((o) => [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED].includes(o.orderStatus));
  const cancelled = orders.filter((o) => o.orderStatus === ORDER_STATUS.CANCELLED);
  const sales = completed.reduce((s, o) => s + o.totalAmount, 0);

  const payments = await Payment.aggregate([
    { $match: { createdAt: dateFilter.createdAt } },
    { $group: { _id: '$method', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
  ]);
  const paymentStatus = await Payment.aggregate([
    { $match: { createdAt: dateFilter.createdAt } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const deliveries = await Delivery.find({ assignedAt: dateFilter.createdAt });
  const delivered = deliveries.filter((d) => d.status === DELIVERY_STATUS.DELIVERED);
  const avgMinutes =
    delivered.length === 0
      ? 0
      : delivered.reduce((s, d) => {
          if (!d.deliveredAt || !d.assignedAt) return s;
          return s + (d.deliveredAt - d.assignedAt) / 60000;
        }, 0) / delivered.length;

  return success(res, {
    summary: {
      orders: orders.length,
      completed: completed.length,
      cancelled: cancelled.length,
      sales,
      deliveryAssigned: deliveries.length,
      deliveryCompleted: delivered.length,
      avgDeliveryMinutes: Math.round(avgMinutes),
    },
    payments,
    paymentStatus,
  });
});

export const toggleShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) throw new ApiError(404, 'Shop not found');
  shop.isActive = req.body.isActive ?? !shop.isActive;
  await shop.save();
  return success(res, { shop });
});
