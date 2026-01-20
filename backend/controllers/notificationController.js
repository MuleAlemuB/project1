// backend/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import JobApplication from "../models/JobApplication.js";
import Employee from "../models/Employee.js";
import Vacancy from "../models/Vacancy.js";
import Department from "../models/Department.js"; // Import Department model
import mongoose from "mongoose";

// ---------------- Get all notifications (Admin only) ----------------
export const getAllNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  if (role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const notifications = await Notification.find({ recipientRole: { $regex: /^admin$/i } })
    .sort({ createdAt: -1 })
    .lean(); // Removed populate to avoid schema issues

  res.json(notifications);
});

// Helper function to get department name
const getDepartmentName = async (departmentId) => {
  try {
    if (!departmentId) return "N/A";
    
    // If it's already a string (department name), return it
    if (typeof departmentId === 'string' && !mongoose.Types.ObjectId.isValid(departmentId)) {
      return departmentId;
    }
    
    // If it's an ObjectId, find the department
    if (mongoose.Types.ObjectId.isValid(departmentId)) {
      const department = await Department.findById(departmentId).select('name').lean();
      return department?.name || "N/A";
    }
    
    return "N/A";
  } catch (error) {
    console.error('Error fetching department:', error.message);
    return "N/A";
  }
};

// ---------------- Get notifications for logged-in user ----------------
export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user.role.toLowerCase();
  const userId = user._id; // Get user ID
  const userEmail = user.email?.toLowerCase(); // Get user email

  let notifications;

  if (role === "admin") {
    notifications = await Notification.find({ recipientRole: "Admin" })
      .sort({ createdAt: -1 })
      .lean();
    
    // Process each notification to add detailed information
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        
        try {
          switch (notif.type) {
            case "Vacancy Application":
              // For JobApplication schema
              const jobApplication = await JobApplication.findById(notif.reference)
                .populate('vacancyId', 'title department position')
                .populate('employeeId', 'name email phoneNumber')
                .lean();
              
              if (jobApplication) {
                enhancedNotif.applicant = {
                  name: jobApplication.employeeId?.name,
                  email: jobApplication.employeeId?.email,
                  phone: jobApplication.employeeId?.phoneNumber,
                  appliedAt: jobApplication.appliedAt,
                  resume: jobApplication.resume
                };
                enhancedNotif.vacancy = jobApplication.vacancyId;
                
                // Get department name
                const departmentName = await getDepartmentName(jobApplication.vacancyId?.department);
                
                enhancedNotif.metadata = {
                  name: jobApplication.employeeId?.name,
                  email: jobApplication.employeeId?.email,
                  phone: jobApplication.employeeId?.phoneNumber,
                  resume: jobApplication.resume,
                  vacancyTitle: jobApplication.vacancyId?.title,
                  department: departmentName,
                  position: jobApplication.vacancyId?.position,
                  appliedAt: jobApplication.appliedAt
                };
              } else if (notif.metadata) {
                // Use existing metadata if available
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Leave":
              const leave = await LeaveRequest.findById(notif.leaveRequestId || notif.reference)
                .lean();
              
              if (leave) {
                // Try to get employee details if requester is an ObjectId
                let employeeName = leave.requesterName;
                let employeeEmail = leave.requesterEmail;
                let employeePhone = null;
                let employeeEmpId = null;
                
                if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
                  try {
                    const employee = await Employee.findById(leave.requester)
                      .select('name email phoneNumber empId')
                      .lean();
                    if (employee) {
                      employeeName = employee.name;
                      employeeEmail = employee.email;
                      employeePhone = employee.phoneNumber;
                      employeeEmpId = employee.empId;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for leave request');
                  }
                }
                
                // Get department name
                const departmentName = await getDepartmentName(leave.department);
                
                enhancedNotif.leaveRequestId = leave;
                enhancedNotif.metadata = {
                  employeeName: employeeName,
                  department: departmentName,
                  email: employeeEmail,
                  phone: employeePhone,
                  empId: employeeEmpId,
                  startDate: leave.startDate,
                  endDate: leave.endDate,
                  reason: leave.reason,
                  attachments: leave.attachments || [],
                  requesterRole: leave.requesterRole,
                  targetRole: leave.targetRole,
                  leaveType: leave.leaveType
                };
              } else if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Requisition":
              const requisition = await Requisition.findById(notif.reference).lean();
              
              if (requisition) {
                // Get requester details
                let requesterName = requisition.requestedBy;
                let requesterEmail = requisition.requestedByEmail;
                let requesterDepartment = requisition.department;
                let requesterEmpId = null;
                
                if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                  try {
                    const employee = await Employee.findById(requisition.requestedById)
                      .select('name email department empId')
                      .lean();
                    if (employee) {
                      requesterName = employee.name || requesterName;
                      requesterEmail = employee.email || requesterEmail;
                      requesterDepartment = employee.department || requesterDepartment;
                      requesterEmpId = employee.empId;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for requisition');
                  }
                }
                
                // Get department name
                const departmentName = await getDepartmentName(requesterDepartment);
                
                // Check if requisition has additional fields (from updated schema)
                const hasAttachments = requisition.attachments && Array.isArray(requisition.attachments) && requisition.attachments.length > 0;
                const justification = requisition.justification || requisition.reason || "N/A";
                const priority = requisition.priority || "medium";
                
                enhancedNotif.metadata = {
                  requesterName: requesterName,
                  department: departmentName,
                  email: requesterEmail || "N/A",
                  empId: requesterEmpId,
                  position: requisition.position,
                  educationLevel: requisition.educationalLevel || requisition.educationLevel,
                  quantity: requisition.quantity,
                  termOfEmployment: requisition.termOfEmployment,
                  sex: requisition.sex,
                  experience: requisition.experience,
                  requestDate: requisition.date || requisition.createdAt,
                  justification: justification,
                  priority: priority,
                  attachments: hasAttachments ? requisition.attachments : []
                };
              } else if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Work Experience":
              // Handle Work Experience requests
              // You'll need to import and use the WorkExperienceRequest model
              // For now, we'll just pass the existing metadata
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;
          }
        } catch (error) {
          console.error(`Error enhancing notification ${notif._id}:`, error.message);
          // Keep original notification if error occurs
          if (notif.metadata) {
            enhancedNotif.metadata = notif.metadata;
          }
        }
        
        return enhancedNotif;
      })
    );

    res.json(enhancedNotifications);
  } else if (role === "departmenthead") {
    notifications = await Notification.find({ recipientRole: "DepartmentHead" })
      .sort({ createdAt: -1 })
      .lean(); // Changed from populate to lean
    
    // Process each notification to add detailed information for department head
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        
        try {
          switch (notif.type) {
            case "Leave":
              const leave = await LeaveRequest.findById(notif.leaveRequestId || notif.reference)
                .lean();
              
              if (leave) {
                // Try to get employee details if requester is an ObjectId
                let employeeName = leave.requesterName;
                let employeeEmail = leave.requesterEmail;
                let employeePhone = null;
                let employeeEmpId = null;
                
                if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
                  try {
                    const employee = await Employee.findById(leave.requester)
                      .select('name email phoneNumber empId')
                      .lean();
                    if (employee) {
                      employeeName = employee.name;
                      employeeEmail = employee.email;
                      employeePhone = employee.phoneNumber;
                      employeeEmpId = employee.empId;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for leave request');
                  }
                }
                
                // Get department name
                const departmentName = await getDepartmentName(leave.department);
                
                enhancedNotif.leaveRequestId = leave;
                enhancedNotif.metadata = {
                  employeeName: employeeName,
                  department: departmentName,
                  email: employeeEmail,
                  phone: employeePhone,
                  empId: employeeEmpId,
                  startDate: leave.startDate,
                  endDate: leave.endDate,
                  reason: leave.reason,
                  attachments: leave.attachments || [],
                  requesterRole: leave.requesterRole,
                  targetRole: leave.targetRole,
                  leaveType: leave.leaveType
                };
              } else if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Requisition":
              const requisition = await Requisition.findById(notif.reference).lean();
              
              if (requisition) {
                // Get requester details
                let requesterName = requisition.requestedBy;
                let requesterEmail = requisition.requestedByEmail;
                let requesterDepartment = requisition.department;
                let requesterEmpId = null;
                
                if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                  try {
                    const employee = await Employee.findById(requisition.requestedById)
                      .select('name email department empId')
                      .lean();
                    if (employee) {
                      requesterName = employee.name || requesterName;
                      requesterEmail = employee.email || requesterEmail;
                      requesterDepartment = employee.department || requesterDepartment;
                      requesterEmpId = employee.empId;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for requisition');
                  }
                }
                
                // Get department name
                const departmentName = await getDepartmentName(requesterDepartment);
                
                // Check if requisition has additional fields (from updated schema)
                const hasAttachments = requisition.attachments && Array.isArray(requisition.attachments) && requisition.attachments.length > 0;
                const justification = requisition.justification || requisition.reason || "N/A";
                const priority = requisition.priority || "medium";
                
                enhancedNotif.metadata = {
                  requesterName: requesterName,
                  department: departmentName,
                  email: requesterEmail || "N/A",
                  empId: requesterEmpId,
                  position: requisition.position,
                  educationLevel: requisition.educationalLevel || requisition.educationLevel,
                  quantity: requisition.quantity,
                  termOfEmployment: requisition.termOfEmployment,
                  sex: requisition.sex,
                  experience: requisition.experience,
                  requestDate: requisition.date || requisition.createdAt,
                  justification: justification,
                  priority: priority,
                  attachments: hasAttachments ? requisition.attachments : []
                };
              } else if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            default:
              // For other types, use existing metadata if available
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;
          }
        } catch (error) {
          console.error(`Error enhancing notification ${notif._id}:`, error.message);
          // Keep original notification if error occurs
          if (notif.metadata) {
            enhancedNotif.metadata = notif.metadata;
          }
        }
        
        return enhancedNotif;
      })
    );

    res.json(enhancedNotifications);
  } else if (role === "employee") {
    // FIXED: Simplified query for employee notifications
    notifications = await Notification.find({
      $or: [
        // General employee notifications
        { recipientRole: "Employee" },
        // Notifications specifically for this employee
        { recipientId: userId },
        { "employee._id": userId },
        { "employee.email": userEmail }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();
    
    // Process each notification
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        
        try {
          switch (notif.type) {
            case "Leave":
  const leave = await LeaveRequest.findById(notif.leaveRequestId || notif.reference).lean();
  
  if (leave) {
    // Get department name (it's already stored as a string)
    const departmentName = leave.department;
    
    enhancedNotif.leaveRequestId = leave;
    enhancedNotif.metadata = {
      employeeName: leave.requesterName,
      department: departmentName,
      email: leave.requesterEmail,
      phone: leave.phoneNumber || null, // Add phoneNumber field to schema if needed
      empId: leave.empId || null, // Add empId field to schema if needed
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      attachments: leave.attachments || [],
      requesterRole: leave.requesterRole,
      targetRole: leave.targetRole,
      leaveType: leave.leaveType
    };
  } else if (notif.metadata) {
    enhancedNotif.metadata = notif.metadata;
  }
  break;
            case "Work Experience":
              // Handle work experience notifications
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              } else {
                enhancedNotif.metadata = {
                  type: "Work Experience",
                  status: notif.status || "pending"
                };
              }
              break;

            case "Requisition":
              // Employees usually only get status updates for requisitions
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            default:
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;
          }
        } catch (error) {
          console.error(`Error enhancing notification ${notif._id}:`, error.message);
          if (notif.metadata) {
            enhancedNotif.metadata = notif.metadata;
          }
        }
        
        return enhancedNotif;
      })
    );

    // Filter out notifications that are clearly not for this employee
    const filteredNotifications = enhancedNotifications.filter(notif => {
      // If notification has a specific employee, check if it's for current user
      if (notif.employee?._id || notif.employee?.email) {
        return (
          notif.employee?._id?.toString() === userId.toString() ||
          notif.employee?.email?.toLowerCase() === userEmail
        );
      }
      
      // If notification has recipientId, check if it's for current user
      if (notif.recipientId) {
        return notif.recipientId.toString() === userId.toString();
      }
      
      // Otherwise, it's a general employee notification
      return notif.recipientRole === "Employee";
    });
    
    res.json(filteredNotifications);
  } else {
    res.status(403);
    throw new Error("User role not authorized");
  }
});

