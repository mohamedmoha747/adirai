import mongoose from 'mongoose';
import { ORDER_STATUS, ROLES } from '../utils/constants.js';

const orderStatusLogSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    previousStatus: { type: String, default: null },
    newStatus: { type: String, enum: Object.values(ORDER_STATUS), required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    changedByRole: { type: String, enum: [...Object.values(ROLES), 'SYSTEM'], required: true },
    note: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

orderStatusLogSchema.index({ order: 1, createdAt: 1 });

export const OrderStatusLog = mongoose.model('OrderStatusLog', orderStatusLogSchema);
