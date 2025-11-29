import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Vacancy from "../models/Vacancy.js";
import Leave from "../models/LeaveRequest.js";
import Attendance from "../models/Attendance.js";
import Requisition from "../models/Requisition.js"; // Add your Requisition model

// @desc    Get admin report with all employee details
// @route   GET /api/reports/admin
// @access  Admin
export const getAdminReport = asyncHandler(async (req, res) => {
  // Fetch all employees with department name
  const employees = await Employee.find().populate("department", "name");

  // Total counts
  const totalEmployees = employees.length;
  const totalDepartments = await Department.countDocuments();

  // Only count accepted/posting items
  const totalVacancies = await Vacancy.countDocuments({ status: "Posted" });
  const totalRequisitions = await Requisition.countDocuments({ status: "Accepted" });
  const totalLeaves = await Leave.countDocuments({ status: "Accepted" });

  // Aggregate absent days for all employees
  const absentAgg = await Attendance.aggregate([
    { $match: { status: "Absent" } },
    { $group: { _id: "$employeeId", count: { $sum: 1 } } },
  ]);
  const absentMap = {};
  absentAgg.forEach(a => { absentMap[a._id.toString()] = a.count });

  // Aggregate leave requests per employee (accepted only)
  const leaveAgg = await Leave.aggregate([
    { $match: { status: "Accepted" } },
    { $group: { _id: "$employee", count: { $sum: 1 } } },
  ]);
  const leaveMap = {};
  leaveAgg.forEach(l => { leaveMap[l._id.toString()] = l.count });

  // Map employee details
  const employeeDetails = employees.map((e) => ({
    _id: e._id,
    firstName: e.firstName,
    middleName: e.middleName,
    lastName: e.lastName,
    email: e.email,
    empId: e.empId,
    department: e.department,
    typeOfPosition: e.typeOfPosition,
    termOfEmployment: e.termOfEmployment,
    sex: e.sex,
    maritalStatus: e.maritalStatus,
    phoneNumber: e.phoneNumber,
    address: e.address,
    contactPerson: e.contactPerson,
    contactPersonAddress: e.contactPersonAddress,
    salary: e.salary,
    experience: e.experience,
    qualification: e.qualification,
    dateOfBirth: e.dateOfBirth,
    employeeStatus: e.employeeStatus,
    photo: e.photo,
    absentDays: absentMap[e._id.toString()] || 0,
    leaveRequests: leaveMap[e._id.toString()] || 0,
  }));

  // Send response
  res.json({
    totalEmployees,
    totalDepartments,
    totalVacancies,
    totalRequisitions,
    totalLeaveRequests: totalLeaves,
    totalNewEmployees: 0, // implement if you track newly added employees
    employees: employeeDetails,
  });
});
