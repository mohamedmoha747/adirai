import { Shop } from '../models/Shop.js';
import { Product } from '../models/Product.js';
import { asyncHandler, success } from '../utils/api.js';
import { ApiError } from '../utils/api.js';

export const listShops = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const shops = await Shop.find(filter).populate('owner', 'name').sort({ name: 1 });
  return success(res, { shops });
});

export const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id).populate('owner', 'name');
  if (!shop || !shop.isActive) throw new ApiError(404, 'Shop not found');
  const products = await Product.find({ shop: shop._id, isAvailable: true }).sort({ name: 1 });
  return success(res, { shop, products });
});
