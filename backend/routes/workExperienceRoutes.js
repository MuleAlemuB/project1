import express from "express";
import {
  createWorkExperienceRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
  uploadWorkExperienceLetter,
  generateWorkExperienceLetter,
} from "../controllers/workExperienceController.js";


import upload from "../middlewares/workExperienceUpload.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Employee / DeptHead
router.post("/", protect, createWorkExperienceRequest);
router.get("/my", protect, getMyRequests);

// Admin
router.get("/", protect, adminOnly, getAllRequests);
router.put("/:id/status", protect, adminOnly, updateRequestStatus);
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


export default router;
