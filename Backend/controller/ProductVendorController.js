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

// Update Product Vendor by Admin
export const updateProductVendorByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessName, ownerName, email, phone } = req.body;

    // Validation
    if (!businessName || !ownerName || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide required fields (businessName, ownerName, email)",
      });
    }

    // Check if email is already in use by another vendor
    const existingVendor = await ProductVendorAuth.findOne({
      email,
      _id: { $ne: id },
    });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another vendor",
      });
    }

    const vendor = await ProductVendorAuth.findByIdAndUpdate(
      id,
      { businessName, ownerName, email, phone },
      { new: true },
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Update vendor error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vendor",
      error: error.message,
    });
  }
};

// Delete Product Vendor
export const deleteProductVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await ProductVendorAuth.findByIdAndDelete(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Delete vendor error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting vendor",
      error: error.message,
    });
  }
};

// Change Product Vendor Password (by Admin)
export const changeProductVendorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await ProductVendorAuth.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// Request Password Reset - Send OTP to email
export const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email address",
      });
    }

    // Check if vendor exists
    const vendor = await ProductVendorAuth.findOne({ email });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    vendor.resetOTP = otp;
    vendor.resetOTPExpiry = otpExpiry;
    await vendor.save();

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your_email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your_app_password",
      },
    });

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: email,
      subject: "Password Reset OTP - SmartsBooking",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password on SmartsBooking.</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
        return res.status(500).json({
          success: false,
          message: "Error sending OTP email",
          error: error.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing password reset request",
      error: error.message,
    });
  }
};

// Verify OTP and Reset Password
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP, and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find vendor
    const vendor = await ProductVendorAuth.findOne({ email });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Check OTP
    if (!vendor.resetOTP || vendor.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (!vendor.resetOTPExpiry || new Date() > vendor.resetOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    vendor.password = hashedPassword;
    vendor.resetOTP = null;
    vendor.resetOTPExpiry = null;
    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};
