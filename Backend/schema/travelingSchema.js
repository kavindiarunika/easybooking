import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    district: { type: String, required: true },
    mainImage: { type: String, required: true },
    mainImagePublicId: { type: String, required: false }, // Cloudinary public_id
    otherimages: { type: [String], default: [] },
    otherimagesPublicIds: { type: [String], default: [] }, // Cloudinary public_ids
  },
  { timestamps: true },
);

export default mongoose.model("TravelPlace", travelSchema);
