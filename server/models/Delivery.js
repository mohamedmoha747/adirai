import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../utils/constants.js';
import { geoPointSchema } from '../utils/geo.js';

const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickupLocation: geoPointSchema,
    deliveryLocation: geoPointSchema,
    currentLocation: geoPointSchema,
    status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.ASSIGNED },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
    pickedUpAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

deliverySchema.index({ deliveryPartner: 1, status: 1 });
deliverySchema.index({ currentLocation: '2dsphere' });

export const Delivery = mongoose.model('Delivery', deliverySchema);
