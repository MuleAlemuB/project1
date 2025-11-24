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
      ref: "Department",  // Reference
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
    experience: { type: String },
    qualification: { type: String },
    dateOfBirth: { type: Date },
    address: { type: String },
    maritalStatus: { type: String },
    photo: { type: String },
    role: { type: String, default: "employee" },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
