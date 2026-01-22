import Employee from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ================================
// 1. GET Department Head Profile (UPDATED)
// ================================
export const getDeptHeadProfile = asyncHandler(async (req, res) => {
  const deptHead = await Employee.findById(req.user._id)
    .select("-password")
    .populate("department", "_id name");

  if (!deptHead) {
    return res.status(404).json({ message: "Department Head not found" });
  }

  return res.status(200).json({
    _id: deptHead._id,
    username: deptHead.username,
    firstName: deptHead.firstName || "",
    middleName: deptHead.middleName || "",
    lastName: deptHead.lastName || "",
    email: deptHead.email,
    phone: deptHead.phone || deptHead.phoneNumber || "",
    phoneNumber: deptHead.phoneNumber || deptHead.phone || "",
    department: {
      _id: deptHead.department?._id,
      name: deptHead.department?.name,
    },
    address: deptHead.address || "",
    role: deptHead.role,
    photo: deptHead.photo || "",
    empId: deptHead.empId || "",
    typeOfPosition: deptHead.typeOfPosition || "Department Head",
    salary: deptHead.salary || "",
    experience: deptHead.experience || "",
    qualification: deptHead.qualification || "",
    contactPerson: deptHead.contactPerson || "",
    contactPersonAddress: deptHead.contactPersonAddress || "",
    employeeStatus: deptHead.employeeStatus || deptHead.status || "Active",
    dateOfBirth: deptHead.dateOfBirth || "",
    maritalStatus: deptHead.maritalStatus || "",
    sex: deptHead.sex || "",
    termOfEmployment: deptHead.termOfEmployment || "",
    status: deptHead.status || deptHead.employeeStatus || "Active",
  });
});

// ================================
// 2. GET Employees in Department
// ================================
export const getDeptEmployees = asyncHandler(async (req, res) => {
  const deptHead = await Employee.findById(req.user._id)
    .select("department")
    .populate("department", "_id name");

  if (!deptHead.department) {
    return res.status(400).json({ message: "Department not assigned" });
  }

  const deptName = deptHead.department.name;

  const employees = await Employee.find({
    "department.name": deptName,
    $or: [
      { employeeStatus: "Active" },
      { employeeStatus: { $exists: false } },
      { status: "Active" }
    ],
    role: { $ne: "departmenthead" }
  })
    .select("-password")
    .populate("department", "_id name")
    .sort({ firstName: 1 });

  res.status(200).json(employees);
});

// ================================
// 3. GET Pending Leave Requests for Department
// ================================
export const getDeptPendingLeaves = asyncHandler(async (req, res) => {
  const deptHead = await Employee.findById(req.user._id)
    .select("department")
    .populate("department", "_id name");

  if (!deptHead.department) {
    return res.status(400).json({ message: "Department not assigned" });
  }

  const deptName = deptHead.department.name;

  const pendingLeaves = await LeaveRequest.find({
    department: deptName,
    targetRole: "DepartmentHead",
    status: "pending"
  })
    .populate("requester", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  res.status(200).json(pendingLeaves);
});

// ================================
// 4. GET Notifications for Department Head
// ================================
export const getDeptNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { recipient: req.user._id },
      { recipientRole: "departmenthead" }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(notifications);
});

// ================================
// 5. GET Department Statistics
// ================================
export const getDeptStats = asyncHandler(async (req, res) => {
  const deptHead = await Employee.findById(req.user._id).populate("department", "_id name");

  if (!deptHead.department) {
    return res.status(400).json({ message: "Department not assigned" });
  }

  const deptId = deptHead.department._id;
  const deptName = deptHead.department.name;

  const totalEmployees = await Employee.countDocuments({
    department: deptId,
    $or: [
      { employeeStatus: "Active" },
      { employeeStatus: { $exists: false } },
      { status: "Active" }
    ]
  });

  const pendingLeaves = await LeaveRequest.countDocuments({
    $or: [
      { department: deptId },
      { department: deptName },
      { "department._id": deptId },
      { "department.name": deptName }
    ],
    targetRole: "DepartmentHead",
    status: "pending"
  });

  // Count only unread notifications for department head
  const notificationsCount = await Notification.countDocuments({
    $or: [
      { recipient: req.user._id, seen: false },
      { recipientRole: "departmenthead", seen: false, "metadata.departmentId": deptHead.department?._id }
    ]
  });

  res.status(200).json({
    totalEmployees,
    pendingLeaves,
    notifications: notificationsCount,
    department: deptName
  });
});

