import mongoose from "mongoose";

const safariSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    adventures: { type: [String], required: true },
    category: { type: String, required: true },
    type:{ type: [String], required: true },
    includeplaces: { type: [String], required: true },
    TeamMembers: { type: Number, required: true },
    whatsapp: { type: String, required: true },
    totalDays: { type: Number, required: true },
    email: { type: String, required: true },
    mainImage: { type: String, required: true },
    otherimages: { type: [String] },
    shortvideo: { type: String },
    VehicleType: { type: String, required: true },
    vehicleImage: { type: [String], required: true },
    GuiderName: { type: String, required: true },
    GuiderImage: { type: String, required: true },
    GuiderExperience: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const safari = mongoose.model("safari", safariSchema);
export default safari;
