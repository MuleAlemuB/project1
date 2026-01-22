import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "requesterModel",
      required: true,
    },

    requesterModel: {
      type: String,
      enum: ["User", "Employee"],
      required: true,
    },

    requesterRole: {
      type: String,
      enum: ["Employee", "DepartmentHead"],
      required: true,
    },

    targetRole: {
      type: String,
      enum: ["DepartmentHead", "Admin"],
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
    },

    requesterEmail: {
      type: String,
      required: true,
    },

    // ✅ store department NAME only
    department: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    attachments: [{
      name: { type: String, required: true },
      url: { type: String, required: true }
    }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ADD THIS FIELD for rejection reason
    rejectionReason: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", leaveRequestSchema);