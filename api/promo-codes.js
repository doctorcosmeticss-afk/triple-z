const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const { PromoCode } = require('./models');

// Middleware to verify admin token
function verifyAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  await connectDB();

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  // Validate promo code (public)
  if (action === 'validate') {
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
        promoCode: { code: promoCode.code, percentOff: promoCode.percentOff },
      });
    } catch (error) {
      console.error('Validate promo code error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Use promo code (public)
  else if (action === 'use') {
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
  }

  // GET - Get all promo codes (admin only)
  else if (req.method === 'GET') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
      res.json({ success: true, promoCodes });
    } catch (error) {
      console.error('Get promo codes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Create promo code (admin only)
  else if (req.method === 'POST') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { code, percentOff, maxUses, validDays } = req.body;

      if (!code || !percentOff || !maxUses || !validDays) {
        return res.status(400).json({ error: 'All fields are required' });
      }

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
  }

  // DELETE - Delete promo code (admin only)
  else if (req.method === 'DELETE') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id } = req.query;
      const promoCode = await PromoCode.findByIdAndDelete(id);

      if (!promoCode) {
        return res.status(404).json({ error: 'Promo code not found' });
      }

      res.json({ success: true, message: 'Promo code deleted successfully' });
    } catch (error) {
      console.error('Delete promo code error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}