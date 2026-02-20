import ProductVendorAuth from "../schema/ProductVendorAuth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// Register Product Vendor
export const registerProductVendor = async (req, res) => {
  try {
    const { businessName, ownerName, email, phone, password } = req.body;

    // Validation
    if (!businessName || !ownerName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if vendor already exists
    const existingVendor = await ProductVendorAuth.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor
    const newVendor = new ProductVendorAuth({
      businessName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
    });

    await newVendor.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: newVendor.email, vendorId: newVendor._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Product vendor registered successfully",
      vendorToken: token,
      vendor: {
        id: newVendor._id,
        email: newVendor.email,
        businessName: newVendor.businessName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering vendor",
      error: error.message,
    });
  }
};

// Login Product Vendor
export const loginProductVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Check if vendor exists
    const vendor = await ProductVendorAuth.findOne({ email });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if vendor is active
    if (!vendor.isActive) {
      return res.status(401).json({
        success: false,
        message: "Vendor account is inactive",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: vendor.email, vendorId: vendor._id },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      vendorToken: token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        businessName: vendor.businessName,
        totalProducts: vendor.totalProducts,
        rating: vendor.rating,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

// Get Product Vendor Profile
export const getProductVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const vendor =
      await ProductVendorAuth.findById(vendorId).select("-password");
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// Update Product Vendor Profile
export const updateProductVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user?.vendorId;
    if (!vendorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { businessName, ownerName, phone } = req.body;

    const vendor = await ProductVendorAuth.findByIdAndUpdate(
      vendorId,
      { businessName, ownerName, phone },
      { new: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Get all product vendors (admin)
export const getAllProductVendors = async (req, res) => {
  try {
    const vendors = await ProductVendorAuth.find().select("-password");
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    console.error("Get All Product Vendors Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   EMAIL HELPER FOR PRODUCT VENDOR
====================================================== */
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset code is ${otp}. It is valid for 10 minutes.`,
  });
};

/* ======================================================
   REQUEST PASSWORD RESET (sends OTP)
   POST /api/product-vendor/request-password-reset
====================================================== */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const vendor = await ProductVendorAuth.findOne({ email });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    vendor.otp = otp;
    vendor.otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await vendor.save();

    await sendOtpEmail(email, otp);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   CONFIRM PASSWORD RESET (verify OTP + set new password)
   POST /api/product-vendor/confirm-password-reset
====================================================== */
export const confirmPasswordReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, otp and newPassword are required",
      });
    }

    const vendor = await ProductVendorAuth.findOne({ email });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    if (!vendor.otp || !vendor.otpExpireAt) {
      return res
        .status(400)
        .json({ success: false, message: "No reset requested or OTP expired" });
    }

    if (vendor.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(vendor.otpExpireAt)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    vendor.password = hashed;
    vendor.otp = undefined;
    vendor.otpExpireAt = undefined;
    await vendor.save();

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset" });
  } catch (error) {
    console.error("Confirm Password Reset Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   DELETE PRODUCT VENDOR (ADMIN)
   DELETE /api/product-vendor/:id
====================================================== */
export const deleteProductVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendorData = await ProductVendorAuth.findByIdAndDelete(id);
    if (!vendorData) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Product vendor deleted successfully" });
  } catch (error) {
    console.error("Delete Product Vendor Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
