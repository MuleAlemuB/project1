import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import WorkExperienceRequest from "../models/WorkExperienceRequest.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * @desc   Create work experience request
 * @route  POST /api/work-experience
 * @access Employee / DepartmentHead
 */
export const createWorkExperienceRequest = asyncHandler(async (req, res) => {
  const { reason, department } = req.body;

  // Get current user
  const currentUser = await User.findById(req.user._id);
  
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const request = await WorkExperienceRequest.create({
    requester: req.user._id,
    requesterRole: req.user.role, // This should be "employee" or "dept_head" or "admin"
    fullName: currentUser.name, // Get name from user document
    department: department || currentUser.department,
    reason,
  });

  // Find admins
  const admins = await User.find({ role: "admin" });
  
  // Create notifications for admins
  const notificationPromises = admins.map(admin =>
    Notification.create({
      user: admin._id,
      type: "work_experience_request",
      relatedId: request._id,
      title: "New Work Experience Request",
      message: `${currentUser.name} has requested a work experience letter`,
      isRead: false,
    })
  );

  await Promise.all(notificationPromises);

  res.status(201).json({
    success: true,
    data: request,
  });
});

/**
 * @desc   Get all requests (Admin)
 * @route  GET /api/work-experience
 * @access Admin
 */
export const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await WorkExperienceRequest.find()
    .populate("requester", "name email employeeId")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

/**
 * @desc   Get my requests (Employee / DeptHead)
 * @route  GET /api/work-experience/my
 * @access Private
 */
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await WorkExperienceRequest.find({
    requester: req.user._id,
  })
    .populate("requester", "name email employeeId")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

/**
 * @desc   Get request statistics
 * @route  GET /api/work-experience/stats
 * @access Admin
 */
export const getRequestStats = asyncHandler(async (req, res) => {
  const total = await WorkExperienceRequest.countDocuments();
  const pending = await WorkExperienceRequest.countDocuments({ status: "pending" });
  const approved = await WorkExperienceRequest.countDocuments({ status: "approved" });
  const rejected = await WorkExperienceRequest.countDocuments({ status: "rejected" });
  const completed = await WorkExperienceRequest.countDocuments({ status: "completed" });

  res.json({
    success: true,
    data: {
      total,
      pending,
      approved,
      rejected,
      completed,
    },
  });
});

/**
 * @desc   Approve or reject request
 * @route  PUT /api/work-experience/:id/status
 * @access Admin
 */
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminReason } = req.body;

  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate("requester", "name email");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = status;
  request.adminReason = adminReason || "";
  request.reviewedBy = req.user._id;
  
  if (status === "approved" || status === "rejected") {
    request.updatedAt = Date.now();
  }

  await request.save();

  // Notify requester
  await Notification.create({
    user: request.requester._id,
    type: "work_experience_status",
    relatedId: request._id,
    title: status === "approved" ? "Request Approved" : "Request Rejected",
    message: status === "approved"
      ? "Your work experience request has been approved"
      : `Your request was ${adminReason ? `rejected: ${adminReason}` : "rejected"}`,
    isRead: false,
  });

  res.json({
    success: true,
    data: request,
  });
});

/**
 * @desc   Generate work experience letter
 * @route  POST /api/work-experience/:id/generate
 * @access Admin
 */
