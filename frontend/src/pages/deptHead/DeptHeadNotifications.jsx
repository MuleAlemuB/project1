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
  FaBriefcase, // Add this for work experience
  FaFileSignature, // Add this for letters
} from "react-icons/fa";

const translations = {
  en: {
    title: "Notifications",
    loading: "Loading notifications...",
    notAuthorized: "Not authorized",
    noNotifications: "No notifications",
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
    // Add these for work experience
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
    // Add these for work experience
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

  const filteredNotifications = activeFilter === "unread" 
    ? notifications.filter(n => !n.seen)
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;

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

  useEffect(() => {
    if (!authLoading && user) {
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
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

  // Handle download work experience letter
  const handleDownloadWorkExperienceLetter = async (notification) => {
    if (!notification.relatedId) {
      console.error("No related ID found for work experience letter");
      return;
    }

    try {
      const downloadUrl = `${axiosInstance.defaults.baseURL}/work-experience/${notification.relatedId}/download`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error downloading letter:", error);
      alert("Failed to download certificate. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"}`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{t.notAuthorized}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FaBell className="text-blue-500" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {notifications.length} {t.notificationCount} • {unreadCount} {t.newNotifications}
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "all" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {t.all} ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "unread" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {t.unread} ({unreadCount})
          </button>
        </div>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t.markAllRead}
            </button>
          )}
          {notifications.filter(n => n.seen).length > 0 && (
            <button
              onClick={handleDeleteAllRead}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t.deleteAll}
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <FaBell className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noNotifications}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`rounded-xl border transition-all ${darkMode ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"} ${!notification.seen ? "border-l-4 border-blue-500" : ""}`}
            >
              <div className="p-4">
                {/* Notification Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-2 rounded-lg ${getNotificationColorClasses(notification.type, darkMode)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">
                          {getNotificationTypeLabel(notification.type, t)}
                        </p>
                        {!notification.seen && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            {t.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.seen && (
                      <button
                        onClick={() => handleMarkSeen(notification._id)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title={t.markSeen}
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Download button for work experience letters */}
                    {(notification.type === "Work Experience Letter Generated" || 
                      notification.type === "Work Experience Letter Uploaded" ||
                      notification.type === "Work Experience Letter") && (
                      <button
                        onClick={() => handleDownloadWorkExperienceLetter(notification)}
                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title={t.downloadCertificate}
                      >
                        <FaFileSignature className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title={t.delete}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDetailsOpen(prev => ({ ...prev, [notification._id]: !prev[notification._id] }))}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title={detailsOpen[notification._id] ? t.closeDetails : t.viewDetails}
                    >
                      <FaInfoCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notification Message */}
                <div className="mb-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    {notification.message}
                  </p>
                </div>

                {/* Details Section */}
                {detailsOpen[notification._id] && (
                  <div className={`mt-4 p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        {notification.type && (
                          <DetailItem
                            icon={getNotificationIcon(notification.type)}
                            label={t.type}
                            value={getNotificationTypeLabel(notification.type, t)}
                            darkMode={darkMode}
                          />
                        )}
                        
                        {notification.status && (
                          <DetailItem
                            icon={notification.status === "approved" ? <FaCheckCircle /> : 
                                  notification.status === "rejected" ? <FaTimesCircle /> : <FaBell />}
                            label={t.status}
                            value={notification.status}
                            darkMode={darkMode}
                          />
                        )}

                        {notification.createdAt && (
                          <DetailItem
                            icon={<FaCalendarAlt />}
                            label={t.createdAt}
                            value={new Date(notification.createdAt).toLocaleString()}
                            darkMode={darkMode}
                          />
                        )}

                        {notification.department && typeof notification.department !== "object" && (
                          <DetailItem
                            icon={<FaBuilding />}
                            label={t.department}
                            value={notification.department}
                            darkMode={darkMode}
                          />
                        )}

                        {notification.adminReason && (
                          <DetailItem
                            icon={<FaInfoCircle />}
                            label={t.adminReason}
                            value={notification.adminReason}
                            darkMode={darkMode}
                          />
                        )}
                      </div>

                      {/* Right Column - Employee Details */}
                      <div className="space-y-3">
                        {notification.employee && notification.employee.name && (
                          <DetailItem
                            icon={<FaUser />}
                            label={t.employee}
                            value={notification.employee.name}
                            darkMode={darkMode}
                          />
                        )}
                        
                        {notification.employee && notification.employee.email && (
                          <DetailItem
                            icon={<FaEnvelope />}
                            label={t.email}
                            value={notification.employee.email}
                            darkMode={darkMode}
                          />
                        )}

                        {notification.reason && (
                          <DetailItem
                            icon={<FaFileAlt />}
                            label={t.reason}
                            value={notification.reason}
                            darkMode={darkMode}
                          />
                        )}

                        {notification.reviewedBy && (
                          <DetailItem
                            icon={<FaUser />}
                            label={t.reviewedBy}
                            value={notification.reviewedBy}
                            darkMode={darkMode}
                          />
                        )}
                      </div>
                    </div>

                    {/* Download Certificate Section for Work Experience */}
                    {(notification.type === "Work Experience Letter Generated" || 
                      notification.type === "Work Experience Letter Uploaded" ||
                      notification.type === "Work Experience Letter") && (
                      <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {t.workExperienceLetter}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownloadWorkExperienceLetter(notification)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <FaFileSignature className="w-4 h-4" />
                            {t.downloadCertificate}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper functions for notifications
const getNotificationIcon = (type) => {
  if (type?.includes("Work Experience")) {
    return <FaBriefcase className="w-4 h-4" />;
  } else if (type === "Leave") {
    return <FaCalendarAlt className="w-4 h-4" />;
  } else if (type === "Requisition") {
    return <FaFileAlt className="w-4 h-4" />;
  } else if (type === "urgent") {
    return <FaExclamationTriangle className="w-4 h-4" />;
  } else {
    return <FaBell className="w-4 h-4" />;
  }
};

const getNotificationColorClasses = (type, darkMode) => {
  if (type?.includes("Work Experience")) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
  } else if (type === "urgent") {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  } else if (type === "Leave") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  } else if (type === "Requisition") {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getNotificationTypeLabel = (type, t) => {
  if (type?.includes("Work Experience")) {
    if (type === "Work Experience Request") return t.workExperienceRequest;
    if (type === "Work Experience Approved") return t.workExperienceApproved;
    if (type === "Work Experience Rejected") return t.workExperienceRejected;
    if (type === "Work Experience Letter Generated") return t.workExperienceLetterGenerated;
    if (type === "Work Experience Letter Uploaded") return t.workExperienceLetterUploaded;
    if (type === "Work Experience Letter") return t.workExperienceLetter;
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

// Helper component for detail items
const DetailItem = ({ icon, label, value, darkMode }) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
    <p className="font-medium">
      {value || <span className="text-gray-400 italic">N/A</span>}
    </p>
  </div>
);

export default DeptHeadNotifications;