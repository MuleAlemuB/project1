// controllers/employeeLeaveController.js
import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";
import Employee from "../models/Employee.js";

// ---------------- Employee submits leave request ----------------
export const createEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const employee = req.user;

  // Handle attachments properly
  let attachments = [];
  if (req.files && req.files.length > 0) {
    attachments = req.files.map(f => ({
      name: f.originalname,
      url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
    }));
  }

  const leave = await LeaveRequest.create({
    requester: employee._id,
    requesterModel: "Employee",
    requesterRole: "Employee",
    targetRole: "DepartmentHead",
    department: employee.department?.name || employee.department,
    requesterName: `${employee.firstName} ${employee.lastName}`,
    requesterEmail: employee.email,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
    attachments: attachments, // Now matches the schema
    status: "pending"
  });

  // ✅ Optional notification to Dept Head
  await Notification.create({
    type: "Leave",
    message: `${leave.requesterName} submitted a leave request`,
    recipientRole: "DepartmentHead",
    department: leave.department,
    leaveRequestId: leave._id,
  });

  res.status(201).json({
    message: "Leave request sent to Department Head",
    leave,
  });
});

// Get leave requests for logged-in employee
export const getMyLeaveRequests = asyncHandler(async (req, res) => {
  // FIX: Use correct field name - it's 'requester' not 'employee'
  const leaves = await LeaveRequest.find({ 
    requester: req.user._id,
    requesterModel: "Employee"
  }).sort({ createdAt: -1 });
  
  res.json(leaves);
});

// Delete a leave request by ID
export const deleteLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  // Only allow owner to delete
  if (leave.requester.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this leave request");
  }

  await leave.deleteOne();
  res.json({ message: "Leave request deleted" });
});

// For Department Head - Get leave requests (pending ones)
export const getDeptHeadLeaveRequests = asyncHandler(async (req, res) => {
  const deptName = req.user.department?.name || req.user.department;

  const requests = await LeaveRequest.find({
    targetRole: "DepartmentHead",
    department: deptName,
    status: "pending" // Usually dept head sees pending requests
  }).sort({ createdAt: -1 });

  res.json(requests);
});

// NEW ENDPOINT: For Department Head - Get previous/decided leave requests
export const getPreviousLeaveRequests = asyncHandler(async (req, res) => {
  const deptName = req.user.department?.name || req.user.department;

  const requests = await LeaveRequest.find({
    targetRole: "DepartmentHead",
    department: deptName,
    status: { $in: ["approved", "rejected"] } // Only approved or rejected
  }).sort({ updatedAt: -1 }); // Sort by decision date (updatedAt)

  res.json(requests);
});

// For Department Head - Update status
export const updateEmployeeLeaveRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "rejected"

  if (req.user.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const deptName = req.user.department?.name || req.user.department;

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leaveRequest.department !== deptName) {
    res.status(403);
    throw new Error("Cannot update another department request");
  }

  // Validate status
  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be either 'approved' or 'rejected'");
  }

  leaveRequest.status = status;
  leaveRequest.approvedBy = `${req.user.firstName} ${req.user.lastName}`;
  await leaveRequest.save();

  // ✅ Create notification for employee
  await Notification.create({
    type: "Leave",
    message: `Your leave request (${leaveRequest.startDate.toDateString()} - ${leaveRequest.endDate.toDateString()}) was ${status}`,
    recipientRole: "Employee",
    employee: {
      _id: leaveRequest.requester,
      email: leaveRequest.requesterEmail,
      name: leaveRequest.requesterName,
    },
    leaveRequestId: leaveRequest._id,
    status,
    seen: false,
  });

  res.json({
    message: `Leave request ${status}`,
    leaveRequest,
  });
});

// For Department Head - Delete request
export const deleteEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const deptName = req.user.department?.name || req.user.department;

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leaveRequest.department !== deptName) {
    res.status(403);
    throw new Error("Cannot delete another department request");
  }

  await leaveRequest.deleteOne();
  res.json({ message: "Leave request deleted successfully" });
});