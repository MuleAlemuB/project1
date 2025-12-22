// backend/routes/workExperienceRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import uploadWorkExperience from "../middlewares/uploadWorkExperience.js";
import {
  submitRequest,
  getAllRequests,
  rejectRequest,
  approveWithUpload,
  approveWithGeneratedLetter,
} from "../controllers/workExperienceController.js";

const router = express.Router();

// Submit request (Employee/DeptHead) with optional file
router.post("/", protect, uploadWorkExperience.single("requestAttachment"), submitRequest);

// Admin: Get all requests
router.get("/", protect, getAllRequests);

// Admin: Reject request
router.put("/:id/reject", protect, rejectRequest);

// Admin: Approve with uploaded letter
router.put("/:id/approve/upload", protect, uploadWorkExperience.single("letterFile"), approveWithUpload);

// Admin: Approve with generated letter link
router.put("/:id/approve/generate", protect, approveWithGeneratedLetter);

export default router;
