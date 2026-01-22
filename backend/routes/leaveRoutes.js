import express from "express";
import multer from "multer";
import { protect, authorizeDeptHead, authorize } from "../middlewares/authMiddleware.js";
import {
  createLeaveRequest,
  getInboxLeaveRequests,
  decideLeaveRequest,
  getMyLeaveRequests,
  deleteLeaveRequest,
} from "../controllers/leaveController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/leaveAttachments/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// DeptHead → Admin: create leave request
// POST /api/leaves/requests
router.post(
  "/requests",
  protect,
  authorizeDeptHead,
  upload.array("attachments"),
  createLeaveRequest
);

// Inbox → DeptHead or Admin: view pending requests
// GET /api/leaves/inbox
router.get("/inbox", protect, authorize("Admin", "DepartmentHead"), getInboxLeaveRequests);

// Approve/Reject leave request
// PUT /api/leaves/requests/:id/status
router.put(
  "/requests/:id/status",
  protect,
  authorize("Admin", "DepartmentHead"),
  decideLeaveRequest
);

// Get my leave requests (DeptHead → Admin)
// GET /api/leaves/my
router.get("/my", protect, authorizeDeptHead, getMyLeaveRequests);

// DELETE leave request
// DELETE /api/leaves/requests/:id
router.delete("/requests/:id", protect, deleteLeaveRequest);

// REMOVED: Duplicate route - router.put("/:id/status", protect, decideLeaveRequest);

export default router;