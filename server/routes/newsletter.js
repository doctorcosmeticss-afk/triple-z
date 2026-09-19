const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/newsletter
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers, count: subscribers.length });
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'This email is already subscribed to our newsletter' });
    }

    const subscriber = new Newsletter({
      email: email.toLowerCase().trim(),
    });

    await subscriber.save();

    console.log(`✅ New newsletter subscriber: ${subscriber.email}`);
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/newsletter/:id
// @desc    Delete newsletter subscriber (Admin only)
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({ success: true, message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
