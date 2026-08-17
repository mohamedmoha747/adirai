import { Product } from '../models/Product.js';
import { Shop } from '../models/Shop.js';
import { User } from '../models/User.js';
import { asyncHandler, success, ApiError } from '../utils/api.js';
import { ROLES } from '../utils/constants.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { search, category, shop, minPrice, maxPrice, available } = req.query;
  const filter = {};
  if (shop) filter.shop = shop;
  if (category) filter.category = category;
  if (available !== 'false') filter.isAvailable = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const queryFilter = search
    ? {
        ...filter,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      }
    : filter;

  const products = (
    await Product.find(queryFilter).populate('shop', 'name isActive').sort({ createdAt: -1 })
  ).filter((p) => p.shop && p.shop.isActive);
  const categories = await Product.distinct('category');
  return success(res, { products, categories });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('shop');
  if (!product) throw new ApiError(404, 'Product not found');
  return success(res, { product });
});

async function sellerShop(user) {
  const shop = await Shop.findOne({ owner: user._id });
  if (!shop) throw new ApiError(400, 'Create your shop profile before managing products');
  return shop;
}

export const createProduct = asyncHandler(async (req, res) => {
  const shop = await sellerShop(req.user);
  const product = await Product.create({
    shop: shop._id,
    name: req.body.name,
    description: req.body.description || '',
    price: req.body.price,
    image: req.body.image || '',
    category: req.body.category || 'General',
    stock: req.body.stock ?? 0,
    isAvailable: req.body.isAvailable !== false,
    unit: req.body.unit || 'pc',
  });
  return success(res, { product }, 201, 'Product created');
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  if (req.user.role !== ROLES.ADMIN) {
    const shop = await sellerShop(req.user);
    if (String(product.shop) !== String(shop._id)) throw new ApiError(403, 'Not your product');
  }

  const fields = ['name', 'description', 'price', 'image', 'category', 'stock', 'isAvailable', 'unit'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  await product.save();
  return success(res, { product }, 200, 'Product updated');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  if (req.user.role !== ROLES.ADMIN) {
    const shop = await sellerShop(req.user);
    if (String(product.shop) !== String(shop._id)) throw new ApiError(403, 'Not your product');
  }
  await product.deleteOne();
  return success(res, {}, 200, 'Product deleted');
});

export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    populate: { path: 'shop', select: 'name isActive' },
  });
  return success(res, { cart: user.cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId).populate('shop');
  if (!product || !product.isAvailable || product.stock < quantity) {
    throw new ApiError(400, 'Product is unavailable or out of stock');
  }

  const user = await User.findById(req.user._id).populate('cart.product');
  const existingOtherShop = user.cart.find(
    (item) => item.product && String(item.product.shop) !== String(product.shop._id),
  );
  if (existingOtherShop) {
    throw new ApiError(409, 'Cart already has items from another shop. Clear the cart first.');
  }

  const existing = user.cart.find((item) => String(item.product?._id) === String(product._id));
  if (existing) {
    existing.quantity += Number(quantity);
    if (existing.quantity > product.stock) throw new ApiError(400, 'Not enough stock');
  } else {
    user.cart.push({ product: product._id, quantity: Number(quantity) });
  }
  await user.save();
  await user.populate({ path: 'cart.product', populate: { path: 'shop', select: 'name' } });
  return success(res, { cart: user.cart }, 200, 'Added to cart');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  const item = user.cart.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');
  const qty = Number(req.body.quantity);
  if (qty <= 0) {
    item.deleteOne();
  } else {
    if (item.product && qty > item.product.stock) throw new ApiError(400, 'Not enough stock');
    item.quantity = qty;
  }
  await user.save();
  await user.populate({ path: 'cart.product', populate: { path: 'shop', select: 'name' } });
  return success(res, { cart: user.cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');
  item.deleteOne();
  await user.save();
  await user.populate({ path: 'cart.product', populate: { path: 'shop', select: 'name' } });
  return success(res, { cart: user.cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  req.user.cart = [];
  await req.user.save();
  return success(res, { cart: [] }, 200, 'Cart cleared');
});
