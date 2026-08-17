import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { Shop } from './models/Shop.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { OrderStatusLog } from './models/OrderStatusLog.js';
import { Payment } from './models/Payment.js';
import { Delivery } from './models/Delivery.js';
import { Notification } from './models/Notification.js';
import { generateOrderNumber, generateTransactionId } from './utils/ids.js';
import { DELIVERY_STATUS, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, ROLES } from './utils/constants.js';

const chennai = (lngOffset = 0, latOffset = 0) => ({
  type: 'Point',
  coordinates: [80.2707 + lngOffset, 13.0827 + latOffset],
});

async function seed() {
  await connectDb(env.mongoUri);
  await Promise.all([
    User.deleteMany({}),
    Shop.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    OrderStatusLog.deleteMany({}),
    Payment.deleteMany({}),
    Delivery.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Adirai Admin',
    email: 'admin@adirai.com',
    phone: '9000000001',
    password: 'Admin@123',
    role: ROLES.ADMIN,
    address: 'Adirai HQ, Anna Nagar, Chennai',
  });

  const seller = await User.create({
    name: 'Meena Iyer',
    email: 'seller@adirai.com',
    phone: '9000000002',
    password: 'Seller@123',
    role: ROLES.SELLER,
    address: 'T. Nagar, Chennai',
  });

  const seller2 = await User.create({
    name: 'Karthik Stores',
    email: 'seller2@adirai.com',
    phone: '9000000003',
    password: 'Seller@123',
    role: ROLES.SELLER,
    address: 'Adyar, Chennai',
  });

  const rider = await User.create({
    name: 'Arun Kumar',
    email: 'delivery@adirai.com',
    phone: '9000000004',
    password: 'Delivery@123',
    role: ROLES.DELIVERY_PARTNER,
    address: 'Velachery',
    isAvailable: true,
    location: chennai(0.01, -0.02),
  });

  const rider2 = await User.create({
    name: 'Divya R',
    email: 'delivery2@adirai.com',
    phone: '9000000005',
    password: 'Delivery@123',
    role: ROLES.DELIVERY_PARTNER,
    isAvailable: true,
    location: chennai(-0.02, 0.01),
  });

  const customer = await User.create({
    name: 'Harun',
    email: 'customer@adirai.com',
    phone: '9000000006',
    password: 'Customer@123',
    role: ROLES.CUSTOMER,
    address: '12 Lake View Road, Chennai',
    location: chennai(0.03, 0.01),
  });

  await User.create({
    name: 'Priya S',
    email: 'priya@adirai.com',
    phone: '9000000007',
    password: 'Customer@123',
    role: ROLES.CUSTOMER,
    address: 'Besant Nagar, Chennai',
  });

  const kitchen = await Shop.create({
    name: 'Adirai Kitchen',
    owner: seller._id,
    description: 'Home-style South Indian meals, fresh every hour.',
    address: '42 Ranganathan Street, T. Nagar, Chennai',
    phone: '9000000002',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
    location: chennai(0.005, 0.004),
    openingHours: '8:00 AM – 11:00 PM',
  });

  const mart = await Shop.create({
    name: 'Nila Mart',
    owner: seller2._id,
    description: 'Groceries, snacks and daily essentials with same-day delivery.',
    address: '8 LB Road, Adyar, Chennai',
    phone: '9000000003',
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    location: chennai(-0.01, -0.008),
    openingHours: '7:00 AM – 10:00 PM',
  });

  const kitchenProducts = await Product.insertMany([
    { shop: kitchen._id, name: 'Mini Tiffin Combo', description: 'Idli, vada, mini dosa and sambar.', price: 149, category: 'Meals', stock: 40, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80', unit: 'plate' },
    { shop: kitchen._id, name: 'Chicken Biryani', description: 'Seeraga samba biryani with raita.', price: 249, category: 'Meals', stock: 25, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', unit: 'box' },
    { shop: kitchen._id, name: 'Filter Coffee', description: 'Hot decoction coffee in a davara set.', price: 49, category: 'Beverages', stock: 80, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80', unit: 'cup' },
    { shop: kitchen._id, name: 'Curd Rice', description: 'Tempered curd rice with pickle.', price: 99, category: 'Meals', stock: 30, image: 'https://images.unsplash.com/photo-1604908177522-c50d2cf2b41b?w=800&q=80', unit: 'box' },
  ]);

  const martProducts = await Product.insertMany([
    { shop: mart._id, name: 'Farm Tomatoes 1kg', description: 'Ripe local tomatoes.', price: 42, category: 'Produce', stock: 120, image: 'https://images.unsplash.com/photo-1546470427-227e0ab0a1e3?w=800&q=80', unit: 'kg' },
    { shop: mart._id, name: 'Aavin Milk 500ml', description: 'Toned milk pouch.', price: 28, category: 'Dairy', stock: 200, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80', unit: 'pack' },
    { shop: mart._id, name: 'Brown Bread', description: 'Whole wheat sandwich loaf.', price: 45, category: 'Bakery', stock: 40, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', unit: 'loaf' },
    { shop: mart._id, name: 'Basmati Rice 5kg', description: 'Aged basmati, extra long grain.', price: 620, category: 'Staples', stock: 18, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', unit: 'bag' },
  ]);

  const confirmedItems = [
    { product: kitchenProducts[1]._id, name: kitchenProducts[1].name, price: 249, quantity: 2, image: kitchenProducts[1].image },
    { product: kitchenProducts[2]._id, name: kitchenProducts[2].name, price: 49, quantity: 2, image: kitchenProducts[2].image },
  ];
  const confirmedTotal = 249 * 2 + 49 * 2;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: customer._id,
    shop: kitchen._id,
    items: confirmedItems,
    totalAmount: confirmedTotal,
    customerName: customer.name,
    customerPhone: customer.phone,
    deliveryAddress: customer.address,
    deliveryLocation: customer.location,
    paymentMethod: PAYMENT_METHOD.UPI,
    paymentStatus: PAYMENT_STATUS.PAID,
    orderStatus: ORDER_STATUS.CONFIRMED,
  });

  await OrderStatusLog.create([
    { order: order._id, previousStatus: null, newStatus: ORDER_STATUS.PENDING, changedBy: customer._id, changedByRole: ROLES.CUSTOMER, note: 'Order placed' },
    { order: order._id, previousStatus: ORDER_STATUS.PENDING, newStatus: ORDER_STATUS.CONFIRMED, changedBy: admin._id, changedByRole: 'SYSTEM', note: 'Payment verified' },
  ]);

  await Payment.create({
    order: order._id,
    amount: confirmedTotal,
    method: PAYMENT_METHOD.UPI,
    transactionId: generateTransactionId('UPI'),
    status: PAYMENT_STATUS.PAID,
    paidAt: new Date(),
  });

  const readyOrder = await Order.create({
    orderNumber: generateOrderNumber(),
    customer: customer._id,
    shop: mart._id,
    items: [{ product: martProducts[0]._id, name: martProducts[0].name, price: 42, quantity: 3, image: martProducts[0].image }],
    totalAmount: 126,
    customerName: customer.name,
    customerPhone: customer.phone,
    deliveryAddress: customer.address,
    deliveryLocation: customer.location,
    paymentMethod: PAYMENT_METHOD.COD,
    paymentStatus: PAYMENT_STATUS.COD,
    orderStatus: ORDER_STATUS.READY_FOR_PICKUP,
    deliveryPartner: rider._id,
  });

  await Delivery.create({
    order: readyOrder._id,
    deliveryPartner: rider._id,
    pickupLocation: mart.location,
    deliveryLocation: customer.location,
    currentLocation: mart.location,
    status: DELIVERY_STATUS.ASSIGNED,
  });

  await Payment.create({
    order: readyOrder._id,
    amount: 126,
    method: PAYMENT_METHOD.COD,
    transactionId: generateTransactionId('COD'),
    status: PAYMENT_STATUS.COD,
  });

  console.log('Seed complete.');
  console.log('Admin     admin@adirai.com / Admin@123');
  console.log('Seller    seller@adirai.com / Seller@123');
  console.log('Delivery  delivery@adirai.com / Delivery@123');
  console.log('Customer  customer@adirai.com / Customer@123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
