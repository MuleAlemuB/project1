// backend/routes/notificationRoutes.js
import express from "express";
import {
  getAllNotifications,
  getMyNotifications,
  markAsSeen,
  deleteNotification,
  createNotification,
  markAllAsRead,
  clearReadNotifications,
  updateLeaveStatus,
  updateRequisitionStatus,
  updateApplicationStatus,
  getNotificationDetails,
  getNotificationStats
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin: see all notifications
router.get("/", protect, getAllNotifications);

// Get notification statistics
router.get("/stats", protect, getNotificationStats);

// Logged-in users: see their notifications
router.get("/my", protect, getMyNotifications);

// Get specific notification details
router.get("/:id", protect, getNotificationDetails);

// Mark notification as seen
router.put("/:id/seen", protect, markAsSeen);

// Mark all as read
router.put("/mark-all-read", protect, markAllAsRead);

// Clear all read notifications
router.delete("/clear-read", protect, clearReadNotifications);

// Create notification
router.post("/", protect, createNotification);

// Delete notification
router.delete("/:id", protect, deleteNotification);

// Status update routes
router.put("/leaves/:id/status", protect, updateLeaveStatus);
router.put("/requisitions/:id/status", protect, updateRequisitionStatus);
router.put("/applications/:id/status", protect, updateApplicationStatus);

export default router;