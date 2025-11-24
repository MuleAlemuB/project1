import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// @desc Get all notifications for Admin
export const getNotifications = asyncHandler(async (req, res) => {
  try {
    // ✅ Fetch only notifications meant for Admin
    const notifications = await Notification.find({ recipientRole: "Admin" })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Mark notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.seen = true;
  await notification.save();

  res.json({
    message: "Notification marked as read",
    notification,
  });
});

// @desc Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  await notification.deleteOne();
  res.json({ message: "Notification deleted successfully" });
});
