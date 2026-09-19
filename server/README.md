# Morth Admin Backend Server

Complete Node.js + Express + MongoDB backend for the Morth admin dashboard.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your MongoDB connection.
Update if needed:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your-secret-key
```

### 3. Create Admin Account

```bash
npm run create-admin
```

Follow the prompts to create your admin account.

### 4. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── Admin.js           # Admin model
│   ├── Product.js         # Product model
│   ├── Order.js           # Order model
│   └── PromoCode.js       # Promo code model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── products.js        # Product routes
│   ├── orders.js          # Order routes
│   └── promoCodes.js      # Promo code routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── scripts/
│   └── createAdmin.js     # Admin creation script
├── .env                   # Environment variables
├── index.js               # Main server file
└── package.json           # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create order (public)
- `PUT /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Promo Codes
- `GET /api/promo-codes` - Get all promo codes (admin only)
- `POST /api/promo-codes/validate` - Validate promo code (public)
- `POST /api/promo-codes` - Create promo code (admin only)
- `DELETE /api/promo-codes/:id` - Delete promo code (admin only)

## 🔐 Authentication

All admin routes require JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 📝 Usage Examples

### Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'your-password'
  })
});

const { token } = await response.json();
```

### Get Products
```javascript
const response = await fetch('http://localhost:5000/api/products');
const { products } = await response.json();
```

### Create Product (Admin)
```javascript
const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Product Name',
    slug: 'product-name',
    price: 299,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Black', hex: '#000000' }],
    images: ['image-url-1.jpg']
  })
});
```

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run create-admin` - Create admin account

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
  items: [OrderItem],
  subtotal: Number,
  shippingCost: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  status: String,
  ...
}
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS enabled
- Input validation
- Error handling middleware

## 🚨 Troubleshooting

### Cannot connect to MongoDB
- Check MONGO_URL in .env
- Ensure MongoDB is accessible
- Check network/firewall settings

### Port already in use
- Change PORT in .env
- Kill process using port 5000

### JWT errors
- Verify JWT_SECRET is set
- Check token expiration (7 days)

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment variables
- multer - File upload handling
- cloudinary - Image storage

## 🔄 Updates

To update dependencies:
```bash
npm update
```

## 📄 License

ISC
