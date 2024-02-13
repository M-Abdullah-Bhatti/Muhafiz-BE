const postModel = require("../models/postModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const newPost = await postModel.create(req.body);
    res.status(201).json({
      data: newPost,
      status: true,
      message: "Post created successfully!",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }
    res.status(201).json({
      data: posts,
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res
        .status(400)
        .json({ status: false, message: "Insufficient details" });
    }
    const updatedPost = await postModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.status(200).json({
      data: posts,
      status: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
};
