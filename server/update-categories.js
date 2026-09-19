import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from server/.env
dotenv.config();

console.log('MongoDB URL:', process.env.MONGO_URL ? 'Found' : 'Not found');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Define Product Schema
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
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  images: [{ type: String, required: true }],
  is_new: { type: Boolean, default: false },
  is_best_seller: { type: Boolean, default: false },
  sold_out: { type: Boolean, default: false },
  stock: { type: Number, default: 100, min: 0 },
  rating: { type: Number, default: 5, min: 0, max: 5 },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

const updateCategories = async () => {
  try {
    await connectDB();
    
    console.log('🔄 Starting category updates...');
    
    // Update T-SHIRT to FULL SUITE
    const tshirtUpdate = await Product.updateMany(
      { category: { $in: ['T-SHIRT', 'T-Shirts', 'tshirt', 't-shirt'] } },
      { $set: { category: 'FULL SUITE' } }
    );
    console.log(`✅ Updated ${tshirtUpdate.modifiedCount} T-SHIRT products to FULL SUITE`);
    
    // Update ZIPERS to CREW-NECK
    const zipersUpdate = await Product.updateMany(
      { category: { $in: ['ZIPERS', 'ZIPPERS', 'zipers', 'zippers'] } },
      { $set: { category: 'CREW-NECK' } }
    );
    console.log(`✅ Updated ${zipersUpdate.modifiedCount} ZIPERS products to CREW-NECK`);
    
    // Update PANTS (make sure it's uppercase)
    const pantsUpdate = await Product.updateMany(
      { category: { $in: ['pants', 'Pants'] } },
      { $set: { category: 'PANTS' } }
    );
    console.log(`✅ Updated ${pantsUpdate.modifiedCount} pants products to PANTS`);
    
    // Update HOODIES (make sure it's uppercase)
    const hoodiesUpdate = await Product.updateMany(
      { category: { $in: ['hoodies', 'Hoodies'] } },
      { $set: { category: 'HOODIES' } }
    );
    console.log(`✅ Updated ${hoodiesUpdate.modifiedCount} hoodies products to HOODIES`);
    
    console.log('🎉 All category updates completed!');
    
    // Show current categories
    const categories = await Product.distinct('category');
    console.log('📋 Current categories in database:', categories);
    
  } catch (error) {
    console.error('❌ Error updating categories:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

updateCategories();