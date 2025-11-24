import express from "express";
import asyncHandler from "express-async-handler";
import { protect, deptHead } from "../middlewares/authMiddleware.js";
import {
  bulkAttendance,
  getDepartmentAttendance,
  getAttendanceHistory,
} from "../controllers/attendanceController.js";

const router = express.Router();

// DeptHead: bulk create/update attendance
router.post("/bulk", protect, deptHead, asyncHandler(bulkAttendance));

// DeptHead: get attendance by department & date
router.get("/", protect, deptHead, asyncHandler(getDepartmentAttendance));

// DeptHead: view attendance history
router.get("/history", protect, deptHead, asyncHandler(getAttendanceHistory));

export default router;
