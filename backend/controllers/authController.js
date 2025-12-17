// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { randomBytes, createHash } from "crypto";
import nodemailer from "nodemailer";


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


// ========== FORGOT PASSWORD ==========
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenHash = createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"DTU HRMS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link to reset your password:</p><a href="${resetURL}">${resetURL}</a>`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ========== RESET PASSWORD ==========
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Employee.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired token" });

    user.password = password; // hashed by userModel pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
