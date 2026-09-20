import { json } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export const APIRoute = createAPIFileRoute('/api/auth/login')({
  POST: async ({ request }) => {
    try {
      const { email, password } = await request.json();

      if (!email || !password) {
        return json({ error: 'Email and password are required' }, { status: 400 });
      }

      await connectDB();

      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        return json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValidPassword = await bcryptjs.compare(password, admin.password);
      if (!isValidPassword) {
        return json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign(
        { adminId: admin._id, email: admin.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return json({
        success: true,
        token,
        admin: { id: admin._id, email: admin.email },
      });
    } catch (error) {
      console.error('Login error:', error);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});
