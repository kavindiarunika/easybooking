import vendor from "../schema/VendorAuth.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import TrendingModel from "../schema/trendingScehema.js";
import TravelPlace from "../schema/travelingSchema.js";
import Vehicle from "../schema/vehicleSchema.js";

/* ======================================================
   GET ALL VENDORS (ADMIN)
====================================================== */
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await vendor.find().select("-password -otp -otpExpireAt");
    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    console.error("Get All Vendors Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   GET SINGLE VENDOR (ADMIN)
====================================================== */
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorData = await vendor.findById(id).select("-password -otp -otpExpireAt");
    
    if (!vendorData) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    
    res.status(200).json({
      success: true,
      vendor: vendorData,
    });
  } catch (error) {
    console.error("Get Vendor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   GET VENDOR DETAILS WITH LISTINGS (ADMIN)
====================================================== */
export const getVendorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorData = await vendor.findById(id).select("-password -otp -otpExpireAt");
    
    if (!vendorData) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Fetch associated listings based on vendor ID
    let listings = {
      stays: [],
      travelPlaces: [],
      vehicles: [],
    };

    try {
      // Get stays/trending listings
      const staysData = await TrendingModel.find({ vendorId: id });
      listings.stays = staysData;
    } catch (err) {
      console.log("No stays found for vendor");
    }

    try {
      // Get travel places
      const travelData = await TravelPlace.find({ vendorId: id });
      listings.travelPlaces = travelData;
    } catch (err) {
      console.log("No travel places found for vendor");
    }

    try {
      // Get vehicles
      const vehicleData = await Vehicle.find({ vendorId: id });
      listings.vehicles = vehicleData;
    } catch (err) {
      console.log("No vehicles found for vendor");
    }

    // Calculate statistics
    const stats = {
      totalStays: listings.stays.length,
      totalTravelPlaces: listings.travelPlaces.length,
      totalVehicles: listings.vehicles.length,
      totalListings: listings.stays.length + listings.travelPlaces.length + listings.vehicles.length,
    };

    res.status(200).json({
      success: true,
      vendor: vendorData,
      listings,
      stats,
    });
  } catch (error) {
    console.error("Get Vendor Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   UPDATE VENDOR (ADMIN)
====================================================== */
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, password, category, isVerified } = req.body;

    const vendorData = await vendor.findById(id);
    if (!vendorData) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (email) vendorData.email = email;
    if (phone) vendorData.phone = phone;
    if (category) vendorData.category = category;
    if (typeof isVerified === "boolean") vendorData.isVerified = isVerified;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      vendorData.password = hashedPassword;
    }

    await vendorData.save();

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
    });
  } catch (error) {
    console.error("Update Vendor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   DELETE VENDOR (ADMIN)
====================================================== */
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendorData = await vendor.findByIdAndDelete(id);
    if (!vendorData) {
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
    console.error("Delete Vendor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const registerByAdmin = async (req, res) => {
  try {
    const { email, phone, password, category } = req.body;

    if (!email || !phone || !password || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exisitingVendor = await vendor.findOne({ email });

    if (exisitingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor already registered",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newVendor = new vendor({
      email,
      phone,
      password: hashedpassword,
      category,
      isVerified: true,
    });
    await newVendor.save();
    res.status(201).json({
      success: true,
      message: "Vendor registered successfully by admin",
    });
  } catch (error) {
    console.error("Register Vendor Error:", error);
  }
};

/* ======================================================
   EMAIL HELPER
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
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });
};

/* ======================================================
   REGISTER VENDOR (NO DEMO CREATED HERE)
====================================================== */
export const registervendor = async (req, res) => {
  try {
    const { email, phone, country, district, city, password, category, hotelName, hotelType, vehicleType, packageName } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, phone and password are required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor already registered",
      });
    }

    // Auto-verify vendor on registration (no OTP flow)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use hotelName as the category (stores the selected option like car, van, restaurant, villas, houses, hotels, etc.)
    const vendorCategory = hotelName || category || "stays";

    const newVendor = new vendor({
      email,
      phone,
      country: country || "",
      district: district || "",
      city: city || "",
      hotelName: packageName || "",
      hotelType: hotelType || "",
      vehicleType: vehicleType || "",
      password: hashedPassword,
      category: vendorCategory,
      isVerified: true,
    });

    await newVendor.save();

    // Create JWT token so vendor is authenticated immediately after registration
    const token = jwt.sign(
      {
        id: newVendor._id,
        email: newVendor.email,
        role: "vendor",
        category: vendorCategory,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      category: vendorCategory,
    });
  } catch (error) {
    console.error("Register Vendor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   VERIFY OTP + CREATE DEMO PROFILE (ONLY ONCE)
====================================================== */
export const sendOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (existingVendor.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Already verified",
      });
    }

    if (existingVendor.otp !== otp || new Date() > existingVendor.otpExpireAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ VERIFY USER
    existingVendor.isVerified = true;
    existingVendor.otp = undefined;
    existingVendor.otpExpireAt = undefined;
    await existingVendor.save();

    const placeholderImage =
      "https://via.placeholder.com/800x600?text=Update+Your+Details";

    // NOTE: Demo profile creation is disabled. Only admins are allowed to create actual profiles for vendors.
    // Send a clear response informing the vendor that verification succeeded but an admin will set up their profile.
    return res.status(200).json({
      success: true,
      message:
        "OTP verified. Your account is verified — an admin will create your profile based on your category.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   LOGIN VENDOR
====================================================== */
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (!existingVendor.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, existingVendor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: existingVendor._id,
        email: existingVendor.email,
        role: "vendor",
        category: existingVendor.category,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      category: existingVendor.category,
    });
  } catch (error) {
    console.error("Vendor Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   FORGOT PASSWORD - SEND OTP
====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    existingVendor.otp = otp;
    existingVendor.otpExpireAt = otpExpireAt;
    await existingVendor.save();

    // Send OTP email
    try {
      await sendPasswordResetEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Still return success since OTP is saved - user can try again or admin can check
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   RESET PASSWORD - VERIFY OTP & UPDATE PASSWORD
====================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Verify OTP
    if (existingVendor.otp !== otp || new Date() > existingVendor.otpExpireAt) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingVendor.password = hashedPassword;
    existingVendor.otp = undefined;
    existingVendor.otpExpireAt = undefined;
    await existingVendor.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================================================
   PASSWORD RESET EMAIL HELPER
====================================================== */
const sendPasswordResetEmail = async (email, otp) => {
  try {
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
      subject: "Password Reset OTP - EasyBooking",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666;">You requested to reset your password. Use the OTP below to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #4F46E5; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log("Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
};
