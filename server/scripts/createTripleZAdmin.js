const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Admin model (inline definition)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createTripleZAdmin() {
  try {
    // Connect to MongoDB with timeout
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('📦 Connected to MongoDB');

    // Delete all existing admins first
    const deletedCount = await Admin.deleteMany({});
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing admin(s)`);

    // Create new Triple-Z admin
    const email = 'triple-z@gmail.com';
    const password = 'triple-z123';
    
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    await admin.save();

    console.log('✅ Triple-Z Admin created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('\n🚀 You can now login to the admin panel at /admin/login');
    console.log('🌟 Welcome to Triple-Z Admin Panel!\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    
    if (error.code === 11000) {
      console.log('⚠️  Admin with this email already exists');
    }
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  }
}

createTripleZAdmin();