import express from "express";
import asyncHandler from "express-async-handler";
import {
  createLeaveRequest,
  getDepartmentLeaveRequests,
  updateLeaveRequestStatus,
} from "../controllers/leaveController.js";
import {
  createEmployeeLeaveRequest,
  getDeptHeadLeaveRequests,
  updateEmployeeLeaveRequestStatus,
  deleteEmployeeLeaveRequest,
} from "../controllers/employeeLeaveController.js";
import {
  protect,
  authorizeDeptHead,
  authorize,
} from "../middlewares/authMiddleware.js";
import multer from "multer";

// Multer setup for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/leaveAttachments/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// DeptHead fetch leave requests
router.get(
  "/requests",
  protect,
  authorizeDeptHead,
  asyncHandler(getDepartmentLeaveRequests)
);

// DeptHead creates leave request
router.post(
  "/requests",
  protect,
  authorizeDeptHead,
  upload.array("attachments"),
  asyncHandler(createLeaveRequest)
);

// Admin or DeptHead approves/rejects leave
router.put(
  "/requests/:id/status",
  protect,
  authorize("admin", "departmenthead"),
  asyncHandler(updateLeaveRequestStatus)
);
// Employee submits leave request
router.post(
  "/request",
  protect,
  upload.array("attachments"),
  asyncHandler(createEmployeeLeaveRequest)
);

// DeptHead fetches leave requests of their department
router.get(
  "/depthead",
  protect,
  authorizeDeptHead,
  asyncHandler(getDeptHeadLeaveRequests)
);

// DeptHead approves/rejects a leave request
router.put(
  "/depthead/:id/status",
  protect,
  authorizeDeptHead,
  asyncHandler(updateLeaveRequestStatus)
);

// DeptHead deletes a leave request
router.delete(
  "/depthead/:id",
  protect,
  authorizeDeptHead,
  asyncHandler(deleteEmployeeLeaveRequest)
);

export default router;
