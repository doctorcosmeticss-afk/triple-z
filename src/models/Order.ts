import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  city?: string;
  addressLine: string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'vodafone_cash' | 'insta_pay';
  payerAccount?: string;
  payerName?: string;
  transferAmount?: number;
  paymentProofPath?: string;
  promoCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness on non-null values
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
      validate: {
        validator: function (v: IOrderItem[]) {
          return v.length > 0;
        },
        message: 'Order must have at least one item',
      },
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
      enum: ['cash_on_delivery', 'vodafone_cash', 'insta_pay'],
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
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  next();
});

// Index for queries
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ email: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
