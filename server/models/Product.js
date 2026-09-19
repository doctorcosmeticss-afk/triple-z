const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
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
        validator: function (v) {
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
    isNewArrival: {
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

// Indexes for search and filter
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ isNewArrival: 1, createdAt: -1 });
ProductSchema.index({ isBestSeller: 1, createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
