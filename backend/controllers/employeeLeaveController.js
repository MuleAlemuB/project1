// backend/controllers/employeeLeaveController.js
import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";

// ---------------- Employee submits leave request ----------------
export const createEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const employee = req.user;
  if (!employee) {
    res.status(401);
    throw new Error("User not found");
  }

  const attachments = req.files?.map((file) => file.path) || [];

  const leaveRequest = await LeaveRequest.create({
    employee: employee._id,
    employeeEmail: employee.email,
    employeeName: `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`,
    department: employee.department?.name || "Unknown",
    role: employee.role,
    startDate,
    endDate,
    reason,
    attachments,
    status: "pending",
  });

  // Notification to DeptHead
  await Notification.create({
    type: "Leave",
    message: `${employee.firstName} ${employee.lastName} requested leave from ${startDate} to ${endDate}`,
    recipientRole: "DepartmentHead",
    department: employee.department?.name,
    status: "pending",
    employee: { name: `${employee.firstName} ${employee.lastName}`, email: employee.email },
    leaveRequestId: leaveRequest._id,
  });

  res.status(201).json({ leaveRequest, message: "Leave request sent to DeptHead" });
});

// ---------------- Get all leave requests for DeptHead ----------------
export const getDeptHeadLeaveRequests = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const leaveRequests = await LeaveRequest.find({ department: user.department.name }).sort({ createdAt: -1 });
  res.json(leaveRequests);
});

// ---------------- DeptHead Approve/Reject leave request ----------------
export const updateEmployeeLeaveRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "rejected"

  const deptHead = req.user;
  if (deptHead.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leaveRequest.department !== deptHead.department.name) {
    res.status(403);
    throw new Error("Cannot update leave requests of another department");
  }

  leaveRequest.status = status;
  await leaveRequest.save();

  // Notify employee
  await Notification.create({
    type: "Leave",
    message: `Your leave request from ${leaveRequest.startDate.toLocaleDateString()} to ${leaveRequest.endDate.toLocaleDateString()} has been ${status}`,
    recipientRole: "Employee",
    employee: {
      name: leaveRequest.employeeName,
      email: leaveRequest.employeeEmail,
    },
    leaveRequestId: leaveRequest._id,
    status,
  });

  res.json({ message: `Leave request ${status}`, leaveRequest });
});

// ---------------- Delete leave request (DeptHead only) ----------------
export const deleteEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deptHead = req.user;

  if (deptHead.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  if (leaveRequest.department !== deptHead.department.name) {
    res.status(403);
    throw new Error("Cannot delete leave requests of another department");
  }

  await leaveRequest.deleteOne();
  res.json({ message: "Leave request deleted successfully" });
});

