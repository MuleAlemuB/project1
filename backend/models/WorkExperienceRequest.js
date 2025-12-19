// backend/models/WorkExperienceRequest.js
import mongoose from "mongoose";

const WorkExperienceRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    requestedByRole: {
      type: String,
      enum: ["Employee", "DepartmentHead", "Admin"], // Added Admin and corrected case
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    yearsOfService: {
      type: Number,
      required: true,
      min: 1, // Minimum 1 year
      max: 50, // Maximum 50 years (reasonable limit)
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    pdfFile: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// Optional: Add index for better performance
WorkExperienceRequestSchema.index({ employee: 1, status: 1 });
WorkExperienceRequestSchema.index({ department: 1, status: 1 });
WorkExperienceRequestSchema.index({ requestedByRole: 1, createdAt: -1 });

const WorkExperienceRequest = mongoose.model(
  "WorkExperienceRequest",
  WorkExperienceRequestSchema
);

export default WorkExperienceRequest;