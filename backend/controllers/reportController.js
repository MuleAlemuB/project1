import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Vacancy from "../models/Vacancy.js";
import Leave from "../models/LeaveRequest.js";
import Attendance from "../models/Attendance.js";
import Requisition from "../models/Requisition.js";

// @desc    Get admin report with all employee details
// @route   GET /api/reports/admin
// @access  Admin
export const getAdminReport = asyncHandler(async (req, res) => {
  // Fetch all employees with department info
  const employees = await Employee.find().populate("department", "name");

  // Total employees and departments
  const totalEmployees = employees.length;
  const totalDepartments = await Department.countDocuments();

  // Total vacancies (all active)
  const totalVacancies = await Vacancy.countDocuments({ isActive: true });

  // Total requisitions (approved only)
  const totalRequisitions = await Requisition.countDocuments({ status: "approved" });

  // Total leave requests (approved only)
  const totalLeaveRequests = await Leave.countDocuments({ status: "approved" });

  // Total absent days per employee
  const absentAgg = await Attendance.aggregate([
    { $match: { status: "Absent" } },
    { $group: { _id: "$employeeId", count: { $sum: 1 } } },
  ]);
  const absentMap = {};
  absentAgg.forEach(a => { 
    if(a._id) absentMap[a._id.toString()] = a.count; 
  });

  // Leave requests per employee
  const leaveAgg = await Leave.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$requester", count: { $sum: 1 } } },
  ]);
  const leaveMap = {};
  leaveAgg.forEach(l => { 
    if(l._id) leaveMap[l._id.toString()] = l.count; 
  });

  // Map employee details with absent & leave counts
  const employeeDetails = employees.map(e => ({
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

  // Total employees who left (status = "Left")
  const totalLeftEmployees = await Employee.countDocuments({ employeeStatus: "Left" });

  res.json({
    totalEmployees,
    totalDepartments,
    totalVacancies,
    totalRequisitions,
    totalLeaveRequests,
    totalLeftEmployees,
    employees: employeeDetails,
  });
});
