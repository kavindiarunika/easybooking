import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Price: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  discrict: { type: String, required: true },
  passagngers: { type: Number },
  facilities: { type: [String] },
  mainImage: { type: String, required: true },
  mainImagePublicId: { type: String, required: false }, // Cloudinary public_id
  otherImages: { type: [String] },
  otherImagesPublicIds: { type: [String], required: false }, // Cloudinary public_ids
  whatsapp: { type: String, required: true },
  ownerEmail: { type: String },
});

const vehicle = mongoose.model("VehicleRent", vehicleSchema);
export default vehicle;
