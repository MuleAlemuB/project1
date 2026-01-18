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
} from "react-icons/fa";

const translations = {
  en: {
    title: "Notifications",
    loading: "Loading notifications...",
    notAuthorized: "Not authorized",
    noNotifications: "No notifications yet",
    markSeen: "Mark as Read",
    delete: "Delete",
    viewDetails: "View Details",
    closeDetails: "Close Details",
    type: "Type",
    requisitionId: "Requisition ID",
    employee: "Employee",
    email: "Email",
    department: "Department",
    from: "From",
    to: "To",
    reason: "Reason",
    status: "Status",
    phone: "Phone",
    vacancy: "Vacancy",
    applicant: "Applicant",
    unread: "Unread",
    all: "All",
    markAllRead: "Mark All as Read",
    deleteAll: "Delete All Read",
    notificationCount: "Notifications",
    newNotifications: "New notifications",
    leaveRequest: "Leave Request",
    requisition: "Requisition",
    general: "General",
    urgent: "Urgent",
    markAllReadConfirm: "Mark all notifications as read?",
    deleteAllConfirm: "Delete all read notifications?",
    workExperience: "Work Experience",
    workExperienceRequest: "Work Experience Request",
    workExperienceApproved: "Work Experience Approved",
    workExperienceRejected: "Work Experience Rejected",
    workExperienceLetter: "Work Experience Letter",
    workExperienceLetterGenerated: "Work Experience Letter Generated",
    workExperienceLetterUploaded: "Work Experience Letter Uploaded",
    downloadLetter: "Download Letter",
    viewLetter: "View Letter",
    adminReason: "Admin Reason",
    createdAt: "Request Date",
    reviewedBy: "Reviewed By",
    downloadCertificate: "Download Certificate",
    clearAll: "Clear All",
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
  },
  am: {
    title: "ማሳወቂያዎች",
    loading: "ማሳወቂያዎች በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    noNotifications: "ምንም ማሳወቂያ የለም",
    markSeen: "እንደተነበበ ምልክት አድርግ",
    delete: "አጥፋ",
    viewDetails: "ዝርዝሮችን አሳይ",
    closeDetails: "ዝርዝሮችን ዝጋ",
    type: "ዓይነት",
    requisitionId: "የጥያቄ መታወቂያ",
    employee: "ሰራተኛ",
    email: "ኢሜይል",
    department: "ክፍል",
    from: "ከ",
    to: "እስከ",
    reason: "ምክንያት",
    status: "ሁኔታ",
    phone: "ስልክ",
    vacancy: "የቦታ ክፍት",
    applicant: "የወሰነ",
    unread: "ያልተነበበ",
    all: "ሁሉም",
    markAllRead: "ሁሉንም እንደተነበበ ምልክት አድርግ",
    deleteAll: "ሁሉንም ያልተነበበ አጥፋ",
    notificationCount: "ማሳወቂያዎች",
    newNotifications: "አዲስ ማሳወቂያዎች",
    leaveRequest: "የፈቃድ ጥያቄ",
    requisition: "ጥያቄ",
    general: "አጠቃላይ",
    urgent: "አስቸኳይ",
    markAllReadConfirm: "ሁሉንም ማሳወቂያዎች እንደተነበቡ ምልክት ማድረግ ትፈልጋለህ?",
    deleteAllConfirm: "ሁሉንም ያልተነበቡ ማሳወቂያዎች ማጥፋት ትፈልጋለህ?",
    workExperience: "የስራ ተሞክሮ",
    workExperienceRequest: "የስራ ተሞክሮ ጥያቄ",
    workExperienceApproved: "የስራ ተሞክሮ ጥያቄ ተፈቅዷል",
    workExperienceRejected: "የስራ ተሞክሮ ጥያቄ ተቀባይነት አላገኘም",
    workExperienceLetter: "የስራ ተሞክሮ ደብዳቤ",
    workExperienceLetterGenerated: "የስራ ተሞክሮ ደብዳቤ ተፈጥሯል",
    workExperienceLetterUploaded: "የስራ ተሞክሮ ደብዳቤ ተሰቅሏል",
    downloadLetter: "ደብዳቤ አውርድ",
    viewLetter: "ደብዳቤ አሳይ",
    adminReason: "የአስተዳዳሪ ምክንያት",
    createdAt: "የጥያቄ ቀን",
    reviewedBy: "በእነዚህ ተፈትኗል",
    downloadCertificate: "ማረጋገጫ አውርድ",
    clearAll: "ሁሉንም አጥፋ",
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
  },
};

const DeptHeadNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedAll, setExpandedAll] = useState(false);

  const filteredNotifications = activeFilter === "unread" 
    ? notifications.filter(n => !n.seen)
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;
  const readCount = notifications.filter(n => n.seen).length;

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchNotifications();
  }, [user, authLoading]);

  const handleMarkSeen = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Error marking as seen:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!window.confirm(t.markAllReadConfirm)) return;
    try {
      await Promise.all(
        notifications
          .filter(n => !n.seen)
          .map(n => axiosInstance.put(`/notifications/${n._id}/seen`))
      );
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!window.confirm(t.deleteAllConfirm)) return;
    try {
      const readNotifications = notifications.filter(n => n.seen);
      await Promise.all(
        readNotifications.map(n => axiosInstance.delete(`/notifications/${n._id}`))
      );
      setNotifications(prev => prev.filter(n => !n.seen));
    } catch (err) {
      console.error("Error deleting all read:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(language === "en" ? "Delete all notifications?" : "ሁሉንም ማሳወቂያዎች ማጥፋት ትፈልጋለህ?")) return;
    try {
      await Promise.all(
        notifications.map(n => axiosInstance.delete(`/notifications/${n._id}`))
      );
      setNotifications([]);
    } catch (err) {
      console.error("Error deleting all:", err);
    }
  };

  const handleDownloadWorkExperienceLetter = async (notification) => {
    if (!notification.relatedId) return;
    try {
      const downloadUrl = `${axiosInstance.defaults.baseURL}/work-experience/${notification.relatedId}/download`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error downloading letter:", error);
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

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto ${darkMode ? "border-blue-500 border-t-blue-300" : "border-blue-600 border-t-blue-200"}`}></div>
          <p className={`mt-6 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
        <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.notAuthorized}</p>
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

          <div className={`rounded-2xl p-6 ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200 shadow-lg"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{language === "en" ? "Read" : "የተነበቡ"}</p>
                <p className="text-3xl font-bold mt-2">{readCount}</p>
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                <FaCheck className={`text-xl ${darkMode ? "text-green-400" : "text-green-600"}`} />
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
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {activeFilter === "unread" ? t.allCaughtUp : t.noNotifications}
            </p>
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
                            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              <FaClock className="inline mr-1" />
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} line-clamp-2`}>
                            {notification.message}
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
                        
                        {(notification.type?.includes("Work Experience Letter")) && (
                          <button
                            onClick={() => handleDownloadWorkExperienceLetter(notification)}
                            className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                            title={t.downloadCertificate}
                          >
                            <FaDownload className="w-4 h-4" />
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
                    {isActive && (
                      <div className={`mt-6 p-6 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            <h4 className={`font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {language === "en" ? "Notification Details" : "የማሳወቂያ ዝርዝሮች"}
                            </h4>
                            
                            <DetailItem
                              icon={NotificationIcon}
                              label={t.type}
                              value={getNotificationTypeLabel(notification.type, t)}
                              darkMode={darkMode}
                            />
                            
                            {notification.status && (
                              <DetailItem
                                icon={notification.status === "approved" ? FaCheckCircle : 
                                      notification.status === "rejected" ? FaTimesCircle : FaBell}
                                label={t.status}
                                value={notification.status}
                                darkMode={darkMode}
                              />
                            )}

                            {notification.createdAt && (
                              <DetailItem
                                icon={FaCalendarAlt}
                                label={t.createdAt}
                                value={new Date(notification.createdAt).toLocaleString()}
                                darkMode={darkMode}
                              />
                            )}
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            <h4 className={`font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {language === "en" ? "Related Information" : "የተዛመደ መረጃ"}
                            </h4>
                            
                            {notification.employee?.name && (
                              <DetailItem
                                icon={FaUser}
                                label={t.employee}
                                value={notification.employee.name}
                                darkMode={darkMode}
                              />
                            )}
                            
                            {notification.department && (
                              <DetailItem
                                icon={FaBuilding}
                                label={t.department}
                                value={notification.department}
                                darkMode={darkMode}
                              />
                            )}

                            {notification.reason && (
                              <DetailItem
                                icon={FaFileAlt}
                                label={t.reason}
                                value={notification.reason}
                                darkMode={darkMode}
                              />
                            )}
                          </div>
                        </div>

                        {/* Download Certificate Section */}
                        {(notification.type?.includes("Work Experience Letter")) && (
                          <div className="mt-6 pt-6 border-t border-gray-700 dark:border-gray-600">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <p className={`font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                  {t.workExperienceLetter}
                                </p>
                                <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {notification.message}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownloadWorkExperienceLetter(notification)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all flex items-center gap-3 shadow-lg"
                              >
                                <FaFileSignature className="w-5 h-5" />
                                {t.downloadCertificate}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
  if (type?.includes("Work Experience")) {
    return FaBriefcase;
  } else if (type === "Leave") {
    return FaCalendarAlt;
  } else if (type === "Requisition") {
    return FaFileAlt;
  } else if (type === "urgent") {
    return FaExclamationTriangle;
  } else {
    return FaBell;
  }
};

const getNotificationColorClasses = (type, darkMode) => {
  if (type?.includes("Work Experience")) {
    return darkMode ? "bg-purple-900/40 text-purple-400" : "bg-purple-100 text-purple-700";
  } else if (type === "urgent") {
    return darkMode ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700";
  } else if (type === "Leave") {
    return darkMode ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700";
  } else if (type === "Requisition") {
    return darkMode ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700";
  } else {
    return darkMode ? "bg-gray-900/40 text-gray-400" : "bg-gray-100 text-gray-700";
  }
};

const getNotificationTypeLabel = (type, t) => {
  if (type?.includes("Work Experience")) {
    if (type === "Work Experience Request") return t.workExperienceRequest;
    if (type === "Work Experience Approved") return t.workExperienceApproved;
    if (type === "Work Experience Rejected") return t.workExperienceRejected;
    if (type === "Work Experience Letter Generated") return t.workExperienceLetterGenerated;
    if (type === "Work Experience Letter Uploaded") return t.workExperienceLetterUploaded;
    return t.workExperience;
  } else if (type === "Leave") {
    return t.leaveRequest;
  } else if (type === "Requisition") {
    return t.requisition;
  } else if (type === "urgent") {
    return t.urgent;
  } else {
    return t.general;
  }
};

const DetailItem = ({ icon: Icon, label, value, darkMode }) => {
  // Handle case where Icon might be undefined
  if (!Icon) {
    Icon = FaInfoCircle; // Default icon
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
      <div>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
        <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {value || <span className={`italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>N/A</span>}
        </p>
      </div>
    </div>
  );
};

export default DeptHeadNotifications;