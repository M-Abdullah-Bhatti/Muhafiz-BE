const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: true,
    },
    confirmPassword: {
      type: String,
      require: false,
    },

    cnic: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      require: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
