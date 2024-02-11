const express = require("express");
const { createContact } = require("../controller/contactController");
const userRouter = express.Router();

userRouter.post("/createContact", createContact);
// userRouter.post("/signin", signin);
// userRouter.post("/sendemail", sendEmail);
// userRouter.post("/verifyOtp", verifyOtp);
// userRouter.put("/updatePassword/:id", updatePassword);

module.exports = userRouter;
