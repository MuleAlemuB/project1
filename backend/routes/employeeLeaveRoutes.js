// employeeLeaveRoutes.js - UPDATED VERSION
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "express-async-handler";
import { 
  createEmployeeLeaveRequest,
  getMyLeaveRequests,
  deleteLeaveRequest,
  getDeptHeadLeaveRequests,
  deleteMyLeaveRequest,
  getPreviousLeaveRequests,
  updateEmployeeLeaveRequestStatus,
  deleteEmployeeLeaveRequest
} from "../controllers/employeeLeaveController.js";
import upload from "../middlewares/uploadPublicFiles.js";

const router = express.Router();

// ================= EMPLOYEE ROUTES =================

// Employee submits leave request
router.post(
  "/request",
  protect,
  upload.array("attachments", 5),
  asyncHandler(createEmployeeLeaveRequest)
);

// Employee gets their own leave requests
router.get("/my", protect, getMyLeaveRequests); // Changed from "/my-requests" to "/my"

// Employee deletes their own leave request
router.delete("/requests/:id", protect, deleteLeaveRequest); // Changed to match frontend

// ================= DEPARTMENT HEAD ROUTES =================

// Department Head gets pending leave requests (inbox)
router.get("/inbox", protect, getDeptHeadLeaveRequests);

// Department Head gets previous/decided leave requests (approved or rejected)
router.get("/previous-requests", protect, getPreviousLeaveRequests);

// Department Head approves or rejects a leave request
router.put("/requests/:id/status", protect, updateEmployeeLeaveRequestStatus);

// Department Head deletes any leave request from their department
router.delete("/requests/:id", protect, deleteEmployeeLeaveRequest); 
router.delete("/my/:id", protect, deleteMyLeaveRequest);// Same endpoint for both employee and dept head

export default router;