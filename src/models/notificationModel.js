const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  // Reference to the user who will receive the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Reference to the user who caused the notification to be created
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Type of notification (like, comment)
  type: {
    type: String,
    required: true,
    enum: ["like", "comment"],
  },
  // Reference to the post that the notification is about
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  // Whether the notification has been read
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Timestamp for when the notification was created
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", NotificationSchema);
