import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
  type: String,
  enum: ["admin", "employee", "departmenthead"],
  required: true,
},

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to Department collection
    },
    phone: { type: String },      
    address: { type: String },    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
