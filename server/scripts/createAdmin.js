const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');
const dns = require('dns');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

// Use Google DNS for MongoDB connections
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt function
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function
async function createAdmin() {
  try {
    console.log('\n🔧 Admin Account Creation Script\n');
    console.log('Connecting to MongoDB...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // Get email
    const email = await prompt('Enter admin email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('❌ Admin with this email already exists');
      process.exit(1);
    }

    // Get password
    const password = await prompt('Enter admin password (min 6 characters): ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await prompt('Confirm password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    // Create admin
    console.log('\n👤 Creating admin account...');
    const admin = new Admin({
      email,
      password,
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('\n🚀 You can now login at: http://localhost:3000/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();
