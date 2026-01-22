import express from "express";
import multer from "multer";
import path from "path";
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
  markNotificationRead,
  updateEmployeeByDeptHead,
  deleteEmployeeByDeptHead,
  updateDeptHeadPhoto,
  getDeptHeadNotifications,
  markDeptHeadNotificationRead,
  deleteDeptHeadNotification // Added here
} from "../controllers/deptHeadController.js"; 
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/employees/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'depthead-' + req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Protect all routes - require authentication
router.use(protect);

// Restrict to department head role only
router.use(authorize("departmenthead"));

// ================================
// PROFILE ROUTES
// ================================
router.get("/profile", getDeptHeadProfile);
router.put("/profile", updateDeptHeadProfile); // Removed upload.single here since we have separate photo upload
router.put("/password", updateDeptHeadPassword);
router.put("/upload-photo", upload.single("photo"), updateDeptHeadPhoto); // Photo upload route

// ================================
// DASHBOARD DATA ROUTES
// ================================
router.get("/stats", getDeptStats);
router.get("/employees", getDeptEmployees);
router.get("/employees/:employeeId", getEmployeeDetails);

// ================================
// EMPLOYEE MANAGEMENT ROUTES
// ================================
router.put("/employees/:id", updateEmployeeByDeptHead);
router.delete("/employees/:id", deleteEmployeeByDeptHead);

// ================================
// LEAVE MANAGEMENT ROUTES
// ================================
router.get("/pending-leaves", getDeptPendingLeaves);
router.put("/leaves/:leaveId/status", updateLeaveStatus);

// ================================
// NOTIFICATION ROUTES
// ================================
router.get("/notifications", getDeptNotifications);
router.put("/notifications/:notificationId/read", markNotificationRead);
router.get("/notifications", getDeptHeadNotifications);
router.put("/notifications/:notificationId/read", markDeptHeadNotificationRead);
router.delete("/notifications/:notificationId", deleteDeptHeadNotification);

export default router;