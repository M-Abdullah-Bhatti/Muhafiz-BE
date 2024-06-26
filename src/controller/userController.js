"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const forgotpasswordModel = require("../models/forgotpassword");
const ObjectId = require("mongoose").Types.ObjectId;

const transporter = require("../middleware/mail");

const SECRET_KEY = "FITGURUAPI";

const signup = async (req, res) => {
  const { username, email, password, confirmPassword, cnic, address } =
    req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password doesnot matches" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,

      cnic: parseInt(cnic),
      address: address,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET_KEY);
    res
      .status(201)
      .json({ user: result, token: token, message: "Account is Created" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: false, message: "invalid username or passowrd" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(404)
        .json({ status: false, message: "invalid username or passowrd" });
    }

    if (existingUser.role == "admin") {
      return res
        .status(404)
        .json({ status: false, message: "Can't access to this account" });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        name: existingUser.username,
        id: existingUser._id,
      },
      SECRET_KEY
    );
    res.status(200).json({
      status: true,
      user: existingUser,
      token: token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log("🚀 ~ file: userController.js:47 ~ signin ~ error:", error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};

const adminLogin = async (req, res) => {
  const { departmentName, password } = req.body;

  try {
    const existingUser = await userModel.findOne({
      departmentName: departmentName,
    });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: false, message: "invalid departmentName or passowrd" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(404)
        .json({ status: false, message: "invalid departmentName or passowrd" });
    }

    if (existingUser.role != "admin") {
      return res
        .status(404)
        .json({ status: false, message: "Can't access to this account" });
    }

    const token = jwt.sign(
      {
        email: existingUser.email,
        name: existingUser.username,
        id: existingUser._id,
      },
      SECRET_KEY
    );
    console.log("existingUser: ", existingUser);
    res.status(200).json({
      status: true,
      user: existingUser,
      token: token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log("🚀 ~ file: userController.js:47 ~ signin ~ error:", error);
    res.status(500).json({ status: false, message: "something went wrong" });
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      throw "No user found with this email Do you have an Account?";
    }

    const existingOtp = await forgotpasswordModel.findOne({
      userId: existingUser._id,
    });

    if (existingOtp) {
      await forgotpasswordModel.deleteMany({ userId: existingOtp.userId });
    }

    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    //send mail to user
    const info = await transporter.sendMail({
      from: "husamiya123@gmail.com",
      to: email,
      subject: "Reset Password",
      text: "Your Otp for Muhafiz",
      html: `Your otp is <b>${otp}</b> enter in Muhafiz`,
    });

    const newOtp = new forgotpasswordModel({
      userId: existingUser._id,
      otp: hashedOtp,
    });
    const saveOtp = await newOtp.save();

    if (!saveOtp) {
      throw "somthing went wrong";
    }

    res
      .status(200)
      .json({ message: "Otp send check your Email", details: saveOtp });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;
  console.log(
    "🚀 ~ file: userController.js:116 ~ verifyOtp ~ req.body:",
    req.body
  );
  try {
    const existingOtp = await forgotpasswordModel.findOne({ userId: userId });

    if (!existingOtp) {
      throw "No record Found";
    }

    const matchOtp = await bcrypt.compare(otp, existingOtp.otp);

    if (!matchOtp) {
      throw "Wrong Otp";
    }
    res.status(200).json({ message: "Verified" });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const updatePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  console.log(
    "🚀 ~ file: userController.js:138 ~ updatePassword ~ req.body:",
    req.body
  );
  try {
    const existingUser = await userModel.findById({ _id: req.params.id });

    if (!existingUser) {
      throw "No User found";
    }

    if (password !== confirmPassword) {
      throw "Password Does Matches";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await userModel.updateOne(
      { _id: req.params.id },
      { password: hashedPassword }
    );

    if (updateUser) {
      res.status(200).json({ message: "Password changed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a post
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.user, req.body, {
      new: true,
    });
    return res.status(200).json({
      data: updatedUser,
      status: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signup,
  signin,
  adminLogin,
  sendEmail,
  verifyOtp,
  updatePassword,
  getSingleUser,
  updateUser,
};
