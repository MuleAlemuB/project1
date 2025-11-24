// backend/controllers/departmentController.js
import asyncHandler from "express-async-handler";
import Department from "../models/Department.js";

// @desc    Add a new department
// @route   POST /api/departments
// @access  Private (Admin)
export const addDepartment = asyncHandler(async (req, res) => {
  const { name, head, totalEmployees, faculty } = req.body;

  if (!name || !head || !totalEmployees || !faculty) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const departmentExists = await Department.findOne({ name });
  if (departmentExists) {
    res.status(400);
    throw new Error("Department already exists");
  }

  const department = await Department.create({
    name,
    head,
    totalEmployees,
    faculty,
  });

  res.status(201).json(department);
});

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private (Admin)
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({});
  res.json(departments);
});

// @desc    Get a single department by ID or name safely
// @route   GET /api/departments/:id
// @access  Private (DeptHead/Admin)
export const getDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  // Check if the value is a valid Mongo ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ name: id });
  }

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  res.json(department);
});

// Alias for getDepartment to prevent import issues
export const getDepartmentById = getDepartment;

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
export const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (isObjectId) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ name: id });
  }

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  await department.deleteOne();
  res.json({ message: "Department removed" });
});

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
export const updateDepartment = asyncHandler(async (req, res) => {
  const { name, head, totalEmployees, faculty } = req.body;
  const { id } = req.params;

  let department;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (isObjectId) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ name: id });
  }

  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }

  department.name = name || department.name;
  department.head = head || department.head;
  department.totalEmployees = totalEmployees || department.totalEmployees;
  department.faculty = faculty || department.faculty;

  const updatedDept = await department.save();
  res.json(updatedDept);
});
