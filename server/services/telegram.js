const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.baseURL = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(message) {
    try {
      if (!this.botToken || !this.chatId) {
        console.log('Telegram bot not configured');
        return null;
      }

      const response = await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });

      console.log('✅ Telegram message sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error sending Telegram message:', error.message);
      return null;
    }
  }

  formatOrderMessage(order) {
    const statusEmojis = {
      pending: '⏳',
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };

    const paymentEmojis = {
      cash_on_delivery: '💰',
      vodafone_cash: '📱',
      instapay: '💳'
    };

    let message = `🛍️ <b>NEW ORDER RECEIVED</b>\n\n`;
    message += `📋 <b>Order:</b> #${order.orderNumber}\n`;
    message += `${statusEmojis[order.status] || '📦'} <b>Status:</b> ${order.status.toUpperCase()}\n`;
    message += `📅 <b>Date:</b> ${new Date(order.createdAt).toLocaleString('en-US', { 
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;

    // Customer Info
    message += `👤 <b>CUSTOMER INFO</b>\n`;
    message += `📧 <b>Name:</b> ${order.fullName}\n`;
    message += `📧 <b>Email:</b> ${order.email}\n`;
    message += `📞 <b>Phone:</b> ${order.phone}\n`;
    
    // Extract alt phone from notes if exists
    if (order.notes && order.notes.includes('Alt phone:')) {
      const altPhone = order.notes.split('Alt phone: ')[1]?.split(' | ')[0];
      if (altPhone) {
        message += `📞 <b>Phone 2:</b> ${altPhone}\n`;
      }
    }
    
    message += `🏠 <b>Address:</b> ${order.governorate}`;
    if (order.city) message += `, ${order.city}`;
    message += `\n📍 <b>Details:</b> ${order.addressLine}\n\n`;

    // Products
    message += `🛒 <b>PRODUCTS</b>\n`;
    order.items.forEach((item, index) => {
      message += `${index + 1}. <b>${item.name}</b>\n`;
      message += `   💰 ${item.price} EGP × ${item.qty} = ${(item.price * item.qty)} EGP\n`;
      message += `   📏 Size: ${item.size} | 🎨 Color: ${item.color}\n`;
    });

    // Payment Info
    message += `\n💳 <b>PAYMENT</b>\n`;
    message += `${paymentEmojis[order.paymentMethod] || '💰'} <b>Method:</b> `;
    
    switch(order.paymentMethod) {
      case 'cash_on_delivery':
        message += 'Cash on Delivery';
        break;
      case 'vodafone_cash':
        message += 'Vodafone Cash';
        break;
      case 'instapay':
        message += 'InstaPay';
        break;
      default:
        message += order.paymentMethod;
    }
    message += `\n`;

    if (order.paymentMethod !== 'cash_on_delivery') {
      if (order.payerName) {
        message += `👤 <b>Payer:</b> ${order.payerName}\n`;
      }
      if (order.payerAccount) {
        message += `📱 <b>Account:</b> ${order.payerAccount}\n`;
      }
      if (order.transferAmount) {
        message += `💸 <b>Transferred:</b> ${order.transferAmount} EGP\n`;
      }
    }

    // Order Summary
    message += `\n💰 <b>ORDER SUMMARY</b>\n`;
    message += `📦 <b>Subtotal:</b> ${order.subtotal} EGP\n`;
    message += `🚚 <b>Shipping:</b> ${order.shippingCost} EGP\n`;
    
    if (order.discount > 0) {
      message += `🎟️ <b>Discount:</b> -${order.discount} EGP\n`;
    }
    
    if (order.promoCode) {
      message += `🏷️ <b>Promo:</b> ${order.promoCode}\n`;
    }
    
    message += `💵 <b>TOTAL:</b> ${order.total} EGP\n`;

    // Notes
    if (order.notes) {
      const cleanNotes = order.notes.includes('Alt phone:') 
        ? order.notes.split(' | ').filter(note => !note.includes('Alt phone:')).join(' | ') 
        : order.notes;
      
      if (cleanNotes.trim()) {
        message += `\n📝 <b>NOTES:</b> ${cleanNotes}\n`;
      }
    }

    return message;
  }

  async sendOrderNotification(order) {
    const message = this.formatOrderMessage(order);
    return await this.sendMessage(message);
  }
}

module.exports = new TelegramService();