// ---------------- Mark as seen ----------------
// ---------------- Mark as seen ----------------
// ---------------- Mark as seen ----------------
export const markAsSeen = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;

  console.log('Marking as seen:', {
    userId,
    role,
    email,
    notificationId: req.params.id
  });

  const notif = await Notification.findById(req.params.id);
  
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  console.log('Found notification:', {
    recipientRole: notif.recipientRole,
    recipientId: notif.recipientId,
    employee: notif.employee
  });

  // Authorization check
  let isAuthorized = false;
  
  if (role === "admin" && notif.recipientRole?.toLowerCase() === "admin") {
    isAuthorized = true;
  } else if (role === "departmenthead" && notif.recipientRole?.toLowerCase() === "departmenthead") {
    isAuthorized = true;
  } else if (role === "employee") {
    // For employees, check if notification is for them
    if (notif.recipientRole?.toLowerCase() === "employee") {
      // Check if it's a general employee notification
      if (!notif.recipientId && !notif.employee?._id && !notif.employee?.email) {
        isAuthorized = true;
      }
      // Check if it's specifically for this employee
      else if (
        (notif.recipientId && notif.recipientId.toString() === userId.toString()) ||
        (notif.employee?._id && notif.employee._id.toString() === userId.toString()) ||
        (notif.employee?.email && notif.employee.email.toLowerCase() === email)
      ) {
        isAuthorized = true;
      }
    }
  }

  console.log('Authorization result:', isAuthorized);

  if (!isAuthorized) {
    res.status(403);
    throw new Error("Not authorized to mark this notification as seen");
  }

  // Mark as seen
  notif.seen = true;
  notif.seenAt = new Date(); // Add this field to your Notification schema
  await notif.save();

  console.log('Notification marked as seen:', notif._id);

  res.status(200).json({ 
    success: true,
    message: "Notification marked as seen",
    notification: {
      _id: notif._id,
      seen: notif.seen,
      seenAt: notif.seenAt
    }
  });
});
// ---------------- Mark all as read ----------------
export const markAllAsRead = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id; // Add user ID

  let query = {};

  if (role === "admin") {
    query = { recipientRole: "Admin", seen: false };
  } else if (role === "departmenthead") {
    query = { recipientRole: "DepartmentHead", seen: false };
  } else if (role === "employee") {
    // FIXED: More specific query for employees
    query = {
      $or: [
        { recipientId: userId, seen: false },
        { "employee._id": userId, seen: false },
        { "employee.email": email, seen: false },
        { 
          recipientRole: "Employee", 
          seen: false,
          $and: [
            { recipientId: { $exists: false } },
            { "employee._id": { $exists: false } },
            { "employee.email": { $exists: false } }
          ]
        }
      ]
    };
  }

  await Notification.updateMany(query, { $set: { seen: true } });
  
  res.json({ message: "All notifications marked as read" });
});

