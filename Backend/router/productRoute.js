import express from "express";
import {
  addProduct,
  getVendorProducts,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addReview,
  toggleProductStatus,
  getProductStats,
} from "../controller/ProductController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import fileUpload from "express-fileupload";

const productRouter = express.Router();

// Use fileUpload middleware for product routes
productRouter.use(fileUpload());

// Public routes
productRouter.get("/all", getAllProducts);
productRouter.get("/details/:id", getProductById);

// Protected routes (require vendor authentication)
productRouter.post("/add", verifyToken, addProduct);
productRouter.get("/vendor/products", verifyToken, getVendorProducts);
productRouter.put("/update/:id", verifyToken, updateProduct);
productRouter.delete("/delete/:id", verifyToken, deleteProduct);
productRouter.post("/review/:id", addReview);
productRouter.patch("/toggle/:id", verifyToken, toggleProductStatus);
productRouter.get("/vendor/stats", verifyToken, getProductStats);

export default productRouter;
