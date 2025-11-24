import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Vacancy from "../models/Vacancy.js";
import JobApplication from "../models/JobApplication.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalVacancies = await Vacancy.countDocuments();
    const totalApplications = await JobApplication.countDocuments();

    const recentEmployees = await Employee.find().sort({ createdAt: -1 }).limit(5);
    const recentVacancies = await Vacancy.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalEmployees,
      totalDepartments,
      totalVacancies,
      totalApplications,
      recentEmployees,
      recentVacancies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
