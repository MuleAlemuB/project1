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
  FaEnvelopeOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine,
  FaSync
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useSettings } from "../../contexts/SettingsContext";
import { motion } from "framer-motion";

const translations = {
  en: {
    welcome: "Welcome",
    totalEmployees: "Total Employees",
    pendingLeaves: "Pending Leaves",
    notifications: "Notifications",
    logout: "Logout",
    department: "Department",
    viewAll: "View All",
    actionRequired: "Action Required",
    allClear: "All Clear",
    newAlerts: "New Alerts",
    noAlerts: "No Alerts",
    active: "Active",
    inDept: "in Department",
    awaiting: "Awaiting",
    yourApproval: "Your Approval",
    unread: "Unread",
    messages: "Messages",
    manageEmployees: "Manage Employees",
    leaveRequests: "Leave Requests",
    quickAccess: "Quick Access",
    dashboard: "Dashboard",
    loading: "Loading dashboard...",
    errorLoading: "Error loading dashboard data",
    tryAgain: "Try Again",
    statsOverview: "Statistics Overview",
    recentActivity: "Recent Activity",
    viewDetails: "View Details",
    noPendingLeaves: "No pending leaves",
    noNotifications: "No new notifications",
    refresh: "Refresh",
    today: "Today"
  },
  am: {
    welcome: "እንኳን በደህና መጡ",
    totalEmployees: "ጠቅላላ ሰራተኞች",
    pendingLeaves: "የቆዩ ፈቃዶች",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    department: "ክፍል",
    viewAll: "ሁሉንም አሳይ",
    actionRequired: "ድርጊት ያስፈልጋል",
    allClear: "ሁሉም ጥሩ ነው",
    newAlerts: "አዲስ ማንቂያዎች",
    noAlerts: "ማንቂያ የለም",
    active: "ንቁ",
    inDept: "በክፍሉ ውስጥ",
    awaiting: "በጥበቃ ላይ",
    yourApproval: "የእርስዎ ማጽደቅ",
    unread: "ያልተነበበ",
    messages: "መልዕክቶች",
    manageEmployees: "ሰራተኞችን አስተዳድር",
    leaveRequests: "የእረፍት ጥያቄዎች",
    quickAccess: "ፈጣን መዳረሻ",
    dashboard: "ዳሽቦርድ",
    loading: "ዳሽቦርድ በመጫን ላይ...",
    errorLoading: "ዳሽቦርድ መረጃ መጫን አልተሳካም",
    tryAgain: "እንደገና ይሞክሩ",
    statsOverview: "ስታቲስቲክስ አጠቃላይ እይታ",
    recentActivity: "የቅርብ ምርቃት",
    viewDetails: "ዝርዝር አሳይ",
    noPendingLeaves: "ምንም የቆየ ፈቃድ የለም",
    noNotifications: "ምንም አዲስ ማሳወቂያ የለም",
    refresh: "አድስ",
    today: "ዛሬ"
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
    department: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!authUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching dashboard data...");
      
      // CORRECT ENDPOINTS:
      // 1. Get department head profile
      const profileRes = await axiosInstance.get("/depthead/profile");
      console.log("Profile response:", profileRes.data);
      setDeptHead(profileRes.data);
      
      // 2. Get statistics using the CORRECT endpoint
      const statsRes = await axiosInstance.get("/depthead/stats");
      console.log("Stats response:", statsRes.data);
      setStats(statsRes.data);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      console.error("Error details:", err.response?.data || err.message);
      
      setError(t.errorLoading);
      
      // Set fallback data
      setStats({
        totalEmployees: 0,
        pendingLeaves: 0,
        notifications: 0,
        department: deptHead?.department?.name || "N/A"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authUser, language]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !deptHead) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
            {t.loading}
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {language === "en" ? "Fetching your dashboard data..." : "የዳሽቦርድ መረጃዎች በማግኘት ላይ..."}
          </p>
        </div>
      </div>
    );
  }

  const displayName = `${deptHead?.firstName || ''} ${deptHead?.lastName || ''}`.trim() || "Department Head";
  const deptName = deptHead?.department?.name || deptHead?.department || stats.department || "N/A";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="DTU Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  DTU HRMS
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === "en" ? "Department Head Portal" : "የክፍል አለቃ ፖርታል"}
                </p>
              </div>
            </div>

            {/* User Info and Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className={`text-center sm:text-right px-4 py-2 rounded-lg w-full sm:w-auto ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/50 backdrop-blur-sm'
              }`}>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-end gap-1">
                  <FaBuilding className="text-xs" /> <span className="truncate">{deptName}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === "en" ? "am" : "en")}
                  className={`p-2 sm:p-3 rounded-xl transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-white hover:bg-gray-100 text-gray-600 shadow-md"
                  }`}
                  title={language === "en" ? "Switch Language" : "ቋንቋ ቀይር"}
                >
                  <FaGlobe className="text-sm sm:text-lg" />
                </button>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 sm:p-3 rounded-xl transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-100 shadow-md"
                  }`}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? 
                    <FaSun className="text-sm sm:text-lg text-yellow-400" /> : 
                    <FaMoon className="text-sm sm:text-lg text-gray-600" />
                  }
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <FaSignOutAlt /> {t.logout}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Section */}
        <div className={`mb-6 sm:mb-8 rounded-2xl p-4 sm:p-6 ${
          darkMode 
            ? "bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border border-gray-700" 
            : "bg-gradient-to-r from-white to-blue-50 border border-blue-100 shadow-xl"
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {t.welcome}, <span className="text-blue-500 dark:text-blue-400">{displayName}</span>
              </h1>
              <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                {t.department}: <span className="font-semibold">{deptName}</span>
              </p>
              {lastUpdated && (
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {language === "en" ? "Last updated: " : "መጨረሻ ዝማኔ: "} 
                  {formatDate(lastUpdated)}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg text-sm sm:text-base">
                <FaBuilding className="mr-2 sm:mr-3" />
                {language === "en" ? "Department Head" : "የክፍል አለቃ"}
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <FaSync /> {t.tryAgain}
                </button>
                <button
                  onClick={() => navigate("/departmenthead/employees")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8">
          {/* Total Employees Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate("/departmenthead/employees")}
            className={`rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500"
                : "bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-xl ${
                darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaUsers className={`text-2xl sm:text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                {t.viewAll}
              </span>
            </div>
            
            <div>
              <p className={`text-base sm:text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.totalEmployees}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalEmployees}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-xs sm:text-sm">{t.active}</p>
                  <p className="text-xs">{t.inDept}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pending Leaves Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => navigate("/departmenthead/leaverequests")}
            className={`rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500"
                : "bg-gradient-to-br from-white to-green-50 border border-green-100 hover:border-green-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-xl ${
                darkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <FaCalendarCheck className={`text-2xl sm:text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${
                stats.pendingLeaves > 0 
                  ? darkMode 
                    ? 'bg-red-900/30 text-red-300' 
                    : 'bg-red-100 text-red-600'
                  : darkMode 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-green-100 text-green-600'
              }`}>
                {stats.pendingLeaves > 0 ? t.actionRequired : t.allClear}
              </span>
            </div>
            
            <div>
              <p className={`text-base sm:text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.pendingLeaves}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stats.pendingLeaves > 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.pendingLeaves}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-xs sm:text-sm">{t.awaiting}</p>
                  <p className="text-xs">{t.yourApproval}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => navigate("/departmenthead/notifications")}
            className={`rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-yellow-500"
                : "bg-gradient-to-br from-white to-yellow-50 border border-yellow-100 hover:border-yellow-300 shadow-xl"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className={`p-3 sm:p-4 rounded-xl ${
                darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
              }`}>
                <FaBell className={`text-2xl sm:text-3xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${
                stats.notifications > 0 
                  ? 'animate-pulse ' + (darkMode 
                    ? 'bg-yellow-900/30 text-yellow-300' 
                    : 'bg-yellow-100 text-yellow-600')
                  : darkMode 
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.notifications > 0 ? t.newAlerts : t.noAlerts}
              </span>
            </div>
            
            <div>
              <p className={`text-base sm:text-lg mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.notifications}
              </p>
              <div className="flex items-end justify-between">
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stats.notifications > 0 ? 'text-yellow-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.notifications}
                </p>
                <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-xs sm:text-sm">{t.unread}</p>
                  <p className="text-xs">{t.messages}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Buttons */}
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-xl sm:text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.quickAccess}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/departmenthead/employees")}
              className={`flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-blue-900/30 to-blue-800/30 hover:from-blue-900/50 hover:to-blue-800/50 text-white border border-blue-700"
                  : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200"
              }`}
            >
              <FaUserTie className="text-xl sm:text-2xl" />
              <span className="font-semibold text-base sm:text-lg">
                {t.manageEmployees}
              </span>
            </button>

            <button
              onClick={() => navigate("/departmenthead/leaverequests")}
              className={`flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-green-900/30 to-green-800/30 hover:from-green-900/50 hover:to-green-800/50 text-white border border-green-700"
                  : "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border border-green-200"
              }`}
            >
              <FaCalendarCheck className="text-xl sm:text-2xl" />
              <span className="font-semibold text-base sm:text-lg">
                {t.leaveRequests}
              </span>
            </button>

            <button
              onClick={() => navigate("/departmenthead/notifications")}
              className={`flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-900/50 hover:to-yellow-800/50 text-white border border-yellow-700"
                  : "bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-700 border border-yellow-200"
              }`}
            >
              <FaEnvelopeOpen className="text-xl sm:text-2xl" />
              <span className="font-semibold text-base sm:text-lg">
                {t.notifications}
              </span>
            </button>
          </div>
          
          {/* Refresh Button */}
          <div className="text-center mt-8">
            <button
              onClick={fetchDashboardData}
              className={`flex items-center gap-2 mx-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <FaChartLine /> {t.refresh} {t.dashboard}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeptHeadDashboard;