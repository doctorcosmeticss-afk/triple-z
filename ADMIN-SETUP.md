# Admin Dashboard Setup Guide

## Prerequisites

1. **MongoDB Database** - You need a MongoDB database (local or cloud)
2. **Node.js** - Version 18 or higher
3. **npm** - Package manager

## Environment Setup

Create or update your `.env` file with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/morth
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/morth

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary or any image storage service
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Admin Account

Run this script to create your first admin account:

```bash
node scripts/create-admin.js
```

Or manually create an admin using MongoDB:

```javascript
// In MongoDB shell or Compass
use morth;

db.admins.insertOne({
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  createdAt: new Date()
});
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Dashboard

Open your browser and go to:
```
http://localhost:3000/admin/login
```

Login with your admin credentials.

## Admin Dashboard Features

### 📦 Add Product
- Add product name
- Set price before and after discount
- Add description and details
- Select category
- Add multiple sizes
- Add colors with RGB picker
- Upload up to 10 images (first image is the main one)
- Drag and drop to reorder images

### 🎯 Manage Products
- View all products
- Search for products
- Filter by category
- **Delete** product
- **Edit** product details
- Mark as **Sold Out**
- Add/Remove from **New Arrivals** (max 10 products)
- Add/Remove from **Best Sellers** (max 10 products)

### 🛒 Orders
- View all orders with full details
- Product images and information
- Customer information (name, address, phone)
- Payment details:
  - Cash on Delivery
  - Vodafone Cash (account number, amount, proof image)
  - Insta Pay (account number, amount, proof image)
- Change order status:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- Delete orders
- Price summary (subtotal, shipping, discount, total)

### 🏷️ Promo Codes
- Create new promo codes
- Set code name
- Set maximum uses
- Set validity period (in days)
- Choose discount percentage (5% to 70% in increments of 5)
- View all active codes
- Track usage count
- View creation and expiration dates
- Delete codes

## Design Features

The admin dashboard includes:
- ✨ Modern and clean design
- 🎨 Gradient colors
- 📱 Fully responsive
- 🎯 User-friendly interface
- 🌈 Interactive messages with SweetAlert2
- 🔔 Toast notifications
- 🌐 **All in English**

## Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Secure logout
- ✅ Token-based session management

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products` - Update product
- `DELETE /api/admin/products?id={id}` - Delete product

### Orders
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders` - Update order status
- `DELETE /api/admin/orders?id={id}` - Delete order

### Promo Codes
- `GET /api/admin/promo-codes` - Get all promo codes
- `POST /api/admin/promo-codes` - Create promo code
- `DELETE /api/admin/promo-codes?id={id}` - Delete promo code

## Database Models

### Admin
```typescript
{
  email: string;
  password: string; // hashed
  createdAt: Date;
}
```

### Product
```typescript
{
  name: string;
  slug: string;
  description: string;
  details: string;
  price: number;
  oldPrice?: number;
  category: string;
  brand: string;
  images: string[];
  sizes: string[];
  colors: { name: string, hex: string }[];
  stock: number;
  soldOut: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  rating: number;
}
```

### Order
```typescript
{
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  city?: string;
  addressLine: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
}
```

### PromoCode
```typescript
{
  code: string;
  percentOff: number;
  maxUses: number;
  currentUses: number;
  validDays: number;
  expiresAt: Date;
  active: boolean;
}
```

## Troubleshooting

1. **Cannot connect to MongoDB**
   - Check your MONGODB_URI in .env
   - Ensure MongoDB is running
   - Check firewall settings

2. **Login fails**
   - Verify admin account exists in database
   - Check JWT_SECRET is set
   - Clear browser localStorage and try again

3. **Images not uploading**
   - Configure image storage service (Cloudinary recommended)
   - Check storage credentials in .env

## Development Tips

- Admin token is stored in localStorage
- Token expires after 7 days
- All API calls require valid token
- Images should be optimized before upload

## Production Deployment

Before deploying:
1. Change JWT_SECRET to a strong random string
2. Set MONGODB_URI to your production database
3. Enable HTTPS
4. Set up proper CORS policies
5. Configure rate limiting
6. Set up backup strategy for database

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify all environment variables
3. Check browser console for errors
4. Review server logs

## Future Enhancements

Possible additions:
- 📊 Analytics Dashboard
- 📈 Sales Reports
- 👥 Customer Management
- 📧 Email Notifications
- 🎁 Special Offers Management
- 📦 Inventory Management
- 🔐 Two-Factor Authentication
- 📱 Mobile App
