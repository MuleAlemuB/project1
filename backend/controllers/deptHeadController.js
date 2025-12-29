import Employee from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// ================================
// 1. GET Department Head Profile
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
    contactPerson: deptHead.contactPerson || "",
    contactPersonAddress: deptHead.contactPersonAddress || "",
    employeeStatus: deptHead.employeeStatus || deptHead.status || "Active",
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

  const notifications = await Notification.countDocuments({
    $or: [
      { recipient: req.user._id, seen: false },
      { recipientRole: "DepartmentHead", seen: false },
      { recipientRole: "departmenthead", seen: false }
    ]
  });

  res.status(200).json({
    totalEmployees,
    pendingLeaves,
    notifications,
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
    message: `Leave request ${status} successfully`,
    leave: updatedLeave
  });
});

// ================================
// 7. UPDATE Department Head Profile
// ================================
export const updateDeptHeadProfile = asyncHandler(async (req, res) => {
  const { username, email, phone, address, password } = req.body;

  const deptHead = await Employee.findById(req.user._id).populate(
    "department",
    "_id name"
  );

  if (!deptHead) {
    return res.status(404).json({ message: "Department Head not found" });
  }

  deptHead.username = username || deptHead.username;
  deptHead.email = email || deptHead.email;
  deptHead.phone = phone || deptHead.phone;
  deptHead.address = address || deptHead.address;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    deptHead.password = await bcrypt.hash(password, salt);
  }

  if (req.file) {
    deptHead.photo = req.file.path;
  }

  const updated = await deptHead.save();

  res.status(200).json({
    _id: updated._id,
    username: updated.username,
    firstName: updated.firstName || "",
    middleName: updated.middleName || "",
    lastName: updated.lastName || "",
    email: updated.email,
    phone: updated.phone || "",
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
    contactPerson: updated.contactPerson || "",
    contactPersonAddress: updated.contactPersonAddress || "",
    employeeStatus: updated.employeeStatus || updated.status || "Active",
  });
});

// ================================
// 8. UPDATE Department Head Password
// ================================
export const updateDeptHeadPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required" });
  }

  const deptHead = await Employee.findById(req.user._id);
  if (!deptHead) {
    return res.status(404).json({ message: "Department Head not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, deptHead.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  deptHead.password = await bcrypt.hash(newPassword, salt);

  await deptHead.save();

  res.status(200).json({
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