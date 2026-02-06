# Product Management API Documentation

## Overview

Complete backend API for product management system with vendor authentication and public browsing capabilities.

## Backend Setup

### Files Created/Modified

1. **Backend/schema/productSchema.js** - Product data model
2. **Backend/controller/ProductController.js** - Business logic for products
3. **Backend/router/productRoute.js** - API endpoints
4. **Backend/Server.js** - Registered product routes

### Database Schema

```javascript
// Product Schema Fields
{
  _id: ObjectId,
  vendorId: ObjectId (ref: VendorAuth),
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  size: String,
  mainImage: String (Cloudinary URL),
  subProducts: [{
    subName: String,
    subDescription: String,
    subPrice: Number,
    subImage: String (Cloudinary URL)
  }],
  whatsapp: String,
  email: String,
  ownerEmail: String,
  stock: Number (default: 0),
  rating: Number,
  reviews: [{
    userId: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Base URL: `http://localhost:4000/api/product`

### 1. Add Product (Protected)

- **Method:** `POST /add`
- **Auth:** Required (Bearer Token)
- **Content-Type:** `multipart/form-data`
- **Body:**
  ```
  name: String
  description: String
  price: Number
  category: String
  size: String (optional)
  whatsapp: String (optional)
  email: String
  ownerEmail: String
  stock: Number
  mainImage: File
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product added successfully",
    "data": { ...product }
  }
  ```

### 2. Get All Products (Public)

- **Method:** `GET /all`
- **Auth:** Not required
- **Query Parameters:**
  ```
  page: Number (default: 1)
  limit: Number (default: 10)
  search: String (searches name/description)
  category: String (filters by category)
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": [...products],
    "totalPages": Number,
    "totalCount": Number,
    "currentPage": Number
  }
  ```

### 3. Get Product by ID (Public)

- **Method:** `GET /details/:id`
- **Auth:** Not required
- **Response:**
  ```json
  {
    "success": true,
    "data": { ...product with full details }
  }
  ```

### 4. Get Vendor Products (Protected)

- **Method:** `GET /vendor/products`
- **Auth:** Required (Bearer Token)
- **Query Parameters:**
  ```
  ownerEmail: String (filters by vendor email)
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": [...vendor's products]
  }
  ```

### 5. Update Product (Protected)

- **Method:** `PUT /update/:id`
- **Auth:** Required (Bearer Token)
- **Content-Type:** `multipart/form-data`
- **Body:** Same as Add Product (all fields optional, only send changed fields)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": { ...updated product }
  }
  ```

### 6. Delete Product (Protected)

- **Method:** `DELETE /delete/:id`
- **Auth:** Required (Bearer Token)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

### 7. Add Review (Public)

- **Method:** `POST /review/:id`
- **Auth:** Not required
- **Body:**
  ```json
  {
    "userId": "String",
    "rating": "Number (1-5)",
    "comment": "String"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Review added successfully",
    "data": { ...product with new review }
  }
  ```

### 8. Toggle Product Status (Protected)

- **Method:** `PATCH /toggle/:id`
- **Auth:** Required (Bearer Token)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product status updated",
    "data": { ...updated product }
  }
  ```

### 9. Get Vendor Stats (Protected)

- **Method:** `GET /vendor/stats`
- **Auth:** Required (Bearer Token)
- **Query Parameters:**
  ```
  ownerEmail: String (filters by vendor email)
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalProducts": Number,
      "activeProducts": Number,
      "inactiveProducts": Number,
      "averageRating": Number
    }
  }
  ```

## Frontend Routes

### Protected Routes (Require Vendor Login)

- `/vendor/dashboard-products` - Vendor product management dashboard

### Public Routes

- `/product/browse` - Browse all products with filters and search

## Frontend Components

### 1. ProductDashboard.jsx

**Location:** `frontend/src/Pages/vendor/ProductDashboard.jsx`

Features:

- View all vendor's products
- Add new products with image upload
- Edit existing products
- Delete products
- Toggle product active/inactive status
- View vendor statistics (total, active, ratings)
- Responsive table with action buttons

**Key Hooks:**

- `useState` - Form data, products, stats, loading states
- `useEffect` - Fetch products and stats on load
- `useNavigate` - Route navigation
- `axios` - API calls

### 2. ProductBrowse.jsx

**Location:** `frontend/src/Pages/Product/ProductBrowse.jsx`

Features:

- Browse all products with pagination
- Search products by name/description
- Filter by category
- Sort by latest/price (low-high, high-low)
- View mode toggle (grid/list)
- Product ratings and reviews count
- Contact vendor via WhatsApp/Email
- Stock status display

**Key Features:**

- Responsive grid/list layouts
- Real-time search and filtering
- Pagination controls
- Product cards with detailed information

## Authentication

### Token Format

JWT tokens are used for vendor authentication. The token contains:

