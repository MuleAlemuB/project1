import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js"; // ✅ Import Department model
import Notification from "../models/Notification.js";

// Bulk create/update attendance
export const bulkAttendance = asyncHandler(async (req, res) => {
  const { records } = req.body;
  if (!records || !Array.isArray(records))
    return res.status(400).json({ message: "Invalid records" });

  const results = [];

  for (const rec of records) {
    const employee = await Employee.findById(rec.employeeId);
    if (!employee) continue;

    const deptId = employee.department;

    const att = await Attendance.findOneAndUpdate(
      { employeeId: rec.employeeId, date: rec.date },
      { status: rec.status, department: deptId },
      { new: true, upsert: true }
    );

    results.push(att);

    if (rec.status === "Absent") {
      // Check for 7 consecutive absences including today
      const today = new Date(rec.date);
      const past6Dates = [];
      for (let i = 1; i <= 6; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        past6Dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
      }

      const past6Absences = await Attendance.find({
        employeeId: rec.employeeId,
        date: { $in: past6Dates },
        status: "Absent",
      });

      if (past6Absences.length === 6) {
        await Notification.create({
          title: `Employee ${employee.firstName} ${employee.lastName} absent 7 consecutive days`,
          message: `Employee ${employee.firstName} ${employee.lastName} from department ${deptId} has been absent for 7 consecutive days.`,
          recipientRole: "admin",
          read: false,
        });
      }
    }
  }

  res.json(results);
});



// ✅ Get attendance for a department on a specific date
export const getDepartmentAttendance = asyncHandler(async (req, res) => {
  const { department, date } = req.query;
  if (!department || !date)
    return res.status(400).json({ message: "Department and date required" });

  // Find the department by name or use ObjectId
  let deptDoc;
  if (mongoose.Types.ObjectId.isValid(department)) {
    deptDoc = await Department.findById(department);
  } else {
    deptDoc = await Department.findOne({ name: department });
  }

  if (!deptDoc)
    return res.status(404).json({ message: "Department not found" });

  const records = await Attendance.find({ department: deptDoc._id, date })
    .populate("employeeId", "firstName lastName photo");

  res.json(records);
});

// ✅ Get full attendance history by department
export const getAttendanceHistory = asyncHandler(async (req, res) => {
  const { department } = req.query;
  if (!department) return res.status(400).json({ message: "Department required" });

  let deptDoc;
  if (mongoose.Types.ObjectId.isValid(department)) {
    deptDoc = await Department.findById(department);
  } else {
    deptDoc = await Department.findOne({ name: department });
  }

  if (!deptDoc)
    return res.status(404).json({ message: "Department not found" });

  const allAttendance = await Attendance.find({ department: deptDoc._id })
    .populate("employeeId", "firstName lastName photo")
    .sort({ date: -1 });

  const historyMap = {};
  allAttendance.forEach((record) => {
    if (!historyMap[record.date]) historyMap[record.date] = [];
    historyMap[record.date].push({
      employeeId: record.employeeId._id,
      status: record.status,
    });
  });

  const history = Object.keys(historyMap).map((date) => ({
    date,
    records: historyMap[date],
  }));

  res.json(history);
});
