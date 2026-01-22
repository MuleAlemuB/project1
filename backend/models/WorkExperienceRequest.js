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
      enum: ["employee", "departmenthead", "admin"],
      required: true,
      default: "employee"
    },
    fullName: {
      type: String,
      // Remove required: true since we'll populate it from employee
    },
    empId: {
      type: String, // Add empId field
    },
    department: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    requestLetter: { // Add this field for uploaded request letters
      type: String,
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
    timestamps: true
  }
);

// Middleware to auto-populate fullName and empId before saving
workExperienceRequestSchema.pre('save', async function(next) {
  try {
    // Only populate if requester is set and fullName/empId are not already set
    if (this.requester && (!this.fullName || !this.empId)) {
      const Employee = mongoose.model("Employee");
      const employee = await Employee.findById(this.requester);
      
      if (employee) {
        // Construct full name
        this.fullName = `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`.trim();
        this.empId = employee.empId;
        
        // If department is not set, get it from employee
        if (!this.department && employee.department) {
          // If department is a reference, populate it
          if (mongoose.Types.ObjectId.isValid(employee.department)) {
            const Department = mongoose.model("Department");
            const dept = await Department.findById(employee.department);
            this.department = dept ? dept.name : "Software Engineering";
          } else {
            this.department = employee.department;
          }
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for formatted status
workExperienceRequestSchema.virtual('statusFormatted').get(function() {
  return this.status.charAt(0).toUpperCase() + this.status.slice(1);
});

// Ensure virtuals are included in JSON
workExperienceRequestSchema.set('toJSON', { virtuals: true });
workExperienceRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model(
  "WorkExperienceRequest",
  workExperienceRequestSchema
);