// ================================
// 6. UPDATE Leave Request Status
// ================================
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { status, adminComment } = req.body;

  if (!["approved", "rejected"].includes(status?.toLowerCase())) {
    return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'" });
  }

  const leaveRequest = await LeaveRequest.findById(leaveId);
  
  if (!leaveRequest) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  const deptHead = await Employee.findById(req.user._id)
    .populate("department", "_id name");

  if (!deptHead.department) {
    return res.status(400).json({ message: "Department not assigned" });
  }

  if (leaveRequest.department !== deptHead.department.name) {
    return res.status(403).json({ 
      message: "You can only process leave requests from your department" 
    });
  }

  leaveRequest.status = status.toLowerCase();
  
  if (leaveRequest.schema.path('processedBy')) {
    leaveRequest.processedBy = req.user._id;
    leaveRequest.processedAt = new Date();
  }

  if (adminComment) {
    if (leaveRequest.schema.path('adminComment')) {
      leaveRequest.adminComment = adminComment;
    } else {
      leaveRequest.metadata = leaveRequest.metadata || {};
      leaveRequest.metadata.adminComment = adminComment;
    }
  }

  const updatedLeave = await leaveRequest.save();

  try {
    await Notification.create({
      recipient: leaveRequest.requester,
      recipientRole: leaveRequest.requesterRole,
      sender: req.user._id,
      senderRole: "departmenthead",
      type: "Leave Status Update",
      message: `Your leave request from ${new Date(leaveRequest.startDate).toLocaleDateString()} to ${new Date(leaveRequest.endDate).toLocaleDateString()} has been ${status}`,
      metadata: {
        leaveId: leaveRequest._id,
        status: status,
        comment: adminComment,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate
      }
    });
  } catch (notifErr) {
    console.error("Failed to create notification:", notifErr);
  }

  res.status(200).json({
    success: true,
    message: `Leave request ${status} successfully`,
    data: updatedLeave
  });
});

// ================================
// 7. UPDATE Department Head Profile (UPDATED)
// ================================
export const updateDeptHeadProfile = asyncHandler(async (req, res) => {
  const { 
    firstName, 
    middleName, 
    lastName, 
    phoneNumber, 
    address, 
    dateOfBirth, 
    contactPerson, 
    contactPersonAddress,
    maritalStatus,
    sex,
    termOfEmployment,
    employeeStatus,
    typeOfPosition
  } = req.body;

  const deptHead = await Employee.findById(req.user._id).populate(
    "department",
    "_id name"
  );

  if (!deptHead) {
    return res.status(404).json({ success: false, message: "Department Head not found" });
  }

  // Update allowed fields (excluding non-editable ones)
  if (firstName !== undefined) deptHead.firstName = firstName;
  if (middleName !== undefined) deptHead.middleName = middleName;
  if (lastName !== undefined) deptHead.lastName = lastName;
  if (phoneNumber !== undefined) {
    deptHead.phoneNumber = phoneNumber;
    deptHead.phone = phoneNumber; // Update both for compatibility
  }
  if (address !== undefined) deptHead.address = address;
  if (dateOfBirth !== undefined) deptHead.dateOfBirth = dateOfBirth;
  if (contactPerson !== undefined) deptHead.contactPerson = contactPerson;
  if (contactPersonAddress !== undefined) deptHead.contactPersonAddress = contactPersonAddress;
  if (maritalStatus !== undefined) deptHead.maritalStatus = maritalStatus;
  if (sex !== undefined) deptHead.sex = sex;
  if (termOfEmployment !== undefined) deptHead.termOfEmployment = termOfEmployment;
  if (employeeStatus !== undefined) {
    deptHead.employeeStatus = employeeStatus;
    deptHead.status = employeeStatus; // Update both for compatibility
  }
  if (typeOfPosition !== undefined) deptHead.typeOfPosition = typeOfPosition;

  const updated = await deptHead.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      _id: updated._id,
      username: updated.username,
      firstName: updated.firstName || "",
      middleName: updated.middleName || "",
      lastName: updated.lastName || "",
      email: updated.email,
      phone: updated.phone || "",
      phoneNumber: updated.phoneNumber || "",
      department: {
        _id: updated.department?._id,
        name: updated.department?.name,
      },
      address: updated.address || "",
      role: updated.role,
      photo: updated.photo || "",
      empId: updated.empId || "",
      typeOfPosition: updated.typeOfPosition || "Department Head",
      salary: updated.salary || "",
      experience: updated.experience || "",
      qualification: updated.qualification || "",
      contactPerson: updated.contactPerson || "",
      contactPersonAddress: updated.contactPersonAddress || "",
      employeeStatus: updated.employeeStatus || updated.status || "Active",
      dateOfBirth: updated.dateOfBirth || "",
      maritalStatus: updated.maritalStatus || "",
      sex: updated.sex || "",
      termOfEmployment: updated.termOfEmployment || "",
      status: updated.status || updated.employeeStatus || "Active",
    }
  });
});

