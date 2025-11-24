import mongoose from "mongoose";

const requisitionSchema = mongoose.Schema(
  {
    requestedBy: { type: String, required: true },
    requestedById: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    requestedByEmail: { type: String, required: true }, // NEW: store DeptHead email
    position: { type: String, required: true },
    quantity: { type: Number, required: true },
    termOfEmployment: { type: String, required: true },
    educationalLevel: { type: String, required: true },
    sex: { type: String },
    experience: { type: String },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

const Requisition = mongoose.model("Requisition", requisitionSchema);
export default Requisition;
