import asyncHandler from "express-async-handler";
import Requisition from "../models/Requisition.js";
import Notification from "../models/Notification.js";

// ---------------- Create a new requisition (DeptHead) ----------------




// ---------------- Create a new requisition (DeptHead) ----------------
export const createRequisition = asyncHandler(async (req, res) => {
  // Extract text fields from the request body
  const {
    position,
    quantity,
    term,
    education,
    sex,
    experience,
    date,
    department,
  } = req.body;

  // Validation
  if (!position || !quantity || !term || !education || !date || !department) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Construct requester name
  const requestedBy =
    req.user.username || `${req.user.firstName || ""} ${req.user.lastName || ""}`;

  // Handle attachments uploaded via multer
  const attachments = req.files ? req.files.map((file) => file.path) : [];

  // Create the requisition
  const requisition = await Requisition.create({
    requestedBy,
    requestedById: req.user._id,
    requestedByEmail: req.user.email,
    position,
    quantity,
    termOfEmployment: term,
    educationalLevel: education,
    sex,
    experience,
    department,
    date,
    attachments,
  });

  // Create a notification for Admin with a proper reference to the requisition ID
  await Notification.create({
  type: "Requisition",
  message: `New requisition from ${requestedBy} for ${quantity} ${position}(s) in ${department} department.`,
  reference: requisition._id.toString(), // THIS MUST EXIST
  typeRef: "Requisition",
  seen: false,
  recipientRole: "Admin", // Make sure "Admin" matches your enum
  department,
  status: "pending",
});


  res.status(201).json({
    message: "Requisition created successfully and admin notified",
    requisition,
  });
});

// ---------------- Get all requisitions (Admin) ----------------
export const getRequisitions = asyncHandler(async (req, res) => {
  const requisitions = await Requisition.find().sort({ createdAt: -1 });
  res.json(requisitions);
});

// ---------------- Get DeptHead requisitions ----------------
export const getDeptHeadRequisitions = asyncHandler(async (req, res) => {
  const requisitions = await Requisition.find({ requestedById: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(requisitions);
});

// ---------------- Update requisition status (Admin) ----------------
export const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const requisition = await Requisition.findById(id);
  if (!requisition) {
    res.status(404);
    throw new Error("Requisition not found");
  }

  requisition.status = status;
  await requisition.save();

  // Notify DeptHead
  await Notification.create({
    type: "Requisition",
    message: `Your requisition for ${requisition.quantity} ${requisition.position}(s) in ${requisition.department} has been ${status}.`,
    reference: requisition._id,
    typeRef: "Requisition",
    seen: false,
    recipientRole: "DepartmentHead",
    department: requisition.department,
    status,
    employee: {
      name: requisition.requestedBy,
      email: requisition.requestedByEmail || "",
    },
  });

  res.json({
    message: `Requisition ${status} successfully`,
    requisition,
  });
});
export const deleteRequisition = async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);

    if (!requisition) {
      return res.status(404).json({ message: "Requisition not found" });
    }

    // Use deleteOne on the found document
    await Requisition.deleteOne({ _id: req.params.id });

    res.json({ message: "Requisition deleted successfully" });
  } catch (err) {
    console.error("Delete requisition error:", err);
    res.status(500).json({ message: "Server error" });
  }
};