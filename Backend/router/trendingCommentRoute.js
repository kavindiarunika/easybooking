import {
  addComment,
  deleteComment,
} from "../controller/TrendingCommentController.js";
import { getCommentByHotel } from "../controller/TrendingCommentController.js";
import { addReply } from "../controller/TrendingCommentController.js";
import express from "express";
import jwt from "jsonwebtoken";

const trendingcommentrouter = express.Router();

// Optional auth middleware - allows both authenticated and anonymous users
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // If no token provided, it's okay - allow anonymous comments
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user_id = null;
      req.user = { name: "Anonymous", role: "user" };
      return next();
    }

    // If token is provided, verify it
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.JWT_SCRET);

    req.user_id = decoded.id;
    req.user = { name: decoded.name, role: decoded.role };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    // If token is invalid, still allow as anonymous
    req.user_id = null;
    req.user = { name: "Anonymous", role: "user" };
    next();
  }
};

trendingcommentrouter.post("/add", optionalAuthenticate, addComment);
trendingcommentrouter.get("/hotel/:hotelId", getCommentByHotel);
trendingcommentrouter.post("/reply/:commentId", optionalAuthenticate, addReply);
trendingcommentrouter.delete(
  "/delete/:commentId",
  optionalAuthenticate,
  deleteComment,
);

export default trendingcommentrouter;
