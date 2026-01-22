import Employee from "../models/Employee.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import Department from "../models/Department.js";

// -------------------- Create Employee --------------------
export const createEmployee = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  
  // Validate that startDate is provided
  if (!data.startDate) {
    res.status(400);
    throw new Error("Start date is required");
  }
  
  // Convert startDate to Date object
  if (data.startDate) {
    data.startDate = new Date(data.startDate);
  }
  
  // Remove experience field if it's being sent (to use virtual field instead)
  if (data.experience) {
    delete data.experience;
  }
  
  if (req.file) data.photo = `uploads/photos/${req.file.filename}`;

  const employee = await Employee.create(data);
  res.status(201).json(employee);
});

// -------------------- Get All Employees --------------------
export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate("department", "name");
  res.json(employees);
});

// -------------------- Get Single Employee --------------------
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("department", "name");
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
});

// -------------------- Update Employee --------------------
export const updateEmployee = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  
  // Handle startDate conversion
  if (data.startDate) {
    data.startDate = new Date(data.startDate);
  }
  
  // Remove experience field if it's being sent (to use virtual field instead)
  if (data.experience) {
    delete data.experience;
  }
  
  if (req.file) data.photo = `uploads/photos/${req.file.filename}`;

  const employee = await Employee.findByIdAndUpdate(req.params.id, data, { new: true }).populate("department", "name");
  res.json(employee);
});

// -------------------- Delete Employee --------------------
export const deleteEmployee = asyncHandler(async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

// -------------------- Get Logged-in Employee Profile --------------------
export const getMyProfile = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.user._id).select('-password').populate("department", "name");
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json(employee);
});

// -------------------- Get Employees by DeptHead's Department --------------------
export const getEmployeesByDepartment = asyncHandler(async (req, res) => {
  const { department } = req.query;

  if (!department) {
    res.status(400);
    throw new Error("Department query is required");
  }

  try {
    const dept = await Department.findOne({ name: department });
    if (!dept) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    const employees = await Employee.find({ department: dept._id }).populate("department", "name");
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees by department:", err);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

// -------------------- Employee Dashboard Route --------------------
// In your employeeController.js, update the dashboard function:

// -------------------- Employee Dashboard Route --------------------
// -------------------- Employee Dashboard Route --------------------
export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.user._id).populate("department", "name");
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  // Format the date for display
  let joinDateDisplay = "-";
  if (employee.startDate) {
    joinDateDisplay = new Date(employee.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Send the full employee object with virtual fields included
  const employeeObject = employee.toObject();
  
  // Add the virtual experience field
  const dashboardData = {
    ...employeeObject,
    password: undefined, // Remove password
    department: employee.department?.name || "-",
    joinDate: joinDateDisplay, // This is the formatted display date
    profileCompleted: calculateProfileCompletion(employee),
  };

  res.json(dashboardData);
});

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

// Helper function for profile completion

// -------------------- Employee Updates Password Only --------------------
export const updatePassword = asyncHandler(async (req, res) => {
  const employeeId = req.user._id; // coming from authMiddleware's `protect`
  const { currentPassword, newPassword } = req.body;

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, employee.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  // Update password
  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(newPassword, salt);
  await employee.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// -------------------- Get Employees Sorted by Experience --------------------
// OPTIONAL: New endpoint if you need to sort employees by experience
export const getEmployeesByExperience = asyncHandler(async (req, res) => {
  const { sort = 'desc' } = req.query; // 'asc' or 'desc'
  
  const sortOrder = sort === 'asc' ? 1 : -1;
  
  const employees = await Employee.aggregate([
    {
      $addFields: {
        experienceYears: {
          $floor: {
            $divide: [
              { $subtract: [new Date(), "$startDate"] },
              1000 * 60 * 60 * 24 * 365.25
            ]
          }
        }
      }
    },
    { $sort: { experienceYears: sortOrder } },
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        password: 0,
        'department.createdAt': 0,
        'department.updatedAt': 0
      }
    }
  ]);

  res.json(employees);
});

// -------------------- Migration Helper (One-time use) --------------------
// Use this once to migrate existing experience data to startDate
export const migrateExperienceData = asyncHandler(async (req, res) => {
  // Protect this endpoint - only for admin use
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to perform migration');
  }

  try {
    const employees = await Employee.find({
      $or: [
        { startDate: { $exists: false } },
        { startDate: null }
      ]
    });

    let migratedCount = 0;

    for (const employee of employees) {
      // If employee has experience field, use it to calculate startDate
      if (employee.experience) {
        const experienceMatch = employee.experience.match(/(\d+)/);
        if (experienceMatch) {
          const years = parseInt(experienceMatch[1]);
          const startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - years);
          
          employee.startDate = startDate;
          await employee.save();
          migratedCount++;
        }
      } else {
        // If no experience, set startDate to current date (0 years experience)
        employee.startDate = new Date();
        await employee.save();
        migratedCount++;
      }
    }

    res.json({
      message: `Successfully migrated ${migratedCount} employee records`,
      migratedCount
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500);
    throw new Error('Migration failed: ' + error.message);
  }
});
// -------------------- Update Employee Profile (Self) --------------------
// -------------------- Update Employee Profile (Self) --------------------
export const updateEmployeeProfile = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;
  const data = { ...req.body };
  
  console.log("Update request data:", data);
  
  // Only allow specific fields to be updated by employee
  const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'contactPerson', 'contactPersonAddress'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });
  
  // Check if there's any data to update
  if (Object.keys(updateData).length === 0) {
    res.status(400);
    throw new Error("No valid fields provided for update");
  }
  
  console.log("Updating with data:", updateData);
  
  // Find and update the employee
  const employee = await Employee.findByIdAndUpdate(
    employeeId, 
    updateData, 
    { new: true, runValidators: true }
  ).populate("department", "name");
  
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  
  console.log("Updated employee:", employee);
  
  // Format response similar to getEmployeeDashboard
  let joinDateDisplay = "-";
  if (employee.startDate) {
    joinDateDisplay = new Date(employee.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  const employeeObject = employee.toObject();
  const responseData = {
    ...employeeObject,
    password: undefined,
    department: employee.department?.name || "-",
    joinDate: joinDateDisplay,
    profileCompleted: calculateProfileCompletion(employee),
  };
  
  res.json(responseData);
});