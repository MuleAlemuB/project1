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
  updatePassword,
  updateEmployeeProfile
} from "../controllers/employeeController.js";

const router = express.Router();

// -------------------- Multer setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/photos/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ==================== EMPLOYEE ROUTES ====================

// -------------------- Password Update --------------------
router.put("/update-password", protect, updatePassword);

// -------------------- Employee Dashboard (MUST BE ABOVE /:id) --------------------
router.get("/dashboard", protect, getEmployeeDashboard);

// -------------------- Update Own Profile --------------------
router.put("/update-profile", protect, updateEmployeeProfile);

// -------------------- Upload Profile Photo --------------------
router.post(
  "/upload-photo",
  protect,
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No photo uploaded");
    }

    const user = await Employee.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.photo = `/uploads/photos/${req.file.filename}`;
    const updatedUser = await user.save();
    
    // Format response similar to dashboard
    const userObject = updatedUser.toObject();
    let joinDateDisplay = "-";
    if (updatedUser.startDate) {
      joinDateDisplay = new Date(updatedUser.startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    const responseData = {
      ...userObject,
      password: undefined,
      department: updatedUser.department?.name || "-",
      joinDate: joinDateDisplay,
      profileCompleted: calculateProfileCompletion(updatedUser),
    };

    res.json({
      message: "Photo uploaded successfully",
      ...responseData
    });
  })
);

// -------------------- Get Employees by Department (DeptHead + Admin) --------------------
router.get(
  "/department",
  protect,
  authorize("admin", "departmenthead"),
  getEmployeesByDepartment
);

// ==================== ADMIN ROUTES ====================

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

// Helper function for profile completion
const calculateProfileCompletion = (employee) => {
  const fields = [
    'firstName', 'lastName', 'email', 'empId', 'department',
    'phoneNumber', 'contactPerson', 'contactPersonAddress',
    'photo', 'dateOfBirth', 'address'
  ];
  
  let completed = 0;
  let total = fields.length;
  
  fields.forEach(field => {
    if (employee[field] && employee[field].toString().trim() !== '') {
      completed++;
    }
  });
  
  return Math.round((completed / total) * 100);
};

export default router;