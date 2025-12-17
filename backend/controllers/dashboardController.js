import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Vacancy from "../models/Vacancy.js";
import JobApplication from "../models/JobApplication.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalVacancies = await Vacancy.countDocuments({ isActive: true });
    const totalApplications = await JobApplication.countDocuments();
    const totalLeaves = await LeaveRequest.countDocuments({ status: "approved" });

    // Employees per department
    const employeePerDepartment = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentDetails"
        }
      },
      {
        $unwind: "$departmentDetails"
      },
      {
        $project: {
          department: "$departmentDetails.name",
          count: 1
        }
      }
    ]);

    // Leaves per month
    const leaves = await LeaveRequest.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const leavesPerMonth = months.map((m, i) => {
      const monthData = leaves.find(l => l._id === i + 1);
      return { month: m, count: monthData ? monthData.count : 0 };
    });

    // Recent applications (last 5)
    const recentApplications = await JobApplication.find()
      .sort({ appliedAt: -1 })
      .limit(5)
      .populate("employeeId", "firstName lastName")
      .populate("vacancyId", "position");

    // Recent vacancies (last 5)
    const recentVacancies = await Vacancy.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalEmployees,
      totalDepartments,
      totalVacancies,
      totalLeaves,
      employeePerDepartment,
      leavesPerMonth,
      recentApplications,
      recentVacancies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
