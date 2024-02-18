const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const likeModel = require("../models/likeModel");
const notificationModel = require("../models/notificationModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const newPost = await postModel.create(req.body);
    return res.status(201).json({
      data: newPost,
      status: true,
      message: "Post created successfully!",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate({
        path: "user",
        select: "_id username",
      })
      .populate({
        path: "likes",
        populate: { path: "user", select: "_id username" }, // Populate comments with user details
      })

      .populate({
        path: "comments",
        populate: { path: "user", select: "_id username email" }, // Populate comments with user details
      });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ status: false, message: "No posts found" });
    }

    return res.status(201).json({
      data: posts,
      status: true,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ status: false, message: "No post found" });
    }
    const updatedPost = await postModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    return res.status(200).json({
      data: updatedPost,
      status: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const posts = await postModel.find();
    if (!posts) {
      return res.status(404).json({ status: false, message: "No post found" });
    }

    // Delete likes associated with the post
    await likeModel.deleteMany({ post: postId });

    // Delete comments associated with the post
    await commentModel.deleteMany({ post: postId });

    // Delete notifications associated with the post
    await notificationModel.deleteMany({ post: postId });

    // Delete the post itself
    const deletedPost = await postModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post and related data:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting post and related data" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
};
