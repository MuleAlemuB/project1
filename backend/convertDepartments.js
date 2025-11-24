import mongoose from "mongoose";
import Employee from "./models/Employee.js";
import Department from "./models/Department.js";

// Replace with your MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/hrms";

const convertDepartments = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Find employees where department is ObjectId
    const employees = await Employee.find({ department: { $type: "objectId" } });

    for (const emp of employees) {
      const dept = await Department.findById(emp.department);
      if (dept) {
        emp.department = dept.name; // replace with string
        await emp.save();
        console.log(`Updated employee ${emp.firstName} ${emp.lastName}`);
      }
    }

    console.log("All applicable employees updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
    mongoose.disconnect();
  }
};

convertDepartments();
