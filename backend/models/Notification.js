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
        "Leave", // employee leave request
        "EmployeeLeaveApplied", // when employee applies leave
      ],
      required: true,
    },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    
    // Reference should be a string for IDs
    reference: { type: String }, // <-- changed from object to string

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
  enum: ["Admin", "DepartmentHead", "Employee"], // capitalized
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
