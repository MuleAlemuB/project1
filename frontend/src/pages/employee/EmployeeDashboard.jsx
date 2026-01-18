// src/pages/employee/EmployeeDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { 
  FaUser, 
  FaBell, 
  FaSignOutAlt, 
  FaSun, 
  FaMoon,
  FaCalendarAlt,
  FaTasks,
  FaFileAlt
} from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import logo from "../../assets/logo.jpg";
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
      {/* Sidebar */}
     

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
                {getGreeting()}, {stats?.firstName || "Employee"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pl-10 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="am">AM</option>
                </select>
                <MdLanguage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FaSun className="text-yellow-500" />
                ) : (
                  <FaMoon className="text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">
                  {language === "am" ? "ውጣ" : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${stats?.firstName} ${stats?.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {stats?.firstName?.charAt(0) || "E"}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.firstName} {stats?.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {stats?.position || "Employee"}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "am" ? "ክፍል" : "Department"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stats?.department || "-"}
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "am" ? "ሰርተፍኬት" : "Employee ID"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stats?.empId || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 min-w-[200px]">
              <h3 className="font-semibold mb-4">
                {language === "am" ? "የመለያ አስፈጻሚነት" : "Profile Status"}
              </h3>
              <div className="mb-2 flex justify-between">
                <span>{stats?.profileCompleted || 0}%</span>
                <span className="text-blue-200">
                  {language === "am" ? "ተሞልቷል" : "Complete"}
                </span>
              </div>
              <div className="w-full bg-blue-900 bg-opacity-50 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.profileCompleted || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Completion Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaUser className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "am" ? "መለያ አስፈጻሚነት" : "Profile Completion"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "የእርስዎን መረጃ ያሟሉ" : "Complete your profile"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {stats?.profileCompleted || 0}%
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {language === "am" ? "በመሙላት ላይ" : "In Progress"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.profileCompleted || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaBell className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "am" ? "ማስታወቂያዎች" : "Notifications"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ያልተነበቡ ማስታወቂያዎች" : "Unread notifications"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.notifications?.length || 0}
              </p>
              {stats?.notifications?.slice(0, 2).map((notification, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm truncate">
                    {notification.title || "New Notification"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaTasks className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "am" ? "የቅርብ ተግባራት" : "Upcoming Tasks"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ለዚህ ሳምንት" : "Due this week"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.pendingTasks || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "am" ? "ተግባራት በመጠባበቅ ላይ" : "Tasks pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === "am" ? "የቅርብ እንቅስቃሴ" : "Recent Activity"}
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {language === "am" ? "ሁሉንም ይመልከቱ" : "View All"}
            </button>
          </div>
          
          <div className="space-y-4">
            {stats?.recentActivities?.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <FaFileAlt className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                {language === "am" ? "ምንም እንቅስቃሴ የለም" : "No recent activity"}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;