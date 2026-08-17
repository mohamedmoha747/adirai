import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next();
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      socket.userId = payload.sub;
      socket.role = payload.role;
    } catch {
      // allow anonymous tracking sockets
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      if (socket.role) socket.join(`role:${socket.role}`);
    }

    socket.on('join:order', (orderId) => {
      if (orderId) socket.join(`order:${orderId}`);
    });

    socket.on('leave:order', (orderId) => {
      if (orderId) socket.leave(`order:${orderId}`);
    });

    socket.on('join:track', (orderNumber) => {
      if (orderNumber) socket.join(`track:${String(orderNumber).toUpperCase()}`);
    });
  });

  return io;
}

export function getIo() {
  return io;
}

export function emitToUser(userId, event, payload) {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToRole(role, event, payload) {
  io?.to(`role:${role}`).emit(event, payload);
}

export function emitOrderUpdate(order) {
  const payload = {
    id: order._id,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    deliveryPartner: order.deliveryPartner,
    updatedAt: order.updatedAt,
  };
  io?.to(`order:${order._id}`).emit('order:updated', payload);
  if (order.orderNumber) io?.to(`track:${order.orderNumber}`).emit('order:updated', payload);
  io?.to('role:ADMIN').emit('order:updated', payload);
  io?.to('role:SELLER').emit('order:updated', payload);
  const customerId = order.customer?._id || order.customer;
  const partnerId = order.deliveryPartner?._id || order.deliveryPartner;
  const ownerId = order.shop?.owner?._id || order.shop?.owner;
  if (customerId) io?.to(`user:${customerId}`).emit('order:updated', payload);
  if (partnerId) io?.to(`user:${partnerId}`).emit('order:updated', payload);
  if (ownerId) io?.to(`user:${ownerId}`).emit('order:updated', payload);
}

export function emitDeliveryLocation(order, location) {
  const payload = { orderId: order._id, orderNumber: order.orderNumber, location };
  io?.to(`order:${order._id}`).emit('delivery:location', payload);
  io?.to(`track:${order.orderNumber}`).emit('delivery:location', payload);
}
