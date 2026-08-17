import { Shop } from '../models/Shop.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { toPoint } from '../utils/geo.js';
import { ORDER_STATUS } from '../utils/constants.js';
import { changeOrderStatus, ensureSellerOwnsOrder } from '../services/order.js';

async function getShopOrThrow(user) {
  const shop = await Shop.findOne({ owner: user._id });
  if (!shop) throw new ApiError(404, 'Shop profile not found. Create one first.');
  return shop;
}

export const getMyShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  return success(res, { shop });
});

export const upsertShop = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    description: req.body.description || '',
    address: req.body.address,
    phone: req.body.phone,
    image: req.body.image || '',
    category: req.body.category || 'General',
    openingHours: req.body.openingHours || '9:00 AM – 10:00 PM',
    location: toPoint(req.body.lng, req.body.lat) || undefined,
  };

  let shop = await Shop.findOne({ owner: req.user._id });
  if (shop) {
    Object.assign(shop, payload);
    await shop.save();
  } else {
    shop = await Shop.create({ ...payload, owner: req.user._id });
  }
  return success(res, { shop }, 200, 'Shop saved');
});

export const sellerProducts = asyncHandler(async (req, res) => {
  const shop = await getShopOrThrow(req.user);
  const products = await Product.find({ shop: shop._id }).sort({ createdAt: -1 });
  return success(res, { products, shop });
});

export const sellerOrders = asyncHandler(async (req, res) => {
  const shop = await getShopOrThrow(req.user);
  const { tab } = req.query;
  const filter = { shop: shop._id };
  if (tab === 'incoming') filter.orderStatus = { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED] };
  if (tab === 'active') {
    filter.orderStatus = { $in: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP] };
  }
  if (tab === 'completed') filter.orderStatus = { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED, ORDER_STATUS.PICKED_UP, ORDER_STATUS.ON_THE_WAY] };
  const orders = await Order.find(filter)
    .populate('customer', 'name phone')
    .populate('deliveryPartner', 'name phone')
    .sort({ createdAt: -1 });
  return success(res, { orders });
});

export const sellerUpdateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');
  await ensureSellerOwnsOrder(req.user, order);
  const updated = await changeOrderStatus({
    order,
    nextStatus: req.body.status,
    actor: req.user,
    role: req.user.role,
    note: req.body.note || '',
  });
  return success(res, { order: updated });
});

export const sellerSales = asyncHandler(async (req, res) => {
  const shop = await getShopOrThrow(req.user);
  const orders = await Order.find({ shop: shop._id, orderStatus: { $ne: ORDER_STATUS.CANCELLED } });
  const completed = orders.filter((o) => [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED].includes(o.orderStatus));
  const totalSales = completed.reduce((s, o) => s + o.totalAmount, 0);
  const incoming = await Order.countDocuments({
    shop: shop._id,
    orderStatus: { $in: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED] },
  });
  return success(res, {
    stats: {
      totalOrders: orders.length,
      completed: completed.length,
      incoming,
      totalSales,
      products: await Product.countDocuments({ shop: shop._id }),
    },
    recent: await Order.find({ shop: shop._id }).sort({ createdAt: -1 }).limit(8).populate('customer', 'name'),
  });
});
