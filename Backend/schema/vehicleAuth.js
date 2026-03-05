import mongoose from "mongoose";

const vehicleAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  otp: { type: String },
  otpExpireAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const VehicleAuth = mongoose.model("VehicleAuth", vehicleAuthSchema);
export default VehicleAuth;