```json
{
  "email": "vendor@example.com",
  "vendorId": "...",
  "iat": "...",
  "exp": "..."
}
```

### How to Use

1. **Get Token:** Login via `/api/vendor/registervendor` (existing endpoint)
2. **Store Token:** Save in `localStorage.vendorToken`
3. **Send Token:** Include in Authorization header:
   ```
   Authorization: Bearer <vendorToken>
   ```

## Image Upload

### Cloudinary Integration

- Main image and sub-product images are uploaded to Cloudinary
- Images are stored as cloud URLs
- Process:
  1. Convert image to Base64
  2. Upload to Cloudinary
  3. Store returned secure_url in database

### Requirements

Set these environment variables in `Backend/.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Error Handling

### Common Errors

**401 Unauthorized**

- Missing or invalid token
- Token expired

**400 Bad Request**

- Missing required fields
- Invalid data format

**404 Not Found**

- Product doesn't exist
- Invalid product ID

**500 Internal Server Error**

- Database error
- File upload error

## Testing the API

### Using Postman

1. **Add Product**
   - Method: POST
   - URL: `http://localhost:4000/api/product/add`
   - Auth: Bearer Token
   - Body: form-data
     - name: "Test Product"
     - description: "Test description"
     - price: 100
     - category: "electronics"
     - stock: 10
     - ownerEmail: "vendor@example.com"
     - email: "vendor@example.com"
     - mainImage: [select file]

2. **Get All Products**
   - Method: GET
   - URL: `http://localhost:4000/api/product/all?page=1&limit=10`

3. **Get Vendor Products**
   - Method: GET
   - URL: `http://localhost:4000/api/product/vendor/products?ownerEmail=vendor@example.com`
   - Auth: Bearer Token

4. **Update Product**
   - Method: PUT
   - URL: `http://localhost:4000/api/product/update/:productId`
   - Auth: Bearer Token
   - Body: form-data (same as add)

5. **Delete Product**
   - Method: DELETE
   - URL: `http://localhost:4000/api/product/delete/:productId`
   - Auth: Bearer Token

## Workflow

### For Vendors

1. **Register/Login**
   - Go to `/vendor/register`
   - Select vendor type and fill details
   - Get vendor token

2. **Add Products**
   - Navigate to `/vendor/dashboard-products`
   - Click "Add New Product"
   - Fill product details and upload image
   - Submit form

3. **Manage Products**
   - View all products in table
   - Edit existing products
   - Delete products
   - Toggle active/inactive status
   - View product statistics

### For Customers

1. **Browse Products**
   - Go to `/product/browse`
   - Use search to find products
   - Filter by category
   - Sort by price or latest

2. **Contact Vendor**
   - Click WhatsApp to message vendor
   - Click Email to send message
   - View product details and reviews

## File Structure

```
Backend/
├── schema/
│   └── productSchema.js (Enhanced)
├── controller/
│   └── ProductController.js (New)
├── router/
│   └── productRoute.js (New)
└── Server.js (Updated)

frontend/
└── src/
    └── Pages/
        ├── Product/
        │   ├── ProductHome.jsx
        │   └── ProductBrowse.jsx (New)
        └── vendor/
            └── ProductDashboard.jsx (New)
```

## Performance Considerations

1. **Pagination:** Products are paginated (default 10 per page)
2. **Indexing:** Create indexes on:
   - vendorId
   - category
   - isActive
   - createdAt

3. **Caching:** Consider caching popular categories and searches

## Security Measures

1. **Authentication:** JWT token required for vendor operations
2. **Authorization:** Vendors can only modify their own products
3. **Input Validation:** All inputs validated before processing
4. **File Upload:** Only image files allowed
5. **CORS:** Configured for allowed domains

## Future Enhancements

1. **Advanced Search:** Full-text search implementation
2. **Product Variants:** Color, size variants
3. **Inventory Management:** Low stock alerts
4. **Analytics:** Vendor sales analytics
5. **Wishlist:** Customer wishlists
6. **Comparison:** Product comparison feature
7. **Ratings:** Advanced rating system
8. **Bulk Upload:** Import multiple products
9. **Image Gallery:** Multiple images per product
10. **Recommendations:** AI-based recommendations

## Support & Troubleshooting

### Common Issues

1. **Image Not Uploading**
   - Check Cloudinary credentials
   - Verify file size limits
   - Check image format (jpg, png, webp)

2. **Token Invalid**
   - Re-login to get new token
   - Check token expiration
   - Verify token format

3. **Products Not Showing**
   - Check database connection
   - Verify product is active (isActive: true)
   - Check pagination parameters

4. **Search Not Working**
   - Ensure search term is in name or description
   - Check category filter doesn't conflict
   - Verify pagination page exists

## Contact & Feedback

For issues, feature requests, or improvements, please contact the development team.
