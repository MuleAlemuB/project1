import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import Application from "../models/Application.js";
import Vacancy from "../models/Vacancy.js";
import Employee from "../models/Employee.js";

// Get Admin notifications with detailed information
export const getNotifications = asyncHandler(async (req, res) => {
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
              enhancedNotif.applicant = {
                name: application.name,
                email: application.email,
                phone: application.phone,
                appliedAt: application.createdAt,
                resume: application.resume
              };
              enhancedNotif.vacancy = application.vacancy;
              
              // Add metadata for frontend
              enhancedNotif.metadata = {
                name: application.name,
                email: application.email,
                phone: application.phone,
                resume: application.resume,
                vacancyTitle: application.vacancy?.title,
                department: application.vacancy?.department,
                position: application.vacancy?.position
              };
            }
            break;

          case "Leave":
            const leave = await LeaveRequest.findById(notif.reference)
              .populate('employeeId', 'name department empId')
              .lean();
            
            if (leave) {
              enhancedNotif.leaveRequestId = leave;
              enhancedNotif.metadata = {
                employeeName: leave.employeeId?.name,
                department: leave.employeeId?.department,
                empId: leave.employeeId?.empId,
                startDate: leave.startDate,
                endDate: leave.endDate,
                leaveType: leave.leaveType,
                reason: leave.reason,
                attachments: leave.attachments || []
              };
            }
            break;

          case "Requisition":
            const requisition = await Requisition.findById(notif.reference)
              .populate('requester', 'name department email')
              .lean();
            
            if (requisition) {
              enhancedNotif.metadata = {
                requesterName: requisition.requester?.name,
                department: requisition.department,
                email: requisition.requester?.email,
                position: requisition.position,
                educationLevel: requisition.educationLevel,
                quantity: requisition.quantity,
                termOfEmployment: requisition.termOfEmployment,
                sex: requisition.sex,
                experience: requisition.experience,
                requestDate: requisition.requestDate,
                justification: requisition.justification,
                priority: requisition.priority,
                attachments: requisition.attachments || []
              };
            }
            break;
        }
      } catch (error) {
        console.error(`Error enhancing notification ${notif._id}:`, error.message);
      }
      
      return enhancedNotif;
    })
  );

  res.json(enhancedNotifications);
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

// Update Leave Request status
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
      adminComment: leave.adminComment
    }
  });
});

// Update Requisition status
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

// Update Application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
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

// Get specific notification details
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
          .populate('vacancy', 'title department position deadline postDate')
          .lean();
        
        if (application) {
          details.application = application;
          details.vacancy = application.vacancy;
        }
        break;

      case "Leave":
        const leave = await LeaveRequest.findById(notification.reference)
          .populate('employeeId', 'name department empId email phoneNumber')
          .lean();
        
        if (leave) {
          details.leave = leave;
          details.employee = leave.employeeId;
        }
        break;

      case "Requisition":
        const requisition = await Requisition.findById(notification.reference)
          .populate('requester', 'name department email empId')
          .lean();
        
        if (requisition) {
          details.requisition = requisition;
          details.requester = requisition.requester;
        }
        break;
    }
  } catch (error) {
    console.error("Error fetching notification details:", error.message);
  }

  res.json(details);
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