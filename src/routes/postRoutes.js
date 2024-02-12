const express = require("express");
const {
  createPost,
  getAllPosts,
  updatePost,
} = require("../controller/postController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const postRouter = express.Router();

postRouter.post("/createPost", isAuthenticatedUser, createPost);
postRouter.get("/allPosts", isAuthenticatedUser, getAllPosts);
postRouter.put("/updatePost", isAuthenticatedUser, updatePost);

module.exports = postRouter;
