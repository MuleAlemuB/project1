const express = require("express");
const router = express.Router();
const Vacancy = require("../models/Vacancy");

// Get all vacancies
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ postDate: -1 });
    res.json(vacancies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a vacancy with validation and proper date parsing
router.post("/", async (req, res) => {
  try {
    console.log("POST /vacancies body:", req.body); // log request body

    const {
      title,
      department,
      position,
      employmentType,
      postDate,
      deadline,
      qualification,
      experience,
      salary,
      description,
    } = req.body;

    // 1️⃣ Check required fields
    if (!title || !department || !position || !employmentType || !postDate || !deadline) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // 2️⃣ Parse dates
    const parsedPostDate = new Date(postDate);
    const parsedDeadline = new Date(deadline);

    if (isNaN(parsedPostDate) || isNaN(parsedDeadline)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // 3️⃣ Create vacancy
    const vacancy = await Vacancy.create({
      title,
      department,
      position,
      employmentType,
      postDate: parsedPostDate,
      deadline: parsedDeadline,
      qualification,
      experience,
      salary,
      description,
    });

    res.status(201).json(vacancy);
  } catch (err) {
    console.error("Error creating vacancy:", err); // log full error
    res.status(500).json({ message: err.message });
  }
});

// Update vacancy
router.put("/:id", async (req, res) => {
  try {
    // Optional: validate dates if included in update
    if (req.body.postDate) req.body.postDate = new Date(req.body.postDate);
    if (req.body.deadline) req.body.deadline = new Date(req.body.deadline);

    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
    res.json(vacancy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete vacancy
router.delete("/:id", async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "Vacancy deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
