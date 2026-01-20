// src/pages/employee/EmployeeDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { 
  FaUser, 
  FaBell, 
  FaSignOutAlt, 
  FaSun, 
  FaMoon,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeDashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/employees/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === "am") {
      if (hour < 12) return "እንኳን ደህና መጡ";
      if (hour < 18) return "እንኳን በህዳሴ መጡ";
      return "እንኳን ከፍ ብለው መጡ";
    }
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {language === "am" ? "ዳሽቦርድ በመጫን ላይ..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const photoUrl = stats?.photo ? `${BACKEND_URL}${stats.photo}` : null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "am" ? "ዳሽቦርድ" : "Dashboard"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {getGreeting()}, <span className="font-medium text-blue-600 dark:text-blue-400">{stats?.firstName || "Employee"}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pl-10 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm"
                >
                  <option value="en">EN</option>
                  <option value="am">AM</option>
                </select>
                <MdLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FaSun className="text-yellow-500 text-sm" />
                ) : (
                  <FaMoon className="text-gray-700 dark:text-gray-300 text-sm" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">
                  {language === "am" ? "ውጣ" : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Profile Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${stats?.firstName} ${stats?.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {stats?.firstName?.charAt(0) || "E"}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats?.firstName} {stats?.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stats?.position || "Employee"}
                  </p>
                </div>
                
                {/* Profile Completion Status */}
                <div className="flex items-center gap-3">
                  <div className="w-32">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        {language === "am" ? "ሙሉነት" : "Completion"}
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {stats?.profileCompleted || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats?.profileCompleted || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  {stats?.profileCompleted === 100 ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaExclamationCircle className="text-yellow-500" />
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === "am" ? "ሰርተፍኬት" : "Employee ID"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stats?.empId || "-"}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === "am" ? "ክፍል" : "Department"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stats?.department || "-"}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === "am" ? "የተመዘገቡበት ቀን" : "Join Date"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stats?.joinDate || "-"}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {language === "am" ? "ሁኔታ" : "Status"}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {language === "am" ? "ንቁ" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Completion Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {language === "am" ? "መለያ አስፈጻሚነት" : "Profile Status"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "የመረጃ ሙሉነት ደረጃ" : "Information completion level"}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaUser className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(stats?.profileCompleted || 0) * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.profileCompleted || 0}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {language === "am" ? "ተሞልቷል" : "Complete"}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/employee/profile")}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {language === "am" ? "መለያ ያስገቡ" : "Update Profile"}
              </button>
            </div>
          </div>

          {/* Notifications & Leave Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {language === "am" ? "ማስታወቂያዎች" : "Notifications & Status"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "የቅርብ ማስታወቂያዎች እና ሁኔታ" : "Recent notifications and status"}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaBell className="text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Notifications Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {language === "am" ? "ማስታወቂያዎች" : "Notifications"}
                  </h4>
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {stats?.notifications?.length || 0} {language === "am" ? "አዲስ" : "New"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {stats?.notifications?.slice(0, 3).map((notification, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title || "New Notification"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {notification.description || "Check for details"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {notification.time || "Just now"}
                      </span>
                    </div>
                  ))}
                  
                  {(!stats?.notifications || stats.notifications.length === 0) && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                      {language === "am" ? "ምንም ማስታወቂያ የለም" : "No notifications"}
                    </p>
                  )}
                </div>
              </div>

              {/* Leave Status Section */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-sm" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {language === "am" ? "የእረፍት ሁኔታ" : "Leave Status"}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "am" ? "የተቀሩ ቀናት" : "Days Remaining"}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {stats?.leaveBalance || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/employee/leave")}
                    className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {language === "am" ? "ያመልክቱ" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;