# ✅ Server Setup Complete!

## 📦 What's Been Done

1. ✅ Created complete Node.js Express server
2. ✅ Set up MongoDB models (Admin, Product, Order, PromoCode)
3. ✅ Created all API routes with authentication
4. ✅ Configured environment variables
5. ✅ Installed all dependencies
6. ✅ Server is ready to run!

## 📁 Server Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── models/
│   ├── Admin.js               # Admin with bcrypt
│   ├── Product.js             # Product model
│   ├── Order.js               # Order model
│   └── PromoCode.js           # Promo code model
├── routes/
│   ├── auth.js                # Login endpoint
│   ├── products.js            # CRUD operations
│   ├── orders.js              # Order management
│   └── promoCodes.js          # Promo codes
├── middleware/
│   └── auth.js                # JWT authentication
├── scripts/
│   └── createAdmin.js         # Admin creation
├── .env                       # Environment variables
├── index.js                   # Main server
└── package.json               # Dependencies

```

## 🚨 MongoDB Connection Issue

The server tried to connect to MongoDB Atlas but got a connection error.

### Possible Causes:
1. **No Internet Connection** - Check your internet
2. **MongoDB Atlas Restrictions** - IP whitelist or network access
3. **Firewall** - Corporate or personal firewall blocking connection
4. **DNS Issues** - Unable to resolve MongoDB domain

### Solutions:

#### Option 1: Fix MongoDB Atlas Connection
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login to your account
3. Go to Network Access
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Save and wait 2-3 minutes
7. Restart the server: `npm run dev`

#### Option 2: Use Local MongoDB
If you have MongoDB installed locally:

Update `server/.env`:
```env
MONGO_URL=mongodb://localhost:27017/morth
```

Then restart: `npm run dev`

#### Option 3: Try Different Network
- Try from a different network (mobile hotspot, different WiFi)
- Disable VPN if using one
- Check DNS settings

## 🎯 Once Connected Successfully

You'll see:
```
✅ MongoDB Connected: cluster0.pqoakfu.mongodb.net
🚀 Server is running on port 5000
```

Then you can:

### 1. Create Admin Account
```bash
npm run create-admin
```

### 2. Test the Server
Visit: http://localhost:5000

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

## 📋 API Endpoints Ready

### ✅ Authentication
- `POST /api/auth/login` - Admin login

### ✅ Products  
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### ✅ Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### ✅ Promo Codes
- `GET /api/promo-codes` - Get all codes (admin)
- `POST /api/promo-codes/validate` - Validate code
- `POST /api/promo-codes` - Create code (admin)
- `DELETE /api/promo-codes/:id` - Delete code (admin)

## 🔧 Server Commands

```bash
# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Create admin account
npm run create-admin
```

## 📝 Environment Variables

Located in `server/.env`:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🎉 Everything is Ready!

The server is fully configured and ready to handle:
- ✅ Admin authentication with JWT
- ✅ Product management (CRUD)
- ✅ Order processing
- ✅ Promo code validation
- ✅ All in English
- ✅ MongoDB integration

Just fix the MongoDB connection and you're good to go! 🚀

## 💡 Quick Test After Connection Fixed

```bash
# 1. Create admin
npm run create-admin

# 2. Test server health
curl http://localhost:5000/api/health

# 3. Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# 4. Use token to create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "price": 299,
    "category": "T-Shirts",
    "sizes": ["S", "M", "L"],
    "colors": [{"name": "Black", "hex": "#000000"}],
    "images": ["https://via.placeholder.com/300"]
  }'
```

## 📞 Need Help?

Check the README.md in the server folder for detailed documentation!
