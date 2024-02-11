const express = require("express");
const {
  createPost,
  getAllPosts,
  updatePost,
} = require("../controller/postController");
const postRouter = express.Router();

postRouter.post("/createPost", createPost);
postRouter.get("/allPosts", getAllPosts);
postRouter.put("/updatePost", updatePost);

module.exports = postRouter;
