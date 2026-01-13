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
    startDate: { type: Date, required: true }, // Add this field
    qualification: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    maritalStatus: { type: String },
    photo: { type: String },
    role: { type: String, default: "employee" },
  },
  { timestamps: true }
);

// Virtual field for experience
employeeSchema.virtual('experience').get(function() {
  if (!this.startDate) return "0 years";
  
  const startDate = new Date(this.startDate);
  const currentDate = new Date();
  
  let years = currentDate.getFullYear() - startDate.getFullYear();
  const monthDiff = currentDate.getMonth() - startDate.getMonth();
  
  // Adjust if current month is before the start month
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < startDate.getDate())) {
    years--;
  }
  
  return `${years} years`;
});

// Ensure virtuals are included in JSON output
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

export default mongoose.model("Employee", employeeSchema);