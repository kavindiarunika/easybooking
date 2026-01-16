import TrendingModel from "../schema/trendingScehema.js";
import jwt from "jsonwebtoken";

export const getProfile = async (req, res) => {
  try {
    let ownerEmail = req.query.ownerEmail;

    // fallback: try to get from Bearer token
    if (!ownerEmail) {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded && decoded.email) ownerEmail = decoded.email;
        } catch (e) {
          // ignore
        }
      }
    }

    if (!ownerEmail)
      return res
        .status(400)
        .json({
          success: false,
          message: "ownerEmail query param or Bearer token required",
        });

    const doc = await TrendingModel.findOne({ ownerEmail });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });

    return res.json(doc);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
