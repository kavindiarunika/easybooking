import express from "express";
import {
  registerProductVendor,
  loginProductVendor,
  getProductVendorProfile,
  updateProductVendorProfile,
} from "../controller/ProductVendorController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/register", registerProductVendor);
router.post("/login", loginProductVendor);

// Protected routes
router.get("/profile", verifyToken, getProductVendorProfile);
router.put("/profile/update", verifyToken, updateProductVendorProfile);

export default router;
