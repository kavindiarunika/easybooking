# Product Management System - Quick Setup Guide

## ✅ What's Been Created

### Backend (Complete)

- ✅ **productSchema.js** - Enhanced MongoDB schema with vendorId, stock, reviews, ratings
- ✅ **ProductController.js** - 9 comprehensive methods for CRUD operations
- ✅ **productRoute.js** - 8 API endpoints (protected & public)
- ✅ **Server.js** - Updated with product router registration

### Frontend (Complete)

- ✅ **ProductDashboard.jsx** - Vendor dashboard for managing products (add/edit/delete/view stats)
- ✅ **ProductBrowse.jsx** - Public product browsing with search/filter/pagination
- ✅ **App.jsx** - Updated with new routes

## 🚀 How to Use

### 1. Start Backend Server

```bash
cd Backend
npm install (if not done)
node Server.js
```

Should see: `Server is running on port 4000`

### 2. Start Frontend Server

```bash
cd frontend
npm install (if not done)
npm run dev
```

Should see: `http://localhost:5173`

### 3. Vendor Flow

#### Step 1: Register as Product Vendor

- Go to: `http://localhost:5173/vendor/register`
- Fill vendor details (email, password, phone, etc.)
- Select "products" as vendor type (if available) OR any vendor type
- Click Register

#### Step 2: Access Product Dashboard

- After login, navigate to: `http://localhost:5173/vendor/dashboard-products`
- Or login first, then the dashboard will be available

#### Step 3: Add Products

- Click "Add New Product" button
- Fill details:
  - Product Name (required)
  - Description (required)
  - Price (required)
  - Category (required) - electronics, clothing, food, home, other
  - Size (optional)
  - Stock quantity
  - WhatsApp number (optional)
  - Email
  - Upload main image
- Click "Add Product"

#### Step 4: Manage Products

- **View:** See all your products in table format
- **Edit:** Click edit button to modify product
- **Delete:** Click delete button (with confirmation)
- **Toggle Status:** Click eye icon to hide/show product
- **Stats:** See total, active, and average rating at top

### 4. Customer/Browsing Flow

#### Step 1: Browse Products

- Go to: `http://localhost:5173/product/browse`
- No login required

#### Step 2: Filter & Search

- Use search bar to find products
- Select category from sidebar
- Change sort order (latest, price low-high, price high-low)

#### Step 3: View Products

- Toggle between grid and list view
- See product details: name, description, price, stock, rating
- Click WhatsApp to contact vendor
- Click Email to contact vendor

## 📁 File Locations

### Backend Files

```
Backend/
├── schema/
│   └── productSchema.js          ← Enhanced with vendorId, stock, reviews
├── controller/
│   └── ProductController.js      ← All product logic (NEW)
├── router/
│   └── productRoute.js           ← All API endpoints (NEW)
└── Server.js                      ← Updated with product routes
```

### Frontend Files

```
frontend/src/
├── Pages/
│   ├── Product/
│   │   ├── ProductHome.jsx       ← Existing home page
│   │   └── ProductBrowse.jsx     ← Product browsing (NEW)
│   └── vendor/
│       ├── ProductDashboard.jsx  ← Vendor dashboard (NEW)
│       └── (other vendor pages)
└── App.jsx                        ← Updated with new routes
```

## 🔌 API Endpoints Summary

| Method | Endpoint                       | Auth | Purpose                   |
| ------ | ------------------------------ | ---- | ------------------------- |
| POST   | `/api/product/add`             | ✅   | Add new product           |
| GET    | `/api/product/all`             | ❌   | Get all products (public) |
| GET    | `/api/product/details/:id`     | ❌   | Get product details       |
| GET    | `/api/product/vendor/products` | ✅   | Get vendor's products     |
| PUT    | `/api/product/update/:id`      | ✅   | Update product            |
| DELETE | `/api/product/delete/:id`      | ✅   | Delete product            |
| POST   | `/api/product/review/:id`      | ❌   | Add review                |
| PATCH  | `/api/product/toggle/:id`      | ✅   | Toggle active/inactive    |
| GET    | `/api/product/vendor/stats`    | ✅   | Get vendor stats          |

## ⚙️ Configuration

### Required Environment Variables

Add to `Backend/.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

(Or update in productRoute.js if using inline config)

### Database Connection

Ensure MongoDB is running and connected in `Backend/config/mongodb.js`

## 🧪 Testing

### Using Postman

1. **Add Product**

   ```
   POST http://localhost:4000/api/product/add
   Headers: Authorization: Bearer <your_token>
   Body (form-data):
   - name: Test Product
   - description: Test Desc
   - price: 99
   - category: electronics
   - email: test@example.com
   - mainImage: [select image file]
   ```

2. **Get Products**

   ```
   GET http://localhost:4000/api/product/all?page=1&limit=10
   ```

3. **Get Vendor Products**
   ```
   GET http://localhost:4000/api/product/vendor/products
   Headers: Authorization: Bearer <your_token>
   ```

## 🛠️ Troubleshooting

### Products Not Showing

- Check MongoDB connection
- Verify vendor email is correct
- Ensure product isActive = true
- Check pagination (page/limit params)

### Image Upload Failed

- Verify Cloudinary credentials
- Check image file size (limit: usually 10MB)
- Ensure image format is jpg, png, or webp
- Check network connection

### Token Errors

- Login again to get fresh token
- Verify token in localStorage
- Check token hasn't expired

### Port Already in Use

```bash
# Change port in Server.js or kill process using port 4000
# For Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# For Mac/Linux:
lsof -i :4000
kill -9 <PID>
```

## 📊 Features Overview

### For Vendors

- ✅ Add products with images
- ✅ Edit existing products
- ✅ Delete products
- ✅ View product statistics
- ✅ Toggle product visibility (active/inactive)
- ✅ Track stock quantities
- ✅ Manage product details (price, category, size)
- ✅ View product reviews and ratings

### For Customers

- ✅ Browse all products
- ✅ Search products by name/description
- ✅ Filter by category
- ✅ Sort by price or latest
- ✅ View detailed product information
- ✅ See product ratings and reviews
- ✅ Contact vendor (WhatsApp/Email)
- ✅ Check stock availability
- ✅ Toggle between grid/list view

## 🔒 Security Features

- JWT authentication for vendor operations
- Protected routes using middleware
- Input validation on all fields
- File upload validation (images only)
- CORS configuration
- Vendor can only modify their own products

## 📝 Next Steps

1. **Test the System**
   - Register as vendor
   - Add a test product
   - Browse products as customer
   - Test search and filters

2. **Customize Categories** (if needed)
   - Edit ProductDashboard.jsx line 150
   - Edit ProductBrowse.jsx line 34
   - Add/remove category options

3. **Add More Features** (optional)
   - Product variants (color, size options)
   - Wishlist functionality
   - Shopping cart
   - Order tracking
   - Vendor ratings
   - Advanced analytics

4. **Deploy**
   - Deploy Backend to hosting service
   - Deploy Frontend to hosting service
   - Update BACKEND_URL in frontend/.env
   - Set up Cloudinary account for production

## 📞 Support

For detailed API documentation, see: `PRODUCT_API_DOCUMENTATION.md`

For issues:

1. Check console for error messages
2. Verify all prerequisites installed
3. Ensure MongoDB is running
4. Check network connectivity
5. Review logs in browser DevTools

---

**Status:** ✅ Complete - Ready for use!
