// server-only — this file runs on the server only, never in the browser
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import jwt from "jsonwebtoken";
import connectDB from "./lib/mongodb";
import Admin from "./models/Admin";
import Product from "./models/Product";
import Order from "./models/Order";
import PromoCode from "./models/PromoCode";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// CORS headers
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Content-Type": "application/json",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

function verifyAdmin(req: Request): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  try {
    jwt.verify(auth.split(" ")[1], JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Newsletter model (not in models folder)
const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model(
    "Newsletter",
    new mongoose.Schema(
      { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
      { timestamps: true }
    )
  );

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  // Handle preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    await connectDB();

    // ─── AUTH ─────────────────────────────────────────────────────
    if (path === "/api/auth/login" && method === "POST") {
      const { email, password } = (await request.json()) as any;
      if (!email || !password) return json({ error: "Email and password required" }, 400);
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) return json({ error: "Invalid credentials" }, 401);
      const ok = await admin.comparePassword(password);
      if (!ok) return json({ error: "Invalid credentials" }, 401);
      const token = jwt.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
      return json({ success: true, token, admin: { id: admin._id, email: admin.email } });
    }

    // ─── ADMIN AUTH ─────────────────────────────────────────────────
    if (path === "/api/admin/login" && method === "POST") {
      const { email, password } = (await request.json()) as any;
      if (!email || !password) return json({ error: "Email and password required" }, 400);
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) return json({ error: "Invalid credentials" }, 401);
      const ok = await admin.comparePassword(password);
      if (!ok) return json({ error: "Invalid credentials" }, 401);
      const token = jwt.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
      return json({ success: true, token, admin: { id: admin._id, email: admin.email } });
    }

    // ─── PRODUCTS ─────────────────────────────────────────────────
    if (path === "/api/products") {
      if (method === "GET") {
        const filter: any = {};
        if (url.searchParams.get("category")) filter.category = url.searchParams.get("category");
        if (url.searchParams.get("slug")) filter.slug = url.searchParams.get("slug");
        const products = await Product.find(filter).sort({ createdAt: -1 });
        return json({ success: true, products });
      }
      if (method === "POST") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const data = (await request.json()) as any;
        const product = new Product(data);
        await product.save();
        return json({ success: true, product }, 201);
      }
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const data = (await request.json()) as any;
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, product });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const product = await Product.findByIdAndDelete(id);
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, message: "Product deleted" });
      }
    }

    // ─── ADMIN PRODUCTS ────────────────────────────────────────────
    if (path === "/api/admin/products") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const filter: any = {};
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");
        if (category && category !== "all") filter.category = category;
        if (search) filter.$text = { $search: search };
        const products = await Product.find(filter).sort({ createdAt: -1 });
        return json({ products });
      }
      if (method === "POST") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const data = (await request.json()) as any;
        const product = new Product(data);
        await product.save();
        return json({ success: true, product }, 201);
      }
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const { id, ...data } = (await request.json()) as any;
        if (!id) return json({ error: "Product ID is required" }, 400);
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, product });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "Product ID is required" }, 400);
        const product = await Product.findByIdAndDelete(id);
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, message: "Product deleted successfully" });
      }
    }

    // Product by ID (PUT/DELETE with id in path)
    const productMatch = path.match(/^\/api\/products\/([^/]+)$/);
    if (productMatch) {
      const id = productMatch[1];
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const data = (await request.json()) as any;
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, product });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const product = await Product.findByIdAndDelete(id);
        if (!product) return json({ error: "Product not found" }, 404);
        return json({ success: true, message: "Product deleted" });
      }
    }

    // ─── ORDERS ───────────────────────────────────────────────────
    if (path === "/api/orders") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const orders = await Order.find().sort({ createdAt: -1 });
        return json({ success: true, orders });
      }
      if (method === "POST") {
        try {
          const data = (await request.json()) as any;
          
          // Validate required fields
          if (!data.fullName || !data.email || !data.phone || !data.addressLine || !data.governorate) {
            return json({ error: "Missing required fields" }, 400);
          }
          
          // Remove paymentProof entirely to avoid 413 errors - will handle separately
          delete data.paymentProof;
          
          const order = new Order(data);
          await order.save();
          
          // Fire-and-forget Telegram notification
          sendTelegram(order).catch(console.error);
          
          return json({ success: true, order }, 201);
        } catch (err: any) {
          console.error("Order creation error:", err);
          if (err.message && err.message.includes("too large")) {
            return json({ error: "Request payload is too large" }, 413);
          }
          return json({ error: err.message || "Failed to create order" }, 500);
        }
      }
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const { status } = (await request.json()) as any;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, order });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const order = await Order.findByIdAndDelete(id);
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, message: "Order deleted" });
      }
    }

    // ─── ADMIN ORDERS ─────────────────────────────────────────────
    if (path === "/api/admin/orders") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const orders = await Order.find().sort({ createdAt: -1 });
        return json({ orders });
      }
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const { status } = (await request.json()) as any;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, order });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const order = await Order.findByIdAndDelete(id);
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, message: "Order deleted" });
      }
    }

    // Order by ID
    const orderMatch = path.match(/^\/api\/orders\/([^/]+)$/);
    if (orderMatch) {
      const id = orderMatch[1];
      if (method === "PUT") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const { status } = (await request.json()) as any;
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, order });
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const order = await Order.findByIdAndDelete(id);
        if (!order) return json({ error: "Order not found" }, 404);
        return json({ success: true, message: "Order deleted" });
      }
    }

    // ─── PROMO CODES ──────────────────────────────────────────────
    if (path === "/api/promo-codes") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
        return json({ success: true, promoCodes });
      }
      if (method === "POST") {
        const action = url.searchParams.get("action");
        const body = (await request.json()) as any;
        if (action === "validate" || action === "use") {
          const promo = await PromoCode.findOne({ code: body.code?.toUpperCase() });
          if (!promo) return json({ error: "Invalid promo code" }, 404);
          if (!promo.isValid()) return json({ error: "Promo code expired or maxed out" }, 400);
          if (action === "use") { promo.currentUses += 1; await promo.save(); }
          return json({ success: true, promoCode: { code: promo.code, percentOff: promo.percentOff } });
        }
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const { code, percentOff, maxUses, validDays } = body;
        if (!code || !percentOff || !maxUses || !validDays) return json({ error: "All fields required" }, 400);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + validDays);
        const promo = new PromoCode({ code: code.toUpperCase(), percentOff, maxUses, currentUses: 0, validDays, expiresAt, active: true });
        await promo.save();
        return json({ success: true, promoCode: promo }, 201);
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const promo = await PromoCode.findByIdAndDelete(id);
        if (!promo) return json({ error: "Promo code not found" }, 404);
        return json({ success: true, message: "Promo code deleted" });
      }
    }

    // ─── ADMIN PROMO CODES ─────────────────────────────────────────
    if (path === "/api/admin/promo-codes") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
        return json({ promoCodes });
      }
      if (method === "POST") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const { code, percentOff, maxUses, validDays } = (await request.json()) as any;
        if (!code || !percentOff || !maxUses || !validDays) return json({ error: "All fields required" }, 400);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + validDays);
        const promo = new PromoCode({ code: code.toUpperCase(), percentOff, maxUses, currentUses: 0, validDays, expiresAt, active: true });
        await promo.save();
        return json({ success: true, promoCode: promo }, 201);
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const promo = await PromoCode.findByIdAndDelete(id);
        if (!promo) return json({ error: "Promo code not found" }, 404);
        return json({ success: true, message: "Promo code deleted" });
      }
    }

    // Promo code by ID
    const promoMatch = path.match(/^\/api\/promo-codes\/([^/]+)$/);
    if (promoMatch) {
      const id = promoMatch[1];
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const promo = await PromoCode.findByIdAndDelete(id);
        if (!promo) return json({ error: "Promo code not found" }, 404);
        return json({ success: true, message: "Promo code deleted" });
      }
    }

    // ─── NEWSLETTER ───────────────────────────────────────────────
    if (path === "/api/newsletter") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const subscribers = await Newsletter.find().sort({ createdAt: -1 });
        return json({ success: true, subscribers, count: subscribers.length });
      }
      if (method === "POST") {
        const { email } = (await request.json()) as any;
        if (!email) return json({ error: "Email required" }, 400);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);
        const exists = await Newsletter.findOne({ email: email.toLowerCase().trim() });
        if (exists) return json({ error: "Email already subscribed" }, 400);
        await new Newsletter({ email: email.toLowerCase().trim() }).save();
        return json({ success: true, message: "Successfully subscribed" }, 201);
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const sub = await Newsletter.findByIdAndDelete(id);
        if (!sub) return json({ error: "Subscriber not found" }, 404);
        return json({ success: true, message: "Subscriber deleted" });
      }
    }

    // ─── ADMIN NEWSLETTER ──────────────────────────────────────────
    if (path === "/api/admin/newsletter") {
      if (method === "GET") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const subscribers = await Newsletter.find().sort({ createdAt: -1 });
        return json({ subscribers, count: subscribers.length });
      }
      if (method === "POST") {
        const { email } = (await request.json()) as any;
        if (!email) return json({ error: "Email required" }, 400);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Invalid email" }, 400);
        const exists = await Newsletter.findOne({ email: email.toLowerCase().trim() });
        if (exists) return json({ error: "Email already subscribed" }, 400);
        await new Newsletter({ email: email.toLowerCase().trim() }).save();
        return json({ success: true, message: "Successfully subscribed" }, 201);
      }
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const id = url.searchParams.get("id");
        if (!id) return json({ error: "ID required" }, 400);
        const sub = await Newsletter.findByIdAndDelete(id);
        if (!sub) return json({ error: "Subscriber not found" }, 404);
        return json({ success: true, message: "Subscriber deleted" });
      }
    }

    // Newsletter subscriber by ID
    const newsletterMatch = path.match(/^\/api\/newsletter\/([^/]+)$/);
    if (newsletterMatch) {
      const id = newsletterMatch[1];
      if (method === "DELETE") {
        if (!verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
        const sub = await Newsletter.findByIdAndDelete(id);
        if (!sub) return json({ error: "Subscriber not found" }, 404);
        return json({ success: true, message: "Subscriber deleted" });
      }
    }

    // No API route matched — let SSR handle it
    return null;
  } catch (err: any) {
    console.error("API error:", err);
    return json({ error: err.message || "Internal server error" }, 500);
  }
}

