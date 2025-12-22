import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";

/**
 * DeptHead applies leave → Admin
 */
export const createLeaveRequest = asyncHandler(async (req, res) => {
  const user = req.user;
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (user.role !== "departmenthead") {
    res.status(403);
    throw new Error("Only DeptHead can apply leave to Admin");
  }

  // map files to include name + url
  const attachments = req.files?.map((f) => ({
    name: f.originalname, // original uploaded file name
    url: f.path,          // server path to file
    uploadedAt: new Date(),
  })) || [];

  const leave = await LeaveRequest.create({
    requester: user._id,
    requesterModel: "User",
    requesterRole: "DepartmentHead",
    targetRole: "Admin",
    requesterName: `${user.firstName} ${user.lastName}`,
    requesterEmail: user.email,
    department: user.department?.name,
    startDate,
    endDate,
    reason,
    attachments,
    status: "pending",
  });

  await Notification.create({
    type: "Leave",
    recipientRole: "Admin",
    department: user.department?.name,
    message: `Department Head ${user.firstName} ${user.lastName} requested leave from ${startDate} to ${endDate}`,
    leaveRequestId: leave._id,
    status: "pending",
  });

  res.status(201).json({ message: "Leave request sent to Admin", leave });
});

/**
 * Inbox view (DeptHead or Admin)
 */
export const getInboxLeaveRequests = asyncHandler(async (req, res) => {
  const user = req.user;

  let targetRole;
  if (user.role === "departmenthead") targetRole = "DepartmentHead";
  else if (user.role === "admin") targetRole = "Admin";

  const filter = { targetRole, status: "pending" };
  if (user.role === "departmenthead") filter.department = user.department.name;

  const requests = await LeaveRequest.find(filter).sort({ createdAt: -1 });
  res.json(requests);
});

/**
 * Approve / Reject leave
 */
export const decideLeaveRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  const userRoleCapitalized = user.role === "departmenthead" ? "DepartmentHead" : "Admin";
  if (leave.targetRole !== userRoleCapitalized) {
    res.status(403);
    throw new Error("Not authorized to act on this leave");
  }

  if (user.role === "departmenthead" && leave.department !== user.department.name) {
    res.status(403);
    throw new Error("Department mismatch");
  }

  leave.status = status;
  await leave.save();

  await Notification.create({
    type: "Leave",
    recipientRole: leave.requesterRole,
    message: `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} was ${status}`,
    leaveRequestId: leave._id,
    status,
  });

  res.json({ message: `Leave request ${status} successfully`, leave });
});

/**
 * Get my leave requests (DeptHead or Employee)
 */
export const getMyLeaveRequests = asyncHandler(async (req, res) => {
  const user = req.user;

  const filter = {
    requester: user._id,
  };

  const leaves = await LeaveRequest.find(filter).sort({ createdAt: -1 });
  res.json(leaves);
});

/**
 * DELETE leave request
 */
export const deleteLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  await LeaveRequest.deleteOne({ _id: leave._id });
  res.status(200).json({ message: "Leave request deleted successfully" });
});
