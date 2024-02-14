const express = require("express");
const {
  addLikesOnPost,
  getLikesByPost,
} = require("../controller/likeController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");

const likeRouter = express.Router();

likeRouter.post("/addLikesOnPost/:postId", isAuthenticatedUser, addLikesOnPost);
likeRouter.get("/getLikesByPost/:postId", isAuthenticatedUser, getLikesByPost);

module.exports = likeRouter;
