import mongoose from 'mongoose';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../utils/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: Object.values(PAYMENT_METHOD), required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    providerRef: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

paymentSchema.index({ order: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
