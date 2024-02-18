const express = require("express");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const {
  getAllNotificationsForUser,
  markNotificationAsRead,
} = require("../controller/notificationController");

const notificationRouter = express.Router();

notificationRouter.get(
  "/getAllNotificationsForUser/:userId",
  isAuthenticatedUser,
  getAllNotificationsForUser
);
notificationRouter.patch(
  "/markNotificationAsRead/:notificationId",
  isAuthenticatedUser,
  markNotificationAsRead
);

module.exports = notificationRouter;
