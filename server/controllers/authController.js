import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Shop } from '../models/Shop.js';
import { env } from '../config/env.js';
import { ApiError, asyncHandler, success } from '../utils/api.js';
import { ROLES } from '../utils/constants.js';
import { toPoint } from '../utils/geo.js';

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = ROLES.CUSTOMER, address } = req.body;

  const allowedRoles = [ROLES.CUSTOMER, ROLES.SELLER, ROLES.DELIVERY_PARTNER];
  const safeRole = allowedRoles.includes(role) ? role : ROLES.CUSTOMER;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(409, 'Email is already registered');

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: safeRole,
    address: address || '',
  });

  const token = signToken(user);
  return success(res, { user: user.toPublicJSON(), token }, 201, 'Registered');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'Account is disabled');

  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(user);
  const payload = { user: user.toPublicJSON(), token };

  if (user.role === ROLES.SELLER) {
    payload.shop = await Shop.findOne({ owner: user._id });
  }

  return success(res, payload, 200, 'Logged in');
});

export const me = asyncHandler(async (req, res) => {
  const data = { user: req.user.toPublicJSON() };
  if (req.user.role === ROLES.SELLER) {
    data.shop = await Shop.findOne({ owner: req.user._id });
  }
  return success(res, data);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, lng, lat, isAvailable } = req.body;
  if (name) req.user.name = name;
  if (phone) req.user.phone = phone;
  if (address !== undefined) req.user.address = address;
  const point = toPoint(lng, lat);
  if (point) req.user.location = point;
  if (req.user.role === ROLES.DELIVERY_PARTNER && typeof isAvailable === 'boolean') {
    req.user.isAvailable = isAvailable;
  }
  await req.user.save();
  return success(res, { user: req.user.toPublicJSON() }, 200, 'Profile updated');
});
