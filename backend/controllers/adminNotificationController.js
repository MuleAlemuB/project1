import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import Application from "../models/Application.js";
import Vacancy from "../models/Vacancy.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

// Get Admin notifications with detailed information for frontend
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientRole: "Admin" })
    .sort({ createdAt: -1 })
    .lean();

  // Process each notification to add detailed information
  const enhancedNotifications = await Promise.all(
    notifications.map(async (notif) => {
      let enhancedNotif = { ...notif };
      
      try {
        switch (notif.type) {
          case "Vacancy Application":
            const application = await Application.findById(notif.reference)
              .populate('vacancy', 'title department position')
              .lean();
            
            if (application) {
              // Add applicant details directly for frontend
              enhancedNotif.applicant = {
                name: application.name,
                email: application.email,
                phone: application.phone,
                empId: application.empId,
                appliedAt: application.createdAt,
                resume: application.resume
              };
              enhancedNotif.vacancy = application.vacancy;
              
              // Add metadata for frontend
              enhancedNotif.metadata = {
                _id: application._id,
                name: application.name,
                email: application.email,
                phone: application.phone,
                empId: application.empId,
                resume: application.resume,
                vacancyTitle: application.vacancy?.title,
                department: application.vacancy?.department,
                position: application.vacancy?.position,
                appliedAt: application.createdAt,
                status: application.status || "pending",
                // Add more fields that might be needed
                ...(application.vacancy ? {
                  vacancyId: application.vacancy._id
                } : {})
              };
            }
            break;

          // In getMyNotifications function, update the Leave case:
// In getMyNotifications function, update the Leave case:
case "Leave":
case "EmployeeLeaveApplied":
  const leave = await LeaveRequest.findById(notif.relatedId || notif.reference).lean();
  
  if (leave) {
    console.log("📝 Found leave request:", leave._id);
    
    // Start with all leave data
    enhancedNotif.metadata = {
      // Basic leave info
      _id: leave._id,
      referenceId: leave._id,
      leaveRequestId: leave._id,
      
      // From leave request
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      leaveType: leave.leaveType || "Annual Leave",
      requesterRole: leave.requesterRole || "Employee",
      department: leave.department,
      status: leave.status || "pending",
      rejectionReason: leave.rejectionReason || "",
      adminComment: leave.adminComment || "",
      attachments: leave.attachments || [],
      
      // From leave request (direct fields)
      requesterName: leave.requesterName,
      requesterEmail: leave.requesterEmail,
      
      // Set initial values
      employeeName: leave.requesterName,
      email: leave.requesterEmail,
      empId: "",
      phone: "",
      
      // Timestamps
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    };
    
    // Try to get employee details from Employee collection
    if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
      try {
        const employee = await Employee.findById(leave.requester)
          .select('name email phoneNumber empId department')
          .lean();
        
        if (employee) {
          console.log("👤 Found employee data:", employee);
          
          // Update with employee data
          enhancedNotif.metadata.employeeName = employee.name || leave.requesterName;
          enhancedNotif.metadata.email = employee.email || leave.requesterEmail;
          enhancedNotif.metadata.phone = employee.phoneNumber || "";
          enhancedNotif.metadata.empId = employee.empId || "";
          enhancedNotif.metadata.department = employee.department || leave.department;
          
          // Also update direct fields
          enhancedNotif.metadata.requesterName = employee.name || leave.requesterName;
          enhancedNotif.metadata.requesterEmail = employee.email || leave.requesterEmail;
        } else {
          console.log("⚠️ No employee found for ID:", leave.requester);
        }
      } catch (error) {
        console.log('❌ Error fetching employee:', error.message);
      }
    } else {
      console.log("⚠️ No valid requester ID in leave request");
    }
    
    // Also set these fields directly on the notification for frontend access
    enhancedNotif.relatedId = leave._id;
    enhancedNotif.relatedModel = "LeaveRequest";
    enhancedNotif.reference = leave._id.toString();
    
    // Set department directly on notification
    enhancedNotif.department = enhancedNotif.metadata.department;
    
    // Set employee object for compatibility
    enhancedNotif.employee = {
      name: enhancedNotif.metadata.employeeName,
      email: enhancedNotif.metadata.email
    };
    
    console.log("✅ Final metadata for notification:", enhancedNotif.metadata);
  } else {
    console.log("❌ No leave request found for notification:", notif._id);
  }
  break;

          case "Requisition":
            const requisition = await Requisition.findById(notif.reference).lean();
            
            if (requisition) {
              let requesterName = requisition.requestedBy;
              let requesterEmail = requisition.requestedByEmail;
              let requesterDepartment = requisition.department;
              let requesterEmpId = "";
              
              // Try to get requester details if requestedById exists
              if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                try {
                  const employee = await Employee.findById(requisition.requestedById)
                    .select('name email department empId')
                    .lean();
                  if (employee) {
                    requesterName = employee.name || requesterName;
                    requesterEmail = employee.email || requesterEmail;
                    requesterDepartment = employee.department || requesterDepartment;
                    requesterEmpId = employee.empId || requesterEmpId;
                  }
                } catch (error) {
                  console.log('Could not populate employee for requisition:', error.message);
                }
              }
              
              enhancedNotif.metadata = {
                _id: requisition._id,
                requesterName: requesterName,
                department: requesterDepartment,
                email: requesterEmail,
                empId: requesterEmpId,
                position: requisition.position,
                educationLevel: requisition.educationLevel,
                quantity: requisition.quantity || 1,
                termOfEmployment: requisition.termOfEmployment || "FullTime",
                sex: requisition.sex || "Any",
                experience: requisition.experience,
                requestDate: requisition.requestDate || requisition.createdAt,
                justification: requisition.justification,
                priority: requisition.priority || "medium",
                attachments: requisition.attachments || [],
                status: requisition.status || "pending",
                requestedById: requisition.requestedById,
                requestedBy: requisition.requestedBy,
                requestedByEmail: requisition.requestedByEmail,
                adminComment: requisition.adminComment || "",
                createdAt: requisition.createdAt,
                updatedAt: requisition.updatedAt
              };
            }
            break;

          case "Work Experience":
            if (notif.metadata) {
              enhancedNotif.metadata = notif.metadata;
            }
            break;
        }
      } catch (error) {
        console.error(`Error enhancing notification ${notif._id}:`, error.message);
        // Keep existing metadata if enhancement fails
        if (notif.metadata) {
          enhancedNotif.metadata = notif.metadata;
        }
      }
      
      return enhancedNotif;
    })
  );

  res.json(enhancedNotifications);
});

