import { json } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

export const APIRoute = createAPIFileRoute('/api/promo-codes')({
  POST: async ({ request }) => {
    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action');
      const { code } = await request.json();

      if (!code) return json({ error: 'Code is required' }, { status: 400 });

      await connectDB();
      const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

      if (!promoCode) return json({ error: 'Invalid promo code' }, { status: 404 });
      if (!promoCode.isValid()) return json({ error: 'Promo code is expired or maxed out' }, { status: 400 });

      if (action === 'use') {
        promoCode.currentUses += 1;
        await promoCode.save();
        return json({
          success: true,
          message: 'Promo code used successfully',
          promoCode: { code: promoCode.code, percentOff: promoCode.percentOff },
        });
      }

      // Default: validate
      return json({
        success: true,
        promoCode: { code: promoCode.code, percentOff: promoCode.percentOff },
      });
    } catch (error) {
      console.error('Promo code error:', error);
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});
