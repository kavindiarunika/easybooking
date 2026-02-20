import mongoose from "mongoose";

const productVendorAuthSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      unique: false,
    },
    ownerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    otp: { type: String },
    otpExpireAt: { type: Date },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ProductVendorAuth", productVendorAuthSchema);
