import express from "express";
import {
  registerProductVendor,
  loginProductVendor,
  getProductVendorProfile,
  updateProductVendorProfile,
  getAllProductVendors,
  updateProductVendorByAdmin,
  deleteProductVendor,
  changeProductVendorPassword,
  forgotPasswordRequest,
  resetPasswordWithOTP,
} from "../controller/ProductVendorController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/register", registerProductVendor);
router.post("/login", loginProductVendor);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password", resetPasswordWithOTP);

// Admin: list all product vendors
router.get("/all", verifyToken, getAllProductVendors);

// Admin: update vendor by ID
router.put("/update/:id", verifyToken, updateProductVendorByAdmin);

// Admin: delete vendor by ID
router.delete("/delete/:id", verifyToken, deleteProductVendor);

// Admin: change vendor password
router.put("/change-password/:id", verifyToken, changeProductVendorPassword);

// Protected routes
router.get("/profile", verifyToken, getProductVendorProfile);
router.put("/profile/update", verifyToken, updateProductVendorProfile);

export default router;
