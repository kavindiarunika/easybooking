import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import VehicleAuth from "../schema/vehicleAuth.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerVehicle = async (req, res) => {
  try {
    let { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    email = email.toLowerCase();

    const existing = await VehicleAuth.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new VehicleAuth({ email, password: hashed, name });
    await user.save();
    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("Vehicle registration error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginVehicle = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const user = await VehicleAuth.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, email: user.email, role: "vehicle" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({
      success: true,
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Vehicle login error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// profile endpoint returns current vehicle user information
export const getVehicleProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = req.user;
    const user = await VehicleAuth.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   FORGOT PASSWORD - SEND OTP
====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const existing = await VehicleAuth.findOne({ email: email.toLowerCase() });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);
    existing.otp = otp;
    existing.otpExpireAt = otpExpireAt;
    await existing.save();

    try {
      await sendPasswordResetEmail(email, otp);
    } catch (emailErr) {
      console.error("Email error", emailErr);
    }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ======================================================
   RESET PASSWORD - VERIFY OTP & UPDATE PASSWORD
====================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, OTP and new password are required",
        });
    }
    const existing = await VehicleAuth.findOne({ email: email.toLowerCase() });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (existing.otp !== otp || new Date() > existing.otpExpireAt) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    existing.password = hashed;
    existing.otp = undefined;
    existing.otpExpireAt = undefined;
    await existing.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* helper to send OTP email */
const sendPasswordResetEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Vehicle user password reset OTP - EasyBooking",
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });
    console.log("Password reset email sent to", email);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    throw err;
  }
};
