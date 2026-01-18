// backend/controllers/adminController.js
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/LeaveRequest.js";
import Vacancy from "../models/Vacancy.js";
import Application from "../models/Application.js";

// ---------------------- EMPLOYEES ----------------------

// Create new employee
export const createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    empId,
    password,
    department,
    sex,
    typeOfPosition,
    termOfEmployment,
    phoneNumber,
    contactPerson,
    contactPersonAddress,
    employeeStatus,
    salary,
    experience,
    role,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !department ||
    !empId ||
    !sex ||
    !typeOfPosition ||
    !termOfEmployment
  ) {
    res.status(400);
    throw new Error("Required fields missing");
  }

  const exists = await Employee.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Employee with this email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const employee = await Employee.create({
    firstName,
    middleName,
    lastName,
    email,
    empId,
    password: hashed,
    department,
    sex,
    typeOfPosition,
    termOfEmployment,
    phoneNumber,
    contactPerson,
    contactPersonAddress,
    employeeStatus,
    salary,
    experience,
    role,
  });

  const { password: _pw, ...safe } = employee.toObject();
  res.status(201).json(safe);
});

// Get all employees
export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().select("-password");
  res.json(employees);
});

// ✅ Get single employee by ID (full details)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee); // return full details
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

// Update employee
export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    firstName,
    middleName,
    lastName,
    email,
    empId,
    department,
    sex,
    typeOfPosition,
    termOfEmployment,
    phoneNumber,
    contactPerson,
    contactPersonAddress,
    employeeStatus,
    salary,
    experience,
    role,
  } = req.body;

  const employee = await Employee.findById(id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Update all fields
  employee.firstName = firstName || employee.firstName;
  employee.middleName = middleName || employee.middleName;
  employee.lastName = lastName || employee.lastName;
  employee.email = email || employee.email;
  employee.empId = empId || employee.empId;
  employee.department = department || employee.department;
  employee.sex = sex || employee.sex;
  employee.typeOfPosition = typeOfPosition || employee.typeOfPosition;
  employee.termOfEmployment = termOfEmployment || employee.termOfEmployment;
  employee.phoneNumber = phoneNumber || employee.phoneNumber;
  employee.contactPerson = contactPerson || employee.contactPerson;
  employee.contactPersonAddress =
    contactPersonAddress || employee.contactPersonAddress;
  employee.employeeStatus = employeeStatus || employee.employeeStatus;
  employee.salary = salary !== undefined ? salary : employee.salary;
  employee.experience = experience || employee.experience;
  employee.role = role || employee.role;

  const updatedEmployee = await employee.save();
  const { password, ...safe } = updatedEmployee.toObject();
  res.json(safe);
});

// Delete employee
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  await employee.deleteOne();
  res.json({ message: "Employee deleted successfully" });
});

// ---------------------- DASHBOARD STATS ----------------------
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Basic stats
  const totalEmployees = await Employee.countDocuments();
  const totalDepartments = await Department.countDocuments();
  const totalLeaves = await Leave.countDocuments({ status: "approved" });
  const activeVacancies = await Vacancy.countDocuments({});

  // Recent applications
  const recentApplications = await Application.find()
    .sort({ appliedAt: -1 })
    .limit(3)
    .populate({ path: "vacancy", select: "position title" })
    .select("name appliedAt vacancy");

  // Recent vacancies
  const recentVacancies = await Vacancy.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .select("title position createdAt");

  // Employees per Department
  const employeePerDepartment = await Employee.aggregate([
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "_id",
        foreignField: "_id",
        as: "departmentInfo",
      },
    },
    { $unwind: "$departmentInfo" },
    { $project: { department: "$departmentInfo.name", count: 1 } },
  ]);

  // Leaves per Month (last 12 months)
  const leavesPerMonth = await Leave.aggregate([
    { $match: { status: "approved" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $project: { month: "$_id", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ]);

  res.json({
    totalEmployees,
    totalDepartments,
    totalLeaves,
    activeVacancies,
    recentApplications,
    recentVacancies,
    employeePerDepartment,
    leavesPerMonth,
  });
});

// Get all departments
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
});

