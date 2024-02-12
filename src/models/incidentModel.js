const mongoose = require("mongoose");

const IncidentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // theft, robbery and assault
    category: {
      type: String,
      require: true,
    },

    // item details
    stolenItem: {
      type: String,
      require: false,
    },
    productName: {
      type: String,
      require: false,
    },
    IMEINumbers: {
      type: String,
      require: false,
    },

    // incident details
    name: {
      type: String,
      require: false,
    },
    dateAndTime: {
      type: Date,
      require: false,
    },
    location: {
      type: String,
      require: false,
    },
    description: {
      type: String,
      require: false,
    },
    image: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", IncidentSchema);
