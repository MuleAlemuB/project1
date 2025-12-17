import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";

// Get Admin notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientRole: "Admin" })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  notification.seen = true;
  await notification.save();
  res.json(notification);
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  await notification.deleteOne();
  res.json({ message: "Notification deleted successfully" });
});

// Update Leave Request status & notification
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  leave.status = req.body.status.toLowerCase();
  await leave.save();

  // Update the corresponding notification
  await Notification.findOneAndUpdate(
    { leaveRequestId: leave._id },
    { status: leave.status }
  );

  res.json({ leave });
});

// Update Requisition status & notification
export const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const requisition = await Requisition.findById(req.params.id);
  if (!requisition) {
    res.status(404);
    throw new Error("Requisition not found");
  }

  requisition.status = req.body.status.toLowerCase();
  await requisition.save();

  // Update the corresponding notification
  await Notification.findOneAndUpdate(
    { reference: requisition._id },
    { status: requisition.status }
  );

  res.json({ requisition });
});
