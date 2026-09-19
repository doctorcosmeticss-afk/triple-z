# 🚀 Morth Admin Backend - Complete Setup

## ✅ What You Have Now

A complete **Node.js + Express + MongoDB** backend server with:

### Features
- ✅ **Admin Authentication** with JWT
- ✅ **Product Management** (Create, Read, Update, Delete)
- ✅ **Order Management** with status tracking
- ✅ **Promo Code System** with validation
- ✅ **All in English** (no Arabic)
- ✅ **MongoDB Integration** (using your connection string)
- ✅ **RESTful API** with proper error handling
- ✅ **Password Hashing** with bcryptjs
- ✅ **CORS Enabled** for frontend connection

## 📁 Project Structure

```
morth/
├── server/                    # 👈 Your backend server
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── Admin.js          # Admin model
│   │   ├── Product.js        # Product model
│   │   ├── Order.js          # Order model
│   │   └── PromoCode.js      # Promo code model
│   ├── routes/
│   │   ├── auth.js           # Login endpoint
│   │   ├── products.js       # Product CRUD
│   │   ├── orders.js         # Order management
│   │   └── promoCodes.js     # Promo codes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── scripts/
│   │   └── createAdmin.js    # Create admin account
│   ├── .env                  # Environment variables
│   ├── index.js              # Main server file
│   ├── package.json          # Dependencies
│   ├── README.md             # Full documentation
│   ├── QUICK-START.md        # Quick start guide
│   └── SETUP-COMPLETE.md     # Setup status
└── ... (frontend files)
```

## 🎯 How to Start

### Step 1: Go to Server Folder
```bash
cd server
```

### Step 2: Dependencies are Already Installed! ✅
All packages are installed. If you need to reinstall:
```bash
npm install
```

### Step 3: Fix MongoDB Connection

⚠️ **Current Issue**: Server cannot connect to MongoDB Atlas

**Why?** Could be:
- Network/Internet issue
- MongoDB Atlas IP whitelist
- Firewall blocking connection

**Solution**: 
1. Open [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to Network Access
3. Add IP Address → Allow from Anywhere (0.0.0.0/0)
4. Wait 2-3 minutes
5. Restart server

**Alternative**: Use local MongoDB
```env
# In server/.env, change to:
MONGO_URL=mongodb://localhost:27017/morth
```

### Step 4: Create Admin Account
```bash
npm run create-admin
```

Follow prompts:
- Enter email: `admin@example.com`
- Enter password: `yourpassword`
- Confirm password: `yourpassword`

### Step 5: Start Server
```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

You'll see:
```
✅ MongoDB Connected: cluster0.pqoakfu.mongodb.net
🚀 Server is running on port 5000
📍 API URL: http://localhost:5000
```

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
```javascript
POST /api/auth/login
Body: { email, password }
Response: { success, token, admin }
```

### Products (Public)
```javascript
GET /api/products              // Get all products
GET /api/products/:id          // Get single product
```

### Products (Admin Only - Requires Token)
```javascript
POST /api/products             // Create product
PUT /api/products/:id          // Update product
DELETE /api/products/:id       // Delete product

Headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### Orders
```javascript
POST /api/orders               // Create order (public)
GET /api/orders                // Get all orders (admin)
PUT /api/orders/:id            // Update order status (admin)
DELETE /api/orders/:id         // Delete order (admin)
```

### Promo Codes
```javascript
POST /api/promo-codes/validate // Validate code (public)
GET /api/promo-codes           // Get all codes (admin)
POST /api/promo-codes          // Create code (admin)
DELETE /api/promo-codes/:id    // Delete code (admin)
```

## 💻 Example Usage

### 1. Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'yourpassword'
  })
});

const { token } = await response.json();
// Save token: localStorage.setItem('adminToken', token);
```

### 2. Get Products
```javascript
const response = await fetch('http://localhost:5000/api/products');
const { products } = await response.json();
console.log(products);
```

### 3. Create Product (Admin)
```javascript
const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Cool T-Shirt',
    slug: 'cool-t-shirt-' + Date.now(),
    description: 'Amazing t-shirt',
    details: 'High quality cotton',
    price: 299,
    oldPrice: 399,
    category: 'T-Shirts',
    brand: 'North',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    images: ['https://via.placeholder.com/500'],
    stock: 100,
    rating: 5
  })
});

const { product } = await response.json();
```

### 4. Create Promo Code
```javascript
const response = await fetch('http://localhost:5000/api/promo-codes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    code: 'SUMMER2024',
    percentOff: 20,
    maxUses: 100,
    validDays: 30
  })
});
```

## 🔐 Security

- **JWT Tokens**: 7-day expiration
- **Password Hashing**: bcryptjs with salt
- **Protected Routes**: Admin-only endpoints
- **CORS**: Enabled for cross-origin requests

## 🛠️ Environment Variables

File: `server/.env`

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📊 Database Models

### Product
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  details: String,
  price: Number,
  oldPrice: Number,
  category: String,
  brand: String,
  images: [String],
  sizes: [String],
  colors: [{ name, hex }],
  stock: Number,
  soldOut: Boolean,
  isNew: Boolean,
  isBestSeller: Boolean,
  rating: Number
}
```

### Order
```javascript
{
  orderNumber: String (auto-generated),
  fullName: String,
  email: String,
  phone: String,
  governorate: String,
  city: String,
  addressLine: String,
  items: [{ productId, name, price, size, color, qty, image }],
  subtotal: Number,
  shippingCost: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  status: String,
  ...
}
```

## 🧪 Testing

### Test Server Health
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check internet connection
- Verify MongoDB Atlas IP whitelist
- Try different network
- Use local MongoDB instead

### Port Already in Use
- Change PORT in `.env` to 5001 or another port

### Token Invalid
- Make sure you're sending token in Authorization header
- Check token hasn't expired (7 days)
- Verify JWT_SECRET matches

## 📚 Additional Resources

- `server/README.md` - Full documentation
- `server/QUICK-START.md` - Quick setup guide
- `server/SETUP-COMPLETE.md` - Setup status

## 🎉 You're Ready!

Once MongoDB connects, you have a **complete production-ready backend** with:
- ✅ Authentication
- ✅ Product management
- ✅ Order processing
- ✅ Promo codes
- ✅ All in English
- ✅ Secure and scalable

Happy coding! 🚀