// ---------------- Clear all read notifications ----------------
export const clearReadNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id; // Add user ID

  let query = { seen: true };

  if (role === "admin") {
    query.recipientRole = "Admin";
  } else if (role === "departmenthead") {
    query.recipientRole = "DepartmentHead";
  } else if (role === "employee") {
    // FIXED: More specific query for employees
    query.$or = [
      { recipientId: userId },
      { "employee._id": userId },
      { "employee.email": email },
      { 
        recipientRole: "Employee",
        $and: [
          { recipientId: { $exists: false } },
          { "employee._id": { $exists: false } },
          { "employee.email": { $exists: false } }
        ]
      }
    ];
  }

  await Notification.deleteMany(query);
  
  res.json({ message: "All read notifications cleared" });
});

// ---------------- Delete notification (role-based access) ----------------
export const deleteNotification = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;

  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  let canDelete = false;

  if (role === "admin" && notif.recipientRole?.toLowerCase() === "admin") {
    canDelete = true;
  } else if (role === "departmenthead" && notif.recipientRole?.toLowerCase() === "departmenthead") {
    canDelete = true;
  } else if (role === "employee") {
    // FIXED: More specific checks for employee
    if (notif.recipientRole?.toLowerCase() === "employee") {
      if (
        (notif.recipientId && notif.recipientId.toString() === userId.toString()) ||
        (notif.employee?._id && notif.employee._id.toString() === userId.toString()) ||
        (notif.employee?.email && notif.employee.email.toLowerCase() === email) ||
        (!notif.recipientId && !notif.employee?._id && !notif.employee?.email)
      ) {
        canDelete = true;
      }
    }
  }

  if (!canDelete) {
    res.status(403);
    throw new Error("Not authorized to delete this notification");
  }

  await notif.deleteOne();
  res.json({ message: "Notification deleted successfully" });
});

