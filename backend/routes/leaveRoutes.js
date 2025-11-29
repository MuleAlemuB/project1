import express from "express";
import multer from "multer";
import { protect, authorizeDeptHead, authorize } from "../middlewares/authMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  createLeaveRequest,
  getInboxLeaveRequests,
  decideLeaveRequest,
  getMyLeaveRequests,
  deleteLeaveRequest, // ✅ import deleteLeaveRequest
} from "../controllers/leaveController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/leaveAttachments/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// DeptHead → Admin: create leave request
router.post(
  "/requests",
  protect,
  authorizeDeptHead,
  upload.array("attachments"),
  createLeaveRequest
);

// Inbox → DeptHead or Admin: view pending requests
router.get("/inbox", protect, authorize("Admin", "DepartmentHead"), getInboxLeaveRequests);

// Approve/Reject leave request
router.put(
  "/requests/:id/status",
  protect,
  authorize("Admin", "DepartmentHead"),
  decideLeaveRequest
);

// Get my leave requests (DeptHead → Admin)
router.get("/my", protect, authorizeDeptHead, getMyLeaveRequests);

// DELETE leave request
router.delete("/requests/:id", protect, deleteLeaveRequest);

export default router;
