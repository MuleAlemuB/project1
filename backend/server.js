import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import deptHeadRoutes from './routes/deptHeadRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import employeeLeaveRoutes from './routes/employeeLeaveRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import departmentRoutes from "./routes/departmentRoutes.js";
import vacancyRoutes from "./routes/vacancyRoute.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminNotificationRoute from './routes/adminNotificationRoute.js';
import requisitionRoutes from "./routes/requisitionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin))
        return callback(new Error('Not allowed by CORS'), false);
      return callback(null, true);
    },
    credentials: true,
  })
);

// Static folder for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/depthead', deptHeadRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/admin/vacancies', vacancyRoutes); // Admin only
app.use('/api/vacancies', vacancyRoutes);       // Public
app.use("/api/applications", applicationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);
app.use("/api/admin/notifications", adminNotificationRoute);
app.use("/api/requisitions", requisitionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use('/api/employee-leave', employeeLeaveRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Debretabor University Employee Management System API');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
