const express = require("express");
const {
  getCommentsByPost,
  addCommentOnPost,
} = require("../controller/commentController");
const commentRouter = express.Router();

commentRouter.post("/addCommentOnPost/:postId", addCommentOnPost);
commentRouter.get("/getCommentsByPost/:postId", getCommentsByPost);

module.exports = commentRouter;