// Create department
export const createDepartment = asyncHandler(async (req, res) => {
  const { name, faculty, totalEmployees, head } = req.body;

  if (!name || !faculty || !head) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const exists = await Department.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error("Department already exists");
  }

  const department = await Department.create({
    name,
    faculty,
    totalEmployees: totalEmployees || 0,
    head,
  });

  res.status(201).json(department);
});

// Update department
export const updateDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) {
    res.status(404);
    throw new Error("Department not found");
  }

  const { name, faculty, totalEmployees, head } = req.body;

  dept.name = name || dept.name;
  dept.faculty = faculty || dept.faculty;
  dept.totalEmployees = totalEmployees || dept.totalEmployees;
  dept.head = head || dept.head;

  const updated = await dept.save();
  res.json(updated);
});

// Delete department
export const deleteDepartment = async (req, res) => {
  try {
    const deletedDept = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDept) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- ADMIN PROFILE ----------------------
export const getAdminProfile = asyncHandler(async (req, res) => {
  try {
    const admin = await Employee.findById(req.user._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin); // return all fields
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch admin profile", error: err.message });
  }
});

// Update admin profile
export const updateAdminProfile = asyncHandler(async (req, res) => {
  try {
    const admin = await Employee.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update all editable fields
    const fields = [
      "firstName",
      "middleName",
      "lastName",
      "email",
      "phoneNumber",
      "empId",
      "sex",
      "department",
      "typeOfPosition",
      "termOfEmployment",
      "employeeStatus",
      "salary",
      "experience",
      "contactPerson",
      "contactPersonAddress",
      "photo",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) admin[field] = req.body[field];
    });

    const updated = await admin.save();
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update admin profile", error: err.message });
  }
});

