const mongoose = require('mongoose');

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Product Schema
const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, default: 'Triple-Z' },
  category: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  old_price: { type: Number, default: null, min: 0 },
  sizes: [{ type: String, required: true }],
  colors: [{ name: { type: String, required: true }, hex: { type: String, required: true } }],
  images: [{ type: String, required: true }],
  is_new: { type: Boolean, default: false },
  is_best_seller: { type: Boolean, default: false },
  sold_out: { type: Boolean, default: false },
  stock: { type: Number, default: 100, min: 0 },
  rating: { type: Number, default: 5, min: 0, max: 5 },
}, { timestamps: true });

// Order Schema
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  governorate: { type: String, required: true },
  city: String,
  addressLine: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: String,
  }],
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true, enum: ['cash_on_delivery', 'vodafone_cash', 'instapay'] },
  payerAccount: String,
  payerName: String,
  transferAmount: Number,
  paymentProofPath: String,
  promoCode: String,
  status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  notes: String,
}, { timestamps: true });

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `TZ-${year}${month}${day}-${random}`;
  }
  next();
});

// PromoCode Schema
const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  percentOff: { type: Number, required: true, min: 5, max: 70 },
  maxUses: { type: Number, required: true, min: 1, default: 1 },
  currentUses: { type: Number, default: 0, min: 0 },
  validDays: { type: Number, required: true, min: 1 },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

PromoCodeSchema.methods.isValid = function () {
  return this.active && this.currentUses < this.maxUses && new Date() < this.expiresAt;
};

// Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

// Export models
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema);
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

module.exports = { Admin, Product, Order, PromoCode, Newsletter };