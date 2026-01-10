import vendor from "../schema/VendorAuth.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import TrendingModel from "../schema/trendingScehema.js";
import TravelPlace from "../schema/travelingSchema.js";
import Vehicle from "../schema/vehicleSchema.js";

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
    const { email, password, category } = req.body;

    if (!email || !password || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingVendor = await vendor.findOne({ email });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newVendor = new vendor({
      email,
      password: hashedPassword,
      category,
      otp,
      otpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    await newVendor.save();
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to email.",
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

    if (
      existingVendor.otp !== otp ||
      new Date() > existingVendor.otpExpireAt
    ) {
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

    /* ================= CREATE DEMO PROFILE ================= */
    if (existingVendor.category === "stays") {
      const exists = await TrendingModel.findOne({
        ownerEmail: email,
      });

      if (!exists) {
        await TrendingModel.create({
          ownerEmail: email,
          name: "Your Hotel Name",
          description: "Add your hotel description",
          category: "villa",
          district: "",
          location: "",
          price: 0,
          rating: 5,
          highlights: "",
          address: "",
          contact: "",
          mainImage: placeholderImage,
          otherimages: [],
          isDemo: true,
        });
      }
    }

    if (existingVendor.category === "ontrip") {
      const exists = await TravelPlace.findOne({
        ownerEmail: email,
      });

      if (!exists) {
        await TravelPlace.create({
          ownerEmail: email,
          name: "Your Trip Name",
          description: "Add trip details",
          district: "",
          mainImage: placeholderImage,
          otherimages: [],
          isDemo: true,
        });
      }
    }

    if (existingVendor.category === "vehicle_rent") {
      const exists = await Vehicle.findOne({
        ownerEmail: email,
      });

      if (!exists) {
        await Vehicle.create({
          ownerEmail: email,
          name: "Your Vehicle Name",
          Price: 0,
          type: "",
          description: "Add vehicle details",
          discrict: "",
          passagngers: 0,
          facilities: [],
          mainImage: placeholderImage,
          otherImages: [],
          whatsapp: "",
          isDemo: true,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified and demo profile created",
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

    const isMatch = await bcrypt.compare(
      password,
      existingVendor.password
    );

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