// Keep original getNotifications for backward compatibility
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientRole: "Admin" })
    .sort({ createdAt: -1 })
    .lean();

  res.json(notifications);
});

// FIXED: Update Leave Request status with proper rejection reason handling
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid leave request ID");
  }

  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  const newStatus = req.body.status.toLowerCase();
  leave.status = newStatus;
  
  // Handle rejection reason based on your model
  if (newStatus === "rejected") {
    // Your model has rejectionReason field
    leave.rejectionReason = req.body.adminComment || "No reason provided";
    leave.adminComment = req.body.adminComment;
  } else if (newStatus === "approved") {
    // Clear rejection reason if approved
    leave.rejectionReason = "";
    if (req.body.adminComment) {
      leave.adminComment = req.body.adminComment;
    }
  }
  
  await leave.save();

  // Update the corresponding notification
  await Notification.findOneAndUpdate(
    { reference: leave._id },
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
      adminComment: leave.adminComment,
      rejectionReason: leave.rejectionReason
    }
  });
});

// FIXED: Update Requisition status
export const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid requisition ID");
  }

  const requisition = await Requisition.findById(id);
  if (!requisition) {
    res.status(404);
    throw new Error("Requisition not found");
  }

  requisition.status = req.body.status.toLowerCase();
  if (req.body.adminComment) {
    requisition.adminComment = req.body.adminComment;
  }
  await requisition.save();

  // Update the corresponding notification
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

// FIXED: Update Application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ID
  if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid application ID");
  }

  const application = await Application.findById(id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application.status = req.body.status.toLowerCase();
  if (req.body.adminComment) {
    application.adminComment = req.body.adminComment;
  }
  await application.save();

  // Update the corresponding notification
  await Notification.findOneAndUpdate(
    { reference: application._id },
    { 
      status: application.status,
      adminComment: req.body.adminComment || undefined
    }
  );

  res.json({ 
    success: true,
    message: "Application status updated successfully",
    application: {
      _id: application._id,
      status: application.status,
      adminComment: application.adminComment
    }
  });
});

