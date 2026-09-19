const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const { Order } = require('./models');
const { sendOrderNotification } = require('./telegram');

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

export default async function handler(req, res) {
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

  // GET - Get all orders (admin only)
  if (req.method === 'GET') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST - Create new order (public)
  else if (req.method === 'POST') {
    try {
      // Generate order number if not provided
      if (!req.body.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        req.body.orderNumber = `TZ-${year}${month}${day}-${random}`;
      }
      
      const order = new Order(req.body);
      await order.save();

      // Send Telegram notification
      try {
        await sendOrderNotification(order);
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError.message);
      }

      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error('Create order error:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));
        return res.status(400).json({ error: 'Validation failed', details: validationErrors });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT - Update order status (admin only)
  else if (req.method === 'PUT') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id } = req.query;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE - Delete order (admin only)
  else if (req.method === 'DELETE') {
    const admin = verifyAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id } = req.query;
      const order = await Order.findByIdAndDelete(id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}