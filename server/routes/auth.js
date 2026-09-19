const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/auth/create-triple-z-admin
// @desc    Create Triple-Z admin (temporary endpoint)
// @access  Public
router.post('/create-triple-z-admin', async (req, res) => {
  try {
    // Delete all existing admins first
    const deletedCount = await Admin.deleteMany({});
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} existing admin(s)`);

    // Create new Triple-Z admin
    const email = 'triple-z@gmail.com';
    const password = 'triple-z123';

    const admin = new Admin({
      email,
      password,
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Triple-Z admin created successfully!',
      admin: {
        email: admin.email,
        createdAt: admin.createdAt
      }
    });

    console.log('✅ Triple-Z Admin created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
