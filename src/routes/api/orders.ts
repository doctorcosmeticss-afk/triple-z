import { json } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export const APIRoute = createAPIFileRoute('/api/orders')({
  POST: async ({ request }) => {
    try {
      await connectDB();
      const data = await request.json();

      const order = new Order(data);
      await order.save();

      // Send Telegram notification (fire-and-forget)
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        if (botToken && chatId) {
          const items = order.items.map((i: any) =>
            `• ${i.name} × ${i.qty} (${i.size} / ${i.color}) — ${i.price * i.qty} EGP`
          ).join('\n');
          const msg = `🛒 *طلب جديد #${order.orderNumber}*\n\n👤 ${order.fullName}\n📞 ${order.phone}\n📍 ${order.governorate}${order.city ? ', ' + order.city : ''}\n🏠 ${order.addressLine}\n\n📦 *المنتجات:*\n${items}\n\n💰 المجموع: ${order.total} EGP\n💳 الدفع: ${order.paymentMethod}`;
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
          });
        }
      } catch (e) {
        console.error('Telegram error:', e);
      }

      return json({ success: true, order }, { status: 201 });
    } catch (error: any) {
      console.error('Create order error:', error);
      if (error.name === 'ValidationError') {
        return json({ error: 'Validation failed', details: error.message }, { status: 400 });
      }
      return json({ error: 'Internal server error' }, { status: 500 });
    }
  },
});
