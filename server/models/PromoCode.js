const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  percentOff: {
    type: Number,
    required: true,
    min: 5,
    max: 70,
  },
  maxUses: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  currentUses: {
    type: Number,
    default: 0,
    min: 0,
  },
  validDays: {
    type: Number,
    required: true,
    min: 1,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if promo code is still valid
PromoCodeSchema.methods.isValid = function () {
  return (
    this.active &&
    this.currentUses < this.maxUses &&
    new Date() < this.expiresAt
  );
};

// Increment usage
PromoCodeSchema.methods.incrementUsage = async function () {
  this.currentUses += 1;
  await this.save();
};

// Indexes
PromoCodeSchema.index({ code: 1, active: 1 });
PromoCodeSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
