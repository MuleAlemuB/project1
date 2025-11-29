// backend/controllers/employeeLeaveController.js
import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";

// ---------------- Employee submits leave request ----------------
export const createEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const employee = req.user;

  const leave = await LeaveRequest.create({
    requester: employee._id,
    requesterModel: "Employee",
    requesterRole: "employee",
    targetRole: "departmenthead",
    department: employee.department,
    requesterName: employee.name,
    requesterEmail: employee.email,
    ...req.body,
    attachments: req.files?.map(f => f.filename),
  });

  res.json({ message: "Leave request sent to Department Head", leave });
});

// ---------------- Get all leave requests for DeptHead ----------------
export const getDeptHeadLeaveRequests = asyncHandler(async (req, res) => {
  const requests = await LeaveRequest.find({
    targetRole: "departmenthead",
    department: req.user.department,
  }).sort({ createdAt: -1 });

  res.json(requests);
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

