import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";

// ---------------- Employee submits leave request ----------------
export const createEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const employee = req.user;

  const leave = await LeaveRequest.create({
    requester: employee._id,
    requesterModel: "Employee",

    // ✅ FIX: enum values must match schema
    requesterRole: "Employee",
    targetRole: "DepartmentHead",

    // ✅ FIX: store department NAME only
    department:
      employee.department?.name ||
      employee.department,

    // ✅ FIX: real full name
    requesterName: `${employee.firstName} ${employee.lastName}`,
    requesterEmail: employee.email,

    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,

    attachments: req.files?.map(f => ({
  name: f.originalname, // human-readable name
  url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}` // full URL
})) || [],
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
export const getDeptHeadLeaveRequests = asyncHandler(async (req, res) => {
  const deptName =
    req.user.department?.name || req.user.department;

  const requests = await LeaveRequest.find({
    targetRole: "DepartmentHead",
    department: deptName,
  }).sort({ createdAt: -1 });

  res.json(requests);
});
// backend/controllers/employeeLeaveController.js
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

  leaveRequest.status = status;
  await leaveRequest.save();

  // ✅ Create notification for employee
  // Notify employee after leave status update
await Notification.create({
  type: "Leave",
  message: `Your leave request (${leaveRequest.startDate.toDateString()} - ${leaveRequest.endDate.toDateString()}) was ${status}`,
  recipientRole: "Employee",
  employee: {
    _id: leaveRequest.requester,        // Employee MongoDB _id
    email: leaveRequest.requesterEmail, // Employee email
    name: leaveRequest.requesterName,   // Optional: full name
  },
  leaveRequestId: leaveRequest._id,
  status,
  seen: false,
});


  console.log("Notification created:", notif); // verify in server logs

  res.json({
    message: `Leave request ${status}`,
    leaveRequest,
  });
});

export const deleteEmployeeLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role.toLowerCase() !== "departmenthead") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const deptName =
    req.user.department?.name || req.user.department;

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
// Get leave requests for logged-in employee
export const getMyLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find({ employee: req.user._id }).sort({ createdAt: -1 });
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
  if (leave.employee.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this leave request");
  }

  await leave.remove();
  res.json({ message: "Leave request deleted" });
});