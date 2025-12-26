// backend/models/Requisition.js
import mongoose from "mongoose";

const requisitionSchema = mongoose.Schema(
  {
    requestedBy: { type: String, required: true },
    requestedById: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    requestedByEmail: { type: String, required: true },
    position: { type: String, required: true },
    quantity: { type: Number, required: true },
    termOfEmployment: { type: String, required: true },
    educationalLevel: { type: String, required: true },
    sex: { type: String },
    experience: { type: String },
    department: { type: String, required: true },
    date: { type: Date, required: true },
    justification: { type: String, default: "" },
    priority: { type: String, default: "medium" },
    attachments: [{ 
      name: { type: String },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminComment: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Requisition = mongoose.model("Requisition", requisitionSchema);
export default Requisition;