async function sendTelegram(order: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const paymentEmojis: Record<string, string> = {
    cash_on_delivery: '💰', vodafone_cash: '📱', instapay: '💳', insta_pay: '💳',
  };

  let msg = `🛍️ <b>NEW ORDER RECEIVED</b>\n\n`;
  msg += `📋 <b>Order:</b> #${order.orderNumber}\n`;
  msg += `📅 <b>Date:</b> ${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Africa/Cairo' })}\n\n`;
  msg += `👤 <b>CUSTOMER</b>\n`;
  msg += `📧 Name: ${order.fullName}\n`;
  msg += `📧 Email: ${order.email}\n`;
  msg += `📞 Phone: ${order.phone}\n`;

  if (order.notes && order.notes.includes('Alt phone:')) {
    const altPhone = order.notes.split('Alt phone: ')[1]?.split(' | ')[0];
    if (altPhone) msg += `📞 Phone 2: ${altPhone}\n`;
  }

  msg += `🏠 Address: ${order.governorate}${order.city ? ', ' + order.city : ''}\n`;
  msg += `📍 Details: ${order.addressLine}\n\n`;

  msg += `🛒 <b>PRODUCTS</b>\n`;
  order.items.forEach((item: any, i: number) => {
    msg += `${i + 1}. <b>${item.name}</b>\n`;
    msg += `   💰 ${item.price} EGP × ${item.qty} = ${item.price * item.qty} EGP\n`;
    msg += `   📏 Size: ${item.size} | 🎨 Color: ${item.color}\n`;
  });

  msg += `\n💳 <b>PAYMENT</b>\n`;
  msg += `${paymentEmojis[order.paymentMethod] || '💰'} Method: `;
  const pmMap: Record<string, string> = { cash_on_delivery: 'Cash on Delivery', vodafone_cash: 'Vodafone Cash', instapay: 'InstaPay', insta_pay: 'InstaPay' };
  msg += (pmMap[order.paymentMethod] || order.paymentMethod) + '\n';

  if (order.paymentMethod !== 'cash_on_delivery') {
    if (order.payerName) msg += `👤 Payer: ${order.payerName}\n`;
    if (order.payerAccount) msg += `📱 Account: ${order.payerAccount}\n`;
    if (order.transferAmount) msg += `💸 Transferred: ${order.transferAmount} EGP\n`;
  }

  msg += `\n💰 <b>SUMMARY</b>\n`;
  msg += `📦 Subtotal: ${order.subtotal} EGP\n`;
  msg += `🚚 Shipping: ${order.shippingCost} EGP\n`;
  if (order.discount > 0) msg += `🎟️ Discount: -${order.discount} EGP\n`;
  if (order.promoCode) msg += `🏷️ Promo: ${order.promoCode}\n`;
  msg += `💵 <b>TOTAL: ${order.total} EGP</b>\n`;

  if (order.notes) {
    const clean = order.notes.includes('Alt phone:')
      ? order.notes.split(' | ').filter((n: string) => !n.includes('Alt phone:')).join(' | ')
      : order.notes;
    if (clean.trim()) msg += `\n📝 Notes: ${clean}\n`;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'HTML' }),
    });
    
    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
  } catch (error) {
    console.error('Telegram notification failed:', error);
    // Don't throw - order should still succeed even if notification fails
  }
}
