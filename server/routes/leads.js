const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   POST /api/leads
// @desc    Create lead
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email, smsConsent, promoCode } = req.body;

    if (!email || !promoCode) {
      return res.status(400).json({ error: 'Email and promo code are required' });
    }

    const lead = new Lead({
      email: email.toLowerCase().trim(),
      smsConsent: smsConsent || false,
      promoCode,
    });

    await lead.save();

    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
