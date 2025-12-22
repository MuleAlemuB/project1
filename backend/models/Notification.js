import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Message",
        "Alert",
        "Reminder",
        "Requisition",
        "Vacancy Application",
        "Leave",
        "EmployeeLeaveApplied",
        "Work Experience Request", // added to fix validation error
      ],
      required: true,
    },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    reference: { type: String }, // Generic reference field
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
      enum: ["Admin", "DepartmentHead", "Employee"], // Capitalized
      required: true,
      default: "Admin",
    },
    leaveRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest",
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
