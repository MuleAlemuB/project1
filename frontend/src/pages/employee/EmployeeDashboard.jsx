// src/pages/employee/EmployeeDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import logo from "../../assets/logo.jpg";
import { AuthContext } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeDashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/employees/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!stats)
    return (
      <p className="p-6 text-center text-xl text-blue-700 dark:text-blue-300">
        {language === "am" ? "ዳሽቦርድ በመጫን ላይ..." : "Loading dashboard..."}
      </p>
    );

  const photoUrl = stats.photo ? `${BACKEND_URL}${stats.photo}` : null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 overflow-auto">
        {/* Top Branding */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-gray-800 dark:to-gray-700 text-white rounded-2xl shadow-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="DTU Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide">
                {language === "am" ? "የዲቲዩ ሰራተኞች መረጃ" : "DTU HRMS"}
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                {language === "am" ? "የሰራተኞች ዳሽቦርድ" : "Employee Dashboard"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition shadow"
            >
              {darkMode ? (language === "am" ? "መብራት" : "Light") : language === "am" ? "ጨለማ" : "Dark"}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition shadow"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition shadow"
            >
              <FaSignOutAlt /> {language === "am" ? "ውጣ" : "Logout"}
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="flex items-center gap-5 mb-10">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Employee"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-300 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-3xl shadow-inner">
              {stats.firstName?.charAt(0) || "E"}
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-blue-900 dark:text-white">
              {language === "am" ? "እንኳን ደህና መጣህ" : "Welcome"}, {stats.firstName} {stats.lastName} 👋
            </h2>
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              {language === "am" ? "ክፍል: " : "Department: "}
              <span className="text-blue-900 dark:text-white">{stats.department || "-"}</span>
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Completion Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <FaUser className="text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">{language === "am" ? "መለያ አስፈጻሚነት" : "Profile Completion"}</h2>
                <p className="text-sm">{stats.profileCompleted}% {language === "am" ? "ተሞልቷል" : "Completed"}</p>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.profileCompleted}%` }}
              ></div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <FaBell className="text-4xl" />
              <div>
                <h2 className="text-lg font-semibold">{language === "am" ? "ማስታወቂያዎች" : "Notifications"}</h2>
                <p className="text-sm">{stats.notifications?.length || 0} {language === "am" ? "አዳዲስ ማስታወቂያዎች" : "New notifications"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {stats.notifications?.slice(0, 3).map((n, i) => (
                <span
                  key={i}
                  className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs animate-pulse"
                >
                  {n.title || "Notification"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
