// src/pages/employee/EmployeeNotifications.jsx
import React, { useEffect, useState, useCallback } from "react";
import { 
  FaBell, 
  FaTrash, 
  FaEye, 
  FaTimes,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaUserCheck,
  FaSpinner,
  FaCheck
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const EmployeeNotifications = () => {
  const { language, darkMode } = useSettings();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await axiosInstance.get("/notifications/my");
    
    console.log("Received notifications:", data); // Debug log
    
    // ✅ FIX: Filter notifications specifically for this employee
    const filteredData = data.filter(notification => {
      // 1. Check if notification has applicant.email matching user email
      const hasApplicantEmail = notification.applicant?.email && 
        notification.applicant.email.toLowerCase() === user.email.toLowerCase();
      
      // 2. Check if notification has employee.email matching user email
      const hasEmployeeEmail = notification.employee?.email && 
        notification.employee.email.toLowerCase() === user.email.toLowerCase();
      
      // 3. Check if notification is specifically for this employee by ID (if available)
      const hasEmployeeId = notification.employee?._id && 
        notification.employee._id === user._id;
      
      // 4. For work experience notifications, check if they're status updates (not requests)
      if (notification.type === "Work Experience Request" && 
          notification.message?.includes("has requested") &&
          !notification.message?.includes("has been") &&
          !notification.message?.includes("submitted successfully")) {
        return false; // Hide work experience REQUEST notifications from employee
      }
      
      // 5. For leave notifications, check metadata for employee email
      let hasMetadataEmail = false;
      if (notification.metadata && notification.metadata.email) {
        hasMetadataEmail = notification.metadata.email.toLowerCase() === user.email.toLowerCase();
      }
      
      // 6. Return true if any of the conditions match
      return hasApplicantEmail || hasEmployeeEmail || hasEmployeeId || hasMetadataEmail;
    });
    
    console.log("Filtered notifications for employee:", filteredData); // Debug log
    
    // Sort by date, newest first
    const sorted = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setNotifications(sorted);
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    toast.error(
      language === "am" 
        ? "ማስታወቂያዎችን ማግኘት አልተሳካም" 
        : "Failed to fetch notifications"
    );
  } finally {
    setLoading(false);
  }
}, [language, user.email, user._id]);
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // ✅ FIXED: Mark as read - using correct backend endpoint
  const markAsRead = async (id) => {
    if (!id) return;
    
    try {
      setMarkingAsRead(id);
      
      // ✅ CORRECT ENDPOINT: Use PUT /notifications/:id/seen
      await axiosInstance.put(`/notifications/${id}/seen`);
      
      // ✅ FIX: Update local state
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, seen: true } : n)
      );
      
      // Update selected notification if open
      if (selectedNotification && selectedNotification._id === id) {
        setSelectedNotification({ ...selectedNotification, seen: true });
      }
      
      toast.success(
        language === "am" 
          ? "ማስታወቂያ እንደተነበበ ምልክት ተደርጓል" 
          : "Notification marked as read"
      );
      
    } catch (error) {
      console.error("Error marking as read:", error);
      
      // Show specific error message
      if (error.response?.status === 403) {
        toast.error(
          language === "am" 
            ? "ይህን ማስታወቂያ ለመጥፎ የሚያስችል ስልጣን የለህም" 
            : "You are not authorized to mark this notification as read"
        );
      } else if (error.response?.status === 404) {
        toast.error(
          language === "am" 
            ? "ማስታወቂያ አልተገኘም" 
            : "Notification not found"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ማስታወቂያ ማንበብ አልተሳካም" 
            : "Failed to mark notification as read"
        );
      }
    } finally {
      setMarkingAsRead(null);
    }
  };

  // ✅ FIXED: Mark all as read - using correct backend endpoint
  const markAllAsRead = async () => {
    try {
      setMarkingAllAsRead(true);
      
      // ✅ CORRECT ENDPOINT: Use PUT /notifications/mark-all-read
      const response = await axiosInstance.put("/notifications/mark-all-read");
      
      // ✅ FIX: Update all notifications to seen
      setNotifications(prev => 
        prev.map(n => ({ ...n, seen: true }))
      );
      
      toast.success(
        response.data?.message || 
        (language === "am" 
          ? "ሁሉም ማስታወቂያዎች እንደተነበቡ ምልክት ተደርጓል" 
          : "All notifications marked as read")
      );
      
    } catch (error) {
      console.error("Error marking all as read:", error);
      
      if (error.response?.status === 403) {
        toast.error(
          language === "am" 
            ? "ሁሉንም ማስታወቂያዎች ለመጥፎ የሚያስችል ስልጣን የለህም" 
            : "You are not authorized to mark all notifications as read"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ሁሉንም ማስታወቂያዎች ማንበብ አልተሳካም" 
            : "Failed to mark all notifications as read"
        );
      }
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // ✅ FIXED: Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm(
      language === "am" 
        ? "ይህን ማስታወቂያ መሰረዝ እንደምትፈልጉ ይረጋገጡ?" 
        : "Are you sure you want to delete this notification?"
    )) return;

    try {
      setIsDeleting(true);
      
      // ✅ CORRECT ENDPOINT: Use DELETE /notifications/:id
      await axiosInstance.delete(`/notifications/${id}`);
      
      setNotifications(prev => prev.filter(n => n._id !== id));
      
      // Close modal if deleting the selected notification
      if (selectedNotification && selectedNotification._id === id) {
        setSelectedNotification(null);
      }
      
      toast.success(
        language === "am" 
          ? "ማስታወቂያ ተሰርዟል" 
          : "Notification deleted successfully"
      );
      
    } catch (error) {
      console.error("Error deleting notification:", error);
      
      if (error.response?.status === 403) {
        toast.error(
          language === "am" 
            ? "ይህን ማስታወቂያ ለመሰረዝ የሚያስችል ስልጣን የለህም" 
            : "You are not authorized to delete this notification"
        );
      } else if (error.response?.status === 404) {
        toast.error(
          language === "am" 
            ? "ማስታወቂያ አልተገኘም" 
            : "Notification not found"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ማስታወቂያ ማሰረዝ አልተሳካም" 
            : "Failed to delete notification"
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ FIXED: Delete all read notifications
  const deleteAllRead = async () => {
    const readCount = notifications.filter(n => n.seen).length;
    if (readCount === 0) return;
    
    if (!window.confirm(
      language === "am" 
        ? `የ${readCount} የተነበቡ ማስታወቂያዎች መሰረዝ እንደምትፈልጉ ይረጋገጡ?` 
        : `Are you sure you want to delete ${readCount} read notifications?`
    )) return;

    try {
      setIsDeleting(true);
      
      // ✅ CORRECT ENDPOINT: Use DELETE /notifications/read/all
      const response = await axiosInstance.delete("/notifications/read/all");
      
      setNotifications(prev => prev.filter(n => !n.seen));
      
      toast.success(
        response.data?.message || 
        (language === "am" 
          ? `${readCount} የተነበቡ ማስታወቂያዎች ተሰርዘዋል` 
          : `${readCount} read notifications deleted`)
      );
      
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      
      if (error.response?.status === 403) {
        toast.error(
          language === "am" 
            ? "የተነበቡ ማስታወቂያዎችን ለመሰረዝ የሚያስችል ስልጣን የለህም" 
            : "You are not authorized to delete read notifications"
        );
      } else {
        toast.error(
          language === "am" 
            ? "የተነበቡ ማስታወቂያዎችን ማሰረዝ አልተሳካም" 
            : "Failed to delete read notifications"
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(note => {
    if (filter === "unread") return !note.seen;
    if (filter === "read") return note.seen;
    return true;
  });

  // Get notification icon
  const getNotificationIcon = (notification) => {
    if (notification.type === "Leave") {
      switch (notification.status) {
        case "approved":
          return <FaCheckCircle className="text-green-500" />;
        case "rejected":
          return <FaTimesCircle className="text-red-500" />;
        case "pending":
          return <FaClock className="text-yellow-500" />;
        default:
          return <FaCalendarAlt className="text-blue-500" />;
      }
    }
    
    if (notification.type?.includes("Work Experience")) {
      if (notification.message?.includes("approved") || notification.status === "approved") {
        return <FaCheckCircle className="text-green-500" />;
      }
      if (notification.message?.includes("rejected") || notification.status === "rejected") {
        return <FaTimesCircle className="text-red-500" />;
      }
      return <FaFileAlt className="text-purple-500" />;
    }
    
    if (notification.type === "Requisition") {
      return <FaUserCheck className="text-orange-500" />;
    }
    
    return <FaBell className="text-blue-500" />;
  };

  // Get notification type text
  const getNotificationTypeText = (notification) => {
    const { type, message, status } = notification;
    
    if (language === "am") {
      if (type?.includes("Work Experience")) {
        if (message?.includes("approved") || status === "approved") return "የተፈቀደ የስራ ልምድ";
        if (message?.includes("rejected") || status === "rejected") return "የተቀበለ የስራ ልምድ";
        if (message?.includes("submitted")) return "የስራ ልምድ ጥያቄ ተልኳል";
        return "የስራ ልምድ ማስታወቂያ";
      }
      if (type === "Leave") {
        switch (status) {
          case "approved": return "የተፈቀደ እረፍት";
          case "rejected": return "የተቀበለ እረፍት";
          case "pending": return "የእረፍት ጥያቄ";
          default: return "እረፍት";
        }
      }
      return type || "ማስታወቂያ";
    }
    
    if (type?.includes("Work Experience")) {
      if (message?.includes("approved") || status === "approved") return "Work Experience Approved";
      if (message?.includes("rejected") || status === "rejected") return "Work Experience Rejected";
      if (message?.includes("submitted")) return "Work Experience Submitted";
      return "Work Experience Notification";
    }
    return type || "Notification";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (language === "am") {
      if (diffMins < 1) return "አሁን";
      if (diffMins < 60) return `${diffMins} ደቂቃ በፊት`;
      if (diffHours < 24) return `${diffHours} ሰዓት በፊት`;
      if (diffDays < 7) return `${diffDays} ቀን በፊት`;
      return date.toLocaleDateString('am-ET', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Stats
  const unreadCount = notifications.filter(n => !n.seen).length;
  const totalCount = notifications.length;
  const readCount = notifications.filter(n => n.seen).length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "am" ? "ማስታወቂያዎች" : "Notifications"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                {language === "am" 
                  ? "የእርስዎን ሁሉንም ማስታወቂያዎች ይመልከቱ እና ያስተዳድሩ" 
                  : "View and manage all your notifications"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <FaBell className="text-blue-500 text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadCount} {language === "am" ? "ያልተነበቡ" : "unread"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {totalCount} {language === "am" ? "በጠቅላላ" : "total"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === "am" ? "ማጣሪያ" : "Filter"}:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: language === "am" ? "ሁሉም" : "All" },
                  { key: "unread", label: language === "am" ? "ያልተነበቡ" : "Unread" },
                  { key: "read", label: language === "am" ? "የተነበቡ" : "Read" }
                ].map((filterType) => (
                  <button
                    key={filterType.key}
                    onClick={() => setFilter(filterType.key)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === filterType.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {filterType.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || markingAllAsRead}
                className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {markingAllAsRead ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheck />
                )}
                {language === "am" ? "ሁሉም እንደተነበቡ ምልክት አድርግ" : "Mark all as read"}
              </button>
              
              <button
                onClick={deleteAllRead}
                disabled={readCount === 0 || isDeleting}
                className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                {language === "am" ? "የተነበቡትን ሰርዝ" : "Delete all read"}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <FaBell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === "all" 
                  ? language === "am" ? "ምንም ማስታወቂያ የለም" : "No notifications found"
                  : filter === "unread"
                  ? language === "am" ? "ያልተነበቡ ማስታወቂያዎች የሉም" : "No unread notifications"
                  : language === "am" ? "የተነበቡ ማስታወቂያዎች የሉም" : "No read notifications"
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "am" 
                  ? "በዚህ ጊዜ ማስታወቂያዎች አልተደረሱም" 
                  : "No notifications have arrived yet"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
                  notification.seen 
                    ? "border-gray-200 dark:border-gray-700" 
                    : "border-blue-200 dark:border-blue-700"
                } p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-3 rounded-lg ${notification.seen ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
                      {getNotificationIcon(notification)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${notification.seen ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {getNotificationTypeText(notification)}
                        </h3>
                        {!notification.seen && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                            {language === "am" ? "አዲስ" : "New"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className={`mb-3 ${notification.seen ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setSelectedNotification(notification);
                          if (!notification.seen) {
                            markAsRead(notification._id);
                          }
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <FaEye className="text-xs" />
                        {language === "am" ? "ዝርዝር ይመልከቱ" : "View Details"}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(notification._id)}
                        disabled={isDeleting}
                        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                      >
                        <FaTrash className="text-xs" />
                        {language === "am" ? "ሰርዝ" : "Delete"}
                      </button>

                      {!notification.seen && (
                        <div className="ml-auto">
                          {markingAsRead === notification._id ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FaSpinner className="animate-spin" />
                              {language === "am" ? "በማዘጋጀት ላይ..." : "Processing..."}
                            </span>
                          ) : (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            >
                              <FaCheck className="text-xs" />
                              {language === "am" ? "እንደተነበበ ምልክት አድርግ" : "Mark as read"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div 
                className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                onClick={() => setSelectedNotification(null)}
              ></div>

              {/* Modal */}
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {getNotificationIcon(selectedNotification)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getNotificationTypeText(selectedNotification)}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {language === "am" ? "መልእክት" : "Message"}
                      </h4>
                      <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {selectedNotification.message}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "የተላከበት ቀን" : "Sent Date"}
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {selectedNotification.createdAt ? 
                            new Date(selectedNotification.createdAt).toLocaleDateString(language === "am" ? 'am-ET' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "ሁኔታ" : "Status"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            selectedNotification.seen 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {selectedNotification.seen 
                              ? (language === "am" ? "ተነትቧል" : "Read") 
                              : (language === "am" ? "አልተነበበም" : "Unread")
                            }
                          </span>
                          {!selectedNotification.seen && (
                            <button
                              onClick={() => {
                                markAsRead(selectedNotification._id);
                                setSelectedNotification({ ...selectedNotification, seen: true });
                              }}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {language === "am" ? "እንደተነበበ ምልክት አድርግ" : "Mark as read"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Show metadata if available */}
                    {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "ተጨማሪ ዝርዝሮች" : "Additional Details"}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                          <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {JSON.stringify(selectedNotification.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {language === "am" ? "ዝጋ" : "Close"}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedNotification._id);
                      setSelectedNotification(null);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors"
                  >
                    {language === "am" ? "ሰርዝ" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeNotifications;