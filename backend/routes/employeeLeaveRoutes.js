import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";
import asyncHandler from "express-async-handler";
import { createEmployeeLeaveRequest } from "../controllers/employeeLeaveController.js";

// Multer for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/leaveAttachments/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// Employee submits leave request
router.post("/request", protect, upload.array("attachments"), asyncHandler(createEmployeeLeaveRequest));

export default router;
