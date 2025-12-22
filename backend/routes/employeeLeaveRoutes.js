import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";
import asyncHandler from "express-async-handler";
import { 
  createEmployeeLeaveRequest,
  getMyLeaveRequests,
  deleteLeaveRequest,
  getDeptHeadLeaveRequests,
  getPreviousLeaveRequests,
  updateEmployeeLeaveRequestStatus,
  deleteEmployeeLeaveRequest
} from "../controllers/employeeLeaveController.js";
import upload from "../middlewares/uploadPublicFiles.js"; // Import your existing upload middleware

const router = express.Router();

// ================= EMPLOYEE ROUTES =================

// Employee submits leave request
router.post(
  "/request",
  protect,
  upload.array("attachments", 5), // Use your existing upload middleware
  asyncHandler(createEmployeeLeaveRequest)
);

// Employee gets their own leave requests
router.get("/my-requests", protect, getMyLeaveRequests);

// Employee deletes their own leave request
router.delete("/my-requests/:id", protect, deleteLeaveRequest);

// ================= DEPARTMENT HEAD ROUTES =================

// Department Head gets pending leave requests (inbox)
router.get("/inbox", protect, getDeptHeadLeaveRequests);

// Department Head gets previous/decided leave requests (approved or rejected)
router.get("/previous-requests", protect, getPreviousLeaveRequests);

// Department Head approves or rejects a leave request
router.put("/:id/status", protect, updateEmployeeLeaveRequestStatus);

// Department Head deletes any leave request from their department
router.delete("/dept-head/:id", protect, deleteEmployeeLeaveRequest);

export default router;