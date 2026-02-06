# Developer Reference Guide - Product Management System

## Quick Reference

### Environment Setup

**Backend Requirements:**

- Node.js v14+
- MongoDB (local or Atlas)
- Express.js
- Mongoose

**Frontend Requirements:**

- Node.js v14+
- React 18+
- Tailwind CSS
- Axios

### Start Services

```bash
# Backend
cd Backend && node Server.js

# Frontend
cd frontend && npm run dev
```

---

## Key Files Reference

### Backend

**productSchema.js**

```javascript
// Main fields
vendorId (ObjectId ref: VendorAuth)
name, description, price, category
mainImage (Cloudinary URL)
ownerEmail (for querying)
stock, rating, isActive
reviews[] (with userId, rating, comment)
timestamps (createdAt, updatedAt)
```

**ProductController.js - 9 Methods**

1. `addProduct(req, res)` - Create product
2. `getVendorProducts(req, res)` - Get vendor's products
3. `getProductById(req, res)` - Get single product
4. `getAllProducts(req, res)` - Public browsing
5. `updateProduct(req, res)` - Edit product
6. `deleteProduct(req, res)` - Remove product
7. `addReview(req, res)` - Add customer review
8. `toggleProductStatus(req, res)` - Hide/show product
9. `getProductStats(req, res)` - Vendor analytics

**productRoute.js - 9 Endpoints**

```
POST /add .......................... Add product (Protected)
GET /all ........................... Get all products (Public)
GET /details/:id ................... Get product details (Public)
GET /vendor/products ............... Get vendor products (Protected)
PUT /update/:id .................... Update product (Protected)
DELETE /delete/:id ................. Delete product (Protected)
POST /review/:id ................... Add review (Public)
PATCH /toggle/:id .................. Toggle status (Protected)
GET /vendor/stats .................. Get stats (Protected)
```

### Frontend

**ProductDashboard.jsx**

- Location: `frontend/src/Pages/vendor/ProductDashboard.jsx`
- Purpose: Vendor product management
- Routes to: `/vendor/dashboard-products` (Protected)
- Features: CRUD, image upload, stats, table view

**ProductBrowse.jsx**

- Location: `frontend/src/Pages/Product/ProductBrowse.jsx`
- Purpose: Public product browsing
- Routes to: `/product/browse` (Public)
- Features: Search, filter, sort, pagination, grid/list view

---

## API Call Examples

### Add Product (Frontend → Backend)

```javascript
const formDataToSend = new FormData();
formDataToSend.append("name", formData.name);
formDataToSend.append("description", formData.description);
formDataToSend.append("price", formData.price);
formDataToSend.append("category", formData.category);
formDataToSend.append("mainImage", media.mainImage);
formDataToSend.append("ownerEmail", vendorEmail);

const response = await axios.post(
  `${BACKEND_URL}/api/product/add`,
  formDataToSend,
  {
    headers: {
      Authorization: `Bearer ${storedToken}`,
      "Content-Type": "multipart/form-data",
    },
  },
);
```

### Get All Products (Frontend → Backend)

```javascript
const response = await axios.get(`${BACKEND_URL}/api/product/all`, {
  params: {
    page: 1,
    limit: 10,
    search: "laptop",
    category: "electronics",
  },
});
```

### Get Vendor Products (Frontend → Backend)

```javascript
const response = await axios.get(`${BACKEND_URL}/api/product/vendor/products`, {
  params: { ownerEmail: vendorEmail },
  headers: { Authorization: `Bearer ${storedToken}` },
});
```

---

## Database Queries

### Find All Products

```javascript
const products = await Product.find({});
```

### Find Vendor's Products

```javascript
const vendorProducts = await Product.find({ ownerEmail: email });
```

### Find by Category

```javascript
const categoryProducts = await Product.find({ category: "electronics" });
```

### Search Products

```javascript
const searchResults = await Product.find({
  $or: [
    { name: { $regex: term, $options: "i" } },
    { description: { $regex: term, $options: "i" } },
  ],
});
```

### Update Product

```javascript
const updated = await Product.findByIdAndUpdate(
  id,
  { $set: updateData },
  { new: true },
);
```

### Add Review

```javascript
const updated = await Product.findByIdAndUpdate(
  id,
  { $push: { reviews: reviewData } },
  { new: true },
);
```

### Calculate Rating

```javascript
const product = await Product.findById(id);
const avgRating =
  product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
    : 0;
```

---

## Common Issues & Solutions

### Issue 1: Image Upload Fails

**Cause:** Cloudinary credentials missing
**Solution:** Add to Backend/.env

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Issue 2: Vendor Can't Add Products

**Cause:** Invalid or expired token
**Solution:**

- Re-login via register page
- Check localStorage.vendorToken
- Verify token format in Authorization header

### Issue 3: Products Not Showing

**Cause:** isActive = false or wrong pagination
**Solution:**

- Check product isActive status
- Verify page and limit parameters
- Check MongoDB connection

### Issue 4: Search Not Working

**Cause:** Query syntax error or missing fields
**Solution:**

- Ensure search term is in name or description
- Check regex pattern in controller
- Verify product fields exist

### Issue 5: Stats Not Calculating

**Cause:** Missing reviews or rating field
**Solution:**

