const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const { Newsletter } = require('./models');

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

  // GET - Get all subscribers (admin only)
  if (req.method === 'GET') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const subscribers = await Newsletter.find().sort({ createdAt: -1 });
      res.json({ success: true, subscribers, count: subscribers.length });
    } catch (error) {
      console.error('Get newsletter subscribers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Subscribe to newsletter (public)
  else if (req.method === 'POST') {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

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
  }

  // DELETE - Delete subscriber (admin only)
  else if (req.method === 'DELETE') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id } = req.query;
      const subscriber = await Newsletter.findByIdAndDelete(id);

      if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
      }

      res.json({ success: true, message: 'Subscriber deleted successfully' });
    } catch (error) {
      console.error('Delete subscriber error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}