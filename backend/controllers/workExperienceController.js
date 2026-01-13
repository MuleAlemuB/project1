import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import WorkExperienceRequest from "../models/WorkExperienceRequest.js";
import Notification from "../models/Notification.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

/**
 * @desc   Create work experience request
 * @route  POST /api/work-experience
 * @access Employee / DepartmentHead
 */
/**
 * @desc   Create work experience request
 * @route  POST /api/work-experience
 * @access Employee / DepartmentHead
 */
export const createWorkExperienceRequest = asyncHandler(async (req, res) => {
  console.log('📥 Request body:', req.body);
  console.log('📁 Request file:', req.file);
  
  // Check if body is empty (might be multipart/form-data issue)
  if (Object.keys(req.body).length === 0) {
    res.status(400);
    throw new Error("Request body is empty. Please check your form data.");
  }

  const { reason, department } = req.body;

  if (!reason || reason.trim() === '') {
    res.status(400);
    throw new Error("Reason is required");
  }

  // Get employee details
  const employee = await Employee.findById(req.user._id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Create full name
  const fullName = `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`;

  // Handle request letter file if uploaded
  let requestLetterPath = null;
  if (req.file) {
    requestLetterPath = `/uploads/request-letters/${req.file.filename}`;
  }

  const request = await WorkExperienceRequest.create({
    requester: req.user._id,
    requesterRole: req.user.role,
    fullName: fullName.trim(),
    department: department || employee.department,
    reason,
    requestLetter: requestLetterPath
  });

  // Find admins (employees with role "admin")
  const admins = await Employee.find({ role: "admin" });
  
  // Create notifications ONLY for admins
  const notificationPromises = [];

  // Notifications for admins
  const adminNotificationPromises = admins.map(admin =>
    Notification.create({
      type: "Work Experience Request",
      message: `${fullName} has requested a work experience letter`,
      seen: false,
      employee: {
        name: fullName,
        email: employee.email,
        empId: employee.empId
      },
      recipientRole: "Admin", // ✅ Only send to Admin
      relatedId: request._id,
      relatedModel: "WorkExperienceRequest",
      status: "pending",
      metadata: {
        employeeName: fullName,
        employeeEmail: employee.email,
        employeeEmpId: employee.empId,
        department: employee.department,
        reason: reason,
        createdAt: request.createdAt,
        status: "pending",
        requestLetter: requestLetterPath
      }
    })
  );

  notificationPromises.push(...adminNotificationPromises);
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
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId department",
      populate: {
        path: "department",
        select: "name"
      }
    })
    .populate("reviewedBy", "firstName lastName")
    .sort({ createdAt: -1 });

  // Format the response to match frontend expectations
  const formattedRequests = requests.map(request => {
    const requester = request.requester;
    const departmentName = requester?.department?.name || 
                          (typeof requester?.department === 'string' ? requester.department : 'N/A');
    
    return {
      ...request.toObject(),
      // Create a formatted name for frontend
      requester: {
        ...requester?.toObject(),
        name: requester ? `${requester.firstName} ${requester.middleName ? requester.middleName + ' ' : ''}${requester.lastName}`.trim() : request.fullName,
        employeeId: requester?.empId
      },
      // Make sure department is a string
      department: departmentName
    };
  });

  res.json({
    success: true,
    count: requests.length,
    data: formattedRequests,
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
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId",
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

/**
 * @desc   Get request by ID
 * @route  GET /api/work-experience/:id
 * @access Admin
 */
export const getRequestById = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId department",
      populate: {
        path: "department",
        select: "name"
      }
    })
    .populate("reviewedBy", "firstName lastName");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.json({
    success: true,
    data: request,
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

  // Find the request without populating first
  let request = await WorkExperienceRequest.findById(req.params.id);
  
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Update the request fields
  request.status = status;
  request.adminReason = adminReason || "";
  request.reviewedBy = req.user._id;
  request.updatedAt = Date.now();

  // Save the request
  await request.save();

  // Now populate for response
  request = await WorkExperienceRequest.findById(req.params.id)
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId department",
      populate: {
        path: "department",
        select: "name"
      }
    })
    .populate("reviewedBy", "firstName lastName");

  // Get employee details for notification
  const employee = await Employee.findById(request.requester._id);
  const fullName = employee ? `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim() : request.fullName;
  const departmentName = employee?.department?.name || request.department || "N/A";

  // Determine notification type based on status
  let notificationType;
  let notificationMessage = "";
  let recipientRole = "Employee";
  
  if (status === "approved") {
    notificationType = "Work Experience Approved";
    notificationMessage = "Your work experience request has been approved";
  } else if (status === "rejected") {
    notificationType = "Work Experience Rejected";
    notificationMessage = `Your work experience request was ${adminReason ? `rejected: ${adminReason}` : "rejected"}`;
  }

  // Notify requester (employee)
  await Notification.create({
    type: notificationType,
    message: notificationMessage,
    seen: false,
    employee: {
      name: fullName,
      email: employee?.email || "",
      empId: employee?.empId
    },
    recipientRole: recipientRole,
    relatedId: request._id,
    relatedModel: "WorkExperienceRequest",
    status: status,
    metadata: {
      employeeName: fullName,
      employeeEmail: employee?.email || "",
      employeeEmpId: employee?.empId,
      department: departmentName,
      reason: request.reason,
      status: status,
      adminReason: adminReason || "",
      reviewedBy: req.user.name || req.user.email,
      reviewedAt: new Date()
    }
  });

  // Also notify the department head about the status update
  if (employee && employee.department) {
    const departmentHead = await Employee.findOne({
      department: employee.department,
      role: "departmenthead"
    });

    if (departmentHead) {
      await Notification.create({
        type: notificationType,
        message: `Work experience request from ${fullName} has been ${status}`,
        seen: false,
        employee: {
          name: fullName,
          email: employee?.email || "",
          empId: employee?.empId
        },
        recipientRole: "DepartmentHead",
        relatedId: request._id,
        relatedModel: "WorkExperienceRequest",
        status: status,
        metadata: {
          employeeName: fullName,
          employeeEmail: employee?.email || "",
          employeeEmpId: employee?.empId,
          department: departmentName,
          reason: request.reason,
          status: status,
          adminReason: adminReason || "",
          reviewedBy: req.user.name || req.user.email,
          reviewedAt: new Date()
        }
      });
    }
  }

  res.json({
    success: true,
    data: request,
  });
});

/**
 * @desc   Bulk approve/reject requests
 * @route  PUT /api/work-experience/bulk/status
 * @access Admin
 */
export const bulkUpdateRequestStatus = asyncHandler(async (req, res) => {
  const { requestIds, status, adminReason } = req.body;

  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    res.status(400);
    throw new Error("Please provide request IDs");
  }

  const requests = await WorkExperienceRequest.find({ _id: { $in: requestIds } });

  if (requests.length !== requestIds.length) {
    res.status(404);
    throw new Error("Some requests not found");
  }

  const updatePromises = requests.map(async (request) => {
    request.status = status;
    request.adminReason = adminReason || "";
    request.reviewedBy = req.user._id;
    request.updatedAt = Date.now();
    
    await request.save();

    // Get employee details for notification
    const employee = await Employee.findById(request.requester);
    const fullName = employee ? `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim() : request.fullName;
    const departmentName = employee?.department?.name || request.department || "N/A";

    // Determine notification type based on status
    let notificationType;
    let notificationMessage = "";
    
    if (status === "approved") {
      notificationType = "Work Experience Approved";
      notificationMessage = "Your work experience request has been approved";
    } else if (status === "rejected") {
      notificationType = "Work Experience Rejected";
      notificationMessage = `Your work experience request was ${adminReason ? `rejected: ${adminReason}` : "rejected"}`;
    }

    // Notify requester
    await Notification.create({
      type: notificationType,
      message: notificationMessage,
      seen: false,
      employee: {
        name: fullName,
        email: employee?.email || "",
        empId: employee?.empId
      },
      recipientRole: "Employee",
      relatedId: request._id,
      relatedModel: "WorkExperienceRequest",
      status: status,
      metadata: {
        employeeName: fullName,
        employeeEmail: employee?.email || "",
        employeeEmpId: employee?.empId,
        department: departmentName,
        reason: request.reason,
        status: status,
        adminReason: adminReason || "",
        reviewedBy: req.user.name || req.user.email,
        reviewedAt: new Date()
      }
    });

    // Also notify the department head about the status update
    if (employee && employee.department) {
      const departmentHead = await Employee.findOne({
        department: employee.department,
        role: "departmenthead"
      });

      if (departmentHead) {
        await Notification.create({
          type: notificationType,
          message: `Work experience request from ${fullName} has been ${status}`,
          seen: false,
          employee: {
            name: fullName,
            email: employee?.email || "",
            empId: employee?.empId
          },
          recipientRole: "DepartmentHead",
          relatedId: request._id,
          relatedModel: "WorkExperienceRequest",
          status: status,
          metadata: {
            employeeName: fullName,
            employeeEmail: employee?.email || "",
            employeeEmpId: employee?.empId,
            department: departmentName,
            reason: request.reason,
            status: status,
            adminReason: adminReason || "",
            reviewedBy: req.user.name || req.user.email,
            reviewedAt: new Date()
          }
        });
      }
    }

    return request;
  });

  const updatedRequests = await Promise.all(updatePromises);

  // Populate the updated requests for response
  const populatedRequests = await WorkExperienceRequest.find({ _id: { $in: requestIds } })
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId",
    })
    .populate("reviewedBy", "firstName lastName");

  res.json({
    success: true,
    data: populatedRequests,
    message: `${updatedRequests.length} requests ${status} successfully`,
  });
});

