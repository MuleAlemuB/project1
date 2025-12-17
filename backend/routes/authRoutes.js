import express from "express";
import { login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Login route
router.post("/login", login);

// Get current logged-in user
router.get("/me", protect, getMe);
// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post("/reset-password/:token", resetPassword);

export default router;
