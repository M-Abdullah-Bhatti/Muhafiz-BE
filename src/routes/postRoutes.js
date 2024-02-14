const express = require("express");
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
} = require("../controller/postController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const postRouter = express.Router();

postRouter.post("/createPost", isAuthenticatedUser, createPost);
postRouter.get("/allPosts", isAuthenticatedUser, getAllPosts);
postRouter.put("/updatePost/:postId", isAuthenticatedUser, updatePost);
postRouter.delete("/deletePost/:postId", isAuthenticatedUser, deletePost);

module.exports = postRouter;
