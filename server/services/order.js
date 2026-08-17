import { Order } from '../models/Order.js';
import { OrderStatusLog } from '../models/OrderStatusLog.js';
import { Delivery } from '../models/Delivery.js';
import { Shop } from '../models/Shop.js';
import { assertTransition, ORDER_TO_DELIVERY } from './orderStatus.js';
import { NotificationService } from './notification.js';
import { emitOrderUpdate } from './socket.js';
import { NOTIFICATION_CHANNEL, ORDER_STATUS, ROLES } from '../utils/constants.js';
import { ApiError } from '../utils/api.js';

export async function changeOrderStatus({
  order,
  nextStatus,
  actor,
  role,
  note = '',
}) {
  assertTransition(order.orderStatus, nextStatus, role);

  const previous = order.orderStatus;
  order.orderStatus = nextStatus;
  if (nextStatus === ORDER_STATUS.CANCELLED && note) {
    order.cancelledReason = note;
  }
  await order.save();

  await OrderStatusLog.create({
    order: order._id,
    previousStatus: previous,
    newStatus: nextStatus,
    changedBy: actor?._id || null,
    changedByRole: role,
    note,
  });

  const mappedDelivery = ORDER_TO_DELIVERY[nextStatus];
  if (mappedDelivery) {
    const delivery = await Delivery.findOne({ order: order._id });
    if (delivery) {
      delivery.status = mappedDelivery;
      if (nextStatus === ORDER_STATUS.PICKED_UP) delivery.pickedUpAt = new Date();
      if (nextStatus === ORDER_STATUS.DELIVERED) delivery.deliveredAt = new Date();
      await delivery.save();
    }
  }

  const populated = await Order.findById(order._id)
    .populate('customer', 'name email phone')
    .populate('shop', 'name address phone owner')
    .populate('deliveryPartner', 'name phone');

  emitOrderUpdate({
    ...populated.toObject(),
    customer: populated.customer?._id || populated.customer,
    deliveryPartner: populated.deliveryPartner?._id || populated.deliveryPartner,
  });

  const channels = [NOTIFICATION_CHANNEL.IN_APP, NOTIFICATION_CHANNEL.EMAIL, NOTIFICATION_CHANNEL.SMS];
  const title = `Order ${populated.orderNumber}`;
  const message = `Status updated from ${previous} to ${nextStatus}`;

  if (populated.customer) {
    await NotificationService.notify({
      user: populated.customer._id,
      order: populated._id,
      title,
      message,
      channels,
      email: populated.customer.email,
      phone: populated.customer.phone,
    });
  }

  if (populated.shop?.owner) {
    await NotificationService.notify({
      user: populated.shop.owner,
      order: populated._id,
      title,
      message,
      channels: [NOTIFICATION_CHANNEL.IN_APP],
    });
  }

  if (populated.deliveryPartner) {
    await NotificationService.notify({
      user: populated.deliveryPartner._id,
      order: populated._id,
      title,
      message,
      channels: [NOTIFICATION_CHANNEL.IN_APP],
    });
  }

  return populated;
}

export async function ensureSellerOwnsOrder(user, order) {
  if (user.role === ROLES.ADMIN) return;
  const shop = await Shop.findOne({ _id: order.shop, owner: user._id });
  if (!shop) throw new ApiError(403, 'This order does not belong to your shop');
}

export async function ensureDeliveryOwnsOrder(user, order) {
  if (user.role === ROLES.ADMIN) return;
  if (String(order.deliveryPartner) !== String(user._id)) {
    throw new ApiError(403, 'This order is not assigned to you');
  }
}
