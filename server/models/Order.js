const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
    },
    governorate: {
      type: String,
      required: true,
    },
    city: String,
    addressLine: {
      type: String,
      required: true,
    },
    items: {
      type: [
        {
          productId: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          size: { type: String, required: true },
          color: { type: String, required: true },
          qty: { type: Number, required: true, min: 1 },
          image: String,
        },
      ],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash_on_delivery', 'vodafone_cash', 'instapay'],
    },
    payerAccount: String,
    payerName: String,
    transferAmount: Number,
    paymentProofPath: String,
    promoCode: String,
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      index: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    this.orderNumber = `TZ-${year}${month}${day}-${random}`;
  }
  next();
});

// Indexes
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ email: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);
