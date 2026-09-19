import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  percentOff: number;
  maxUses: number;
  currentUses: number;
  validDays: number;
  expiresAt: Date;
  active: boolean;
  createdAt: Date;
}

const PromoCodeSchema: Schema = new Schema({
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
PromoCodeSchema.methods.isValid = function (): boolean {
  return (
    this.active &&
    this.currentUses < this.maxUses &&
    new Date() < this.expiresAt
  );
};

// Increment usage
PromoCodeSchema.methods.incrementUsage = async function (): Promise<void> {
  this.currentUses += 1;
  await this.save();
};

// Index for queries
PromoCodeSchema.index({ code: 1, active: 1 });
PromoCodeSchema.index({ expiresAt: 1 });

export default mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
