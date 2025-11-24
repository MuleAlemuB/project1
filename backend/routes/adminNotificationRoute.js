import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/adminNotificationController.js";

const router = express.Router();

router.get("/", protect, adminOnly, getNotifications);
router.put("/:id/read", protect, adminOnly, markAsRead);
router.delete("/:id", protect, adminOnly, deleteNotification);

export default router;
