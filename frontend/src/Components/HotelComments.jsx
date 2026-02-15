import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App.jsx";
import { FaUser, FaReply, FaTrash } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const HotelComments = ({ hotelId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [showReplyForm, setShowReplyForm] = useState({});
  const [replyMessages, setReplyMessages] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!hotelId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/api/trendingcomments/hotel/${hotelId}`,
        );
        if (response.data.success) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [hotelId]);

  // Handle adding new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {},
      };

      // Add token if available, but don't require it
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/trendingcomments/add`,
        {
          hotelId,
          message: newComment,
        },
        config,
      );

      if (response.data.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment("");
        setSuccess("Comment added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to add comment",
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle adding reply
  const handleAddReply = async (commentId) => {
    const replyMessage = replyMessages[commentId];

    if (!replyMessage?.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {},
      };

      // Add token if available, but don't require it
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/trendingcomments/reply/${commentId}`,
        {
          message: replyMessage,
        },
        config,
      );

      if (response.data.success) {
        // Update the comment with the new reply
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), response.data.reply],
                }
              : comment,
          ),
        );
        setReplyMessages({ ...replyMessages, [commentId]: "" });
        setShowReplyForm({ ...showReplyForm, [commentId]: false });
        setSuccess("Reply added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      setError(
        error.response?.data?.message || error.message || "Failed to add reply",
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle deleting comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {},
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.delete(
        `${BACKEND_URL}/api/trendingcomments/delete/${commentId}`,
        config,
      );

      if (response.data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        setSuccess("Comment deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete comment",
      );
      setTimeout(() => setError(""), 3000);
    }
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-full py-8 px-4">
        <div className="text-center text-white">Loading comments...</div>
      </div>
    );
  }

  return (
    <section className="w-full py-8 px-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
      {/* Header */}
      <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
        <h3 className="text-xl font-bold text-blue-400 inter-regular">
          Guest Comments
        </h3>
        <p className="text-gray-400 inter-regular">
          (Share your experience at this hotel)
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
          {success}
        </div>
      )}

      {/* Add Comment Form */}
      <div className="mb-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h4 className="text-base font-semibold text-white mb-4">
          Add Your Comment
        </h4>
        <form onSubmit={handleAddComment} className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this hotel..."
            className="flex-1 p-3 bg-white/80 text-black border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            rows="2"
          />
          <button
            type="submit"
            className="bg-blue-600 mt-4 hover:bg-blue-700 px-1 py-1 h-12 w-12 text-white rounded-full transition font-semibold flex items-center justify-center gap-2 "
          >
            <IoSend size={18} />
            
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800/30 border border-gray-700 rounded-lg p-6"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {comment.userName || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded transition"
                  title="Delete comment"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>

              {/* Comment Body */}
              <p className="text-gray-200 mb-4 ml-13">{comment.message}</p>

              {/* Reply Button */}
              <button
                onClick={() =>
                  setShowReplyForm({
                    ...showReplyForm,
                    [comment._id]: !showReplyForm[comment._id],
                  })
                }
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition"
              >
                <FaReply className="text-xs" />
                Reply
              </button>

              {/* Reply Form */}
              {showReplyForm[comment._id] && (
                <div className="mt-4 ml-8  p-4 ">
                  <div className="flex gap-3">
                    <textarea
                      value={replyMessages[comment._id] || ""}
                      onChange={(e) =>
                        setReplyMessages({
                          ...replyMessages,
                          [comment._id]: e.target.value,
                        })
                      }
                      placeholder="Write your reply..."
                      className="flex-1 p-2 bg-white/50 text-black rounded focus:outline-none focus:border-blue-500 resize-none text-sm"
                      rows="2"
                    />
                    <button
                      onClick={() => handleAddReply(comment._id)}
                      className="bg-blue-600 text-white text-center mt-2  py-1 px-1 w-12 h-12 rounded-full hover:bg-blue-700 transition text-sm font-semibold flex items-center gap-2 "
                    > 
                      <IoSend size={14} className="ml-3" />
                     
                    </button>
                  </div>
                 
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-3 border-l-2 border-gray-600 pl-4">
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="bg-gray-700/20 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                          <FaUser className="text-white text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {reply.username || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default HotelComments;
