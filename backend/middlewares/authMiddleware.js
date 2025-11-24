import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";



// -------------------- Protect route --------------------
// Normalize helper
const normalizeRole = (role) =>
  role?.toLowerCase().replace(/\s+/g, "") || "employee";

// -------------------- Protect route --------------------
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user =
        (await User.findById(decoded.id)
          .select("-password")
          .populate("department", "name")) ||
        (await Employee.findById(decoded.id)
          .select("-password")
          .populate("department", "name"));

      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = {
        ...user.toObject(),
        role: normalizeRole(user.role),
      };

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
});

// -------------------- Department Head middleware --------------------
export const deptHead = (req, res, next) => {
  const normalizedRole = normalizeRole(req.user?.role);

  if (normalizedRole === "departmenthead") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as Department Head" });
};


// -------------------- Admin middleware --------------------
export const admin = (req, res, next) => {
  if (req.user?.role === "admin") return next(); // normalized
  return res.status(403).json({ message: "Access denied, admin only" });
};





// -------------------- Role-based authorization --------------------
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "User role not found" });
    }

    const normalizedUserRole = req.user.role.toLowerCase().replace(/\s+/g, "");

    const allowedRoles = roles.map(r =>
      r.toLowerCase().replace(/\s+/g, "")
    );

    if (!allowedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({ message: "User role not authorized" });
    }

    next();
  };
};
export const authorizeNotificationDelete = async (req, res, next) => {
  try {
    const userRole = req.user.role?.toLowerCase();
    const userEmail = req.user.email?.toLowerCase();

    // Admin can delete anything
    if (userRole === "admin") return next();

    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Normalize role from DB
    const notifRole = notif.recipientRole?.toLowerCase();

    // Department Head (match either "departmenthead" or "depthead")
    if (
      userRole === "departmenthead" &&
      ["departmenthead", "depthead", "dept head"].includes(notifRole)
    ) {
      return next();
    }

    // Employee (match email)
    if (
      userRole === "employee" &&
      notif.employee?.email?.toLowerCase() === userEmail
    ) {
      return next();
    }

    return res.status(403).json({ message: "Not authorized" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// Aliases
export const authorizeDeptHead = deptHead;
export const adminOnly = admin;
