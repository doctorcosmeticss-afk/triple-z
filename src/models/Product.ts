import mongoose, { Schema, Document } from 'mongoose';

export interface IColor {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand: string;
  images: string[];
  sizes: string[];
  colors: IColor[];
  stock: number;
  soldOut: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      default: 'North',
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length > 0 && v.length <= 10;
        },
        message: 'Product must have between 1 and 10 images',
      },
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [
        {
          name: { type: String, required: true },
          hex: { type: String, required: true },
        },
      ],
      required: true,
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    soldOut: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNew: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filter
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ isNew: 1, createdAt: -1 });
ProductSchema.index({ isBestSeller: 1, createdAt: -1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