/**
 * Helper function to calculate work experience
 */
const calculateWorkExperience = (startDate, endDate = new Date()) => {
  if (!startDate) return { years: 0, months: 0, display: "N/A" };
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust for days
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  const experienceText = [];
  if (years > 0) experienceText.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) experienceText.push(`${months} month${months > 1 ? 's' : ''}`);
  
  return {
    years,
    months,
    display: experienceText.length > 0 ? experienceText.join(' and ') : "Less than 1 month"
  };
};

/**
 * @desc   Generate work experience letter
 * @route  POST /api/work-experience/:id/generate
 * @access Admin
 */
export const generateWorkExperienceLetter = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate({
      path: "requester",
      select: "firstName middleName lastName empId department dateOfJoin experience hireDate employmentDate createdAt",
      populate: {
        path: "department",
        select: "name"
      }
    });

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

  // Get employee details
  const employee = await Employee.findById(request.requester._id).populate("department", "name");
  const fullName = employee ? `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim() : request.fullName;
  const departmentName = employee?.department?.name || request.department || "N/A";
  const employeeId = employee?.empId || "N/A";

  // Get employee position if available
  const employeeDetails = await Employee.findById(request.requester._id).select("typeOfPosition");
  const position = employeeDetails?.typeOfPosition || "";

  // Calculate work experience
  const startDate = employee?.dateOfJoin || employee?.hireDate || employee?.employmentDate || employee?.createdAt;
  const experience = calculateWorkExperience(startDate, new Date());
  
  // Get experience from employee model if available
  let employeeExperience = "";
  if (employee?.experience) {
    if (typeof employee.experience === 'string') {
      employeeExperience = employee.experience;
    } else if (typeof employee.experience === 'number') {
      employeeExperience = `${employee.experience} year${employee.experience > 1 ? 's' : ''}`;
    }
  }

  // Use calculated experience if employee experience is not available
  const finalExperience = employeeExperience || experience.display;

  // Generate PDF
  const fileName = `work-experience-${employeeId}-${Date.now()}.pdf`;
  const filePath = path.join(uploadDir, fileName);
  
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: `Work Experience Certificate - ${fullName}`,
          Author: 'Debre Tabor University HR System',
          Subject: 'Work Experience Certificate',
          Keywords: 'work experience, certificate, employment, reference',
          Creator: 'HR Management System',
          Producer: 'Debre Tabor University'
        }
      });
      
      const writeStream = fs.createWriteStream(filePath);
      
      doc.pipe(writeStream);
      
      // Add university logo placeholder (you can add an actual image if available)
      doc.rect(50, 40, 100, 80).stroke();
      doc.fontSize(10).fillColor('gray').text('University Logo', 65, 80, { width: 70, align: 'center' });
      
      // Header
      doc.fillColor('black').fontSize(20).font('Helvetica-Bold')
        .text("DEBRE TABOR UNIVERSITY", { align: "center", y: 60 });
      
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica')
        .text("Human Resource Management System", { align: "center" });
      
      doc.moveDown(2);
      doc.fontSize(16).font('Helvetica-Bold')
        .text("WORK EXPERIENCE CERTIFICATE", { align: "center" });
      
      // Certificate ID and Date
      doc.moveDown(2);
      doc.fontSize(10).fillColor('gray')
        .text(`Certificate ID: WE-${employeeId}-${Date.now().toString().slice(-6)}`, 50, 160);
      
      doc.fontSize(10)
        .text(`Issue Date: ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`, { align: "right" });
      
      doc.moveDown(3);
      
      // Salutation
      doc.fillColor('black').fontSize(12).font('Helvetica-Bold')
        .text("TO WHOM IT MAY CONCERN", { align: "center", underline: true });
      
      doc.moveDown(1.5);
      
      // Body
      doc.fontSize(12).font('Helvetica')
        .text("This is to certify that:", { lineGap: 5 });
      
      doc.moveDown(0.5);
      
      // Employee details in a formatted box
      const detailsY = doc.y;
      doc.rect(50, detailsY, 500, 100).stroke();
      
      doc.fontSize(14).font('Helvetica-Bold')
        .text(`${fullName}`, 60, detailsY + 15);
      
      doc.fontSize(12).font('Helvetica')
        .text(`Employee ID: ${employeeId}`, 60, detailsY + 40);
      
      doc.text(`Department: ${departmentName}`, 60, detailsY + 60);
      
      // Add position if available
      if (position) {
        doc.text(`Position: ${position}`, 60, detailsY + 80);
      }
      
      doc.moveDown(4);
      
      // Work experience section
      doc.fontSize(12)
        .text(`has been employed with Debre Tabor University since ${startDate ? new Date(startDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'their joining date'}, accumulating a total work experience of ${finalExperience}.`, {
          lineGap: 5
        });
      
      doc.moveDown();
      
      doc.text(`During ${experience.years > 0 ? 'this period' : 'their tenure'}, the employee has demonstrated professionalism, dedication, and commitment to their duties and responsibilities. ${fullName} has consistently shown good work ethics and has been a valuable member of our team.`, {
        lineGap: 5
      });
      
      doc.moveDown();
      
      doc.text(`This certificate is issued upon the employee's request for the purpose of:`, { lineGap: 5 });
      
      // Reason in a bordered box
      const reasonY = doc.y;
      doc.rect(50, reasonY + 10, 500, 50).stroke();
      doc.fontSize(12).font('Helvetica-Oblique').fillColor('navy')
        .text(`${request.reason}`, 55, reasonY + 20, { width: 490 });
      
      doc.moveDown(4);
      
      // Closing
      doc.fillColor('black').fontSize(12).font('Helvetica')
        .text("We wish them all the best in their future endeavors.", { lineGap: 5 });
      
      doc.moveDown(2);
      
      doc.text("Sincerely,");
      doc.moveDown(2);
      
      // Signature area
      doc.text("___________________________");
      doc.fontSize(11).font('Helvetica-Bold')
        .text("HR Department Head", { indent: 20 });
      
      doc.fontSize(10)
        .text("Human Resource Management System");
      doc.text("Debre Tabor University");
      
      // Contact information
      doc.moveDown(2);
      doc.fontSize(9).fillColor('gray')
        .text("Address: Debre Tabor, Ethiopia | Phone: +251 XXX XXX XXX | Email: hr@dtu.edu.et", { align: "center" });
      
      // Footer
      doc.moveDown(2);
      doc.fontSize(8).fillColor('gray')
        .text("This is an electronically generated document. No physical signature is required.", { align: "center" });
      
      doc.text(`Document Reference: WE-${employeeId}-${Date.now().toString().slice(-8)} | Valid as of issue date`, { align: "center" });
      
      doc.end();
      
      writeStream.on('finish', async () => {
        try {
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
            type: "Work Experience Letter Generated",
            message: "Your work experience letter has been generated and is ready for download",
            seen: false,
            employee: {
              name: fullName,
              email: employee?.email || "",
              empId: employee?.empId
            },
            recipientRole: "Employee",
            relatedId: request._id,
            relatedModel: "WorkExperienceRequest",
            status: "approved",
            metadata: {
              employeeName: fullName,
              employeeEmail: employee?.email || "",
              employeeEmpId: employee?.empId,
              department: departmentName,
              experience: finalExperience,
              position: position,
              certificateUrl: `/uploads/work-experience-letters/${fileName}`,
              generatedDate: new Date()
            }
          });
          
          // Notify department head
          if (employee && employee.department) {
            const departmentHead = await Employee.findOne({
              department: employee.department,
              role: "departmenthead"
            });
            
            if (departmentHead) {
              await Notification.create({
                type: "Work Experience Letter Generated",
                message: `Work experience letter has been generated for ${fullName}`,
                seen: false,
                employee: {
                  name: fullName,
                  email: employee?.email || "",
                  empId: employee?.empId
                },
                recipientRole: "DepartmentHead",
                relatedId: request._id,
                relatedModel: "WorkExperienceRequest",
                status: "completed",
                metadata: {
                  employeeName: fullName,
                  employeeEmail: employee?.email || "",
                  employeeEmpId: employee?.empId,
                  department: departmentName,
                  experience: finalExperience,
                  position: position,
                  certificateUrl: `/uploads/work-experience-letters/${fileName}`,
                  generatedDate: new Date()
                }
              });
            }
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      
      writeStream.on('error', reject);
      
    } catch (error) {
      reject(error);
    }
  })
  .then(async () => {
    // Get updated request with populated data
    const updatedRequest = await WorkExperienceRequest.findById(req.params.id)
      .populate({
        path: "requester",
        select: "firstName middleName lastName empId",
      });
    
    return res.json({
      success: true,
      data: {
        message: "Letter generated successfully",
        pdfUrl: `/uploads/work-experience-letters/${fileName}`,
        request: updatedRequest,
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

  const request = await WorkExperienceRequest.findById(req.params.id);

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

  // Get employee details for notification
  const employee = await Employee.findById(request.requester);
  const fullName = employee ? `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim() : request.fullName;
  const departmentName = employee?.department?.name || request.department || "N/A";

  // Notify requester
  await Notification.create({
    type: "Work Experience Letter Uploaded",
    message: "Your work experience letter has been uploaded and is ready for download",
    seen: false,
    employee: {
      name: fullName,
      email: employee?.email || "",
      empId: employee?.empId
    },
    recipientRole: "Employee",
    relatedId: request._id,
    relatedModel: "WorkExperienceRequest",
    status: "approved",
    metadata: {
      employeeName: fullName,
      employeeEmail: employee?.email || "",
      employeeEmpId: employee?.empId,
      department: departmentName,
      certificateUrl: `/uploads/work-experience-letters/${req.file.filename}`,
      uploadedDate: new Date()
    }
  });

  // Notify department head
  if (employee && employee.department) {
    const departmentHead = await Employee.findOne({
      department: employee.department,
      role: "departmenthead"
    });
    
    if (departmentHead) {
      await Notification.create({
        type: "Work Experience Letter Uploaded",
        message: `Work experience letter has been uploaded for ${fullName}`,
        seen: false,
        employee: {
          name: fullName,
          email: employee?.email || "",
          empId: employee?.empId
        },
        recipientRole: "DepartmentHead",
        relatedId: request._id,
        relatedModel: "WorkExperienceRequest",
        status: "completed",
        metadata: {
          employeeName: fullName,
          employeeEmail: employee?.email || "",
          employeeEmpId: employee?.empId,
          department: departmentName,
          certificateUrl: `/uploads/work-experience-letters/${req.file.filename}`,
          uploadedDate: new Date()
        }
      });
    }
  }

  // Populate request for response
  const populatedRequest = await WorkExperienceRequest.findById(req.params.id)
    .populate({
      path: "requester",
      select: "firstName middleName lastName email",
    });

  res.json({
    success: true,
    data: populatedRequest,
  });
});

/**
 * @desc   Export requests as CSV
 * @route  GET /api/work-experience/export
 * @access Admin
 */
export const exportRequests = asyncHandler(async (req, res) => {
  const requests = await WorkExperienceRequest.find()
    .populate({
      path: "requester",
      select: "firstName middleName lastName email empId",
      populate: {
        path: "department",
        select: "name"
      }
    })
    .populate("reviewedBy", "firstName lastName")
    .sort({ createdAt: -1 });

  // Create CSV content
  let csvContent = "ID,Employee Name,Employee ID,Department,Reason,Status,Request Date,Reviewed By,Admin Remarks\n";
  
  requests.forEach(request => {
    const requester = request.requester;
    const fullName = requester ? `${requester.firstName} ${requester.middleName ? requester.middleName + ' ' : ''}${requester.lastName}`.trim() : request.fullName;
    const employeeId = requester?.empId || "N/A";
    const departmentName = requester?.department?.name || request.department || "N/A";
    const reviewedByName = request.reviewedBy ? `${request.reviewedBy.firstName} ${request.reviewedBy.lastName}` : "N/A";
    
    csvContent += `"${request._id}","${fullName}","${employeeId}","${departmentName}","${request.reason.replace(/"/g, '""')}","${request.status}","${new Date(request.createdAt).toLocaleDateString()}","${reviewedByName}","${request.adminReason?.replace(/"/g, '""') || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=work-experience-requests.csv');
  res.send(csvContent);
});

/**
 * @desc   Send letter to user (additional notification)
 * @route  POST /api/work-experience/:id/send
 * @access Admin
 */
export const sendLetterToUser = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id)
    .populate({
      path: "requester",
      select: "firstName middleName lastName email",
    });

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (!request.letterPdf) {
    res.status(400);
    throw new Error("No letter found. Please generate or upload a letter first");
  }

  // Get employee details for notification
  const employee = await Employee.findById(request.requester._id);
  const fullName = employee ? `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim() : request.fullName;

  // Additional notification
  await Notification.create({
    type: "Work Experience Letter Generated",
    message: "Your work experience letter has been sent to you. You can download it now.",
    seen: false,
    employee: {
      name: fullName,
      email: employee?.email || "",
      empId: employee?.empId
    },
    recipientRole: "Employee",
    relatedId: request._id,
    relatedModel: "WorkExperienceRequest",
    status: "approved",
  });

  res.json({
    success: true,
    data: {
      message: "Letter sent successfully",
      request,
    },
  });
});

/**
 * @desc   Download work experience letter PDF
 * @route  GET /api/work-experience/:id/download
 * @access Admin / Requester
 */
export const downloadWorkExperienceLetter = asyncHandler(async (req, res) => {
  console.log('📥 Download request for ID:', req.params.id);
  
  const request = await WorkExperienceRequest.findById(req.params.id);

  if (!request) {
    console.log('❌ Request not found');
    res.status(404);
    throw new Error("Request not found");
  }

  if (!request.letterPdf || !request.letterPdf.url) {
    console.log('❌ No letter PDF found');
    res.status(404);
    throw new Error("Letter not found");
  }

  // Check permissions
  const isAdmin = req.user.role === "admin";
  const isRequester = req.user._id.toString() === request.requester.toString();
  const isDepartmentHead = req.user.role === "departmenthead";
  
  if (!isAdmin && !isRequester && !isDepartmentHead) {
    console.log('❌ Not authorized');
    res.status(403);
    throw new Error("Not authorized to access this letter");
  }

  // Extract filename from URL
  const fileName = request.letterPdf.public_id || 
                   path.basename(request.letterPdf.url);
  
  console.log('📄 File name:', fileName);
  console.log('📁 File URL:', request.letterPdf.url);
  
  // FIX: Correct the file path
  // Remove leading slash if present
  const fileUrl = request.letterPdf.url.startsWith('/') 
    ? request.letterPdf.url.substring(1) 
    : request.letterPdf.url;
  
  // Use process.cwd() to get the correct base directory
  const filePath = path.join(process.cwd(), fileUrl);
  console.log('🔍 Looking for file at:', filePath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('❌ File does not exist at path:', filePath);
    
    // Try alternative paths
    const alternativePaths = [
      path.join(__dirname, '..', fileUrl),
      path.join(__dirname, '..', '..', fileUrl),
      fileUrl
    ];
    
    console.log('🔍 Trying alternative paths:', alternativePaths);
    
    for (const altPath of alternativePaths) {
      console.log('🔍 Checking:', altPath);
      if (fs.existsSync(altPath)) {
        console.log('✅ Found file at alternative path:', altPath);
        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        // Stream the file
        const fileStream = fs.createReadStream(altPath);
        return fileStream.pipe(res);
      }
    }
    
    res.status(404);
    throw new Error("PDF file not found on server");
  }

  console.log('✅ File found, sending...');
  
  // Set headers for file download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

/**
 * @desc   Delete work experience request
 * @route  DELETE /api/work-experience/:id
 * @access Admin
 */
export const deleteWorkExperienceRequest = asyncHandler(async (req, res) => {
  const request = await WorkExperienceRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Delete the PDF file if it exists
  if (request.letterPdf && request.letterPdf.url) {
    try {
      const fileUrl = request.letterPdf.url.startsWith('/') 
        ? request.letterPdf.url.substring(1) 
        : request.letterPdf.url;
      
      const filePath = path.join(process.cwd(), fileUrl);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error deleting PDF file:", error);
      // Continue with deletion even if file deletion fails
    }
  }

  // Delete related notifications
  await Notification.deleteMany({
    relatedId: request._id,
    relatedModel: "WorkExperienceRequest"
  });

  // Delete the request
  await WorkExperienceRequest.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Work experience request deleted successfully",
    data: { id: req.params.id }
  });
});

/**
 * @desc   Bulk delete work experience requests
 * @route  DELETE /api/work-experience/bulk
 * @access Admin
 */
export const bulkDeleteWorkExperienceRequests = asyncHandler(async (req, res) => {
  const { requestIds } = req.body;

  if (!Array.isArray(requestIds) || requestIds.length === 0) {
    res.status(400);
    throw new Error("Please provide request IDs to delete");
  }

  // Find all requests to delete
  const requests = await WorkExperienceRequest.find({ _id: { $in: requestIds } });

  if (requests.length !== requestIds.length) {
    res.status(404);
    throw new Error("Some requests not found");
  }

  // Delete PDF files for each request
  for (const request of requests) {
    if (request.letterPdf && request.letterPdf.url) {
      try {
        const fileUrl = request.letterPdf.url.startsWith('/') 
          ? request.letterPdf.url.substring(1) 
          : request.letterPdf.url;
        
        const filePath = path.join(process.cwd(), fileUrl);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error("Error deleting PDF file for request", request._id, ":", error);
        // Continue with deletion even if file deletion fails
      }
    }
  }

  // Delete related notifications
  await Notification.deleteMany({
    relatedId: { $in: requestIds },
    relatedModel: "WorkExperienceRequest"
  });

  // Delete the requests
  const deleteResult = await WorkExperienceRequest.deleteMany({ 
    _id: { $in: requestIds } 
  });

  res.json({
    success: true,
    message: `${deleteResult.deletedCount} work experience requests deleted successfully`,
    data: {
      deletedCount: deleteResult.deletedCount,
      requestIds
    }
  });
});