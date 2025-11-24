// backend/routes/applicationRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";
import Vacancy from "../models/Vacancy.js";
import Notification from "../models/Notification.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// -------------------- MULTER CONFIG --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -------------------- ROUTES --------------------

// ✅ Apply for a vacancy (public or logged user)
router.post("/apply/:vacancyId", upload.single("resume"), async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.vacancyId);
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });

    // Create application record
    const application = await Application.create({
      vacancy: vacancy._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      resume: req.file ? req.file.filename : null,
    });

    // ✅ Create admin notification for new application
    await Notification.create({
      type: "Vacancy Application",
      message: `${application.name} applied for ${vacancy.title}`,
      recipientRole: "Admin",
      applicant: {
        name: application.name,
        email: application.email,
        phone: application.phone,
      },
      vacancy: {
        title: vacancy.title,
        department: vacancy.department || "",
      },
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all applications (admin only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find().populate("vacancy");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get applications per vacancy (admin only)
router.get("/:vacancyId", protect, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find({ vacancy: req.params.vacancyId }).populate("vacancy");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete application (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // Delete resume if exists
    if (app.resume) {
      const cvPath = path.join("uploads", app.resume);
      if (fs.existsSync(cvPath)) fs.unlinkSync(cvPath);
    }

    await app.deleteOne();
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Download resume (public/admin)
router.get("/download/:appId", async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId);
    if (!application || !application.resume)
      return res.status(404).json({ message: "Resume not found" });

    const filePath = path.join(process.cwd(), "uploads", application.resume);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found on server" });

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download resume" });
  }
});

export default router;
