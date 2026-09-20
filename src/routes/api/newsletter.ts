import { json } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Newsletter model
const NewsletterSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true }
);
const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

export const APIRoute = createAPIFileRoute('/api/newsletter')({
  POST: async ({ request }) => {
    try {
      const { email } = await request.json();
      if (!email) return json({ error: 'Email is required' }, { status: 400 });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return json({ error: 'Please enter a valid email address' }, { status: 400 });
      }

      await connectDB();

      const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return json({ error: 'This email is already subscribed' }, { status: 400 });
      }

      await new Newsletter({ email: email.toLowerCase().trim() }).save();
      return json({ success: true, message: 'Successfully subscribed to newsletter' }, { status: 201 });
    } catch (error) {
      console.error('Newsletter error:', error);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});
