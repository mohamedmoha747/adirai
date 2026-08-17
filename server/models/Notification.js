import mongoose from 'mongoose';
import { NOTIFICATION_CHANNEL } from '../utils/constants.js';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    type: { type: String, default: 'ORDER' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: Object.values(NOTIFICATION_CHANNEL), default: NOTIFICATION_CHANNEL.IN_APP },
    status: { type: String, enum: ['QUEUED', 'SENT', 'FAILED', 'READ'], default: 'QUEUED' },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