// Get specific notification details - FIXED to include all details
export const getNotificationDetails = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).lean();
  
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  let details = { notification };
  
  try {
    switch (notification.type) {
      case "Vacancy Application":
        const application = await Application.findById(notification.reference)
          .populate('vacancy', 'title department position deadline postDate requirements')
          .lean();
        
        if (application) {
          details.application = application;
          details.vacancy = application.vacancy;
          
          // Get applicant details
          details.applicant = {
            name: application.name,
            email: application.email,
            phone: application.phone,
            empId: application.empId,
            appliedAt: application.createdAt,
            resume: application.resume,
            status: application.status
          };
        }
        break;

      // In your backend controller, update the Leave case:
case "Leave":
case "EmployeeLeaveApplied":
  const leave = await LeaveRequest.findById(notif.relatedId || notif.reference).lean();
  
  if (leave) {
    // Ensure notification has relatedId set properly
    enhancedNotif.relatedId = leave._id;
    enhancedNotif.relatedModel = "LeaveRequest";
    
    let employeeName = leave.requesterName;
    let employeeEmail = leave.requesterEmail;
    let employeePhone = "";
    let employeeEmpId = "";
    let employeeDepartment = leave.department;
    
    // Try to get employee details if requester exists
    if (leave.requester && mongoose.Types.ObjectId.isValid(leave.requester)) {
      try {
        const employee = await Employee.findById(leave.requester)
          .select('name email phoneNumber empId department')
          .lean();
        if (employee) {
          employeeName = employee.name || employeeName;
          employeeEmail = employee.email || employeeEmail;
          employeePhone = employee.phoneNumber || employeePhone;
          employeeEmpId = employee.empId || employeeEmpId;
          employeeDepartment = employee.department || employeeDepartment;
        }
      } catch (error) {
        console.log('Could not populate employee for leave request:', error.message);
      }
    }
    
    // Build complete metadata
    enhancedNotif.metadata = {
      _id: leave._id,
      referenceId: leave._id,
      leaveRequestId: leave._id,
      employeeName: employeeName,
      department: employeeDepartment,
      email: employeeEmail,
      phone: employeePhone,
      empId: employeeEmpId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      leaveType: leave.leaveType || "Annual Leave",
      reason: leave.reason,
      attachments: leave.attachments || [],
      requesterRole: leave.requesterRole || "Employee",
      status: leave.status || "pending",
      requester: leave.requester,
      requesterName: leave.requesterName,
      requesterEmail: leave.requesterEmail,
      rejectionReason: leave.rejectionReason || "",
      adminComment: leave.adminComment || "",
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt
    };
    
    // Also update reference field for compatibility
    enhancedNotif.reference = leave._id.toString();
  }
  break;

      case "Requisition":
        const requisition = await Requisition.findById(notification.reference).lean();
        
        if (requisition) {
          details.requisition = requisition;
          
          if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
            const employee = await Employee.findById(requisition.requestedById)
              .select('name department email empId position')
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

// Mark as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  notification.seen = true;
  await notification.save();
  res.json(notification);
});

// Mark all as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipientRole: "Admin", seen: false },
    { $set: { seen: true } }
  );
  res.json({ message: "All notifications marked as read" });
});

// Delete notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  await notification.deleteOne();
  res.json({ message: "Notification deleted successfully" });
});

// Clear all read notifications
export const clearReadNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipientRole: "Admin", seen: true });
  res.json({ message: "All read notifications cleared" });
});

// Get notification statistics
export const getNotificationStats = asyncHandler(async (req, res) => {
  const stats = await Notification.aggregate([
    {
      $match: { recipientRole: "Admin" }
    },
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
        },
        byStatus: {
          $push: {
            status: "$status",
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
        byType: {
          $arrayToObject: {
            $reduce: {
              input: "$byType",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  [
                    {
                      k: { $arrayElemAt: ["$$this.type", 0] },
                      v: {
                        $sum: [
                          { $arrayElemAt: ["$$value.v", 0] } || 0,
                          "$$this.count"
                        ]
                      }
                    }
                  ]
                ]
              }
            }
          }
        },
        byStatus: {
          $arrayToObject: {
            $reduce: {
              input: "$byStatus",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  [
                    {
                      k: { $arrayElemAt: ["$$this.status", 0] } || "pending",
                      v: {
                        $sum: [
                          { $arrayElemAt: ["$$value.v", 0] } || 0,
                          "$$this.count"
                        ]
                      }
                    }
                  ]
                ]
              }
            }
          }
        }
      }
    }
  ]);

  const result = stats[0] || {
    total: 0,
    unread: 0,
    read: 0,
    byType: {},
    byStatus: {}
  };

  res.json(result);
});

// Helper function to update notification status (for fallback)
export const updateNotificationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminComment } = req.body;

  const notification = await Notification.findById(id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.status = status;
  if (adminComment) {
    notification.adminComment = adminComment;
  }
  
  await notification.save();

  // Also update the referenced document if it exists
  try {
    if (notification.type === "Leave" && notification.reference) {
      const updateData = { status: status };
      if (status === "rejected") {
        updateData.rejectionReason = adminComment || "No reason provided";
        updateData.adminComment = adminComment;
      } else if (adminComment) {
        updateData.adminComment = adminComment;
      }
      await LeaveRequest.findByIdAndUpdate(notification.reference, updateData);
    } else if (notification.type === "Requisition" && notification.reference) {
      await Requisition.findByIdAndUpdate(notification.reference, {
        status: status,
        adminComment: adminComment
      });
    } else if (notification.type === "Vacancy Application" && notification.reference) {
      await Application.findByIdAndUpdate(notification.reference, {
        status: status,
        adminComment: adminComment
      });
    }
  } catch (error) {
    console.log("Note: Could not update referenced document:", error.message);
  }

  res.json({
    success: true,
    message: "Notification status updated",
    notification: {
      _id: notification._id,
      status: notification.status,
      adminComment: notification.adminComment
    }
  });
});