import express from "express";
import { getEmployeesByDepartment } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getEmployeesByDepartment);

export default router;