export const getMe = async (req, res) => {
  try {
    const admin = await Employee.findById(req.user.id).select("-password"); // exclude password
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = asyncHandler(async (req, res) => {
  try {
    console.log("🔐 Change password request received - Full body:", req.body);
    console.log("🔐 Request headers auth:", req.headers.authorization ? "Present" : "Missing");
    
    // Get the current user from request
    const userId = req.user?._id || req.user?.id;
    console.log("🔐 User ID from auth:", userId);
    
    if (!userId) {
      console.error("❌ No user ID in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Debug: Log all fields in request body
    console.log("📋 All fields in req.body:", Object.keys(req.body));
    Object.keys(req.body).forEach(key => {
      console.log(`   ${key}: ${typeof req.body[key]} = "${req.body[key]}"`);
    });

    // Support multiple field naming conventions
    const requestBody = req.body;
    
    // Try to extract current password
    const currentPassword = 
      requestBody.current || 
      requestBody.currentPassword || 
      requestBody.oldPassword;
    
    // Try to extract new password
    const newPassword = 
      requestBody.new || 
      requestBody.newPassword || 
      requestBody.password;
    
    // Try to extract confirmation
    const confirmation = 
      requestBody.confirm || 
      requestBody.confirmPassword || 
      requestBody.confirmation;

    console.log("📦 Extracted values:", {
      currentPassword: currentPassword ? "Provided" : "Missing",
      newPassword: newPassword ? "Provided" : "Missing",
      confirmation: confirmation ? "Provided" : "Missing"
    });

    // Validate inputs
    if (!currentPassword) {
      return res.status(400).json({ 
        message: "Current password is required",
        receivedFields: Object.keys(requestBody)
      });
    }

    if (!newPassword) {
      return res.status(400).json({ 
        message: "New password is required",
        receivedFields: Object.keys(requestBody)
      });
    }

    if (!confirmation) {
      return res.status(400).json({ 
        message: "Password confirmation is required",
        receivedFields: Object.keys(requestBody)
      });
    }

    // Compare new password with confirmation
    console.log("🔍 Comparing passwords:", {
      newPassword: newPassword,
      confirmation: confirmation,
      match: newPassword === confirmation
    });

    if (newPassword !== confirmation) {
      return res.status(400).json({ 
        message: "New password and confirmation do not match",
        details: {
          newPasswordLength: newPassword.length,
          confirmationLength: confirmation.length,
          newPasswordFirst10: newPassword.substring(0, 10),
          confirmationFirst10: confirmation.substring(0, 10)
        }
      });
    }

    // Find admin by ID
    console.log("👤 Looking for admin with ID:", userId);
    const admin = await Employee.findById(userId);
    
    if (!admin) {
      console.error("❌ Admin not found for ID:", userId);
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("✅ Admin found:", {
      email: admin.email,
      hasPassword: !!admin.password,
      passwordType: typeof admin.password
    });

    // Check if admin has a password
    if (!admin.password) {
      console.warn("⚠️ Admin has no password stored");
      return res.status(400).json({ 
        message: "Password cannot be changed for this account type" 
      });
    }

    // Debug password comparison
    console.log("🔑 Password comparison details:", {
      inputCurrent: currentPassword,
      storedExists: !!admin.password,
      storedStartsWith: admin.password?.substring(0, 10) + "...",
      isLikelyBcrypt: admin.password?.startsWith('$2')
    });

    // Compare passwords
    const isMatch = await bcrypt.compare(String(currentPassword), String(admin.password));
    
    console.log("🔑 Password match result:", isMatch);
    
    if (!isMatch) {
      // Try alternative comparison method if available
      if (admin.comparePassword) {
        const altMatch = await admin.comparePassword(currentPassword);
        console.log("🔑 Alternative comparison result:", altMatch);
        if (!altMatch) {
          return res.status(400).json({ 
            message: "Current password is incorrect",
            hint: "Please check your current password"
          });
        }
      } else {
        return res.status(400).json({ 
          message: "Current password is incorrect",
          hint: "Please check your current password"
        });
      }
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Hash new password
    console.log("🔨 Hashing new password...");
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    
    console.log("💾 Saving admin with new password...");
    await admin.save();

    console.log("✅ Password changed successfully for admin:", admin.email);

    res.json({ 
      message: "Password changed successfully",
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Change password error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific errors
    if (error.message.includes("Illegal arguments")) {
      return res.status(400).json({ 
        message: "Invalid password format. Please check your input." 
      });
    }
    
    res.status(500).json({ 
      message: "Server error during password change", 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ---------------------- NEW ADDED SECTION ----------------------
import Notification from "../models/Notification.js";
import Requisition from "../models/Requisition.js";
import User from "../models/User.js";

// ✅ Approve or Reject Leave Request and notify Dept Head
export const handleLeaveDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "Approved" or "Rejected"

  try {
    const leave = await Leave.findById(id).populate("requestedBy");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    await leave.save();

    const deptHead = await User.findOne({
      department: leave.requestedBy.department,
      role: "Department Head",
    });

    if (deptHead) {
      await Notification.create({
        receiver: deptHead._id,
        type: "LeaveResponse",
        message: `Leave request by ${leave.requestedBy.firstName} ${leave.requestedBy.lastName} was ${status} by HR.`,
        status,
        seen: false,
      });
    }

    res.json({ message: `Leave ${status} successfully.` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// ✅ Approve or Reject Requisition Request and notify Dept Head
export const handleRequisitionDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "Approved" or "Rejected"

  try {
    const requisition = await Requisition.findById(id).populate("requestedBy");
    
    if (!requisition) {
      // Log all existing requisition IDs for debugging
      const allRequisitions = await Requisition.find().select("_id position department");
      console.error(`Requisition not found for ID: ${id}`);
      console.log("Existing Requisition IDs in DB:", allRequisitions);
      
      return res.status(404).json({
        message: `Requisition not found for ID: ${id}`,
        existingRequisitions: allRequisitions
      });
    }

    requisition.status = status;
    await requisition.save();

    const deptHead = await User.findOne({
      department: requisition.department,
      role: "Department Head",
    });

    if (deptHead) {
      await Notification.create({
        receiver: deptHead._id,
        type: "RequisitionResponse",
        message: `Requisition for ${requisition.typeOfPosition} was ${status} by HR.`,
        status,
        seen: false,
      });
    }

    res.json({ message: `Requisition ${status} successfully.` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