// ---------------- Create a new notification ----------------
export const createNotification = asyncHandler(async (req, res) => {
  const { message, recipientRole, type, reference, employee, department, vacancy, status, leaveRequestId, metadata } = req.body;

  if (!message || !recipientRole) {
    res.status(400);
    throw new Error("Message and recipientRole are required");
  }

  const notification = await Notification.create({
    message,
    recipientRole,
    type,
    reference,
    employee,
    department,
    vacancy,
    leaveRequestId,
    metadata: metadata || {},
    status: status || "pending",
    seen: false,
  });

  res.status(201).json(notification);
});

// ---------------- Update Leave Request status ----------------
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  leave.status = req.body.status.toLowerCase();
  if (req.body.adminComment) {
    leave.adminComment = req.body.adminComment;
  }
  await leave.save();

  await Notification.findOneAndUpdate(
    { $or: [{ reference: leave._id }, { leaveRequestId: leave._id }] },
    { 
      status: leave.status,
      adminComment: req.body.adminComment || undefined
    }
  );

  res.json({ 
    success: true,
    message: "Leave status updated successfully",
    leave: {
      _id: leave._id,
      status: leave.status,
      adminComment: leave.adminComment
    }
  });
});

// ---------------- Update Requisition status ----------------
export const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const requisition = await Requisition.findById(req.params.id);
  if (!requisition) {
    res.status(404);
    throw new Error("Requisition not found");
  }

  requisition.status = req.body.status.toLowerCase();
  if (req.body.adminComment) {
    requisition.adminComment = req.body.adminComment;
  }
  await requisition.save();

  await Notification.findOneAndUpdate(
    { reference: requisition._id },
    { 
      status: requisition.status,
      adminComment: req.body.adminComment || undefined
    }
  );

  res.json({ 
    success: true,
    message: "Requisition status updated successfully",
    requisition: {
      _id: requisition._id,
      status: requisition.status,
      adminComment: requisition.adminComment
    }
  });
});

