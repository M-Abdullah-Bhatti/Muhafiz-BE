const express = require("express");
const {
  createContact,
  getSingleContact,
  getAllMyContacts,
} = require("../controller/contactController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/createContact", isAuthenticatedUser, createContact);
userRouter.get("/getAllMyContacts", isAuthenticatedUser, getAllMyContacts);
userRouter.get("/getSingleContact", isAuthenticatedUser, getSingleContact);

module.exports = userRouter;
