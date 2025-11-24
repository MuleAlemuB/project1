// scripts/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/dtu-ems");

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "System Admin",
      email: "admin@dtu.edu.et",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

createAdmin();
