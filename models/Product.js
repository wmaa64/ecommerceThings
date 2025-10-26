import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      en: {type: String, required: true},
      ar: {type: String, required: true}
  },
  description: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true }
  },
  brand: { type: String, required: true},
  countInStock: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true},
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true},
  featured: { type: Boolean, default: false },
  topselling: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
