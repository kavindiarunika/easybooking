import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Price: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  // corrected spelling
  district: { type: String, required: true },
  passagngers: { type: Number },
  facilities: { type: [String] },
  mainImage: { type: String, required: true },
  mainImageId: { type: String },
  otherImages: { type: [String] },
  otherImagesIds: { type: [String] },
  whatsapp: { type: String, required: true },
  ownerEmail: { type: String },
});

const vehicle = mongoose.model("VehicleRent", vehicleSchema);
export default vehicle;
