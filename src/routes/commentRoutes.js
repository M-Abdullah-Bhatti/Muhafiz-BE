const express = require("express");
const {
  getCommentsByPost,
  addCommentOnPost,
} = require("../controller/commentController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");

const commentRouter = express.Router();

commentRouter.post(
  "/addCommentOnPost/:postId",
  isAuthenticatedUser,
  addCommentOnPost
);
commentRouter.get(
  "/getCommentsByPost/:postId",
  isAuthenticatedUser,
  getCommentsByPost
);

module.exports = commentRouter;
