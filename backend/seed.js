import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Employee from "./models/Employee.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await Employee.deleteMany(); // Clear previous users

    const users = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        empId: "A001",
        password: await bcrypt.hash("admin123", 10),
        department: "Admin",
        sex: "Male",
        typeOfPosition: "Administrator",
        termOfEmployment: "Permanent",
        role: "admin",
      },
      {
        firstName: "DeptHead",
        lastName: "User",
        email: "head@example.com",
        empId: "DH001",
        password: await bcrypt.hash("head123", 10),
        department: "HR",
        sex: "Female",
        typeOfPosition: "Department Head",
        termOfEmployment: "Permanent",
        role: "departmenthead",
      },
      {
        firstName: "Regular",
        lastName: "Employee",
        email: "employee@example.com",
        empId: "E001",
        password: await bcrypt.hash("employee123", 10),
        department: "HR",
        sex: "Male",
        typeOfPosition: "Staff",
        termOfEmployment: "Contract",
        role: "employee",
      },
    ];

    await Employee.insertMany(users);
    console.log("Users seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
};

connectDB().then(seedUsers);
