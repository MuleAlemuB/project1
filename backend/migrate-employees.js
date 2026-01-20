// migrate-employees.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!value.startsWith('#') && key.trim()) {
        process.env[key.trim()] = value.replace(/['"]/g, '');
      }
    }
  });
}

const migrateEmployees = async () => {
  try {
    // Get MongoDB URI from environment or use default
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/dtu-hrms';
    
    console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Dynamically import Employee model
    const { default: Employee } = await import('./models/Employee.js');
    
    // Find all employees
    const employees = await Employee.find({});
    
    console.log(`📊 Found ${employees.length} total employees`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Update each employee
    for (const employee of employees) {
      try {
        // Check if startDate is missing or invalid
        if (!employee.startDate || employee.startDate === 'Invalid Date') {
          const updateData = {
            startDate: employee.createdAt || new Date('2023-01-01')
          };
          
          await Employee.findByIdAndUpdate(
            employee._id, 
            { $set: updateData },
            { new: true, runValidators: true }
          );
          
          updatedCount++;
          console.log(`✅ Updated employee ${employee.empId || employee.email}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error updating employee ${employee._id}:`, error.message);
      }
    }
    
    console.log('\n📋 Migration Summary:');
    console.log(`   Total employees: ${employees.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Already had startDate: ${employees.length - updatedCount - errorCount}`);
    
    // Test a few employees to verify experience calculation
    console.log('\n🧪 Testing experience calculation:');
    const testEmployees = await Employee.find().limit(3).lean({ virtuals: true });
    
    testEmployees.forEach(emp => {
      console.log(`   ${emp.empId || emp.email}:`);
      console.log(`     - Start Date: ${emp.startDate ? new Date(emp.startDate).toLocaleDateString() : 'N/A'}`);
      console.log(`     - Created At: ${emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'}`);
      console.log(`     - Experience: ${emp.experience || 'N/A'}`);
      console.log(`     - Experience Years: ${emp.experienceYears || 'N/A'}`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Try to close connection
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing connection:', closeError.message);
    }
    
    process.exit(1);
  }
};

// Run migration
migrateEmployees();