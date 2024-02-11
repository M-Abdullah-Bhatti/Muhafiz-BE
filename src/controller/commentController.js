const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");

// Add a comment to a post
const addComment = async (req, res) => {
  const { postId } = req.query;

  try {
    const newComment = commentModel.create(req.body);

    // Optionally, add the comment to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      data: newComment,
      status: true,
      message: "Comment added successfully!",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.query;

  try {
    const comments = await commentModel.find({ post: postId });
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }
    res.status(201).json({
      data: comments,
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
};
