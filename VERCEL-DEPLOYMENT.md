# Vercel Deployment Guide 🚀

## 📁 API Structure (9 Files Total)

```
/api/
├── db.js               # MongoDB connection with caching
├── models.js           # All Mongoose models (Admin, Product, Order, PromoCode, Newsletter)
├── telegram.js         # Telegram notification service
├── auth.js            # Admin authentication endpoint
├── products.js        # Products CRUD operations
├── orders.js          # Orders management + Telegram notifications
├── promo-codes.js     # Promo codes management
├── newsletter.js      # Newsletter subscription management
└── package.json       # API dependencies
```

## 🔧 Environment Variables Setup

In Vercel dashboard, add these environment variables:

```bash
MONGO_URL=mongodb+srv://abrahemelgazaly2_db_user:VbMp7GpMkLoXDLcJ@cluster0.pqoakfu.mongodb.net/?appName=Cluster0
JWT_SECRET=morth-super-secret-key-2024-change-in-production
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products?id={productId}` - Update product (admin)
- `DELETE /api/products?id={productId}` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order (public) + Telegram notification
- `PUT /api/orders?id={orderId}` - Update order status (admin)
- `DELETE /api/orders?id={orderId}` - Delete order (admin)

### Promo Codes
- `GET /api/promo-codes` - Get all promo codes (admin)
- `POST /api/promo-codes` - Create promo code (admin)
- `POST /api/promo-codes?action=validate` - Validate promo code (public)
- `POST /api/promo-codes?action=use` - Use promo code (public)
- `DELETE /api/promo-codes?id={promoId}` - Delete promo code (admin)

### Newsletter
- `GET /api/newsletter` - Get all subscribers (admin)
- `POST /api/newsletter` - Subscribe to newsletter (public)
- `DELETE /api/newsletter?id={subscriberId}` - Delete subscriber (admin)

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Project Root
```bash
cd "c:\Users\super magic\Desktop\morth"
vercel --prod
```

### 4. Set Environment Variables
In Vercel dashboard:
1. Go to your project
2. Click "Settings" > "Environment Variables"
3. Add all the environment variables listed above

### 5. Update Frontend Environment Variable
Create or update your `.env` file with:
```bash
# For production deployment
VITE_API_URL=https://your-project.vercel.app/api

# The frontend will automatically use localhost:5000 for development if not set
```

### 6. Test All Endpoints
Test your deployed API endpoints to ensure everything works correctly.

## ✨ Features Included

- ✅ **MongoDB Connection Caching** - Optimized for serverless
- ✅ **CORS Headers** - Configured for all origins
- ✅ **JWT Authentication** - Secure admin access
- ✅ **Telegram Notifications** - Automatic order alerts
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Validation** - Input validation for all endpoints
- ✅ **Mongoose Models** - All schemas included
- ✅ **Environment Variables** - Frontend uses VITE_API_URL automatically

## 🔒 Security Features

- **Environment Variables** - Sensitive data not in code
- **JWT Token Verification** - Protected admin endpoints
- **Input Validation** - Prevents malicious data
- **CORS Configuration** - Controlled access
- **Password Hashing** - bcryptjs for admin passwords

## 📊 Performance Optimizations

- **Connection Caching** - Reuse MongoDB connections
- **Serverless Optimized** - Fast cold start times
- **Minimal Dependencies** - Only essential packages
- **Error Boundaries** - Graceful error handling

## 🎯 Next Steps

1. **Deploy the API** using steps above
2. **Test all endpoints** with Postman or browser
3. **Update frontend** with new API URLs
4. **Configure Telegram Bot** using TELEGRAM-BOT-SETUP.md
5. **Test complete flow** from frontend to database

Your serverless API is ready for production! 🎉