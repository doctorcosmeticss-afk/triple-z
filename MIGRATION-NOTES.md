# Migration from Supabase to MongoDB - Summary

## ✅ Completed

### 1. Database Setup
- ✅ Created MongoDB models (Admin, Product, Order, PromoCode)
- ✅ Set up MongoDB connection utility
- ✅ Created API routes for all admin operations
- ✅ Updated environment variables

### 2. Authentication
- ✅ Replaced Supabase Auth with JWT-based authentication
- ✅ Updated login page to use MongoDB API
- ✅ Updated dashboard authentication check

### 3. Files Updated
- ✅ `src/lib/mongodb.ts` - MongoDB connection
- ✅ `src/models/Admin.ts` - Admin model with bcrypt
- ✅ `src/models/Product.ts` - Product model
- ✅ `src/models/Order.ts` - Order model
- ✅ `src/models/PromoCode.ts` - Promo code model
- ✅ `src/routes/api/admin/login.ts` - Login API
- ✅ `src/routes/api/admin/products.ts` - Products API
- ✅ `src/routes/api/admin/orders.ts` - Orders API
- ✅ `src/routes/api/admin/promo-codes.ts` - Promo codes API
- ✅ `src/routes/admin/login.tsx` - Login page (English)
- ✅ `src/routes/admin/dashboard.tsx` - Dashboard page (English)

## 🔄 To Be Updated (Remaining Components)

The following components need to be updated to:
1. Replace Supabase calls with MongoDB API calls
2. Convert all Arabic text to English

### Components to Update:

1. **`src/components/admin/AddProductTab.tsx`**
   - Change: Replace Supabase storage with Cloudinary or similar
   - Change: Use `/api/admin/products` POST endpoint
   - Change: Convert all labels and messages to English

2. **`src/components/admin/ManageProductsTab.tsx`**
   - Change: Use `/api/admin/products` GET endpoint
   - Change: Use `/api/admin/products` PUT/DELETE endpoints
   - Change: Convert all text to English

3. **`src/components/admin/EditProductDialog.tsx`**
   - Change: Use `/api/admin/products` PUT endpoint
   - Change: Convert all text to English

4. **`src/components/admin/OrdersTab.tsx`**
   - Change: Use `/api/admin/orders` GET endpoint
   - Change: Use `/api/admin/orders` PUT/DELETE endpoints
   - Change: Convert all text to English

5. **`src/components/admin/PromoCodesTab.tsx`**
   - Change: Use `/api/admin/promo-codes` endpoints
   - Change: Convert all text to English

## 📝 Quick Reference for API Calls

### Old (Supabase):
```typescript
const { data, error } = await supabase
  .from("products")
  .select("*");
```

### New (MongoDB API):
```typescript
const response = await fetch('/api/admin/products', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  }
});
const { products } = await response.json();
```

## 🔐 Authentication Header

All API calls need to include the auth token:

```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json'
}
```

## 🖼️ Image Upload

Images should be uploaded to Cloudinary or similar service.
The API expects image URLs (not files).

Example Cloudinary integration:
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('upload_preset', 'your_preset');

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  {
    method: 'POST',
    body: formData
  }
);
const { secure_url } = await response.json();
```

## 🚀 Next Steps

1. Create admin account using script:
   ```bash
   node scripts/create-admin.js
   ```

2. Test login at `/admin/login`

3. Update remaining components one by one

4. Test each feature thoroughly

5. Remove Supabase dependencies if no longer needed:
   ```bash
   npm uninstall @supabase/supabase-js
   ```

## 📌 Important Notes

- MongoDB connection string is in `.env` as `MONGODB_URI`
- JWT secret is in `.env` as `JWT_SECRET`
- Admin token expires after 7 days
- All admin routes are under `/admin/*`
- All API routes are under `/api/admin/*`
