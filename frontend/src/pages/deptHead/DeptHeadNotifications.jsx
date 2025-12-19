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
  },
};

const DeptHeadNotifications = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [activeFilter, setActiveFilter] = useState("all"); // "all" or "unread"

  // Filter notifications
  const filteredNotifications = activeFilter === "unread" 
    ? notifications.filter(n => !n.seen)
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;

  // Fetch notifications function
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

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user) fetchNotifications();
  }, [user, authLoading]);

  // Polling every 10 seconds for new notifications
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
                    <div className={`mt-1 p-2 rounded-lg ${notification.type === "urgent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : notification.type === "Leave" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                      {notification.type === "Leave" ? (
                        <FaCalendarAlt className="w-4 h-4" />
                      ) : notification.type === "Requisition" ? (
                        <FaFileAlt className="w-4 h-4" />
                      ) : notification.type === "urgent" ? (
                        <FaExclamationTriangle className="w-4 h-4" />
                      ) : (
                        <FaBell className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">
                          {notification.type === "Leave" ? t.leaveRequest :
                           notification.type === "Requisition" ? t.requisition :
                           notification.type === "urgent" ? t.urgent : t.general}
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
                            icon={notification.type === "Leave" ? <FaCalendarAlt /> : 
                                  notification.type === "Requisition" ? <FaFileAlt /> : 
                                  notification.type === "urgent" ? <FaExclamationTriangle /> : <FaBell />}
                            label={t.type}
                            value={notification.type}
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

                        {notification.reference && (
                          <DetailItem
                            icon={<FaFileAlt />}
                            label={t.requisitionId}
                            value={notification.reference}
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
                      </div>

                      {/* Right Column - Leave Request Details */}
                      {notification.leaveRequestId && (
                        <div className="space-y-3">
                          {notification.leaveRequestId.requesterName && (
                            <DetailItem
                              icon={<FaUser />}
                              label={t.employee}
                              value={notification.leaveRequestId.requesterName}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {notification.leaveRequestId.requesterEmail && (
                            <DetailItem
                              icon={<FaEnvelope />}
                              label={t.email}
                              value={notification.leaveRequestId.requesterEmail}
                              darkMode={darkMode}
                            />
                          )}

                          {notification.leaveRequestId.department && (
                            <DetailItem
                              icon={<FaBuilding />}
                              label={t.department}
                              value={typeof notification.leaveRequestId.department === "object" 
                                ? notification.leaveRequestId.department.name 
                                : notification.leaveRequestId.department}
                              darkMode={darkMode}
                            />
                          )}

                          {notification.leaveRequestId.startDate && (
                            <DetailItem
                              icon={<FaCalendarAlt />}
                              label={t.from}
                              value={new Date(notification.leaveRequestId.startDate).toLocaleDateString()}
                              darkMode={darkMode}
                            />
                          )}

                          {notification.leaveRequestId.endDate && (
                            <DetailItem
                              icon={<FaCalendarAlt />}
                              label={t.to}
                              value={new Date(notification.leaveRequestId.endDate).toLocaleDateString()}
                              darkMode={darkMode}
                            />
                          )}

                          {notification.leaveRequestId.reason && (
                            <DetailItem
                              icon={<FaFileAlt />}
                              label={t.reason}
                              value={notification.leaveRequestId.reason}
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      )}

                      {/* Employee Details */}
                      {notification.employee && (
                        <div className="space-y-3">
                          {notification.employee.name && (
                            <DetailItem
                              icon={<FaUser />}
                              label={t.employee}
                              value={notification.employee.name}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {notification.employee.email && (
                            <DetailItem
                              icon={<FaEnvelope />}
                              label={t.email}
                              value={notification.employee.email}
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      )}

                      {/* Vacancy Details */}
                      {notification.vacancy && (
                        <div className="space-y-3">
                          {notification.vacancy.title && (
                            <DetailItem
                              icon={<FaFileAlt />}
                              label={t.vacancy}
                              value={notification.vacancy.title}
                              darkMode={darkMode}
                            />
                          )}
                          
                          {notification.vacancy.department && (
                            <DetailItem
                              icon={<FaBuilding />}
                              label={t.department}
                              value={notification.vacancy.department}
                              darkMode={darkMode}
                            />
                          )}
                        </div>
                      )}
                    </div>
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