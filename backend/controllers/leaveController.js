import asyncHandler from "express-async-handler";
import LeaveRequest from "../models/LeaveRequest.js";
import Notification from "../models/Notification.js";

// -------------------- Create Leave Request --------------------
// -------------------- Create Leave Request --------------------
export const createLeaveRequest = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;

  if (!startDate || !endDate || !reason) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const employee = req.user;
  if (!employee || !employee.email) {
    res.status(400);
    throw new Error("Employee not found or missing email");
  }

  const attachments = req.files?.map((file) => file.path) || [];

  const leaveRequest = await LeaveRequest.create({
    employee: employee._id,
    employeeName: `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`,
    employeeEmail: employee.email,
    department: employee.department?.name || "Unknown",
    role: employee.role,
    startDate,
    endDate,
    reason,
    attachments,
    status: "pending",
  });

  // ✅ Add leaveRequestId to notification
  await Notification.create({
    type: "Leave", // leave-specific
    message: `${employee.firstName} ${employee.lastName} from ${employee.department?.name} requested leave from ${startDate} to ${endDate}`,
    recipientRole: "Admin",
    status: "pending",
    employee: { name: `${employee.firstName} ${employee.lastName}`, email: employee.email },
    leaveRequestId: leaveRequest._id, // <--- important for frontend approve/reject
  });

  res.status(201).json({ leaveRequest, message: "Leave request sent to Admin" });
});

// -------------------- Get Department Leave Requests --------------------
export const getDepartmentLeaveRequests = async (req, res) => {
  const deptId = req.query.department;
  const status = req.query.status || "pending";

  if (!deptId) return res.status(400).json({ message: "Department ID required" });

  try {
    const requests = await LeaveRequest.find({ department: deptId, status })
      .populate("employee", "firstName lastName");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// -------------------- Update Leave Request Status --------------------
export const updateLeaveRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["approved", "rejected"];
  if (!validStatus.includes(status.toLowerCase())) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const leaveRequest = await LeaveRequest.findById(id);
  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  leaveRequest.status = status.toLowerCase();
  await leaveRequest.save();

  // Notify DeptHead
  await Notification.create({
    type: "Leave",
    message: `Leave request from ${leaveRequest.employeeName} (${leaveRequest.startDate.toLocaleDateString()} - ${leaveRequest.endDate.toLocaleDateString()}) has been ${status.toLowerCase()}`,
    recipientRole: "DepartmentHead",
    status: status.toLowerCase(),
    employee: { name: leaveRequest.employeeName, email: leaveRequest.employeeEmail },
  });

  // Notify Employee
  await Notification.create({
    type: "Leave",
    message: `Your leave request (${leaveRequest.startDate.toLocaleDateString()} to ${leaveRequest.endDate.toLocaleDateString()}) has been ${status.toLowerCase()}.`,
    recipientRole: "Employee",
    status: status.toLowerCase(),
    employee: { name: leaveRequest.employeeName, email: leaveRequest.employeeEmail },
  });

  res.json({
    message: `Leave request ${status.toLowerCase()} successfully`,
    leaveRequest,
  });
});
