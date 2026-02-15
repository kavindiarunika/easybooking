import TrendingComment from "../schema/trendingCommentSchema.js";

export const addComment = async (req, res) => {
  try {
    const { hotelId, message } = req.body;

    if (!hotelId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(
      "Adding comment - req.user:",
      req.user,
      "req.user_id:",
      req.user_id,
    );

    const newComment = new TrendingComment({
      hotelId,
      userId: req.user_id || null,
      userName: req.user?.name || "Anonymous",
      message,
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      success: true,
      comment: savedComment,
    });
  } catch (error) {
    console.error("Error in addComment:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCommentByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    console.log("Getting comments for hotelId:", hotelId);

    const comments = await TrendingComment.find({ hotelId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error in getCommentByHotel:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    console.log(
      "Adding reply - req.user:",
      req.user,
      "req.user_id:",
      req.user_id,
    );

    const comment = await TrendingComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      userId: req.user_id || null,
      username: req.user?.name || "Anonymous",
      message,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      reply: reply,
    });
  } catch (error) {
    console.error("Error in addReply:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await TrendingComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.userId?.toString() !== req.user_id?.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await TrendingComment.findByIdAndDelete(commentId);

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteComment:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
