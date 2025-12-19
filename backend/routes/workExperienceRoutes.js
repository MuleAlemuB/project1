// backend/routes/workExperienceRoutes.js
import express from "express";
import {
  createRequest,
  getAdminRequests,
  getMyRequests,
  approveRequest,
  rejectRequest,
  getDepartmentRequests,
  deleteRequest,
  downloadLetter
} from "../controllers/workExperienceController.js";
import { protect, admin, deptHead } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (authenticated users only)
router.route("/")
  .post(protect, createRequest)
  .get(protect, getMyRequests);

// Download route
router.route("/download/:id")
  .get(protect, downloadLetter);

// Admin routes
router.route("/admin")
  .get(protect, admin, getAdminRequests);

router.route("/approve/:id")
  .put(protect, admin, approveRequest);

router.route("/reject/:id")
  .put(protect, admin, rejectRequest);

// Department head routes
router.route("/department")
  .get(protect, deptHead, getDepartmentRequests);

router.route("/department/approve/:id")
  .put(protect, deptHead, approveRequest);

router.route("/department/reject/:id")
  .put(protect, deptHead, rejectRequest);

// Delete route (for employees and admin)
router.route("/:id")
  .delete(protect, deleteRequest);

export default router;