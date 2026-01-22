import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Requisition from "../models/Requisition.js";
import JobApplication from "../models/JobApplication.js";
import Employee from "../models/Employee.js";
import Vacancy from "../models/Vacancy.js";
import Department from "../models/Department.js";
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
    .lean();

  res.json(notifications);
});

// Helper function to get department name
const getDepartmentName = async (departmentId) => {
  try {
    if (!departmentId) return "N/A";
    
    if (typeof departmentId === 'string' && !mongoose.Types.ObjectId.isValid(departmentId)) {
      return departmentId;
    }
    
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

// Helper to get current department head's department
const getCurrentDeptHeadDepartment = async (userId) => {
  try {
    const employee = await Employee.findById(userId).select('department').lean();
    return employee?.department;
  } catch (error) {
    console.error('Error fetching employee department:', error.message);
    return null;
  }
};

// ---------------- Get notifications for logged-in user ----------------
export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user.role.toLowerCase();
  const userId = user._id;
  const userEmail = user.email?.toLowerCase();

  console.log(`[NOTIFICATION] Fetching notifications for: ${user.email}, Role: ${role}, ID: ${userId}`);

  let notifications;

  if (role === "admin") {
    notifications = await Notification.find({ recipientRole: "Admin" })
      .sort({ createdAt: -1 })
      .lean();
    
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        
        try {
          switch (notif.type) {
            case "Vacancy Application":
              const jobApplication = await JobApplication.findById(notif.reference)
                .populate('vacancyId', 'title department position')
                .populate('employeeId', 'name email phoneNumber')
                .lean();
              
              if (jobApplication) {
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
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Leave":
              const leave = await LeaveRequest.findById(notif.reference || notif.relatedId).lean();
              
              if (leave) {
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
                
                const departmentName = await getDepartmentName(leave.department);
                
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
                
                const departmentName = await getDepartmentName(requesterDepartment);
                
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
            case "Work Experience Request":
            case "Work Experience Approved":
            case "Work Experience Rejected":
            case "Work Experience Letter Generated":
            case "Work Experience Letter Uploaded":
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

    res.json(enhancedNotifications);
  } else if (role === "departmenthead") {
    // For department head - get all notifications for department heads
    notifications = await Notification.find({ recipientRole: "DepartmentHead" })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`[NOTIFICATION] Found ${notifications.length} notifications for all department heads`);
    
    // Get current department head's department
    const userDepartment = await getCurrentDeptHeadDepartment(userId);
    console.log(`[NOTIFICATION] Current department head department: ${userDepartment}`);
    
    // Filter notifications based on department from referenced documents
    const filteredNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        let shouldInclude = false;
        
        try {
          switch (notif.type) {
            case "Leave":
              const leave = await LeaveRequest.findById(notif.reference || notif.relatedId).lean();
              
              if (leave) {
                // Check if leave request is from this department head's department
                if (leave.department && leave.department.toString() === userDepartment?.toString()) {
                  shouldInclude = true;
                  
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
                  
                  const departmentName = await getDepartmentName(leave.department);
                  
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
                }
              } else if (notif.metadata) {
                // If no leave request found but has metadata, include it
                shouldInclude = true;
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            case "Requisition":
              const requisition = await Requisition.findById(notif.reference).lean();
              
              if (requisition) {
                // Check if requisition is from this department head's department
                let requesterDepartment = requisition.department;
                
                if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                  try {
                    const employee = await Employee.findById(requisition.requestedById)
                      .select('department')
                      .lean();
                    if (employee) {
                      requesterDepartment = employee.department || requesterDepartment;
                    }
                  } catch (error) {
                    console.log('Could not populate employee for requisition');
                  }
                }
                
                if (requesterDepartment && requesterDepartment.toString() === userDepartment?.toString()) {
                  shouldInclude = true;
                  
                  let requesterName = requisition.requestedBy;
                  let requesterEmail = requisition.requestedByEmail;
                  let requesterEmpId = null;
                  
                  if (requisition.requestedById && mongoose.Types.ObjectId.isValid(requisition.requestedById)) {
                    try {
                      const employee = await Employee.findById(requisition.requestedById)
                        .select('name email empId')
                        .lean();
                      if (employee) {
                        requesterName = employee.name || requesterName;
                        requesterEmail = employee.email || requesterEmail;
                        requesterEmpId = employee.empId;
                      }
                    } catch (error) {
                      console.log('Could not populate employee for requisition');
                    }
                  }
                  
                  const departmentName = await getDepartmentName(requesterDepartment);
                  
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
                }
              } else if (notif.metadata) {
                // If no requisition found but has metadata, include it
                shouldInclude = true;
                enhancedNotif.metadata = notif.metadata;
              }
              break;

            default:
              // For other notification types, include them by default
              shouldInclude = true;
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              }
              break;
          }
        } catch (error) {
          console.error(`Error processing notification ${notif._id}:`, error.message);
          // On error, include the notification with existing metadata
          shouldInclude = true;
          if (notif.metadata) {
            enhancedNotif.metadata = notif.metadata;
          }
        }
        
        return shouldInclude ? enhancedNotif : null;
      })
    );
    
    // Remove null entries (notifications that shouldn't be included)
    const finalNotifications = filteredNotifications.filter(notif => notif !== null);
    
    console.log(`[NOTIFICATION] Filtered to ${finalNotifications.length} notifications for this department head`);
    
    res.json(finalNotifications);
  } else if (role === "employee") {
    // For employee - get notifications based on applicant or employee fields
    notifications = await Notification.find({
      $or: [
        // Check applicant email field
        { "applicant.email": userEmail },
        // Check employee email field  
        { "employee.email": userEmail },
        // Check for employee recipient role without specific user
        { recipientRole: "Employee" }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`[NOTIFICATION] Found ${notifications.length} employee notifications`);
    
    const enhancedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let enhancedNotif = { ...notif };
        
        try {
          switch (notif.type) {
            case "Leave":
              const leave = await LeaveRequest.findById(notif.reference || notif.relatedId).lean();
              
              if (leave) {
                const departmentName = leave.department;
                
                enhancedNotif.metadata = {
                  employeeName: leave.requesterName,
                  department: departmentName,
                  email: leave.requesterEmail,
                  phone: leave.phoneNumber || null,
                  empId: leave.empId || null,
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
            case "Work Experience Request":
            case "Work Experience Approved":
            case "Work Experience Rejected":
            case "Work Experience Letter Generated":
            case "Work Experience Letter Uploaded":
              if (notif.metadata) {
                enhancedNotif.metadata = notif.metadata;
              } else {
                enhancedNotif.metadata = {
                  type: notif.type,
                  status: notif.status || "pending"
                };
              }
              break;

            case "Requisition":
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

    // Filter notifications to ensure they're for this specific employee
    const filteredNotifications = enhancedNotifications.filter(notif => {
      // Check if notification has applicant email matching user email
      if (notif.applicant?.email) {
        return notif.applicant.email.toLowerCase() === userEmail;
      }
      
      // Check if notification has employee email matching user email
      if (notif.employee?.email) {
        return notif.employee.email.toLowerCase() === userEmail;
      }
      
      // If no specific email, assume it's for this employee
      return notif.recipientRole === "Employee";
    });
    
    console.log(`[NOTIFICATION] Final filtered to ${filteredNotifications.length} notifications for this employee`);
    
    res.json(filteredNotifications);
  } else {
    res.status(403);
    throw new Error("User role not authorized");
  }
});

// ---------------- Mark as seen ----------------
export const markAsSeen = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;

  const notif = await Notification.findById(req.params.id);
  
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }

  let isAuthorized = false;
  
  if (role === "admin" && notif.recipientRole?.toLowerCase() === "admin") {
    isAuthorized = true;
  } else if (role === "departmenthead") {
    // Check if notification is for department head
    if (notif.recipientRole?.toLowerCase() === "departmenthead") {
      // Get user's department
      const userDepartment = await getCurrentDeptHeadDepartment(userId);
      
      // Check if this notification belongs to user's department
      let belongsToUserDept = false;
      
      // For leave requests, check the referenced leave request
      if (notif.type === "Leave" || notif.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notif.reference || notif.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      }
      // For requisitions, check the referenced requisition
      else if (notif.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notif.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      }
      // For other types, allow access
      else {
        belongsToUserDept = true;
      }
      
      isAuthorized = belongsToUserDept;
    }
  } else if (role === "employee") {
    if (notif.recipientRole?.toLowerCase() === "employee") {
      // Check if notification has applicant or employee email matching user email
      if (notif.applicant?.email && notif.applicant.email.toLowerCase() === email) {
        isAuthorized = true;
      } else if (notif.employee?.email && notif.employee.email.toLowerCase() === email) {
        isAuthorized = true;
      } else if (!notif.applicant?.email && !notif.employee?.email) {
        // If no specific email, assume it's for this employee
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    res.status(403);
    throw new Error("Not authorized to mark this notification as seen");
  }

  notif.seen = true;
  notif.seenAt = new Date();
  await notif.save();

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
  const userId = req.user._id;

  let query = {};

  if (role === "admin") {
    query = { recipientRole: "Admin", seen: false };
  } else if (role === "departmenthead") {
    // For department head, we need to handle this differently
    // We'll mark all unseen department head notifications as seen
    const userDepartment = await getCurrentDeptHeadDepartment(userId);
    
    // First get all department head notifications
    const allDeptHeadNotifications = await Notification.find({ 
      recipientRole: "DepartmentHead", 
      seen: false 
    }).lean();
    
    // Filter to only those belonging to user's department
    const notificationsToMark = [];
    
    for (const notif of allDeptHeadNotifications) {
      let belongsToUserDept = false;
      
      // Check if this notification belongs to user's department
      if (notif.type === "Leave" || notif.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notif.reference || notif.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      } else if (notif.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notif.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      } else {
        // For other types, mark them
        belongsToUserDept = true;
      }
      
      if (belongsToUserDept) {
        notificationsToMark.push(notif._id);
      }
    }
    
    // Mark all filtered notifications as seen
    await Notification.updateMany(
      { _id: { $in: notificationsToMark } },
      { $set: { seen: true, seenAt: new Date() } }
    );
    
    return res.json({ 
      message: "All notifications marked as read",
      count: notificationsToMark.length
    });
    
  } else if (role === "employee") {
    query = {
      $or: [
        { "applicant.email": email, seen: false },
        { "employee.email": email, seen: false },
        { 
          recipientRole: "Employee", 
          seen: false,
          $and: [
            { "applicant.email": { $exists: false } },
            { "employee.email": { $exists: false } }
          ]
        }
      ]
    };
    
    await Notification.updateMany(query, { $set: { seen: true, seenAt: new Date() } });
  }

  res.json({ message: "All notifications marked as read" });
});

// ---------------- Clear all read notifications ----------------
export const clearReadNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role.toLowerCase();
  const email = req.user.email?.toLowerCase();
  const userId = req.user._id;

  let query = { seen: true };

  if (role === "admin") {
    query.recipientRole = "Admin";
  } else if (role === "departmenthead") {
    // For department head, we need to handle this differently
    const userDepartment = await getCurrentDeptHeadDepartment(userId);
    
    // First get all read department head notifications
    const allReadDeptHeadNotifications = await Notification.find({ 
      recipientRole: "DepartmentHead", 
      seen: true 
    }).lean();
    
    // Filter to only those belonging to user's department
    const notificationsToDelete = [];
    
    for (const notif of allReadDeptHeadNotifications) {
      let belongsToUserDept = false;
      
      // Check if this notification belongs to user's department
      if (notif.type === "Leave" || notif.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notif.reference || notif.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      } else if (notif.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notif.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      } else {
        // For other types, delete them
        belongsToUserDept = true;
      }
      
      if (belongsToUserDept) {
        notificationsToDelete.push(notif._id);
      }
    }
    
    // Delete all filtered notifications
    await Notification.deleteMany({ _id: { $in: notificationsToDelete } });
    
    return res.json({ 
      message: "All read notifications cleared",
      count: notificationsToDelete.length
    });
    
  } else if (role === "employee") {
    query.$or = [
      { "applicant.email": email },
      { "employee.email": email },
      { 
        recipientRole: "Employee",
        $and: [
          { "applicant.email": { $exists: false } },
          { "employee.email": { $exists: false } }
        ]
      }
    ];
    
    await Notification.deleteMany(query);
  }

  res.json({ message: "All read notifications cleared" });
});

// ---------------- Delete notification ----------------
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
  } else if (role === "departmenthead") {
    if (notif.recipientRole?.toLowerCase() === "departmenthead") {
      // Get user's department
      const userDepartment = await getCurrentDeptHeadDepartment(userId);
      
      // Check if this notification belongs to user's department
      let belongsToUserDept = false;
      
      if (notif.type === "Leave" || notif.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notif.reference || notif.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      } else if (notif.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notif.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      } else {
        belongsToUserDept = true;
      }
      
      canDelete = belongsToUserDept;
    }
  } else if (role === "employee") {
    if (notif.recipientRole?.toLowerCase() === "employee") {
      if (notif.applicant?.email && notif.applicant.email.toLowerCase() === email) {
        canDelete = true;
      } else if (notif.employee?.email && notif.employee.email.toLowerCase() === email) {
        canDelete = true;
      } else if (!notif.applicant?.email && !notif.employee?.email) {
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
  const { message, recipientRole, type, reference, employee, department, vacancy, status, leaveRequestId, metadata, applicant } = req.body;

  if (!message || !recipientRole) {
    res.status(400);
    throw new Error("Message and recipientRole are required");
  }

  // Build notification object based on available fields in your model
  const notificationData = {
    message,
    recipientRole,
    type,
    reference,
    metadata: metadata || {},
    status: status || "pending",
    seen: false,
  };

  // Add optional fields if provided
  if (applicant) notificationData.applicant = applicant;
  if (employee) notificationData.employee = employee;
  if (vacancy) notificationData.vacancy = vacancy;
  
  // Use relatedId instead of leaveRequestId to match your model
  if (leaveRequestId) {
    notificationData.relatedId = leaveRequestId;
    notificationData.relatedModel = "LeaveRequest";
  }

  const notification = await Notification.create(notificationData);

  res.status(201).json(notification);
});

// Helper function to create department head notifications with proper department info
export const createDeptHeadNotification = asyncHandler(async (req, res) => {
  const { message, type, reference, metadata, departmentId } = req.body;
  
  if (!message || !type || !departmentId) {
    res.status(400);
    throw new Error("Message, type, and departmentId are required");
  }

  // Find current department head for this department
  const currentDeptHead = await Employee.findOne({
    department: departmentId,
    role: 'depthead',
    employeeStatus: 'active'
  }).select('_id name email');

  if (!currentDeptHead) {
    res.status(404);
    throw new Error('No active department head found for this department');
  }

  // Create metadata with department info
  const notificationMetadata = {
    ...metadata,
    departmentId: departmentId,
    departmentHeadName: currentDeptHead.name,
    departmentHeadEmail: currentDeptHead.email
  };

  const notification = await Notification.create({
    message,
    recipientRole: "DepartmentHead",
    type,
    reference,
    metadata: notificationMetadata,
    status: "pending",
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

  // Update related notification
  await Notification.findOneAndUpdate(
    { $or: [{ reference: leave._id }, { relatedId: leave._id }] },
    { 
      status: leave.status,
      $set: { 'metadata.adminComment': req.body.adminComment || undefined }
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
      $set: { 'metadata.adminComment': req.body.adminComment || undefined }
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
      $set: { 'metadata.adminComment': req.body.adminComment || undefined }
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

  let isAuthorized = false;
  
  if (role === "admin" && notification.recipientRole?.toLowerCase() === "admin") {
    isAuthorized = true;
  } else if (role === "departmenthead") {
    if (notification.recipientRole?.toLowerCase() === "departmenthead") {
      // Get user's department
      const userDepartment = await getCurrentDeptHeadDepartment(userId);
      
      // Check if this notification belongs to user's department
      let belongsToUserDept = false;
      
      if (notification.type === "Leave" || notification.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notification.reference || notification.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      } else if (notification.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notification.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      } else {
        belongsToUserDept = true;
      }
      
      isAuthorized = belongsToUserDept;
    }
  } else if (role === "employee") {
    if (notification.recipientRole?.toLowerCase() === "employee") {
      if (notification.applicant?.email && notification.applicant.email.toLowerCase() === email) {
        isAuthorized = true;
      } else if (notification.employee?.email && notification.employee.email.toLowerCase() === email) {
        isAuthorized = true;
      } else if (!notification.applicant?.email && !notification.employee?.email) {
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
        const leave = await LeaveRequest.findById(notification.reference || notification.relatedId).lean();
        
        if (leave) {
          details.leave = leave;
          
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

  // For department head, we need custom logic
  if (role === "departmenthead") {
    const userDepartment = await getCurrentDeptHeadDepartment(userId);
    
    // Get all department head notifications
    const allDeptHeadNotifications = await Notification.find({ 
      recipientRole: "DepartmentHead" 
    }).lean();
    
    // Filter to only those belonging to user's department
    let total = 0;
    let unread = 0;
    const byType = {};
    
    for (const notif of allDeptHeadNotifications) {
      let belongsToUserDept = false;
      
      if (notif.type === "Leave" || notif.type === "Leave Request") {
        try {
          const leave = await LeaveRequest.findById(notif.reference || notif.relatedId)
            .select('department')
            .lean();
          if (leave && leave.department && leave.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify leave request department');
        }
      } else if (notif.type === "Requisition") {
        try {
          const requisition = await Requisition.findById(notif.reference)
            .select('department')
            .lean();
          if (requisition && requisition.department && requisition.department.toString() === userDepartment?.toString()) {
            belongsToUserDept = true;
          }
        } catch (error) {
          console.log('Could not verify requisition department');
        }
      } else {
        belongsToUserDept = true;
      }
      
      if (belongsToUserDept) {
        total++;
        if (!notif.seen) unread++;
        byType[notif.type] = (byType[notif.type] || 0) + 1;
      }
    }
    
    const result = {
      total,
      unread,
      read: total - unread,
      byType
    };
    
    return res.json(result);
  }

  // For admin and employee, use simpler queries
  let matchStage = {};

  if (role === "admin") {
    matchStage = { recipientRole: "Admin" };
  } else if (role === "employee") {
    matchStage = {
      $or: [
        { "applicant.email": email },
        { "employee.email": email },
        { 
          recipientRole: "Employee",
          $and: [
            { "applicant.email": { $exists: false } },
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
    byType: {}
  };

  // Convert byType array to object
  if (Array.isArray(result.byType)) {
    const byTypeObj = {};
    result.byType.forEach(item => {
      byTypeObj[item.type] = (byTypeObj[item.type] || 0) + item.count;
    });
    result.byType = byTypeObj;
  }

  res.json(result);
});