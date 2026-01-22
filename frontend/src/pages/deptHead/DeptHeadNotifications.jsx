import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaTrash,
  FaCheck,
  FaInfoCircle,
  FaBell,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaBriefcase,
  FaFileSignature,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaDownload,
  FaClock,
  FaUsers,
  FaUserTie,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const translations = {
  en: {
    title: "Department Head Notifications",
    loading: "Loading notifications...",
    notAuthorized: "Not authorized - Department Head access only",
    noNotifications: "No notifications yet",
    markSeen: "Mark as Read",
    delete: "Delete",
    viewDetails: "View Details",
    closeDetails: "Close Details",
    type: "Type",
    employee: "Employee",
    email: "Email",
    department: "Department",
    from: "From",
    to: "To",
    reason: "Reason",
    status: "Status",
    phone: "Phone",
    unread: "Unread",
    all: "All",
    markAllRead: "Mark All as Read",
    deleteAll: "Delete All Read",
    notificationCount: "Notifications",
    newNotifications: "New notifications",
    leaveRequest: "Leave Request",
    employeeUpdate: "Employee Update",
    general: "General",
    urgent: "Urgent",
    markAllReadConfirm: "Mark all notifications as read?",
    deleteAllConfirm: "Delete all read notifications?",
    createdAt: "Date",
    timeAgo: "ago",
    justNow: "Just now",
    minutes: "min",
    hours: "hr",
    days: "day",
    filterBy: "Filter by",
    noUnread: "No unread notifications",
    allCaughtUp: "All caught up!",
    markAll: "Mark All",
    deleteRead: "Delete Read",
    clearAll: "Clear All",
    employeeManagement: "Employee Management",
    leaveManagement: "Leave Management",
    forYourDepartment: "For Your Department",
    actionRequired: "Action Required",
    processed: "Processed",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    viewEmployee: "View Employee",
    processLeave: "Process Leave",
    details: "Details",
    comments: "Comments",
    startDate: "Start Date",
    endDate: "End Date",
    leaveType: "Leave Type",
    emergencyContact: "Emergency Contact",
    contactAddress: "Contact Address",
    position: "Position",
    employeeStatus: "Employee Status",
    maritalStatus: "Marital Status",
    dateOfBirth: "Date of Birth",
    address: "Address",
    updatedFields: "Updated Fields",
    processedBy: "Processed By",
    processedAt: "Processed At",
  },
  am: {
    title: "የክፍል ሃላፊ ማሳወቂያዎች",
    loading: "ማሳወቂያዎች በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም - የክፍል ሃላፊ ብቻ",
    noNotifications: "ምንም ማሳወቂያ የለም",
    markSeen: "እንደተነበበ ምልክት አድርግ",
    delete: "አጥፋ",
    viewDetails: "ዝርዝሮችን አሳይ",
    closeDetails: "ዝርዝሮችን ዝጋ",
    type: "ዓይነት",
    employee: "ሰራተኛ",
    email: "ኢሜይል",
    department: "ክፍል",
    from: "ከ",
    to: "እስከ",
    reason: "ምክንያት",
    status: "ሁኔታ",
    phone: "ስልክ",
    unread: "ያልተነበበ",
    all: "ሁሉም",
    markAllRead: "ሁሉንም እንደተነበበ ምልክት አድርግ",
    deleteAll: "ሁሉንም ያልተነበበ አጥፋ",
    notificationCount: "ማሳወቂያዎች",
    newNotifications: "አዲስ ማሳወቂያዎች",
    leaveRequest: "የፈቃድ ጥያቄ",
    employeeUpdate: "የሰራተኛ አማራጭ",
    general: "አጠቃላይ",
    urgent: "አስቸኳይ",
    markAllReadConfirm: "ሁሉንም ማሳወቂያዎች እንደተነበቡ ምልክት ማድረግ ትፈልጋለህ?",
    deleteAllConfirm: "ሁሉንም ያልተነበቡ ማሳወቂያዎች ማጥፋት ትፈልጋለህ?",
    createdAt: "ቀን",
    timeAgo: "በፊት",
    justNow: "አሁን",
    minutes: "ደቂቃ",
    hours: "ሰዓት",
    days: "ቀን",
    filterBy: "አጣራ",
    noUnread: "ያልተነበቡ ማሳወቂያዎች የሉም",
    allCaughtUp: "ሁሉም ተነትበዋል!",
    markAll: "ሁሉንም ምልክት አድርግ",
    deleteRead: "የተነበቡትን አጥፋ",
    clearAll: "ሁሉንም አጥፋ",
    employeeManagement: "የሰራተኛ አስተዳደር",
    leaveManagement: "የፈቃድ አስተዳደር",
    forYourDepartment: "ለክፍልዎ",
    actionRequired: "ተግባር ያስፈልጋል",
    processed: "ተሰርቷል",
    pending: "በመጠባበቅ ላይ",
    approved: "ተፈቅዷል",
    rejected: "ተቀባይነት አላገኘም",
    viewEmployee: "ሰራተኛ አሳይ",
    processLeave: "ፈቃድ አስተናግድ",
    details: "ዝርዝሮች",
    comments: "አስተያየቶች",
    startDate: "የመጀመሪያ ቀን",
    endDate: "የመጨረሻ ቀን",
    leaveType: "የፈቃድ አይነት",
    emergencyContact: "የአደጋ ማንነት",
    contactAddress: "የመገናኛ አድራሻ",
    position: "ሥራ",
    employeeStatus: "የሰራተኛ ሁኔታ",
    maritalStatus: "የትዳር ሁኔታ",
    dateOfBirth: "የልደት ቀን",
    address: "አድራሻ",
    updatedFields: "የተለወጡ መስኮች",
    processedBy: "በሰራ",
    processedAt: "በሰራበት ቀን",
  },
};

const DeptHeadNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedAll, setExpandedAll] = useState(false);

  const filteredNotifications = activeFilter === "unread" 
    ? notifications.filter(n => !n.seen)
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;
  const readCount = notifications.filter(n => n.seen).length;

  // Fetch notifications for department head
  const fetchNotifications = async () => {
  console.log("=== STARTING NOTIFICATION FETCH ===");
  
  if (!user) {
    console.log("No user found, cannot fetch notifications");
    setNotifications([]);
    setLoading(false);
    return;
  }
  
  // Check if user is department head
  if (user.role.toLowerCase() !== "departmenthead") {
    console.log("User is not department head, role:", user.role);
    setNotifications([]);
    setLoading(false);
    return;
  }
  
  console.log("User details:", {
    id: user._id,
    role: user.role,
    department: user.department,
    departmentName: user.departmentName,
    email: user.email
  });
  
  try {
    console.log("Calling /notifications/my endpoint...");
    const res = await axiosInstance.get("/notifications/my");
    
    console.log("API Response status:", res.status);
    console.log("API Response data count:", res.data?.length);
    
    if (res.data && Array.isArray(res.data)) {
      console.log(`Received ${res.data.length} notifications for this department head`);
      
      // Log sample notifications for debugging
      if (res.data.length > 0) {
        console.log("Sample notification:", JSON.stringify(res.data[0], null, 2));
      }
      
      // REMOVE THE FILTERING - backend already handles it
      // Just set the notifications directly
      setNotifications(res.data);
      setError(null);
    } else {
      console.log("Response data is not an array:", res.data);
      setNotifications([]);
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    
    setError(err.response?.data?.message || "Failed to load notifications");
    setNotifications([]);
  } finally {
    console.log("Setting loading to false");
    setLoading(false);
  }
};

  useEffect(() => {
    console.log("useEffect triggered, authLoading:", authLoading, "user:", user);
    
    if (!authLoading && user) {
      console.log("User loaded, fetching notifications...");
      fetchNotifications();
    } else if (!authLoading && !user) {
      console.log("No user found, stopping loading");
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleMarkSeen = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Error marking as seen:", err);
      alert("Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!window.confirm(t.markAllReadConfirm)) return;
    try {
      await axiosInstance.put("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
      alert("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  };

  const handleDeleteAllRead = async () => {
    if (!window.confirm(t.deleteAllConfirm)) return;
    try {
      await axiosInstance.delete("/notifications/clear-read");
      setNotifications(prev => prev.filter(n => !n.seen));
    } catch (err) {
      console.error("Error deleting all read:", err);
      alert("Failed to delete read notifications");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(language === "en" ? "Delete all notifications?" : "ሁሉንም ማሳወቂያዎች ማጥፋት ትፈልጋለህ?")) return;
    try {
      const deletePromises = notifications.map(n => 
        axiosInstance.delete(`/notifications/${n._id}`)
      );
      await Promise.all(deletePromises);
      setNotifications([]);
    } catch (err) {
      console.error("Error deleting all:", err);
      alert("Failed to delete all notifications");
    }
  };

  const handleToggleExpandAll = () => {
    if (expandedAll) {
      setDetailsOpen({});
    } else {
      const expanded = {};
      filteredNotifications.forEach(notification => {
        expanded[notification._id] = true;
      });
      setDetailsOpen(expanded);
    }
    setExpandedAll(!expandedAll);
  };

  const getTimeAgo = (date) => {
    if (!date) return t.justNow;
    
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins}${t.minutes} ${t.timeAgo}`;
    if (diffHours < 24) return `${diffHours}${t.hours} ${t.timeAgo}`;
    return `${diffDays}${t.days} ${t.timeAgo}`;
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${darkMode ? "border-blue-500 border-t-blue-300" : "border-blue-600 border-t-blue-200"}`}></div>
          <p className={`mt-6 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
          <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading notifications for your department...
          </p>
        </div>
      </div>
    );
  }

  // Check authorization
  if (!user || user.role.toLowerCase() !== "departmenthead") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
        <div className="text-center">
          <FaExclamationTriangle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`} />
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.notAuthorized}</p>
          <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            You need department head privileges to access this page
          </p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
        <div className="text-center max-w-md">
          <FaExclamationTriangle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-red-400" : "text-red-500"}`} />
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Error Loading Notifications
          </h3>
          <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-gray-50 via-white to-gray-50"}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {notifications.length} {t.notificationCount} • {unreadCount} {t.newNotifications}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <FaBuilding className={`${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <span className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                  {t.forYourDepartment}: {user?.departmentName || user?.department || "Your Department"}
                </span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Showing notifications specifically for you as department head
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredNotifications.length > 0 && (
                <button
                  onClick={handleToggleExpandAll}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    expandedAll 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {expandedAll ? <FaEyeSlash /> : <FaEye />}
                  {expandedAll ? t.closeDetails : t.viewDetails}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.all}</p>
                <p className="text-3xl font-bold mt-2">{notifications.length}</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                <FaBell className={`text-xl ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-100 shadow-lg"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{t.unread}</p>
                <p className="text-3xl font-bold mt-2">{unreadCount}</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? "bg-blue-800/40" : "bg-blue-200"}`}>
                <FaExclamationTriangle className={`text-xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${darkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-100 shadow-lg"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-green-300" : "text-green-600"}`}>{t.leaveRequest}</p>
                <p className="text-3xl font-bold mt-2">
                  {notifications.filter(n => n.type === "Leave" || n.type === "Leave Request").length}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? "bg-green-800/40" : "bg-green-200"}`}>
                <FaCalendarAlt className={`text-xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FaFilter className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.filterBy}:</span>
              </div>
              
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-4 py-2 rounded-lg transition-all relative ${
                  activeFilter === "unread"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {t.unread}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <FaCheck />
                  {t.markAll}
                </button>
              )}
              {readCount > 0 && (
                <button
                  onClick={handleDeleteAllRead}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <FaTrash />
                  {t.deleteRead}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <FaTrash />
                  {t.clearAll}
                </button>
              )}
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                <FaCheck />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <FaBell className={`w-10 h-10 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {activeFilter === "unread" ? t.noUnread : t.noNotifications}
            </h3>
            <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {activeFilter === "unread" ? t.allCaughtUp : "No notifications found for your department"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchNotifications}
                className={`px-4 py-2 rounded-lg transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              >
                Refresh Notifications
              </button>
              <a
                href="/depthead/leave-requests"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
              >
                Go to Leave Management
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const isActive = detailsOpen[notification._id];
              const NotificationIcon = getNotificationIcon(notification.type);
              const notificationColor = getNotificationColorClasses(notification.type, darkMode);
              
              return (
                <div
                  key={notification._id}
                  className={`rounded-2xl border transition-all duration-300 ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"} ${!notification.seen ? "border-l-4 border-blue-500 shadow-lg" : ""}`}
                >
                  <div className="p-6">
                    {/* Notification Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${notificationColor.split(' ')[0]}`}>
                          <NotificationIcon className={`w-5 h-5 ${notificationColor.split(' ')[1]}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {getNotificationTypeLabel(notification.type, t)}
                            </span>
                            {!notification.seen && (
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-medium">
                                {t.unread}
                              </span>
                            )}
                            {notification.metadata?.status === "pending" && (
                              <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full font-medium">
                                {t.actionRequired}
                              </span>
                            )}
                            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              <FaClock className="inline mr-1" />
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2`}>
                            {notification.message}
                          </p>
                          {notification.metadata?.department && (
                            <p className={`text-sm mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                              <FaBuilding className="inline mr-1" />
                              {notification.metadata.department}
                            </p>
                          )}
                          {/* Debug info - remove in production */}
                          <p className={`text-xs mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            ID: {notification._id} • Dept: {notification.department || "N/A"} • For: {notification.recipientId ? "Specific User" : "All Dept Heads"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.seen && (
                          <button
                            onClick={() => handleMarkSeen(notification._id)}
                            className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                            title={t.markSeen}
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => setDetailsOpen(prev => ({ ...prev, [notification._id]: !prev[notification._id] }))}
                          className={`p-2 rounded-xl transition-all shadow-md ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              : darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          title={isActive ? t.closeDetails : t.viewDetails}
                        >
                          {isActive ? <FaEyeSlash className="w-4 h-4" /> : <FaInfoCircle className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                          title={t.delete}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Section */}
                    {isActive && renderNotificationDetails(notification, t, darkMode, language)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const getNotificationIcon = (type) => {
  if (type === "Leave Request" || type === "Leave Status Update" || type === "Leave") {
    return FaCalendarAlt;
  } else if (type === "Employee Updated") {
    return FaUserTie;
  } else if (type === "Employee Terminated") {
    return FaUser;
  } else if (type === "System") {
    return FaBell;
  } else if (type === "Requisition") {
    return FaFileSignature;
  } else {
    return FaBell;
  }
};

const getNotificationColorClasses = (type, darkMode) => {
  if (type === "Leave Request" || type === "Leave Status Update" || type === "Leave") {
    return darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700";
  } else if (type === "Employee Updated" || type === "Employee Terminated") {
    return darkMode ? "bg-purple-900/40 text-purple-400" : "bg-purple-100 text-purple-700";
  } else if (type === "urgent") {
    return darkMode ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700";
  } else if (type === "Requisition") {
    return darkMode ? "bg-orange-900/40 text-orange-400" : "bg-orange-100 text-orange-700";
  } else {
    return darkMode ? "bg-gray-900/40 text-gray-400" : "bg-gray-100 text-gray-700";
  }
};

const getNotificationTypeLabel = (type, t) => {
  const language = localStorage.getItem('language') || 'en';
  
  if (type === "Leave Request" || type === "Leave Status Update" || type === "Leave") return t.leaveRequest;
  if (type === "Employee Updated") return t.employeeUpdate;
  if (type === "Employee Terminated") return language === "en" ? "Employee Terminated" : "ሰራተኛ ተሰርዟል";
  if (type === "System") return t.general;
  if (type === "urgent") return t.urgent;
  if (type === "Requisition") return language === "en" ? "Requisition Request" : "የፍቃድ ጥያቄ";
  return type || t.general;
};

const renderNotificationDetails = (notification, t, darkMode, language) => {
  const { type, metadata } = notification;
  
  if (type === "Leave Request" || type === "Leave Status Update" || type === "Leave") {
    return (
      <div className={`mt-6 p-6 rounded-xl ${darkMode ? "bg-blue-900/10" : "bg-blue-50"}`}>
        <h4 className={`font-semibold mb-4 text-lg ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
          <FaCalendarAlt className="inline mr-2" />
          {t.leaveRequest} {t.details}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailItem
              icon={FaUser}
              label={t.employee}
              value={metadata?.employeeName || notification.message?.split(' ')[0] + ' ' + notification.message?.split(' ')[1]}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaBuilding}
              label={t.department}
              value={metadata?.department || notification.metadata?.department}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaCalendarAlt}
              label={t.leaveType}
              value={metadata?.leaveType || "Annual Leave"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaCheckCircle}
              label={t.status}
              value={metadata?.status ? t[metadata.status] || metadata.status : t.pending}
              darkMode={darkMode}
            />
          </div>
          
          <div className="space-y-4">
            <DetailItem
              icon={FaCalendarAlt}
              label={t.startDate}
              value={metadata?.startDate ? formatDate(metadata.startDate) : "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaCalendarAlt}
              label={t.endDate}
              value={metadata?.endDate ? formatDate(metadata.endDate) : "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaFileAlt}
              label={t.reason}
              value={metadata?.reason || notification.message}
              darkMode={darkMode}
            />
            
            {metadata?.adminComment && (
              <DetailItem
                icon={FaInfoCircle}
                label={t.comments}
                value={metadata.adminComment}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
        
        {metadata?.status === "pending" && (
          <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-600">
            <p className={`font-semibold mb-3 ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>
              <FaExclamationTriangle className="inline mr-2" />
              {t.actionRequired}
            </p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {language === "en" 
                ? "This leave request requires your approval. Please process it in the Leave Management section."
                : "ይህ የፈቃድ ጥያቄ የእርስዎ ፍቃድ ያስፈልገዋል። እባክዎን በፈቃድ አስተዳደር ክፍል ውስጥ ያስተናግዱት።"}
            </p>
          </div>
        )}
      </div>
    );
  }
  
  if (type === "Employee Updated" || type === "Employee Terminated") {
    return (
      <div className={`mt-6 p-6 rounded-xl ${darkMode ? "bg-purple-900/10" : "bg-purple-50"}`}>
        <h4 className={`font-semibold mb-4 text-lg ${darkMode ? "text-purple-300" : "text-purple-700"}`}>
          <FaUserTie className="inline mr-2" />
          {type === "Employee Updated" ? t.employeeUpdate : language === "en" ? "Employee Termination" : "የሰራተኛ መጨረሻ"} {t.details}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailItem
              icon={FaUser}
              label={t.employee}
              value={metadata?.employeeName || notification.message?.split(' ')[1] + ' ' + notification.message?.split(' ')[2]}
              darkMode={darkMode}
            />
            <DetailItem
              icon={FaBuilding}
              label={t.department}
              value={metadata?.department || notification.metadata?.department}
              darkMode={darkMode}
            />
            
            {metadata?.updatedFields && (
              <DetailItem
                icon={FaEdit}
                label={t.updatedFields}
                value={Array.isArray(metadata.updatedFields) ? metadata.updatedFields.join(', ') : metadata.updatedFields}
                darkMode={darkMode}
              />
            )}
            
            {metadata?.updatedBy && (
              <DetailItem
                icon={FaUserTie}
                label={t.processedBy}
                value={metadata.updatedBy}
                darkMode={darkMode}
              />
            )}
          </div>
          
          <div className="space-y-4">
            {metadata?.employeeStatus && (
              <DetailItem
                icon={FaCheckCircle}
                label={t.employeeStatus}
                value={metadata.employeeStatus}
                darkMode={darkMode}
              />
            )}
            
            {metadata?.position && (
              <DetailItem
                icon={FaBriefcase}
                label={t.position}
                value={metadata.position}
                darkMode={darkMode}
              />
            )}
            
            {metadata?.updatedAt && (
              <DetailItem
                icon={FaCalendarAlt}
                label={t.processedAt}
                value={formatDateTime(metadata.updatedAt)}
                darkMode={darkMode}
              />
            )}
            
            {type === "Employee Terminated" && metadata?.terminationDate && (
              <DetailItem
                icon={FaCalendarAlt}
                label={language === "en" ? "Termination Date" : "የመጨረሻ ቀን"}
                value={formatDate(metadata.terminationDate)}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
        
        if (notification.message && (
          <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-600">
            <DetailItem
              icon={FaFileAlt}
              label={t.details}
              value={notification.message}
              darkMode={darkMode}
            />
          </div>
        )
      </div>
    );
  }
  
  if (type === "Requisition") {
    return (
      <div className={`mt-6 p-6 rounded-xl ${darkMode ? "bg-orange-900/10" : "bg-orange-50"}`}>
        <h4 className={`font-semibold mb-4 text-lg ${darkMode ? "text-orange-300" : "text-orange-700"}`}>
          <FaFileSignature className="inline mr-2" />
          {language === "en" ? "Requisition Details" : "የፍቃድ ዝርዝር"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DetailItem
              icon={FaUser}
              label={t.employee}
              value={metadata?.requesterName || "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaBuilding}
              label={t.department}
              value={metadata?.department || "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaBriefcase}
              label={t.position}
              value={metadata?.position || "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaCheckCircle}
              label={t.status}
              value={metadata?.status ? t[metadata.status] || metadata.status : t.pending}
              darkMode={darkMode}
            />
          </div>
          
          <div className="space-y-4">
            <DetailItem
              icon={FaCalendarAlt}
              label={language === "en" ? "Request Date" : "የጥያቄ ቀን"}
              value={metadata?.requestDate ? formatDate(metadata.requestDate) : "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaUsers}
              label={language === "en" ? "Quantity" : "ብዛት"}
              value={metadata?.quantity || "N/A"}
              darkMode={darkMode}
            />
            
            <DetailItem
              icon={FaFileAlt}
              label={language === "en" ? "Justification" : "ምክንያት"}
              value={metadata?.justification || "N/A"}
              darkMode={darkMode}
            />
            
            {metadata?.priority && (
              <DetailItem
                icon={FaExclamationTriangle}
                label={language === "en" ? "Priority" : "ቅድሚያ"}
                value={metadata.priority}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
        
        {metadata?.status === "pending" && (
          <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-600">
            <p className={`font-semibold mb-3 ${darkMode ? "text-yellow-300" : "text-yellow-600"}`}>
              <FaExclamationTriangle className="inline mr-2" />
              {t.actionRequired}
            </p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {language === "en" 
                ? "This requisition requires your review. Please process it in the Requisition Management section."
                : "ይህ ፍቃድ የእርስዎ ግምገማ ያስፈልገዋል። እባክዎን በፍቃድ አስተዳደር ክፍል ውስጥ ያስተናግዱት።"}
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // Default notification details
  return (
    <div className={`mt-6 p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      <h4 className={`font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {language === "en" ? "Notification Details" : "የማሳወቂያ ዝርዝሮች"}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DetailItem
            icon={getNotificationIcon(notification.type)}
            label={t.type}
            value={getNotificationTypeLabel(notification.type, t)}
            darkMode={darkMode}
          />
          
          <DetailItem
            icon={FaCalendarAlt}
            label={t.createdAt}
            value={formatDateTime(notification.createdAt)}
            darkMode={darkMode}
          />
          
          {notification.senderRole && (
            <DetailItem
              icon={FaUser}
              label={language === "en" ? "Sender Role" : "የላኪ ሚና"}
              value={notification.senderRole}
              darkMode={darkMode}
            />
          )}
          
          {notification.recipientId && (
            <DetailItem
              icon={FaUser}
              label="Recipient ID"
              value={notification.recipientId}
              darkMode={darkMode}
            />
          )}
        </div>
        
        <div className="space-y-4">
          {notification.metadata && Object.entries(notification.metadata).map(([key, value]) => (
            <DetailItem
              key={key}
              icon={FaInfoCircle}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, darkMode }) => {
  if (!Icon) {
    Icon = FaInfoCircle;
  }
  
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        {typeof Icon === 'function' ? (
          <Icon className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        ) : (
          <div className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {Icon}
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
        <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {value || <span className={`italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>N/A</span>}
        </p>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default DeptHeadNotifications;