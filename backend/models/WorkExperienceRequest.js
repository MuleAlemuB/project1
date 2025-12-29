import mongoose from "mongoose";

const workExperienceRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterRole: {
      type: String,
      enum: ["employee", "dept_head", "admin"], // Changed from "departmenthead" to "dept_head"
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    adminReason: {
      type: String,
      default: "",
    },
    letterPdf: {
      public_id: String,
      url: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    letterGeneratedDate: {
      type: Date,
    },
    isGenerated: {
      type: Boolean,
      default: false,
    },
    isUploaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "WorkExperienceRequest",
  workExperienceRequestSchema
);