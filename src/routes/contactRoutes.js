const express = require("express");
const {
  createContact,
  getAllContacts,
  getSingleContact,
} = require("../controller/contactController");
const userRouter = express.Router();

userRouter.post("/createContact", createContact);
userRouter.get("/getAllContacts", getAllContacts);
userRouter.get("/getSingleContact", getSingleContact);
// userRouter.post("/signin", signin);
// userRouter.post("/sendemail", sendEmail);
// userRouter.post("/verifyOtp", verifyOtp);
// userRouter.put("/updatePassword/:id", updatePassword);

module.exports = userRouter;
