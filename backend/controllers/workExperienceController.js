// backend/controllers/workExperienceController.js
import asyncHandler from "express-async-handler";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WorkExperienceRequest from "../models/WorkExperienceRequest.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Simple PDF generation function
const generatePDF = async (request, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const employee = request.employee;
      const content = `
        WORK EXPERIENCE CERTIFICATE
        
        This is to certify that ${employee.firstName} ${employee.lastName}
        Employee ID: ${employee.empId}
        
        has served in ${request.department} department
        for a period of ${request.yearsOfService} years.
        
        Certificate ID: ${request._id}
        Issue Date: ${new Date().toLocaleDateString()}
        
        This certificate is issued upon request and verification of service records.
        
        ________________________
        Signature
        
        Approved By: ${request.approvedBy?.firstName || 'Admin'} ${request.approvedBy?.lastName || ''}
      `;
      
      fs.writeFileSync(filePath, content);
      console.log(`PDF created at: ${filePath}`);
      resolve(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};

// Create work experience request
export const createRequest = asyncHandler(async (req, res) => {
  try {
    const { yearsOfService } = req.body;

    // Validate input
    if (!yearsOfService || isNaN(yearsOfService) || yearsOfService <= 0) {
      return res.status(400).json({ 
        message: "Please provide valid years of service (must be a positive number)" 
      });
    }

    // Get employee with populated department
    const employee = await Employee.findById(req.user._id).populate("department");
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Determine the role based on user
    let requestedByRole;
    switch (req.user.role) {
      case "admin":
        requestedByRole = "Admin";
        break;
      case "deptHead":
      case "departmenthead":
        requestedByRole = "DepartmentHead";
        break;
      case "employee":
      default:
        requestedByRole = "Employee";
    }

    // Get department name as string
    const departmentName = employee.department?.name || "Unknown Department";

    const requestData = {
      employee: req.user._id,
      yearsOfService: parseInt(yearsOfService),
      department: departmentName,
      requestedByRole: requestedByRole,
      status: "Pending"
    };

    const request = await WorkExperienceRequest.create(requestData);
    
    // Populate employee details for response
    const populatedRequest = await WorkExperienceRequest.findById(request._id)
      .populate({
        path: "employee",
        select: "firstName lastName email phoneNumber empId",
        populate: {
          path: "department",
          select: "name"
        }
      });

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("Error creating work experience request:", error);
    res.status(500).json({ 
      message: "Failed to create request", 
      error: error.message 
    });
  }
});

// Get all requests for admin
export const getAdminRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await WorkExperienceRequest.find()
      .populate({
        path: "employee",
        select: "firstName lastName empId department",
        populate: {
          path: "department",
          select: "name"
        }
      })
      .populate({
        path: "approvedBy",
        select: "firstName lastName email",
      })
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      _id: request._id,
      yearsOfService: request.yearsOfService,
      status: request.status,
      pdfFile: request.pdfFile,
      createdAt: request.createdAt,
      employee: {
        name: request.employee 
          ? `${request.employee.firstName} ${request.employee.lastName}`
          : "Unknown Employee",
        empId: request.employee?.empId || "N/A",
        department: request.employee?.department?.name || request.department
      },
      department: request.employee?.department?.name || request.department,
      requestedByRole: request.requestedByRole,
      approvedBy: request.approvedBy 
        ? `${request.approvedBy.firstName} ${request.approvedBy.lastName}`
        : null,
      rejectionReason: request.rejectionReason
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    res.status(500).json({ 
      message: "Failed to fetch requests", 
      error: error.message 
    });
  }
});

// Get my requests (for employee/department head)
export const getMyRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await WorkExperienceRequest.find({ employee: req.user._id })
      .populate({
        path: "employee",
        select: "firstName lastName empId",
      })
      .populate({
        path: "approvedBy",
        select: "firstName lastName",
      })
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      _id: request._id,
      yearsOfService: request.yearsOfService,
      status: request.status,
      pdfFile: request.pdfFile,
      createdAt: request.createdAt,
      department: request.department,
      requestedByRole: request.requestedByRole,
      approvedBy: request.approvedBy 
        ? `${request.approvedBy.firstName} ${request.approvedBy.lastName}`
        : null,
      rejectionReason: request.rejectionReason
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching my requests:", error);
    res.status(500).json({ 
      message: "Failed to fetch requests", 
      error: error.message 
    });
  }
});

