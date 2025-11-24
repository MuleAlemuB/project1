// setAdminPassword.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Employee from "./models/Employee.js"; // adjust path if needed

dotenv.config();

const setAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = "admin@example.com"; // Replace with your admin email
    const plainPassword = "Admin123"; // Replace with the password you want

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Update admin password in DB
    const result = await Employee.updateOne(
      { email: adminEmail },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      console.log("No admin user found with that email!");
    } else {
      console.log("Admin password updated successfully!");
    }

    // Disconnect from DB
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
};

setAdminPassword();
