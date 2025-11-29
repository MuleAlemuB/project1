// backend/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import Vacancy from "../models/Vacancy.js";

// ---------------- Get all notifications (Admin only) ----------------
export const getAllNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  if (role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const notifications = await Notification.find({ recipientRole: { $regex: /^admin$/i } })
    .sort({ createdAt: -1 })
    .populate("leaveRequestId")   // populate leave requests
    .populate("reference");       // populate requisitions if ObjectId

  res.json(notifications);
});

// ---------------- Get notifications for logged-in user ----------------
export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user.role.toLowerCase();

  if (!["admin", "departmenthead", "employee"].includes(role)) {
    res.status(403);
    throw new Error("User role not authorized to view notifications");
  }

  let notifications;

  if (role === "admin") {
    notifications = await Notification.find({ recipientRole: { $regex: /^admin$/i } })
      .sort({ createdAt: -1 })
      .populate("leaveRequestId")
      .populate("reference");
  } else if (role === "departmenthead") {
    notifications = await Notification.find({ recipientRole: { $regex: /^departmenthead$/i } })
      .sort({ createdAt: -1 })
      .populate("leaveRequestId")
      .populate("reference");
  } else {
    // Employee sees notifications specifically for them
    notifications = await Notification.find({ "employee.email": user.email })
      .sort({ createdAt: -1 })
      .populate("leaveRequestId")
      .populate("reference");
  }

  res.json(notifications);
});

// ---------------- Mark notification as seen ----------------
export const markAsSeen = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();

  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  const isEmployee = role === "employee" && notif.employee?.email?.toLowerCase() === email;
  const isDeptHead = role === "departmenthead" && notif.recipientRole?.toLowerCase() === "departmenthead";
  const isAdmin = role === "admin" && notif.recipientRole?.toLowerCase() === "admin";

  if (!isEmployee && !isDeptHead && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to mark this notification as seen");
  }

  notif.seen = true;
  await notif.save();
  res.status(200).json({ message: "Notification marked as seen", notif });
});

// ---------------- Delete notification (role-based access) ----------------
export const deleteNotification = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();

  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  const canDelete =
    (role === "admin" && notif.recipientRole?.toLowerCase() === "admin") ||
    (role === "departmenthead" && notif.recipientRole?.toLowerCase() === "departmenthead") ||
    (role === "employee" && notif.employee?.email?.toLowerCase() === email);

  if (!canDelete) {
    res.status(403);
    throw new Error("Not authorized to delete this notification");
  }

  await notif.deleteOne();
  res.json({ message: "Notification deleted successfully" });
});

// ---------------- Create a new notification ----------------
export const createNotification = asyncHandler(async (req, res) => {
  const { message, recipientRole, type, reference, employee, department, vacancy, status, leaveRequestId } = req.body;

  if (!message || !recipientRole) {
    res.status(400);
    throw new Error("Message and recipientRole are required");
  }

  const notification = await Notification.create({
    message,
    recipientRole,
    type,
    reference,
    employee,
    department,
    vacancy,
    leaveRequestId,
    status: status || "pending",
    seen: false,
  });

  res.status(201).json(notification);
});
