const postModel = require("../models/postModel");
const likeModel = require("../models/likeModel");
const { createNotification } = require("./notificationController");

const addLikesOnPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.body.userId;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    const alreadyLiked = postModel.likes.includes(userId);
    if (alreadyLiked) {
      // User already liked the post, so remove the like
      post.likes.pull(userId); // Mongoose pull to remove from array
    } else {
      // User hasn't liked the post yet, so add the like
      post.likes.push(userId);
      // Create a notification for the post's owner
      if (post) {
        await createNotification("like", userId, post.user, postId);
      }
    }

    await post.save();

    return res.status(200).json({
      status: true,
      message: alreadyLiked
        ? "Like removed from the post"
        : "Post liked successfully",
      data: { likesCount: post.likes.length },
    });
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
