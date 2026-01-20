import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    empId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    sex: { type: String, required: true },
    typeOfPosition: { type: String, required: true },
    termOfEmployment: { type: String, required: true },
    phoneNumber: { type: String },
    contactPerson: { type: String },
    contactPersonAddress: { type: String },
    employeeStatus: { type: String },
    salary: { type: Number },
    // Change experience to start date
    startDate: { 
      type: Date, 
      required: false,
      default: function() {
        // Default to createdAt if not provided
        return this.createdAt || new Date();
      }
    }, 
    qualification: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    maritalStatus: { type: String },
    photo: { type: String },
    role: { type: String, default: "employee" },
  },
  { timestamps: true }
);

// Virtual field for experience (years and months)
employeeSchema.virtual('experience').get(function() {
  // Use startDate or createdAt as fallback
  const startDate = this.startDate || this.createdAt;
  
  if (!startDate) {
    console.log('No start date or createdAt found for employee:', this._id);
    return "N/A";
  }
  
  const startDateObj = new Date(startDate);
  const currentDate = new Date();
  
  // Check if start date is in the future (shouldn't happen but just in case)
  if (startDateObj > currentDate) {
    return "Not started yet";
  }
  
  let years = currentDate.getFullYear() - startDateObj.getFullYear();
  let months = currentDate.getMonth() - startDateObj.getMonth();
  
  // Adjust if current month is before the start month
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust for day of month
  if (currentDate.getDate() < startDateObj.getDate()) {
    months--;
    // If months goes negative, adjust years
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  // Ensure months is not negative
  if (months < 0) {
    months = 0;
  }
  
  // Format the output
  if (years === 0 && months === 0) {
    // Less than 1 month
    const days = Math.floor((currentDate - startDateObj) / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Just started";
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days/7)} weeks`;
    return "Less than 1 month";
  } else if (years === 0) {
    // Less than 1 year
    if (months === 1) return "1 month";
    return `${months} months`;
  } else if (months === 0) {
    // Exact years
    if (years === 1) return "1 year";
    return `${years} years`;
  } else {
    // Years and months
    const yearText = years === 1 ? "1 year" : `${years} years`;
    const monthText = months === 1 ? "1 month" : `${months} months`;
    return `${yearText} and ${monthText}`;
  }
});

// Alternative virtual field for just years (for sorting/calculations)
employeeSchema.virtual('experienceYears').get(function() {
  const startDate = this.startDate || this.createdAt;
  
  if (!startDate) return 0;
  
  const startDateObj = new Date(startDate);
  const currentDate = new Date();
  
  let years = currentDate.getFullYear() - startDateObj.getFullYear();
  const monthDiff = currentDate.getMonth() - startDateObj.getMonth();
  
  // Adjust if current month is before the start month
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < startDateObj.getDate())) {
    years--;
  }
  
  // Return as decimal for more precise calculations (e.g., 2.5 years)
  const months = (currentDate.getMonth() - startDateObj.getMonth() + 12) % 12;
  const days = currentDate.getDate() - startDateObj.getDate();
  
  // Calculate decimal value (approximate)
  const decimalYears = years + (months / 12) + (days / 365);
  return parseFloat(decimalYears.toFixed(1));
});

// Add pre-save middleware to ensure startDate is set
employeeSchema.pre('save', function(next) {
  // If startDate is not set, default to createdAt
  if (!this.startDate && this.createdAt) {
    this.startDate = this.createdAt;
  } else if (!this.startDate) {
    this.startDate = new Date();
  }
  next();
});

// Add post-init middleware to add startDate if missing (for existing documents)
employeeSchema.post('init', function(doc) {
  if (!doc.startDate && doc.createdAt) {
    doc.startDate = doc.createdAt;
  }
});

// Ensure virtuals are included in JSON output
employeeSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive data
    delete ret.password;
    return ret;
  }
});
employeeSchema.set('toObject', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive data
    delete ret.password;
    return ret;
  }
});

// Index for better performance on common queries
employeeSchema.index({ email: 1 });
employeeSchema.index({ empId: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ startDate: -1 }); // For sorting by experience

export default mongoose.model("Employee", employeeSchema);