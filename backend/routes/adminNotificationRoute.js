import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  updateLeaveStatus,
  updateRequisitionStatus,
  markAllAsRead,
  clearReadNotifications,
  updateApplicationStatus,
  getNotificationDetails,
  getNotificationStats
} from "../controllers/adminNotificationController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin notification routes
router.route("/")
  .get(protect, admin, getNotifications);

router.route("/stats")
  .get(protect, admin, getNotificationStats);

router.route("/mark-all-read")
  .put(protect, admin, markAllAsRead);

router.route("/clear-read")
  .delete(protect, admin, clearReadNotifications);

router.route("/:id/seen")
  .put(protect, admin, markAsRead);

router.route("/:id")
  .delete(protect, admin, deleteNotification)
  .get(protect, admin, getNotificationDetails);

// Status update routes
router.route("/leaves/:id/status")
  .put(protect, admin, updateLeaveStatus);

router.route("/requisitions/:id/status")
  .put(protect, admin, updateRequisitionStatus);

router.route("/applications/:id/status")
  .put(protect, admin, updateApplicationStatus);

export default router;