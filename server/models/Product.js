import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, default: 'General', trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
    unit: { type: String, default: 'pc' },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ shop: 1, isAvailable: 1 });

export const Product = mongoose.model('Product', productSchema);
