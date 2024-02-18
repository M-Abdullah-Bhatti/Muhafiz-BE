const postModel = require("../models/postModel");
const commentModel = require("../models/commentModel");
const { createNotification } = require("./notificationController");

// Add a comment to a post
const addCommentOnPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req?.user?._id;
  const { text } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    const newComment = await commentModel.create({
      post: postId,
      user: userId,
      text: text,
    });

    // Optionally, add the comment to the post's comments array
    await postModel.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    //  create a notification for the post's owner
    if (post && post.user.toString() !== userId.toString()) {
      await createNotification("comment", userId, post.user, postId);
    }

    return res.status(201).json({
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
  const { postId } = req.params;

  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    const comments = await commentModel.find({ post: postId });
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }
    return res.status(201).json({
      data: comments,
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  addCommentOnPost,
  getCommentsByPost,
};
