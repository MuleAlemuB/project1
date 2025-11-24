// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import asyncHandler from "express-async-handler";

// Login user
export const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // Validate request
    if (!email || !password || !role)
      return res.status(400).json({ message: "Please provide all fields" });

    // Normalize input
    email = email.toLowerCase().trim();
    role = role.toLowerCase().trim();

    // Find user by email
    const user = await Employee.findOne({ email: email.trim().toLowerCase() });
if (!user) return res.status(400).json({ message: "User not found" });

if (user.role.trim().toLowerCase() !== role.trim().toLowerCase())
  return res.status(400).json({ message: "Role mismatch" });


    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with user info
    res.json({
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department || null,
      empId: user.empId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current logged-in user
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    department: req.user.department?.name || "", // populated department name
    address: req.user.address,
  });
});