// Approve request
export const approveRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await WorkExperienceRequest.findById(id)
      .populate('employee', 'firstName lastName empId')
      .populate('approvedBy', 'firstName lastName');
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ 
        message: `Request is already ${request.status.toLowerCase()}` 
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    ensureDirectoryExists(uploadsDir);
    
    // Create work-experience directory if it doesn't exist
    const workExperienceDir = path.join(uploadsDir, 'work-experience');
    ensureDirectoryExists(workExperienceDir);

    // Generate PDF file path
    const pdfFileName = `work-experience-${request.employee.empId || request._id}-${Date.now()}.pdf`;
    const pdfFilePath = path.join(workExperienceDir, pdfFileName);
    const relativePdfPath = `uploads/work-experience/${pdfFileName}`;

    // Generate PDF
    await generatePDF(request, pdfFilePath);

    // Update request
    request.status = "Approved";
    request.pdfFile = relativePdfPath;
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    
    await request.save();

    res.json({ 
      message: "Request approved successfully",
      pdfFile: relativePdfPath,
      pdfUrl: `/${relativePdfPath}`
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ 
      message: "Failed to approve request", 
      error: error.message 
    });
  }
});

// Reject request
export const rejectRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    const request = await WorkExperienceRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ 
        message: `Request is already ${request.status.toLowerCase()}` 
      });
    }

    request.status = "Rejected";
    request.rejectionReason = rejectionReason || "Request rejected";
    request.approvedBy = req.user._id;
    
    await request.save();

    res.json({ 
      message: "Request rejected successfully",
      rejectionReason: request.rejectionReason 
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ 
      message: "Failed to reject request", 
      error: error.message 
    });
  }
});

// Download letter
export const downloadLetter = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await WorkExperienceRequest.findById(id)
      .populate('employee', 'firstName lastName empId')
      .populate('approvedBy', 'firstName lastName');
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Approved") {
      return res.status(400).json({ 
        message: "Certificate is not approved yet" 
      });
    }

    // Check if user has permission to download
    const isOwner = request.employee._id.toString() === req.user._id.toString();
    const isAdminOrDeptHead = ['admin', 'deptHead', 'departmenthead'].includes(req.user.role);
    
    if (!isOwner && !isAdminOrDeptHead) {
      return res.status(403).json({ 
        message: "You are not authorized to download this certificate" 
      });
    }

    // Check if PDF file exists
    if (!request.pdfFile) {
      return res.status(404).json({ 
        message: "Certificate file not found. Please contact administrator." 
      });
    }

    // Construct full file path
    const filePath = path.join(__dirname, '..', request.pdfFile);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      
      // Try to find the file by just the filename
      const fileName = path.basename(request.pdfFile);
      const alternativePath = path.join(__dirname, '..', 'uploads', 'work-experience', fileName);
      
      if (fs.existsSync(alternativePath)) {
        // Update database with correct path
        request.pdfFile = `uploads/work-experience/${fileName}`;
        await request.save();
        
        // Send the file
        return res.download(alternativePath, 
          `work-experience-${request.employee.empId || request.employee._id}.pdf`);
      }
      
      return res.status(404).json({ 
        message: "Certificate file not found on server" 
      });
    }

    // Send the file
    const downloadName = `work-experience-${request.employee.empId || request.employee._id}.pdf`;
    res.download(filePath, downloadName);
    
  } catch (error) {
    console.error("Error downloading certificate:", error);
    res.status(500).json({ 
      message: "Failed to download certificate", 
      error: error.message 
    });
  }
});

// Get requests by department (for department heads)
export const getDepartmentRequests = asyncHandler(async (req, res) => {
  try {
    // Get department head's department
    const employee = await Employee.findById(req.user._id).populate("department");
    
    if (!employee || !employee.department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const requests = await WorkExperienceRequest.find({
      department: employee.department.name
    })
      .populate({
        path: "employee",
        select: "firstName lastName empId department",
        populate: {
          path: "department",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      _id: request._id,
      yearsOfService: request.yearsOfService,
      status: request.status,
      pdfFile: request.pdfFile,
      createdAt: request.createdAt,
      employee: {
        name: request.employee 
          ? `${request.employee.firstName} ${request.employee.lastName}`
          : "Unknown Employee",
        empId: request.employee?.empId || "N/A",
        department: request.employee?.department?.name || request.department
      },
      department: request.department,
      requestedByRole: request.requestedByRole
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching department requests:", error);
    res.status(500).json({ 
      message: "Failed to fetch department requests", 
      error: error.message 
    });
  }
});

// Delete request (optional)
export const deleteRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await WorkExperienceRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only allow deletion if pending or by admin
    if (request.status !== "Pending" && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Only pending requests can be deleted" 
      });
    }

    // Only allow employee to delete their own requests unless admin
    if (request.employee.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "You can only delete your own requests" 
      });
    }

    await WorkExperienceRequest.findByIdAndDelete(id);

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ 
      message: "Failed to delete request", 
      error: error.message 
    });
  }
});