// backend/models/LeaveRequest.js
import mongoose from "mongoose";

const leaveRequestSchema = mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeEmail: { type: String, required: true }, // <-- ADD THIS
    department: { type: String, required: true }, 
    employeeName: { type: String, required: true },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, default: "pending" },
    attachments: [{ type: String }],
    role: { type: String },
  },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
