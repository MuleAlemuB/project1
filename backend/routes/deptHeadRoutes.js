import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  deleteDeptHeadNotification,
  deleteDeptHeadPhoto
} from "../controllers/deptHeadController.js"; 
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the directory if it doesn't exist
    const dir = path.join(__dirname, '..', 'public', 'uploads', 'employees');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'depthead-' + req.user._id + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
    }
  }
});

// Protect all routes - require authentication
router.use(protect);

// Restrict to department head role only
router.use(authorize("departmenthead"));

// ================================
// PROFILE ROUTES
// ================================
router.get("/profile", getDeptHeadProfile);
router.put("/profile", updateDeptHeadProfile);
router.put("/password", updateDeptHeadPassword);
router.put("/profile/photo", upload.single("photo"), updateDeptHeadPhoto);
router.delete("/profile/photo", deleteDeptHeadPhoto);

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
router.get("/notifications", getDeptHeadNotifications);
router.put("/notifications/:notificationId/read", markDeptHeadNotificationRead);
router.delete("/notifications/:notificationId", deleteDeptHeadNotification);

export default router;