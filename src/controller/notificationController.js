const notificationModel = require("../models/notificationModel");

const getAllNotificationsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await notificationModel
      .find({ recipient: userId })
      .sort({
        createdAt: -1,
      }); // Get most recent notifications first

    return res.json({
      status: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ status: false, message: "Notification not found" });
    }

    return res.json({
      status: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllNotificationsForUser,
  markNotificationAsRead,
};
