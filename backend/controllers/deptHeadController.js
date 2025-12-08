import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// ================================
// GET Department Head Profile
// ================================
export const getDeptHeadProfile = asyncHandler(async (req, res) => {
  const deptHead = await Employee.findById(req.user._id)
    .select("-password")
    .populate("department", "_id name");

  if (!deptHead) {
    return res.status(404).json({ message: "Department Head not found" });
  }

  if (deptHead.role?.toLowerCase() !== "departmenthead") {
    return res
      .status(403)
      .json({ message: "Not authorized as Department Head" });
  }

  return res.status(200).json({
    _id: deptHead._id,
    username: deptHead.username,
    firstName: deptHead.firstName || "",
    middleName: deptHead.middleName || "",
    lastName: deptHead.lastName || "",
    email: deptHead.email,
    phone: deptHead.phone || deptHead.phoneNumber || "",
    department: {
      _id: deptHead.department?._id,
      name: deptHead.department?.name,
    },
    address: deptHead.address || "",
    role: deptHead.role,
    photo: deptHead.photo || "",
    empId: deptHead.empId || "",
    typeOfPosition: deptHead.typeOfPosition || "Department Head",
    salary: deptHead.salary || "",
    experience: deptHead.experience || "",
    contactPerson: deptHead.contactPerson || "",
    contactPersonAddress: deptHead.contactPersonAddress || "",
    employeeStatus: deptHead.employeeStatus || deptHead.status || "Active",
  });
});

// ================================
// UPDATE Department Head Profile
// ================================
export const updateDeptHeadProfile = asyncHandler(async (req, res) => {
  const { username, email, phone, address, password } = req.body;

  const deptHead = await Employee.findById(req.user._id).populate(
    "department",
    "_id name"
  );

  if (!deptHead) {
    return res.status(404).json({ message: "Department Head not found" });
  }

  if (deptHead.role?.toLowerCase() !== "departmenthead") {
    return res
      .status(403)
      .json({ message: "Not authorized as Department Head" });
  }

  deptHead.username = username || deptHead.username;
  deptHead.email = email || deptHead.email;
  deptHead.phone = phone || deptHead.phone;
  deptHead.address = address || deptHead.address;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    deptHead.password = await bcrypt.hash(password, salt);
  }

  if (req.file) {
    deptHead.photo = req.file.path;
  }

  const updated = await deptHead.save();

  res.status(200).json({
    _id: updated._id,
    username: updated.username,
    firstName: updated.firstName || "",
    middleName: updated.middleName || "",
    lastName: updated.lastName || "",
    email: updated.email,
    phone: updated.phone || "",
    department: {
      _id: updated.department?._id,
      name: updated.department?.name,
    },
    address: updated.address || "",
    role: updated.role,
    photo: updated.photo || "",
    empId: updated.empId || "",
    typeOfPosition: updated.typeOfPosition || "Department Head",
    salary: updated.salary || "",
    experience: updated.experience || "",
    contactPerson: updated.contactPerson || "",
    contactPersonAddress: updated.contactPersonAddress || "",
    employeeStatus:
      updated.employeeStatus || updated.status || "Active",
  });
});

// ================================
// UPDATE Department Head Password
// ================================
export const updateDeptHeadPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Both current and new password are required");
  }

  const deptHead = await Employee.findById(req.user._id);
  if (!deptHead) {
    res.status(404);
    throw new Error("Department Head not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    deptHead.password
  );

  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  deptHead.password = await bcrypt.hash(newPassword, salt);

  await deptHead.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
});
