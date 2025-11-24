import express from "express";
import { login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Login route
router.post("/login", login);

// Get current logged-in user
router.get("/me", protect, getMe);

export default router;
