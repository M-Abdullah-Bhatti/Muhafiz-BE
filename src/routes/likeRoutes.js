const express = require("express");
const {
  addLikesOnPost,
  getLikesByPost,
} = require("../controller/likeController");

const likeRouter = express.Router();

likeRouter.post("/addLikesOnPost/:postId", addLikesOnPost);
likeRouter.get("/getLikesByPost/:postId", getLikesByPost);

module.exports = likeRouter;
