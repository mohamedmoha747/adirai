import { Order } from '../models/Order.js';
import { Delivery } from '../models/Delivery.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { ORDER_STATUS, DELIVERY_STATUS } from '../utils/constants.js';
import { changeOrderStatus, ensureDeliveryOwnsOrder } from '../services/order.js';
import { toPoint } from '../utils/geo.js';
import { emitDeliveryLocation, emitOrderUpdate } from '../services/socket.js';

const populate = [
  { path: 'shop', select: 'name address phone location' },
  { path: 'customer', select: 'name phone' },
];

export const assignedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryPartner: req.user._id,
    orderStatus: { $nin: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED] },
  })
    .populate(populate)
    .sort({ createdAt: -1 });
  return success(res, { orders });
});

export const history = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryPartner: req.user._id,
    orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED] },
  })
    .populate('customer', 'name phone')
    .populate('shop', 'name')
    .sort({ updatedAt: -1 });
  return success(res, { orders });
});

export const acceptAssignment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  await ensureDeliveryOwnsOrder(req.user, order);
  const delivery = await Delivery.findOne({ order: order._id, deliveryPartner: req.user._id });
  if (!delivery) throw new ApiError(404, 'Delivery assignment not found');
  delivery.status = DELIVERY_STATUS.ACCEPTED;
  delivery.acceptedAt = new Date();
  await delivery.save();
  emitOrderUpdate(order);
  return success(res, { order, delivery }, 200, 'Assignment accepted');
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  await ensureDeliveryOwnsOrder(req.user, order);
  const updated = await changeOrderStatus({
    order,
    nextStatus: req.body.status,
    actor: req.user,
    role: req.user.role,
    note: req.body.note || '',
  });
  return success(res, { order: updated });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const point = toPoint(req.body.lng, req.body.lat);
  if (!point) throw new ApiError(400, 'Valid lng and lat required');
  req.user.location = point;
  await req.user.save();

  const active = await Delivery.find({
    deliveryPartner: req.user._id,
    status: { $in: [DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.PICKED_UP, DELIVERY_STATUS.ON_THE_WAY] },
  }).populate('order');

  for (const delivery of active) {
    delivery.currentLocation = point;
    await delivery.save();
    if (delivery.order) emitDeliveryLocation(delivery.order, point);
  }

  return success(res, { location: point });
});
