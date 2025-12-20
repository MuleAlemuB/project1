// backend/controllers/notificationController.js
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import JobApplication from "../models/JobApplication.js";
import Employee from "../models/Employee.js";
import Vacancy from "../models/Vacancy.js";
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
    .populate("leaveRequestId");

  res.json(notifications);
});

// ---------------- Get notifications for logged-in user ----------------
export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user.role.toLowerCase();

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
                
                enhancedNotif.metadata = {
                  name: jobApplication.employeeId?.name,
                  email: jobApplication.employeeId?.email,
                  phone: jobApplication.employeeId?.phoneNumber,
                  resume: jobApplication.resume,
                  vacancyTitle: jobApplication.vacancyId?.title,
                  department: jobApplication.vacancyId?.department,
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
                
                if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
                  try {
                    const employee = await Employee.findById(leave.requester)
                      .select('name email phoneNumber')
                      .lean();
                    if (employee) {
                      employeeName = employee.name;
                      employeeEmail = employee.email;
                      employeePhone = employee.phoneNumber;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for leave request');
                  }
                }
                
                enhancedNotif.leaveRequestId = leave;
                enhancedNotif.metadata = {
                  employeeName: employeeName,
                  department: leave.department,
                  email: employeeEmail,
                  phone: employeePhone,
                  startDate: leave.startDate,
                  endDate: leave.endDate,
                  reason: leave.reason,
                  attachments: leave.attachments || []
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
                
                if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                  try {
                    const employee = await Employee.findById(requisition.requestedById)
                      .select('name email department')
                      .lean();
                    if (employee) {
                      requesterName = employee.name || requesterName;
                      requesterEmail = employee.email || requesterEmail;
                      requesterDepartment = employee.department || requesterDepartment;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for requisition');
                  }
                }
                
                enhancedNotif.metadata = {
                  requesterName: requesterName,
                  department: requesterDepartment,
                  email: requesterEmail,
                  position: requisition.position,
                  educationLevel: requisition.educationalLevel,
                  quantity: requisition.quantity,
                  termOfEmployment: requisition.termOfEmployment,
                  sex: requisition.sex,
                  experience: requisition.experience,
                  requestDate: requisition.date,
                  justification: requisition.justification || "N/A",
                  priority: requisition.priority || "medium",
                  attachments: requisition.attachments || []
                };
              } else if (notif.metadata) {
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
      .populate("leaveRequestId");
    res.json(notifications);
  } else if (role === "employee") {
    notifications = await Notification.find({
      $or: [
        { "employee.email": user.email },
        { recipientRole: "Employee" }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("leaveRequestId");
    res.json(notifications);
  } else {
    res.status(403);
    throw new Error("User role not authorized");
  }
});

// ---------------- Mark notification as seen ----------------
export const markAsSeen = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();

  const notif = await Notification.findById(req.params.id);
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  const isEmployee = role === "employee" && notif.employee?.email?.toLowerCase() === email;
  const isDeptHead = role === "departmenthead" && notif.recipientRole?.toLowerCase() === "departmenthead";
  const isAdmin = role === "admin" && notif.recipientRole?.toLowerCase() === "admin";

  if (!isEmployee && !isDeptHead && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to mark this notification as seen");
  }

  notif.seen = true;
  await notif.save();
  res.status(200).json({ message: "Notification marked as seen", notif });
});

// ---------------- Mark all as read ----------------
export const markAllAsRead = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();

  let query = {};

  if (role === "admin") {
    query = { recipientRole: "Admin", seen: false };
  } else if (role === "departmenthead") {
    query = { recipientRole: "DepartmentHead", seen: false };
  } else if (role === "employee") {
    query = {
      $or: [
        { "employee.email": email, seen: false },
        { recipientRole: "Employee", seen: false }
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

  let query = { seen: true };

  if (role === "admin") {
    query.recipientRole = "Admin";
  } else if (role === "departmenthead") {
    query.recipientRole = "DepartmentHead";
  } else if (role === "employee") {
    query.$or = [
      { "employee.email": email },
      { recipientRole: "Employee" }
    ];
  }

  await Notification.deleteMany(query);
  
  res.json({ message: "All read notifications cleared" });
});

// ---------------- Delete notification (role-based access) ----------------
export const deleteNotification = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id.toString();

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
    if (notif.recipientRole?.toLowerCase() === "employee") {
      if (!notif.employee || Object.keys(notif.employee).length === 0 || notif.employee.email?.toLowerCase() === email) {
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
  
  const notification = await Notification.findById(req.params.id).lean();
  
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Check authorization
  const isAuthorized = 
    (role === "admin" && notification.recipientRole?.toLowerCase() === "admin") ||
    (role === "departmenthead" && notification.recipientRole?.toLowerCase() === "departmenthead") ||
    (role === "employee" && (
      notification.recipientRole?.toLowerCase() === "employee" ||
      notification.employee?.email?.toLowerCase() === email
    ));

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

  let matchStage = {};

  if (role === "admin") {
    matchStage = { recipientRole: "Admin" };
  } else if (role === "departmenthead") {
    matchStage = { recipientRole: "DepartmentHead" };
  } else if (role === "employee") {
    matchStage = {
      $or: [
        { "employee.email": email },
        { recipientRole: "Employee" }
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