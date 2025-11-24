import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import asyncHandler from "express-async-handler";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeeDashboard,
  updatePassword
} from "../controllers/employeeController.js";

const router = express.Router();

// -------------------- Multer setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/photos/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// -------------------- Password Update --------------------
router.put("/update-password", protect, updatePassword);

// -------------------- Employee Dashboard (MUST BE ABOVE /:id) --------------------
router.get("/dashboard", protect, getEmployeeDashboard);

// -------------------- Get Employees by Department (DeptHead + Admin) --------------------
router.get(
  "/department",
  protect,
  authorize("admin", "departmenthead"),
  getEmployeesByDepartment
);

// -------------------- Update Own Profile --------------------
router.put(
  "/update-profile",
  protect,
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const user = await Employee.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.file) {
      user.photo = `/uploads/photos/${req.file.filename}`;
    }

    const updated = await user.save();
    const populatedUser = await Employee.findById(updated._id)
      .populate("department", "name");

    res.json(populatedUser);
  })
);

// -------------------- Employee CRUD (Admin only) --------------------
router.get("/", protect, authorize("admin"), getEmployees);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const employee = new Employee({
      ...req.body,
      password: hashedPassword,
      photo: req.file ? `/uploads/photos/${req.file.filename}` : null,
    });

    const saved = await employee.save();
    const populated = await Employee.findById(saved._id).populate(
      "department",
      "name"
    );

    res.status(201).json(populated);
  })
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const updateData = { ...req.body };

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      updateData.photo = `/uploads/photos/${req.file.filename}`;
    } else {
      const existing = await Employee.findById(req.params.id);
      if (existing && existing.photo) updateData.photo = existing.photo;
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("department", "name");

    res.json(updated);
  })
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted" });
  })
);

// -------------------- Get Employee by ID (MUST BE LAST) --------------------
router.get(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id).populate(
      "department",
      "name"
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  })
);

export default router;
