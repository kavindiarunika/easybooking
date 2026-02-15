import mongoose from "mongoose";

const replaySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  message: String,
  createAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  message: String,
  replies: [replaySchema],
  createAt: { type: Date, default: Date.now },
});

const TrendingComment = mongoose.model("TrendingComment", commentSchema);

export default TrendingComment;