- Ensure reviews array is populated
- Check rating calculation logic
- Verify product has reviews before displaying rating

---

## Code Snippets for Common Tasks

### Extract Token from JWT

```javascript
const getVendorInfo = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const vendorInfo = getVendorInfo(localStorage.vendorToken);
const vendorEmail = vendorInfo?.email;
```

### Format Phone Number for WhatsApp

```javascript
const whatsappNumber = phoneNumber.replace(/\D/g, "");
const whatsappLink = `https://wa.me/${whatsappNumber}`;
```

### Calculate Star Rating

```javascript
const getRating = (product) => {
  return product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
    : 0;
};
```

### Render Stars

```javascript
{
  [...Array(5)].map((_, i) => (
    <FaStar
      key={i}
      className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-600"}
    />
  ));
}
```

### Toast Notifications

```javascript
import { toast } from "react-toastify";

// Success
toast.success("Product added successfully");

// Error
toast.error("Failed to add product");

// Info
toast.info("Please login first");
```

### API Call Pattern

```javascript
try {
  setLoading(true);
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  setData(response.data.data);
  toast.success("Data loaded");
} catch (error) {
  console.error("Error:", error);
  toast.error(error.response?.data?.message || "Error loading data");
} finally {
  setLoading(false);
}
```

---

## Authentication Flow

1. **User Registers**

   ```
   POST /api/vendor/registervendor
   Response: { vendorToken, category, ... }
   ```

2. **Store Token**

   ```javascript
   localStorage.setItem("vendorToken", response.data.vendorToken);
   localStorage.setItem("vendorCategory", response.data.category);
   ```

3. **Use Token in Requests**

   ```javascript
   headers: {
     Authorization: `Bearer ${localStorage.vendorToken}`;
   }
   ```

4. **Token Verification (Backend)**
   ```javascript
   const token = req.headers.authorization?.split(" ")[1];
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = decoded;
   ```

---

## Validation Rules

### Product Schema Validation

```javascript
// Required
name: String (required)
description: String (required)
price: Number (required, > 0)
category: String (required)
email: String (required, valid email)

// Optional
size: String
whatsapp: String (valid phone format)
stock: Number (default 0)
mainImage: File (jpg, png, webp)
```

### Review Validation

```javascript
// Required
userId: String (required)
rating: Number (required, 1-5)
comment: String (required, max 500 chars)
```

---

## Performance Tips

1. **Pagination**
   - Always paginate large datasets
   - Default limit: 10 items per page
   - Users can request higher limits

2. **Indexing**

   ```javascript
   productSchema.index({ vendorId: 1 });
   productSchema.index({ category: 1 });
   productSchema.index({ createdAt: -1 });
   productSchema.index({ isActive: 1 });
   ```

3. **Caching**
   - Cache popular categories
   - Cache vendor stats
   - Invalidate on updates

4. **Image Optimization**
   - Use Cloudinary transformations
   - Serve WebP format when possible
   - Lazy load images in browse

---

## Testing Checklist

### Backend Testing

- [ ] Add product endpoint works
- [ ] Image uploads to Cloudinary
- [ ] Get all products returns paginated data
- [ ] Search filters correctly
- [ ] Category filter works
- [ ] Vendor can only see own products
- [ ] Update product works
- [ ] Delete removes product
- [ ] Add review updates rating
- [ ] Toggle status works
- [ ] Stats calculate correctly

### Frontend Testing

- [ ] Vendor dashboard loads
- [ ] Add product form validates
- [ ] Image preview shows
- [ ] Products table displays
- [ ] Edit button works
- [ ] Delete confirmation appears
- [ ] Browse page loads products
- [ ] Search works real-time
- [ ] Category filter works
- [ ] Pagination works
- [ ] Grid/list toggle works
- [ ] WhatsApp link works
- [ ] Email link works

---

## Deployment Checklist

- [ ] Set environment variables
- [ ] Update BACKEND_URL in frontend
- [ ] Test all API endpoints
- [ ] Verify image uploads work
- [ ] Check authentication flow
- [ ] Test on production database
- [ ] Set up Cloudinary account
- [ ] Configure CORS for production domains
- [ ] Add error logging
- [ ] Set up monitoring
- [ ] Create backup strategy
- [ ] Document deployment steps

---

## Useful Links

- [Express Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios Documentation](https://axios-http.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## Support Resources

1. **Documentation Files**
   - `PRODUCT_API_DOCUMENTATION.md` - Complete API reference
   - `PRODUCT_SETUP_GUIDE.md` - Quick start guide
   - `COMPLETION_SUMMARY.md` - Project overview

2. **Postman Collection**
   - `Product_API_Postman_Collection.json` - Ready for testing

3. **Code Comments**
   - Check ProductController.js for detailed comments
   - Check productRoute.js for endpoint documentation
   - Check components for React patterns

---

## Version History

- **v1.0** (Current)
  - Complete product CRUD
  - Image upload to Cloudinary
  - Public browsing with filters
  - Vendor dashboard
  - Review system
  - Rating calculations
  - Protected routes
  - Pagination and search

---

## Contact & Support

For questions or issues:

1. Check the documentation files
2. Review code comments
3. Test with Postman collection
4. Check browser console for errors
5. Review backend logs

---

**Last Updated:** January 2024
**Status:** Production Ready ✅
