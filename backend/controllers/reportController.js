import asyncHandler from "express-async-handler";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Vacancy from "../models/Vacancy.js";
import Leave from "../models/LeaveRequest.js";

// @desc    Get admin report with all employee details
// @route   GET /api/reports/admin
// @access  Admin
export const getAdminReport = asyncHandler(async (req, res) => {
  // Fetch all employees
  const employees = await Employee.find().populate("department", "name");


  // Stats
  const totalEmployees = employees.length;
  const totalDepartments = await Department.countDocuments();
  const totalVacancies = await Vacancy.countDocuments();
  const totalLeaveRequests = await Leave.countDocuments();
  const totalJobApplications = 0; // Update if you track job applications
  const totalNewEmployees = 0; // Update if you track new employees

  // Map all employee details for frontend
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
    absentDays: e.absentDays || 0,
    leaveRequests: e.leaveRequests?.length || 0,
  }));

  // Send response
  res.json({
    totalEmployees,
    totalDepartments,
    totalVacancies,
    totalJobApplications,
    totalLeaveRequests,
    totalNewEmployees,
    employees: employeeDetails,
  });
});
