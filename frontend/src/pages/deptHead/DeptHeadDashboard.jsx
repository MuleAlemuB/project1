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
    today: "Today",
    markAllRead: "Mark All as Read",
    viewNotifications: "View Notifications"
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
    noNotifications: "ምንም አዲስ �ማሳወቂያ የለም",
    refresh: "አድስ",
    today: "ዛሬ",
    markAllRead: "ሁሉንም እንደተነበቡ ምልክት አድርግ",
    viewNotifications: "ማሳወቂያዎችን እይ"
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
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!authUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching dashboard data...");
      
      // 1. Get department head profile
      const profileRes = await axiosInstance.get("/depthead/profile");
      console.log("Profile response:", profileRes.data);
      setDeptHead(profileRes.data);
      
      // 2. Get statistics
      const statsRes = await axiosInstance.get("/depthead/stats");
      console.log("Stats response:", statsRes.data);
      
      // Count only unread notifications
      const unreadCount = await countUnreadNotifications();
      
      setStats({
        ...statsRes.data,
        notifications: unreadCount // Use unread count instead of total
      });
      
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

  // Function to count unread notifications
  const countUnreadNotifications = async () => {
    try {
      const response = await axiosInstance.get("/depthead/notifications");
      const notifications = response.data;
      
      // Count notifications where seen is false
      const unreadCount = notifications.filter(notification => !notification.seen).length;
      console.log(`Found ${unreadCount} unread notifications out of ${notifications.length} total`);
      
      return unreadCount;
    } catch (err) {
      console.error("Error counting unread notifications:", err);
      return 0;
    }
  };

  const fetchNotifications = async () => {
    if (!authUser) return;
    
    setNotificationsLoading(true);
    try {
      const res = await axiosInstance.get("/depthead/notifications");
      setNotificationsList(res.data);
      
      // Update stats with unread count
      const unreadCount = res.data.filter(notification => !notification.seen).length;
      setStats(prev => ({
        ...prev,
        notifications: unreadCount
      }));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read individually or use a bulk endpoint
      await Promise.all(
        notificationsList
          .filter(notification => !notification.seen)
          .map(notification => 
            axiosInstance.put(`/depthead/notifications/${notification._id}/read`)
          )
      );
      
      // Update local state
      const updatedNotifications = notificationsList.map(notification => ({
        ...notification,
        seen: true
      }));
      setNotificationsList(updatedNotifications);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        notifications: 0
      }));
      
      showNotificationMessage("All notifications marked as read", "success");
    } catch (err) {
      console.error("Error marking all as read:", err);
      showNotificationMessage("Failed to mark notifications as read", "error");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.put(`/depthead/notifications/${notificationId}/read`);
      
      // Update local state
      const updatedNotifications = notificationsList.map(notification => 
        notification._id === notificationId 
          ? { ...notification, seen: true }
          : notification
      );
      setNotificationsList(updatedNotifications);
      
      // Update stats
      const unreadCount = updatedNotifications.filter(notification => !notification.seen).length;
      setStats(prev => ({
        ...prev,
        notifications: unreadCount
      }));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const toggleNotificationDropdown = async () => {
    if (!showNotificationDropdown) {
      await fetchNotifications();
    }
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  // Helper function to show notification messages
  const showNotificationMessage = (message, type = "success") => {
    // You could implement a toast notification system here
    console.log(`${type}: ${message}`);
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

  const formatTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return language === "en" ? "Just now" : "አሁን";
    if (diffMins < 60) return `${diffMins} ${language === "en" ? "min" : "ደቂቃ"}`;
    if (diffHours < 24) return `${diffHours} ${language === "en" ? "hr" : "ሰአት"}`;
    return `${diffDays} ${language === "en" ? "day" : "ቀን"}`;
  };

  // Get unread notifications count
  const unreadNotificationsCount = notificationsList.filter(notification => !notification.seen).length;

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
                {/* Notifications Bell with Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleNotificationDropdown}
                    className={`p-2 sm:p-3 rounded-xl transition-all relative ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-white hover:bg-gray-100 text-gray-600 shadow-md"
                    }`}
                    title={t.notifications}
                  >
                    <FaBell className="text-sm sm:text-lg" />
                    {stats.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {stats.notifications > 9 ? "9+" : stats.notifications}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotificationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl border ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">
                            {t.notifications} 
                            <span className="ml-2 text-sm font-normal">
                              ({unreadNotificationsCount} {t.unread.toLowerCase()})
                            </span>
                          </h3>
                          {unreadNotificationsCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                            >
                              {t.markAllRead}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {language === "en" ? "Loading notifications..." : "ማሳወቂያዎች በመጫን ላይ..."}
                            </p>
                          </div>
                        ) : notificationsList.length > 0 ? (
                          <>
                            {/* Unread notifications first */}
                            {notificationsList.filter(n => !n.seen).length > 0 && (
                              <div className="px-4 pt-3 pb-2">
                                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                  {language === "en" ? "New" : "አዲስ"}
                                </h4>
                              </div>
                            )}
                            
                            {notificationsList
                              .filter(notification => !notification.seen)
                              .map((notification) => (
                                <div
                                  key={notification._id}
                                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors bg-blue-50 dark:bg-blue-900/20"
                                  onClick={() => {
                                    markAsRead(notification._id);
                                  }}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className={`font-medium ${
                                        darkMode ? "text-gray-200" : "text-gray-800"
                                      }`}>
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatTimeAgo(notification.createdAt)}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notification._id);
                                        }}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                      >
                                        {language === "en" ? "Mark as read" : "እንደተነበበ ምልክት አድርግ"}
                                      </button>
                                    </div>
                                  </div>
                                  {notification.type && (
                                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                      notification.type === "Leave"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                        : notification.type === "Requisition"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    }`}>
                                      {notification.type}
                                    </span>
                                  )}
                                </div>
                              ))
                            }
                            
                            {/* Read notifications */}
                            {notificationsList.filter(n => n.seen).length > 0 && (
                              <>
                                <div className="px-4 pt-3 pb-2">
                                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {language === "en" ? "Earlier" : "ቀደም ሲል"}
                                  </h4>
                                </div>
                                
                                {notificationsList
                                  .filter(notification => notification.seen)
                                  .slice(0, 3) // Show only 3 read notifications
                                  .map((notification) => (
                                    <div
                                      key={notification._id}
                                      className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                      onClick={() => navigate("/departmenthead/notifications")}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className={`font-medium ${
                                            darkMode ? "text-gray-300" : "text-gray-700"
                                          }`}>
                                            {notification.message}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {formatTimeAgo(notification.createdAt)}
                                          </p>
                                        </div>
                                      </div>
                                      {notification.type && (
                                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                          notification.type === "Leave"
                                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                            : notification.type === "Requisition"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}>
                                          {notification.type}
                                        </span>
                                      )}
                                    </div>
                                  ))
                                }
                              </>
                            )}
                          </>
                        ) : (
                          <div className="p-8 text-center">
                            <FaBell className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                              {t.noNotifications}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setShowNotificationDropdown(false);
                            navigate("/departmenthead/notifications");
                          }}
                          className="w-full py-2 text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          {t.viewNotifications} →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

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

      {/* Close dropdown when clicking outside */}
      {showNotificationDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotificationDropdown(false)}
        />
      )}

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

          {/* Notifications Card - Updated to show only unread count */}
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
                {t.notifications} <span className="text-xs">({t.unread})</span>
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