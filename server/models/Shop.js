import mongoose from 'mongoose';
import { geoPointSchema } from '../utils/geo.js';

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    address: { type: String, required: true },
    location: geoPointSchema,
    phone: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: 'General' },
    isActive: { type: Boolean, default: true },
    openingHours: { type: String, default: '9:00 AM – 10:00 PM' },
  },
  { timestamps: true },
);

shopSchema.index({ location: '2dsphere' });
shopSchema.index({ name: 'text', description: 'text' });

export const Shop = mongoose.model('Shop', shopSchema);
