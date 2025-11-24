import express from "express";
import { getAdminReport } from "../controllers/reportController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/admin", protect, admin, getAdminReport);


export default router;