export const generateWorkExperienceLetter = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate("requester", "name employeeId department");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.status !== "approved") {
    res.status(400);
    throw new Error("Request must be approved before generating letter");
  }

  // Create uploads directory if it doesn't exist
  const uploadDir = "uploads/work-experience-letters";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate PDF
  const fileName = `work-experience-${request.requester.employeeId}-${Date.now()}.pdf`;
  const filePath = path.join(uploadDir, fileName);
  
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);
      
      doc.pipe(writeStream);
      
      // Header
      doc.fontSize(20).text("DEBRE TABOR UNIVERSITY", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text("WORK EXPERIENCE CERTIFICATE", { align: "center" });
      doc.moveDown(2);
      
      // Date
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown(2);
      
      // Salutation
      doc.fontSize(12).text("TO WHOM IT MAY CONCERN", { underline: true });
      doc.moveDown();
      
      // Body
      doc.fontSize(12).text("This is to certify that:", { lineGap: 5 });
      doc.moveDown(0.5);
      
      doc.fontSize(14).text(`${request.requester.name}`, { indent: 50 });
      doc.fontSize(12).text(`Employee ID: ${request.requester.employeeId}`, { indent: 50 });
      doc.fontSize(12).text(`Department: ${request.department}`, { indent: 50 });
      doc.moveDown();
      
      doc.text(`has been employed with Debre Tabor University and has demonstrated professionalism and dedication in their role.`, {
        lineGap: 5
      });
      doc.moveDown();
      
      doc.text(`This certificate is issued upon the employee's request for the purpose of:`, { lineGap: 5 });
      doc.text(`${request.reason}`, { indent: 50 });
      doc.moveDown(2);
      
      // Closing
      doc.text("Sincerely,");
      doc.moveDown(2);
      doc.text("___________________________");
      doc.text("HR Department");
      doc.text("Human Resource Management System");
      doc.text("Debre Tabor University");
      
      // Footer
      doc.moveDown(3);
      doc.fontSize(10).text("This is a system-generated document", { align: "center" });
      
      doc.end();
      
      writeStream.on('finish', async () => {
        // Update request with PDF info
        request.letterPdf = {
          url: `/uploads/work-experience-letters/${fileName}`,
          public_id: fileName,
        };
        request.isGenerated = true;
        request.letterGeneratedDate = Date.now();
        request.status = "completed";
        await request.save();
        
        // Notify requester
        await Notification.create({
          user: request.requester._id,
          type: "work_experience_letter",
          relatedId: request._id,
          title: "Work Experience Letter Ready",
          message: "Your work experience letter has been generated and is ready for download",
          isRead: false,
        });
        
        resolve();
      });
      
      writeStream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  })
  .then(() => {
    res.json({
      success: true,
      data: {
        message: "Letter generated successfully",
        pdfUrl: `/uploads/work-experience-letters/${fileName}`,
        request,
      },
    });
  })
  .catch((error) => {
    res.status(500);
    throw new Error(`PDF generation failed: ${error.message}`);
  });
});

/**
 * @desc   Upload work experience letter (PDF)
 * @route  POST /api/work-experience/:id/upload
 * @access Admin
 */
export const uploadWorkExperienceLetter = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a PDF file");
  }

  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate("requester", "name email");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.status !== "approved") {
    res.status(400);
    throw new Error("Request must be approved before uploading letter");
  }

  // Update request with PDF info
  request.letterPdf = {
    url: `/uploads/work-experience-letters/${req.file.filename}`,
    public_id: req.file.filename,
  };
  request.isUploaded = true;
  request.letterGeneratedDate = Date.now();
  request.status = "completed";
  await request.save();

  // Notify requester
  await Notification.create({
    user: request.requester._id,
    type: "work_experience_letter",
    relatedId: request._id,
    title: "Work Experience Letter Uploaded",
    message: "Your work experience letter has been uploaded and is ready for download",
    isRead: false,
  });

  res.json({
    success: true,
    data: request,
  });
});

/**
 * @desc   Send letter to user
 * @route  POST /api/work-experience/:id/send
 * @access Admin
 */
export const sendLetterToUser = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate("requester", "name email");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (!request.letterPdf) {
    res.status(400);
    throw new Error("No letter found. Please generate or upload a letter first");
  }

  // Additional notification
  await Notification.create({
    user: request.requester._id,
    type: "work_experience_letter_sent",
    relatedId: request._id,
    title: "Work Experience Letter Sent",
    message: "Your work experience letter has been sent to you. You can download it now.",
    isRead: false,
  });

  res.json({
    success: true,
    data: {
      message: "Letter sent successfully",
      request,
    },
  });
});