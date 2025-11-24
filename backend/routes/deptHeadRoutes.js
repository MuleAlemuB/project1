import express from "express";
import { getDeptHeadProfile, updateDeptHeadProfile, updateDeptHeadPassword } from "../controllers/deptHeadController.js";
import { protect, deptHead } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get DeptHead profile
router.get("/profile", protect, deptHead, getDeptHeadProfile);

// Update DeptHead profile
router.put("/profile", protect, deptHead, updateDeptHeadProfile);

// Update DeptHead password
router.put("/update-password", protect, deptHead, updateDeptHeadPassword);

export default router;
