import express from "express";
import {
  registerProductVendor,
  loginProductVendor,
  getProductVendorProfile,
  updateProductVendorProfile,
  getAllProductVendors,
  requestPasswordReset,
  confirmPasswordReset,
  deleteProductVendor,
} from "../controller/ProductVendorController.js";
import verifyToken from "../middleware/verifyToken.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/register", registerProductVendor);
router.post("/login", loginProductVendor);
router.post("/request-password-reset", requestPasswordReset);
router.post("/confirm-password-reset", confirmPasswordReset);
router.delete("/:id", adminAuth, deleteProductVendor);

// Admin: list all product vendors
router.get("/all", verifyToken, getAllProductVendors);

// Protected routes
router.get("/profile", verifyToken, getProductVendorProfile);
router.put("/profile/update", verifyToken, updateProductVendorProfile);

export default router;
