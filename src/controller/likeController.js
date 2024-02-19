const postModel = require("../models/postModel");
const likeModel = require("../models/likeModel");
const {
  createNotification,
  deleteNotification,
} = require("./notificationController");

const addLikesOnPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req?.user?._id;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Check if the user has already liked the post
    const alreadyLiked = await likeModel.findOne({
      post: postId,
      user: userId,
    });

    if (alreadyLiked) {
      // User already liked the post, so remove the like
      await likeModel.findByIdAndDelete(alreadyLiked?._id);

      // Remove like ID from the post's likes array
      post.likes.pull(alreadyLiked._id);

      // Delete the notification if it exists
      await deleteNotification("like", userId, post.user, postId);

      await post.save();

      // Return success message
      return res.status(200).json({
        status: true,
        message: "Like removed from the post",
        data: { likesCount: post.likes.length },
      });
    } else {
      // User hasn't liked the post yet, so add the like
      const newLike = await likeModel.create({
        post: postId,
        user: userId,
      });

      // Add like ID to the post's likes array
      post.likes.push(newLike._id);

      if (post.user.toString() !== userId.toString()) {
        // Create a notification for the post's owner
        await createNotification("like", userId, post.user, postId);
      }

      await post.save();

      // Return success message
      return res.status(200).json({
        status: true,
        message: "Post liked successfully",
        data: { likesCount: post.likes.length },
      });
    }
  } catch (error) {
    console.error("Error toggling like on post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error toggling like on post" });
  }
};

const getLikesByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Find all likes associated with the given postId
    const likes = await likeModel.find({ post: postId });

    // Check if any likes were found
    if (!likes || likes.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No likes found for this post" });
    }

    // Return the likes as a response
    return res.status(200).json({
      message: "Likes found for the post",
      data: likes,
      status: true,
    });
  } catch (error) {
    console.error("Error retrieving likes for post:", error);
    return res
      .status(500)
      .json({ status: false, message: "Error retrieving likes for post" });
  }
};

module.exports = {
  addLikesOnPost,
  getLikesByPost,
};
