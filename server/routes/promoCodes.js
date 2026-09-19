const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/promo-codes
// @desc    Get all promo codes
// @access  Private (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });

    res.json({ success: true, promoCodes });
  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/promo-codes/validate
// @desc    Validate promo code
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    if (!promoCode.isValid()) {
      return res.status(400).json({ error: 'Promo code is expired or maxed out' });
    }

    res.json({
      success: true,
      promoCode: {
        code: promoCode.code,
        percentOff: promoCode.percentOff,
      },
    });
  } catch (error) {
    console.error('Validate promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/promo-codes
// @desc    Create promo code
// @access  Private (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, percentOff, maxUses, validDays } = req.body;

    if (!code || !percentOff || !maxUses || !validDays) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validDays);

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      percentOff,
      maxUses,
      currentUses: 0,
      validDays,
      expiresAt,
      active: true,
    });

    await promoCode.save();

    res.status(201).json({ success: true, promoCode });
  } catch (error) {
    console.error('Create promo code error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Promo code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/promo-codes/:id
// @desc    Delete promo code
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    res.json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/promo-codes/use
// @desc    Use promo code (increment usage count)
// @access  Public
router.post('/use', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoCode) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    if (!promoCode.isValid()) {
      return res.status(400).json({ error: 'Promo code is expired or maxed out' });
    }

    // Increment usage count
    promoCode.currentUses += 1;
    await promoCode.save();

    res.json({
      success: true,
      message: 'Promo code used successfully',
      promoCode: {
        code: promoCode.code,
        percentOff: promoCode.percentOff,
        currentUses: promoCode.currentUses,
        maxUses: promoCode.maxUses
      },
    });
  } catch (error) {
    console.error('Use promo code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
