const express = require("express");
const {} = require("../middleware/authMiddleware");
const {
  getAllNotificationsForUser,
  markNotificationAsRead,
} = require("../controller/notificationController");

const notificationRouter = express.Router();

notificationRouter.get("/notifications/:userId", getAllNotificationsForUser);
notificationRouter.patch(
  "/notifications/read/:notificationId",
  markNotificationAsRead
);

module.exports = notificationRouter;
