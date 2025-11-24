import User from "../models/User.js";
import mongoose from "mongoose";

// Get employees by department
export const getEmployeesByDepartment = async (req, res) => {
  const { department } = req.query;
  if (!department) return res.status(400).json({ message: "Department is required" });

  try {
    // Convert to ObjectId
    const deptId = mongoose.Types.ObjectId(department);

    const employees = await User.find({ department: deptId, role: "Employee" })
      .select("_id name email role")
      .lean();

    res.json(employees);
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};