// ================================
// 8. UPDATE Department Head Password
// ================================
export const updateDeptHeadPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: "Both current and new password are required" 
    });
  }

  const deptHead = await Employee.findById(req.user._id);
  if (!deptHead) {
    return res.status(404).json({ success: false, message: "Department Head not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, deptHead.password);

  if (!isMatch) {
    return res.status(400).json({ 
      success: false, 
      message: "Current password is incorrect" 
    });
  }

  const salt = await bcrypt.genSalt(10);
  deptHead.password = await bcrypt.hash(newPassword, salt);

  await deptHead.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// ================================
// 9. GET Employee Details (Single)
// ================================
export const getEmployeeDetails = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const deptHead = await Employee.findById(req.user._id)
    .populate("department", "_id name");

  if (!deptHead.department) {
    return res.status(400).json({ message: "Department not assigned" });
  }

  const deptName = deptHead.department.name;

  const employee = await Employee.findOne({
    _id: employeeId,
    "department.name": deptName
  })
    .select("-password")
    .populate("department", "_id name");

  if (!employee) {
    return res.status(404).json({ 
      message: "Employee not found or not in your department" 
    });
  }

  res.status(200).json(employee);
});

// ================================
// 10. MARK Notification as Read
// ================================
export const markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findOne({
    _id: notificationId,
    $or: [
      { recipient: req.user._id },
      { recipientRole: "departmenthead" }
    ]
  });

  if (!notification) {
    return res.status(404).json({ 
      message: "Notification not found or not authorized" 
    });
  }

  notification.seen = true;
  await notification.save();

  res.status(200).json({
    message: "Notification marked as read",
    notification
  });
});

// ================================
// UPDATE Employee by Department Head
// ================================
export const updateEmployeeByDeptHead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  console.log("=== UPDATE EMPLOYEE BY DEPT HEAD ===");
  console.log("Department Head ID:", req.user._id);
  console.log("Employee ID to update:", id);
  console.log("Update data:", req.body);
  
  // Get department head's department
  const deptHead = await Employee.findById(req.user._id).populate("department", "_id name");
  
  if (!deptHead.department) {
    console.log("Dept Head has no department assigned");
    return res.status(400).json({ 
      success: false, 
      message: "Department not assigned" 
    });
  }
  
  const deptId = deptHead.department._id.toString();
  const deptName = deptHead.department.name;
  
  console.log("Department Head's Department:", {
    id: deptId,
    name: deptName,
    deptHeadDepartment: deptHead.department
  });
  
  // Find the employee
  const employee = await Employee.findById(id).populate("department", "_id name");
  
  if (!employee) {
    console.log("Employee not found");
    return res.status(404).json({ 
      success: false, 
      message: "Employee not found" 
    });
  }
  
  console.log("Found employee:", {
    employeeId: employee._id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    department: employee.department,
    departmentId: employee.department?._id?.toString(),
    departmentName: employee.department?.name
  });
  
  // Check if employee is in the same department
  const employeeDeptId = employee.department?._id?.toString();
  const employeeDeptName = employee.department?.name;
  
  console.log("Department comparison:", {
    deptHeadDeptId: deptId,
    employeeDeptId: employeeDeptId,
    matchId: employeeDeptId === deptId,
    deptHeadDeptName: deptName,
    employeeDeptName: employeeDeptName,
    matchName: employeeDeptName === deptName
  });
  
  if (employeeDeptId !== deptId && employeeDeptName !== deptName) {
    console.log("DEPARTMENT MISMATCH - Access denied");
    return res.status(403).json({ 
      success: false, 
      message: `You can only update employees in your department. Your department: ${deptName}, Employee's department: ${employeeDeptName || 'Unknown'}` 
    });
  }
  
  console.log("Department check passed. Proceeding with update...");
  
  // Only allow specific fields to be updated by department head
  const allowedUpdates = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    sex: req.body.sex,
    typeOfPosition: req.body.typeOfPosition,
    termOfEmployment: req.body.termOfEmployment,
    contactPerson: req.body.contactPerson,
    contactPersonAddress: req.body.contactPersonAddress,
    employeeStatus: req.body.employeeStatus,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    maritalStatus: req.body.maritalStatus,
  };
  
  console.log("Fields to update:", allowedUpdates);
  
  // Remove undefined fields
  Object.keys(allowedUpdates).forEach(key => {
    if (allowedUpdates[key] !== undefined) {
      employee[key] = allowedUpdates[key];
    }
  });
  
  const updatedEmployee = await employee.save();
  
  console.log("Update successful!");
  
  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: updatedEmployee
  });
});

