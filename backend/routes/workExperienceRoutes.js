import express from "express";
import {
  createWorkExperienceRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  bulkUpdateRequestStatus,
  uploadWorkExperienceLetter,
  generateWorkExperienceLetter,
  exportRequests,
  getRequestStats,
  sendLetterToUser, 
  downloadWorkExperienceLetter,
  deleteWorkExperienceRequest,
  bulkDeleteWorkExperienceRequests
} from "../controllers/workExperienceController.js";

import upload from "../middlewares/workExperienceUpload.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ FIXED: Add upload middleware for file uploads
// Employee / DeptHead routes
router.post("/", protect, upload.single("requestLetter"), createWorkExperienceRequest);
router.get("/my", protect, getMyRequests);

// Admin routes
router.get("/", protect, adminOnly, getAllRequests);
router.get("/stats", protect, adminOnly, getRequestStats);
router.get("/export", protect, adminOnly, exportRequests);

// GET single request (admin)
router.get("/:id", protect, adminOnly, getRequestById);

// UPDATE status routes
router.put("/:id/status", protect, adminOnly, updateRequestStatus);
router.put("/bulk/status", protect, adminOnly, bulkUpdateRequestStatus);

// DELETE routes
router.delete("/:id", protect, adminOnly, deleteWorkExperienceRequest);
router.delete("/bulk", protect, adminOnly, bulkDeleteWorkExperienceRequests);

// PDF generation and upload routes
router.post(
  "/:id/upload",
  protect,
  adminOnly,
  upload.single("pdf"),
  uploadWorkExperienceLetter
);
router.post(
  "/:id/generate",
  protect,
  adminOnly,
  generateWorkExperienceLetter
);
router.get("/:id/download", protect, downloadWorkExperienceLetter);
router.post("/:id/send", protect, adminOnly, sendLetterToUser);

export default router;