// ---------------- Update Job Application status ----------------
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Job application not found");
  }

  application.status = req.body.status.toLowerCase();
  if (req.body.adminComment) {
    application.adminComment = req.body.adminComment;
  }
  await application.save();

  await Notification.findOneAndUpdate(
    { reference: application._id },
    { 
      status: application.status,
      adminComment: req.body.adminComment || undefined
    }
  );

  res.json({ 
    success: true,
    message: "Job application status updated successfully",
    application: {
      _id: application._id,
      status: application.status,
      adminComment: application.adminComment
    }
  });
});

// ---------------- Get notification details ----------------
export const getNotificationDetails = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;
  
  const notification = await Notification.findById(req.params.id).lean();
  
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // FIXED: Check authorization with user ID for employees
  let isAuthorized = false;
  
  if (role === "admin" && notification.recipientRole?.toLowerCase() === "admin") {
    isAuthorized = true;
  } else if (role === "departmenthead" && notification.recipientRole?.toLowerCase() === "departmenthead") {
    isAuthorized = true;
  } else if (role === "employee") {
    if (notification.recipientRole?.toLowerCase() === "employee") {
      if (
        (notification.recipientId && notification.recipientId.toString() === userId.toString()) ||
        (notification.employee?._id && notification.employee._id.toString() === userId.toString()) ||
        (notification.employee?.email && notification.employee.email.toLowerCase() === email) ||
        (!notification.recipientId && !notification.employee?._id && !notification.employee?.email)
      ) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    res.status(403);
    throw new Error("Not authorized to view this notification");
  }

  let details = { notification };
  
  try {
    switch (notification.type) {
      case "Vacancy Application":
        const jobApplication = await JobApplication.findById(notification.reference)
          .populate('vacancyId', 'title department position deadline postDate description salary')
          .populate('employeeId', 'name email phoneNumber empId address')
          .lean();
        
        if (jobApplication) {
          details.application = jobApplication;
          details.vacancy = jobApplication.vacancyId;
          details.employee = jobApplication.employeeId;
        }
        break;

      case "Leave":
        const leave = await LeaveRequest.findById(notification.leaveRequestId || notification.reference)
          .lean();
        
        if (leave) {
          details.leave = leave;
          
          // Try to get employee details if available
          if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
            const employee = await Employee.findById(leave.requester)
              .select('name email phoneNumber empId address')
              .lean();
            details.employee = employee;
          }
        }
        break;

      case "Requisition":
        const requisition = await Requisition.findById(notification.reference).lean();
        
        if (requisition) {
          details.requisition = requisition;
          
          // Get requester details if available
          if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
            const employee = await Employee.findById(requisition.requestedById)
              .select('name email phoneNumber empId position')
              .lean();
            details.requester = employee;
          }
        }
        break;
    }
  } catch (error) {
    console.error("Error fetching notification details:", error.message);
  }

  res.json(details);
});

