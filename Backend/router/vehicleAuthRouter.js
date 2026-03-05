import express from "express";
import {
  registerVehicle,
  loginVehicle,
  getVehicleProfile,
  forgotPassword,
  resetPassword,
} from "../controller/vehicleAuthController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// register new vehicle account
router.post("/register", registerVehicle);
// login existing vehicle account
router.post("/login", loginVehicle);
// forgot/reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// get profile of authenticated vehicle user
router.get("/me", verifyToken, getVehicleProfile);

export default router;
