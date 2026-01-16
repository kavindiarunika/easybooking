import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    district: { type: String, required: true },
    mainImage: { type: String, required: true },
    otherimages: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("TravelPlace", travelSchema);
