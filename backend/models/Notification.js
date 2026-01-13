import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        // Work Experience related
        "Work Experience Request",
        "Work Experience Approved", 
        "Work Experience Rejected",
        "Work Experience Letter Generated",
        "Work Experience Letter Uploaded",
        
        // Leave related
        "Leave",
        "EmployeeLeaveApplied",
        
        // General
        "Message",
        "Alert",
        "Reminder",
        "Requisition",
        "Vacancy Application"
      ],
      required: true,
    },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    reference: { type: String },
    applicant: {
      name: String,
      email: String,
      phone: String,
    },
    vacancy: {
      title: String,
      department: String,
    },
    department: String,
    employee: {
      name: String,
      email: String,
    },
    recipientRole: {
      type: String,
      enum: ["Admin", "DepartmentHead", "Employee"],
      required: true,
      default: "Admin",
    },
    relatedId: { // Renamed from leaveRequestId to be more generic
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel"
    },
    relatedModel: { // To specify which model the relatedId refers to
      type: String,
      enum: ["LeaveRequest", "WorkExperienceRequest", "TrainingRequest"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);