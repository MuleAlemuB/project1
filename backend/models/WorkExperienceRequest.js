import mongoose from "mongoose";

const workExperienceRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    requesterRole: {
      type: String,
      enum: ["employee", "dept_head", "admin"],
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
      ref: "Employee",
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
  { 
    timestamps: true,
    // This will prevent validation when updating existing documents
    validateBeforeSave: false 
  }
);

// Add a pre-save middleware to handle updates
workExperienceRequestSchema.pre('save', function(next) {
  // If document is being updated, don't validate required fields
  if (!this.isNew) {
    this.$__.saveOptions = { validateBeforeSave: false };
  }
  next();
});

export default mongoose.model(
  "WorkExperienceRequest",
  workExperienceRequestSchema
);