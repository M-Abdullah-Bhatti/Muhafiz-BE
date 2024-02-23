const express = require("express");
const {
  signup,
  signin,
  sendEmail,
  verifyOtp,
  updatePassword,
  getSingleUser,
  updateUser,
} = require("../controller/userController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/sendemail", sendEmail);
userRouter.post("/verifyOtp", verifyOtp);
userRouter.put("/updatePassword/:id", updatePassword);
userRouter.post("/updateUser", isAuthenticatedUser, updateUser);
userRouter.get("/singleUser", isAuthenticatedUser, getSingleUser);

module.exports = userRouter;
