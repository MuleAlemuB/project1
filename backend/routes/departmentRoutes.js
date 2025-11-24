import express from "express";
import Department from "../models/Department.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import asyncHandler from "express-async-handler";
import { adminOnly } from "../middlewares/adminMiddleware.js";
import {
  addDepartment,
  getDepartments,
  deleteDepartment,
  updateDepartment,
  getDepartmentById,
} from "../controllers/departmentController.js";

const router = express.Router();

// Admin-only routes
router.route("/")
  .post(protect, adminOnly, addDepartment);

// DeptHead and Admin can fetch departments
router.get("/", protect, authorize("admin", "departmenthead"), asyncHandler(async (req, res) => {
  const departments = await Department.find({});
  res.json(departments);
}));

// Get single department by ID (DeptHead/Admin)
router.get("/:id", protect, authorize("admin", "departmenthead"), getDepartmentById);

// Update/Delete department (admin only)
router.route("/:id")
  .put(protect, adminOnly, updateDepartment)
  .delete(protect, adminOnly, deleteDepartment);

export default router;
