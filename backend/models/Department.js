// backend/models/Department.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  head: { type: String, required: true },
  totalEmployees: { type: Number, required: true },
  faculty: { type: String, required: true },
});

export default mongoose.model("Department", departmentSchema);
