# 🚀 Quick Start Guide - Morth Backend Server

## Step 1: Install Dependencies

Open terminal in the `server` folder and run:

```bash
cd server
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- and more...

## Step 2: Server is Ready!

The `.env` file is already configured with your MongoDB connection.

## Step 3: Create Admin Account

```bash
npm run create-admin
```

Follow the prompts:
1. Enter your admin email
2. Enter password (min 6 characters)
3. Confirm password

You'll see:
```
✅ Admin account created successfully!
📧 Email: your-email@example.com
🚀 You can now login at: http://localhost:3000/admin/login
```

## Step 4: Start the Server

**Development mode** (auto-reload on changes):
```bash
npm run dev
```

**OR Production mode:**
```bash
npm start
```

You'll see:
```
🚀 Server is running on port 5000
📍 API URL: http://localhost:5000
💚 Environment: development
✅ MongoDB Connected: cluster0.pqoakfu.mongodb.net
```

## ✅ That's It!

Your server is now running and connected to MongoDB.

## 🧪 Test the Server

### Check if server is running:
Open browser and go to:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "Morth Admin API Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "products": "/api/products",
    "orders": "/api/orders",
    "promoCodes": "/api/promo-codes"
  }
}
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

You should get a JWT token back!

## 📋 API Endpoints Summary

### Public Endpoints
- `GET /api/products` - Get all products
- `POST /api/orders` - Create order
- `POST /api/promo-codes/validate` - Validate promo code

### Admin Endpoints (Require JWT Token)
- `POST /api/auth/login` - Login
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/promo-codes` - Get all promo codes
- `POST /api/promo-codes` - Create promo code
- `DELETE /api/promo-codes/:id` - Delete promo code

## 🔥 Common Commands

```bash
# Install dependencies
npm install

# Start dev server (auto-reload)
npm run dev

# Start production server
npm start

# Create admin account
npm run create-admin
```

## 🐛 Troubleshooting

### Problem: Cannot connect to MongoDB
**Solution:** Check your MongoDB URL in `.env` file

### Problem: Port 5000 already in use
**Solution:** Change PORT in `.env` file to 5001 or any available port

### Problem: Admin login fails
**Solution:** Make sure you created admin account first with `npm run create-admin`

## 🔗 Connect Frontend to Backend

Update your frontend API calls to use:
```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Example: Get Products
fetch(`${API_URL}/products`);

// Example: Create Product (Admin)
fetch(`${API_URL}/products`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});
```

## 💡 Pro Tips

1. **Development:** Always use `npm run dev` for auto-reload
2. **Security:** Change JWT_SECRET in `.env` before production
3. **Testing:** Use Postman or Thunder Client to test APIs
4. **Logs:** Check terminal for any errors
5. **MongoDB:** Use MongoDB Compass to view your data

## 🎉 You're All Set!

Your backend server is running and ready to handle:
- ✅ Admin authentication
- ✅ Product management
- ✅ Order processing
- ✅ Promo code validation

Now you can build your admin dashboard frontend! 🚀
