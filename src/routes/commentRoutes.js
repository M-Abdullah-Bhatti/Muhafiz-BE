const express = require("express");
const {
  addComment,
  getCommentsByPost,
} = require("../controller/commentController");
const commentRouter = express.Router();

commentRouter.post("/createPost", addComment);
commentRouter.get("/allPosts", getCommentsByPost);

module.exports = commentRouter;
