// backend/controllers/requisitionController.js
import asyncHandler from "express-async-handler";
import Requisition from "../models/Requisition.js";
import Notification from "../models/Notification.js";
import Department from "../models/Department.js";
import mongoose from "mongoose";

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
    justification,
    priority
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
  const attachments = req.files 
    ? req.files.map((file) => ({
        name: file.originalname,
        url: file.path.replace(/\\/g, "/"),
        uploadedAt: new Date()
      }))
    : [];

  // Create the requisition
  const requisition = await Requisition.create({
    requestedBy,
    requestedById: req.user._id,
    requestedByEmail: req.user.email,
    position,
    quantity,
    termOfEmployment: term,
    educationalLevel: education,
    sex: sex || "",
    experience: experience || "",
    department,
    date,
    justification: justification || "",
    priority: priority || "medium",
    attachments
  });

  // Get department name for notification
  let departmentName = department;
  try {
    if (mongoose.Types.ObjectId.isValid(department)) {
      const dept = await Department.findById(department).select('name').lean();
      departmentName = dept?.name || department;
    }
  } catch (error) {
    console.log('Error fetching department name:', error.message);
  }

  // Create a notification for Admin with a proper reference to the requisition ID
  await Notification.create({
    type: "Requisition",
    message: `New requisition from ${requestedBy} for ${quantity} ${position}(s) in ${departmentName} department.`,
    reference: requisition._id.toString(),
    typeRef: "Requisition",
    seen: false,
    recipientRole: "Admin",
    department: departmentName,
    status: "pending",
    metadata: {
      requesterName: requestedBy,
      department: departmentName,
      email: req.user.email,
      position: position,
      educationLevel: education,
      quantity: quantity,
      termOfEmployment: term,
      sex: sex || "Any",
      experience: experience || "",
      requestDate: date,
      justification: justification || "",
      priority: priority || "medium",
      attachments: attachments
    }
  });

  res.status(201).json({
    message: "Requisition created successfully and admin notified",
    requisition,
  });
});

// ---------------- Get all requisitions (Admin) ----------------
export const getRequisitions = asyncHandler(async (req, res) => {
  const requisitions = await Requisition.find().sort({ createdAt: -1 });
  
  // Enhance requisitions with department names
  const enhancedRequisitions = await Promise.all(
    requisitions.map(async (req) => {
      const requisition = req.toObject();
      
      // Get department name
      if (requisition.department && mongoose.Types.ObjectId.isValid(requisition.department)) {
        try {
          const department = await Department.findById(requisition.department).select('name').lean();
          requisition.departmentName = department?.name || requisition.department;
        } catch (error) {
          requisition.departmentName = requisition.department;
        }
      } else {
        requisition.departmentName = requisition.department;
      }
      
      return requisition;
    })
  );
  
  res.json(enhancedRequisitions);
});

// ---------------- Get DeptHead requisitions ----------------
export const getDeptHeadRequisitions = asyncHandler(async (req, res) => {
  const requisitions = await Requisition.find({ requestedById: req.user._id }).sort({
    createdAt: -1,
  });
  
  // Enhance requisitions with department names
  const enhancedRequisitions = await Promise.all(
    requisitions.map(async (req) => {
      const requisition = req.toObject();
      
      // Get department name
      if (requisition.department && mongoose.Types.ObjectId.isValid(requisition.department)) {
        try {
          const department = await Department.findById(requisition.department).select('name').lean();
          requisition.departmentName = department?.name || requisition.department;
        } catch (error) {
          requisition.departmentName = requisition.department;
        }
      } else {
        requisition.departmentName = requisition.department;
      }
      
      return requisition;
    })
  );
  
  res.json(enhancedRequisitions);
});

// ---------------- Update requisition status (Admin) ----------------
export const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminComment } = req.body;

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
  if (adminComment) {
    requisition.adminComment = adminComment;
  }
  await requisition.save();

  // Get department name
  let departmentName = requisition.department;
  try {
    if (mongoose.Types.ObjectId.isValid(requisition.department)) {
      const department = await Department.findById(requisition.department).select('name').lean();
      departmentName = department?.name || requisition.department;
    }
  } catch (error) {
    console.log('Error fetching department name:', error.message);
  }

  // ✅ FIX: Update the existing notification that Admin sees
  await Notification.findOneAndUpdate(
    { 
      type: "Requisition",
      reference: requisition._id,
      recipientRole: "Admin" // Find the Admin notification
    },
    { 
      status: status,
      // Keep other fields but update status
      $set: {
        seen: true // Optionally mark as seen for Admin
      }
    }
  );

  // Notify DeptHead (create new notification for them)
  await Notification.create({
    type: "Requisition",
    message: `Your requisition for ${requisition.quantity} ${requisition.position}(s) in ${departmentName} has been ${status}.`,
    reference: requisition._id,
    typeRef: "Requisition",
    seen: false,
    recipientRole: "DepartmentHead",
    department: departmentName,
    status,
    employee: {
      name: requisition.requestedBy,
      email: requisition.requestedByEmail || "",
    },
    metadata: {
      adminComment: adminComment || "",
      status: status
    }
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