// ================================
// DELETE Employee by Department Head
// ================================
export const deleteEmployeeByDeptHead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Get department head's department
  const deptHead = await Employee.findById(req.user._id).populate("department", "_id name");
  
  if (!deptHead.department) {
    return res.status(400).json({ 
      success: false, 
      message: "Department not assigned" 
    });
  }
  
  const deptName = deptHead.department.name;
  
  // Find employee in the same department
  const employee = await Employee.findOne({
    _id: id,
    "department.name": deptName
  });
  
  if (!employee) {
    return res.status(404).json({ 
      success: false, 
      message: "Employee not found in your department" 
    });
  }
  
  // Soft delete - mark as terminated
  employee.employeeStatus = "Terminated";
  employee.status = "Terminated";
  await employee.save();
  
  res.status(200).json({
    success: true,
    message: "Employee terminated successfully",
    data: { id: employee._id, status: "Terminated" }
  });
});

// ================================
// GET Notifications for Specific Department Head
// ================================
export const getDeptHeadNotifications = asyncHandler(async (req, res) => {
  console.log("Fetching notifications for department head:", req.user._id);
  
  const notifications = await Notification.find({
    $or: [
      { recipient: req.user._id }, // Directly to this department head
      { 
        recipientRole: "departmenthead", 
        "metadata.departmentId": req.user.department // To all department heads of this department
      }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(100);

  console.log(`Found ${notifications.length} notifications for department head ${req.user._id}`);
  
  res.status(200).json(notifications);
});

// ================================
// MARK Notification as Read for Department Head
// ================================
export const markDeptHeadNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  console.log("Marking notification as read:", {
    notificationId,
    departmentHeadId: req.user._id
  });

  const notification = await Notification.findOne({
    _id: notificationId,
    $or: [
      { recipient: req.user._id },
      { 
        recipientRole: "departmenthead", 
        "metadata.departmentId": req.user.department 
      }
    ]
  });

  if (!notification) {
    console.log("Notification not found or not authorized");
    return res.status(404).json({ 
      message: "Notification not found or not authorized" 
    });
  }

  notification.seen = true;
  await notification.save();

  console.log("Notification marked as read successfully");

  res.status(200).json({
    message: "Notification marked as read",
    notification
  });
});

// ================================
// DELETE Notification for Department Head
// ================================
export const deleteDeptHeadNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  console.log("Deleting notification:", {
    notificationId,
    departmentHeadId: req.user._id
  });

  const notification = await Notification.findOne({
    _id: notificationId,
    $or: [
      { recipient: req.user._id },
      { 
        recipientRole: "departmenthead", 
        "metadata.departmentId": req.user.department 
      }
    ]
  });

  if (!notification) {
    console.log("Notification not found or not authorized");
    return res.status(404).json({ 
      message: "Notification not found or not authorized" 
    });
  }

  await notification.deleteOne();

  console.log("Notification deleted successfully");

  res.status(200).json({
    message: "Notification deleted successfully"
  });
});

// ================================
// UPDATE Department Head Photo
// ================================
// ================================
// UPDATE Department Head Photo
// ================================
export const updateDeptHeadPhoto = asyncHandler(async (req, res) => {
  try {
    const deptHead = await Employee.findById(req.user._id);
    
    if (!deptHead) {
      return res.status(404).json({ 
        success: false, 
        message: "Department Head not found" 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload a photo" 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file type. Only JPG, PNG, and GIF are allowed" 
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: "File size too large. Maximum size is 5MB" 
      });
    }

    // Save the file path - CHANGED TO YOUR DESIRED PATH
    const photoPath = `/uploads/photos/${req.file.filename}`;
    deptHead.photo = photoPath;

    await deptHead.save();

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      photo: deptHead.photo, // Return photo path
      photoUrl: `${req.protocol}://${req.get('host')}${deptHead.photo}` // Return full URL for compatibility
    });

  } catch (error) {
    console.error("Photo upload error:", error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: "File size too large. Maximum size is 5MB" 
      });
    }
    
    if (error.message && error.message.includes('Only image files')) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file type. Only JPG, PNG, and GIF are allowed" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to upload photo",
      error: error.message 
    });
  }
});

// ================================
// DELETE Department Head Photo
// ================================
export const deleteDeptHeadPhoto = asyncHandler(async (req, res) => {
  try {
    const deptHead = await Employee.findById(req.user._id);
    
    if (!deptHead) {
      return res.status(404).json({ 
        success: false, 
        message: "Department Head not found" 
      });
    }

    // Delete the actual file from storage - CHANGED PATH
    if (deptHead.photo && deptHead.photo.startsWith('/uploads/photos/')) {
      try {
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'photos', path.basename(deptHead.photo));
        await fs.unlink(filePath);
      } catch (fileErr) {
        console.log("File not found or already deleted, continuing...");
      }
    }

    // Clear the photo field
    deptHead.photo = null;
    await deptHead.save();

    res.status(200).json({
      success: true,
      message: "Photo removed successfully"
    });

  } catch (error) {
    console.error("Photo removal error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to remove photo",
      error: error.message 
    });
  }
});