import mongoose from "mongoose";

const WorkExperienceRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roleSubmitted: {
      type: String,
      enum: ["Employee", "DepartmentHead"],
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

    // optional attached file from employee or dept head
    requestAttachment: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // admin rejection explanation
    adminDecisionReason: {
      type: String,
      default: "",
    },

    // admin uploaded letter
    letterFile: {
      type: String,
      default: null,
    },

    // generated letter link if system auto creates
    generatedLetterLink: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "WorkExperienceRequest",
  WorkExperienceRequestSchema
);
