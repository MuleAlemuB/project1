// routes/admin.js
import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAdminProfile,
  updateAdminProfile,
   getMe // <-- new controller for admin profile
} from "../controllers/adminController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { changePassword } from "../controllers/adminController.js";
import { markAsSeen } from "../controllers/notificationController.js";
import {
  handleLeaveDecision,
  handleRequisitionDecision,
} from "../controllers/adminController.js";
import Requisition from "../models/Requisition.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js"

const router = express.Router();

// Apply protect + admin middleware to all routes
router.use(protect);
router.use(admin);

// Employee routes
router.get("/employees", getAllEmployees);           // Get all employees
router.get("/employees/:id", getEmployeeById);       // Get single employee
router.put("/employees/:id", updateEmployee);        // Update employee
router.delete("/employees/:id", deleteEmployee);     // Delete employee

// Dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// Department routes
router.route("/departments")
  .get(getDepartments)
  .post(createDepartment);

router.route("/departments/:id")
  .put(updateDepartment)
  .delete(deleteDepartment);

// Admin profile route (fetch logged-in admin info)
router.get("/me", getAdminProfile);
router.put("/me", updateAdminProfile);
router.get("/me", protect, admin, getMe);


// Get all applications for a vacancy
router.get("/applications/:vacancyId", async (req, res) => {
  try {
    const applications = await Application.find({ vacancy: req.params.vacancyId }).sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Download CV for an application
router.get("/applications/download/:appId", async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const filePath = path.join(process.cwd(), "uploads/resumes", application.resume);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Failed to download resume" });
  }
});

// Get all vacancies with new application count (last 24h)
router.get("/vacancies/notifications", async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHrsAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const vacancies = await Vacancy.find();

    const data = await Promise.all(vacancies.map(async (vac) => {
      const newApplications = await Application.countDocuments({
        vacancy: vac._id,
        appliedAt: { $gte: twentyFourHrsAgo },
      });
      return { ...vac.toObject(), newApplications };
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vacancy notifications" });
  }
});
router.put("/change-password", changePassword);
router.put("/change-password", protect, async (req, res) => {
  const { current, new: newPassword } = req.body;

  if (!current || !newPassword) return res.status(400).json({ message: "All fields required" });

  const admin = await Employee.findById(req.user._id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  // Verify current password
  const match = await bcrypt.compare(current, admin.password);
  if (!match) return res.status(400).json({ message: "Current password is incorrect" });

  // Hash and update new password
  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.json({ message: "Password updated successfully" });
});
router.put("/notifications/:id/seen", protect, admin, markAsSeen);
// ✅ new routes for approve/reject
router.put("/leave/:id/decision", protect, handleLeaveDecision);
router.put(
  "/requisition/:id/decision",
  protect,
  admin,
  async (req, res) => {
    console.log("PUT /requisition/:id/decision called with ID:", req.params.id);
    try {
      const requisition = await Requisition.findById(req.params.id).populate("requestedBy");
      if (!requisition) {
        console.log("Requisition not found in DB for ID:", req.params.id);
        return res.status(404).json({ message: "Requisition not found" });
      }

      const { status } = req.body; // "Approved" or "Rejected"
      if (!status || !["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      requisition.status = status;
      await requisition.save();

      console.log("Requisition updated:", requisition);

      // Notify Dept Head
      const deptHead = await User.findOne({
        department: requisition.department,
        role: "Department Head",
      });

      if (deptHead) {
        await Notification.create({
          receiver: deptHead._id,
          type: "RequisitionResponse",
          message: `Requisition for ${requisition.position || requisition.typeOfPosition} was ${status} by HR.`,
          status,
          seen: false,
        });
        console.log("Notification sent to Dept Head:", deptHead._id);
      }

      res.json({ message: `Requisition ${status} successfully.`, requisition });
    } catch (err) {
      console.error("Error handling requisition decision:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);
export default router;