// ---------------- Get notification statistics ----------------
export const getNotificationStats = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;

  let matchStage = {};

  if (role === "admin") {
    matchStage = { recipientRole: "Admin" };
  } else if (role === "departmenthead") {
    matchStage = { recipientRole: "DepartmentHead" };
  } else if (role === "employee") {
    // FIXED: More specific match for employees
    matchStage = {
      $or: [
        { recipientId: userId },
        { "employee._id": userId },
        { "employee.email": email },
        { 
          recipientRole: "Employee",
          $and: [
            { recipientId: { $exists: false } },
            { "employee._id": { $exists: false } },
            { "employee.email": { $exists: false } }
          ]
        }
      ]
    };
  }

  const stats = await Notification.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ["$seen", false] }, 1, 0] } },
        byType: {
          $push: {
            type: "$type",
            count: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        unread: 1,
        read: { $subtract: ["$total", "$unread"] },
        byType: 1
      }
    }
  ]);

  const result = stats[0] || {
    total: 0,
    unread: 0,
    read: 0,
    byType: []
  };

  // Group by type
  const byTypeObj = {};
  result.byType.forEach(item => {
    byTypeObj[item.type] = (byTypeObj[item.type] || 0) + item.count;
  });
  result.byType = byTypeObj;

  res.json(result);
});