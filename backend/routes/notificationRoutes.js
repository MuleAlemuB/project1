// backend/routes/notificationRoutes.js
import express from "express";
import {
  getAllNotifications,
  getMyNotifications,
  markAsSeen,
  deleteNotification,
  createNotification,
} from "../controllers/notificationController.js";
import { protect, adminOnly, authorizeNotificationDelete } from "../middlewares/authMiddleware.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Admin: see all notifications
router.get("/", protect, adminOnly, asyncHandler(getAllNotifications));

// Logged-in users: see their notifications
router.get("/my", protect, asyncHandler(getMyNotifications));

// Mark notification as seen
router.put("/:id/seen", protect, asyncHandler(markAsSeen));

// Create notification
router.post("/", protect, asyncHandler(createNotification));

// Delete notification
router.delete("/:id", protect, authorizeNotificationDelete, asyncHandler(deleteNotification));

export default router;
