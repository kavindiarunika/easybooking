import {
  registervendor,
  sendOtp,
  logincontroller,
  registerByAdmin,
  getAllVendors,
  getVendorById,
  getVendorDetails,
  updateVendor,
  deleteVendor,
  forgotPassword,
  resetPassword,
} from "../controller/VendorController.js";
import express from "express";
import adminAuth from "../middleware/adminAuth.js";

const vendorrouter = express.Router();

vendorrouter.post("/registervendor", registervendor);
vendorrouter.post("/registerByAdmin", adminAuth, registerByAdmin);
vendorrouter.post("/sendotp", sendOtp);
vendorrouter.post("/login", logincontroller);
vendorrouter.post("/forgot-password", forgotPassword);
vendorrouter.post("/reset-password", resetPassword);

// Admin vendor management routes
vendorrouter.get("/all", adminAuth, getAllVendors);
vendorrouter.get("/details/:id", adminAuth, getVendorDetails);
vendorrouter.get("/:id", adminAuth, getVendorById);
vendorrouter.put("/:id", adminAuth, updateVendor);
vendorrouter.delete("/:id", adminAuth, deleteVendor);

export default vendorrouter;
