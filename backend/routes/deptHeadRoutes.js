import express from "express";
import {
  getDeptHeadProfile,
  updateDeptHeadProfile,
  updateDeptHeadPassword,
  getDeptEmployees,
  getDeptPendingLeaves,
  getDeptNotifications,
  updateLeaveStatus,
  getDeptStats,
  getEmployeeDetails,
  markNotificationRead
} from "../controllers/deptHeadController.js"; // NOTE: Case-sensitive import
import { protect, authorize } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadPublicFiles.js";

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// Restrict to department head role only
router.use(authorize("departmenthead"));

// ================================
// PROFILE ROUTES
// ================================
router.get("/profile", getDeptHeadProfile);
router.put("/profile", upload.single("photo"), updateDeptHeadProfile);
router.put("/password", updateDeptHeadPassword);

// ================================
// DASHBOARD DATA ROUTES
// ================================
router.get("/stats", getDeptStats);
router.get("/employees", getDeptEmployees);
router.get("/employees/:employeeId", getEmployeeDetails);
router.get("/pending-leaves", getDeptPendingLeaves);
router.get("/notifications", getDeptNotifications);
router.put("/notifications/:notificationId/read", markNotificationRead);

// ================================
// LEAVE MANAGEMENT ROUTES
// ================================
router.put("/leaves/:leaveId/status", updateLeaveStatus);

export default router;