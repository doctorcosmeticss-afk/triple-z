import { json } from '@tanstack/react-start/server';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

// GET - Get all promo codes
export async function GET() {
  try {
    await connectDB();

    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });

    return json({ promoCodes });
  } catch (error) {
    console.error('Get promo codes error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create promo code
export async function POST({ request }: { request: Request }) {
  try {
    const { code, percentOff, maxUses, validDays } = await request.json();

    if (!code || !percentOff || !maxUses || !validDays) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

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

    return json({ success: true, promoCode });
  } catch (error: any) {
    console.error('Create promo code error:', error);
    if (error.code === 11000) {
      return json({ error: 'Promo code already exists' }, { status: 400 });
    }
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete promo code
export async function DELETE({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return json({ error: 'Promo code ID is required' }, { status: 400 });
    }

    await connectDB();

    const promoCode = await PromoCode.findByIdAndDelete(id);

    if (!promoCode) {
      return json({ error: 'Promo code not found' }, { status: 404 });
    }

    return json({ success: true, message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Delete promo code error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
