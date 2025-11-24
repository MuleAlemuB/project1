import express from "express";
import {
  createRequisition,
  getRequisitions,
  getDeptHeadRequisitions,
  updateRequisitionStatus,
  deleteRequisition
} from "../controllers/requisitionController.js";
import { protect, deptHead, admin } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// ================================
// Multer setup for file uploads
// ================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================================
// DeptHead routes
// ================================
router.post("/", protect, deptHead, upload.array("attachments"), createRequisition);
router.get("/depthead", protect, deptHead, getDeptHeadRequisitions);

// ================================
// Admin routes
// ================================
router.get("/", protect, admin, getRequisitions);
router.put("/:id/status", protect, admin, updateRequisitionStatus);
router.delete("/:id", protect, deptHead, deleteRequisition);

export default router;
