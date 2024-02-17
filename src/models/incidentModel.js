const mongoose = require("mongoose");

const IncidentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Theft, Robbery, Assault and Cyber crime
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
      type: String,
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
