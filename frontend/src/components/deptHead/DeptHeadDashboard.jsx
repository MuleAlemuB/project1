import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DeptHeadSidebar from "./DeptHeadSidebar";
import Employees from "./Employees";
import Attendance from "./Attendance";
import LeaveRequests from "./LeaveRequests";
import ProfilePage from "./ProfilePage";
import axiosInstance from "../../utils/axiosInstance";
import { FaUsers, FaCalendarCheck, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const DeptHeadDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [selected, setSelected] = useState("employees");
  const [deptName, setDeptName] = useState("");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    notifications: 0,
  });

  // ----------------- Fetch department name -----------------
  useEffect(() => {
    if (!user || !user.department) return;

    const fetchDeptName = async () => {
      try {
        const res = await axiosInstance.get(`/departments/${user.department}`);
        setDeptName(res.data.name || "Your Department");
      } catch (err) {
        console.error("Error fetching department name:", err);
        setDeptName("Your Department");
      }
    };

    fetchDeptName();
  }, [user]);

  // ----------------- Fetch stats -----------------
  useEffect(() => {
    if (!user || !user.department) return;

    const fetchStats = async () => {
      try {
        // Total Employees including Dept Head
        const empRes = await axiosInstance.get(
          `/employees/department?department=${user.department}`
        );
        const totalEmployees = empRes.data.length;

        // Pending Leaves
        const leaveRes = await axiosInstance.get(
          `/leave/requests?department=${user.department}&status=pending`
        );
        const pendingLeaves = leaveRes.data.length;

        // Notifications
        const notiRes = await axiosInstance.get(
          `/notifications/department/${user.department}`
        );
        const notifications = notiRes.data.length;

        setStats({ totalEmployees, pendingLeaves, notifications });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
  }, [user]);

  if (authLoading) return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <DeptHeadSidebar selected={selected} setSelected={setSelected} />

      <main className="flex-grow p-6 bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-all">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-300 drop-shadow-md">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-lg mt-3 opacity-90 text-gray-700 dark:text-gray-300">
            Department Head —{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {deptName}
            </span>
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Total Employees */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 border-l-8 border-white hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-md">
              <FaUsers className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Total Employees</h2>
              <motion.p
                className="text-3xl font-bold text-white mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {stats.totalEmployees}
              </motion.p>
            </div>
          </motion.div>

          {/* Pending Leaves */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 border-l-8 border-white hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-md">
              <FaCalendarCheck className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Pending Leaves</h2>
              <motion.p
                className="text-3xl font-bold text-white mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {stats.pendingLeaves}
              </motion.p>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-700 dark:to-yellow-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 border-l-8 border-white hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-md">
              <FaBell className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Notifications</h2>
              <motion.p
                className="text-3xl font-bold text-white mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {stats.notifications}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Nested Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="employees" replace />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default DeptHeadDashboard;
