import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaUsers,
  FaCalendarCheck,
  FaBell,
  FaSignOutAlt,
  FaBuilding,
  FaMoon,
  FaSun,
  FaGlobe,
  FaUserTie,
  FaEnvelopeOpen
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    welcome: "Welcome",
    totalEmployees: "Total Employees",
    pendingLeaves: "Pending Leaves",
    notifications: "Notifications",
    logout: "Logout",
    department: "Department"
  },
  am: {
    welcome: "እንኳን በደህና መጡ",
    totalEmployees: "ጠቅላላ ሰራተኞች",
    pendingLeaves: "የቆዩ ፈቃዶች",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    department: "ክፍል"
  },
};

const DeptHeadDashboard = () => {
  const { user: authUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const [deptHead, setDeptHead] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    if (!authUser) return;

    const fetchDeptHeadData = async () => {
      try {
        const profileRes = await axiosInstance.get("/depthead/profile");
        const profile = profileRes.data;
        setDeptHead(profile);

        const deptName = profile.department?.name || profile.department;

        const empRes = await axiosInstance.get(
          `/employees/department?department=${encodeURIComponent(deptName)}`
        );
        const employees = Array.isArray(empRes.data) ? empRes.data : [];

        const leaveRes = await axiosInstance.get("/leave/requests");
        const pendingLeaves = Array.isArray(leaveRes.data) ? leaveRes.data : [];

        const notiRes = await axiosInstance.get("/notifications/my");
        const notifications = Array.isArray(notiRes.data) ? notiRes.data : [];

        setStats({
          totalEmployees: employees.length,
          pendingLeaves: pendingLeaves.length,
          notifications: notifications.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeptHeadData();
  }, [authUser, language]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!deptHead || loading)
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === "en" ? "Loading dashboard..." : "ዳሽቦርድ በመጫን ላይ..."}
          </p>
        </div>
      </div>
    );

  const displayName = `${deptHead.firstName} ${deptHead.lastName}`;
  const deptName = deptHead.department?.name || deptHead.department || "N/A";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="DTU Logo"
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DTU HRMS
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Department Head Portal
                </p>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <div className={`text-right hidden md:block px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/50 backdrop-blur-sm'
              }`}>
                <p className="font-medium text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                  <FaBuilding className="text-xs" /> {deptName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === "en" ? "am" : "en")}
                  className={`p-3 rounded-xl transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-white hover:bg-gray-100 text-gray-600 shadow-md"
                  }`}
                  title={language === "en" ? "Switch Language" : "ቋንቋ ቀይር"}
                >
                  <FaGlobe className="text-lg" />
                </button>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-xl transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-100 shadow-md"
                  }`}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? 
                    <FaSun className="text-lg text-yellow-400" /> : 
                    <FaMoon className="text-lg text-gray-600" />
                  }
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  <FaSignOutAlt /> {t.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className={`mb-12 rounded-2xl p-8 ${
          darkMode 
            ? "bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border border-gray-700" 
            : "bg-gradient-to-r from-white to-blue-50 border border-blue-100 shadow-xl"
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {t.welcome}, <span className="text-blue-500 dark:text-blue-400">{displayName}</span>
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.department}: <span className="font-semibold">{deptName}</span>
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg">
                <FaBuilding className="mr-3" />
                Department Head
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Only 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Total Employees Card */}
          <div 
            onClick={() => navigate("/departmenthead/employees")}
            className={`rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500"
                : "bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaUsers className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                View All
              </span>
            </div>
            
            <div>
              <p className={`text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.totalEmployees}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalEmployees}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm">Active</p>
                  <p className="text-xs">in {deptName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Leaves Card */}
          <div 
            onClick={() => navigate("/departmenthead/leaverequests")}
            className={`rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500"
                : "bg-gradient-to-br from-white to-green-50 border border-green-100 hover:border-green-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <FaCalendarCheck className={`text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                stats.pendingLeaves > 0 
                  ? darkMode 
                    ? 'bg-red-900/30 text-red-300' 
                    : 'bg-red-100 text-red-600'
                  : darkMode 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-green-100 text-green-600'
              }`}>
                {stats.pendingLeaves > 0 ? "Action Required" : "All Clear"}
              </span>
            </div>
            
            <div>
              <p className={`text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.pendingLeaves}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-5xl font-bold ${stats.pendingLeaves > 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.pendingLeaves}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm">Awaiting</p>
                  <p className="text-xs">Your Approval</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div 
            onClick={() => navigate("/departmenthead/notifications")}
            className={`rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-yellow-500"
                : "bg-gradient-to-br from-white to-yellow-50 border border-yellow-100 hover:border-yellow-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${
                darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                <FaBell className={`text-3xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full animate-pulse ${
                stats.notifications > 0 
                  ? darkMode 
                    ? 'bg-yellow-900/30 text-yellow-300' 
                    : 'bg-yellow-100 text-yellow-600'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.notifications > 0 ? "New Alerts" : "No Alerts"}
              </span>
            </div>
            
            <div>
              <p className={`text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.notifications}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-5xl font-bold ${stats.notifications > 0 ? 'text-yellow-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.notifications}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm">Unread</p>
                  <p className="text-xs">Messages</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className={`text-2xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/departmenthead/employees")}
              className={`flex items-center justify-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-blue-900/30 to-blue-800/30 hover:from-blue-900/50 hover:to-blue-800/50 text-white border border-blue-700"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200"
              }`}
            >
              <FaUserTie className="text-2xl" />
              <span className="font-semibold text-lg">
                {language === "en" ? "Manage Employees" : "ሰራተኞችን አስተዳድር"}
              </span>
            </button>

            <button
              onClick={() => navigate("/departmenthead/leaverequests")}
              className={`flex items-center justify-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-green-900/30 to-green-800/30 hover:from-green-900/50 hover:to-green-800/50 text-white border border-green-700"
                  : "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border border-green-200"
              }`}
            >
              <FaCalendarCheck className="text-2xl" />
              <span className="font-semibold text-lg">
                {language === "en" ? "Leave Requests" : "የእረፍት ጥያቄዎች"}
              </span>
            </button>

            <button
              onClick={() => navigate("/departmenthead/notifications")}
              className={`flex items-center justify-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-900/50 hover:to-yellow-800/50 text-white border border-yellow-700"
                  : "bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-700 border border-yellow-200"
              }`}
            >
              <FaEnvelopeOpen className="text-2xl" />
              <span className="font-semibold text-lg">
                {language === "en" ? "Notifications" : "ማሳወቂያዎች"}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeptHeadDashboard;