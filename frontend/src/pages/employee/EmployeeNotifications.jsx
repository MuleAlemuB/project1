// src/pages/employee/EmployeeNotifications.jsx (UPDATED VERSION)
import React, { useEffect, useState } from "react";
import { 
  FaBell, 
  FaTrash, 
  FaEye, 
  FaTimes,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEnvelope,
  FaInfoCircle
} from "react-icons/fa";

import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext"; // Added import

const EmployeeNotifications = () => {
  const { language, darkMode } = useSettings();
  const { user } = useAuth(); // Get current user
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, [language, user]); // Added user dependency

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/notifications/my");
      
      // TEMPORARY FIX: Additional client-side filtering as safety measure
      const filteredData = data.filter(notification => {
        // If notification has specific employee info, check if it's for current user
        if (notification.employee && notification.employee.email && user?.email) {
          return notification.employee.email.toLowerCase() === user.email.toLowerCase();
        }
        
        // If no specific employee attached, assume it's for all employees
        return notification.recipientRole === "Employee";
      });
      
      // Sort by date, newest first
      const sorted = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
      
      // Debug: Log what we received
      console.log("📨 Employee Notifications Debug:");
      console.log("Current User Email:", user?.email);
      console.log("Total notifications from backend:", data.length);
      console.log("Filtered notifications for employee:", filteredData.length);
      data.forEach((notif, index) => {
        console.log(`Notification ${index}:`, {
          id: notif._id,
          message: notif.message,
          recipientRole: notif.recipientRole,
          employeeEmail: notif.employee?.email,
          isForCurrentUser: notif.employee?.email?.toLowerCase() === user?.email?.toLowerCase()
        });
      });
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
  };

  // Mark as read - FIXED: Use correct endpoint
  const markAsRead = async (id) => {
    try {
      // Try PATCH first, then PUT if PATCH fails
      const response = await axiosInstance.patch(`/notifications/${id}/read`);
      // Alternative: await axiosInstance.put(`/notifications/${id}/read`);
      
      console.log("Mark as read response:", response.data);
      
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, seen: true } : n)
      );
      toast.success(
        language === "am" 
          ? "ማስታወቂያ እንደተነበበ ምልክት ተደርጓል" 
          : "Notification marked as read"
      );
    } catch (error) {
      console.error("Error marking as read:", error.response?.data || error.message);
      
      // If the endpoint doesn't exist, try a different approach
      if (error.response?.status === 404) {
        toast.warning(
          language === "am" 
            ? "የማስታወቂያ ማድረጊያ መንገድ አልተገኘም" 
            : "Mark as read endpoint not found"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ማስታወቂያ ማንበብ ምልክት ማድረግ አልተሳካም" 
            : "Failed to mark notification as read"
        );
      }
    }
  };

  // Mark all as read - Check if this endpoint exists
  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.patch("/notifications/read/all");
      console.log("Mark all as read response:", response.data);
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, seen: true }))
      );
      toast.success(
        language === "am" 
          ? "ሁሉም ማስታወቂያዎች እንደተነበቡ ምልክት ተደርጓል" 
          : "All notifications marked as read"
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      
      // If endpoint doesn't exist, do it client-side
      if (error.response?.status === 404) {
        toast.warning(
          language === "am" 
            ? "የአጠቃላይ ማስታወቂያ መንገድ አልተገኘም" 
            : "Bulk mark as read endpoint not found"
        );
        // Fallback: mark all as read locally
        setNotifications(prev => 
          prev.map(n => ({ ...n, seen: true }))
        );
        toast.success(
          language === "am" 
            ? "ሁሉም ማስታወቂያዎች አግምተዋል (አይነተኛ)" 
            : "All notifications marked locally"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ማስታወቂያዎች ማንበብ ምልክት ማድረግ አልተሳካም" 
            : "Failed to mark notifications as read"
        );
      }
    }
  };

  // Delete notification - FIXED
  const handleDelete = async (id) => {
    if (!window.confirm(
      language === "am" 
        ? "ይህን ማስታወቂያ መሰረዝ እንደምትፈልጉ ይረጋገጡ?" 
        : "Are you sure you want to delete this notification?"
    )) return;

    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/notifications/${id}`);
      console.log("Delete response:", response.data);
      
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success(
        language === "am" 
          ? "ማስታወቂያ ተሰርዟል" 
          : "Notification deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting notification:", error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        toast.error(
          language === "am" 
            ? "ይህን ማስታወቂያ ለመሰረዝ ፈቃድ የለዎትም" 
            : "You don't have permission to delete this notification"
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

  // Delete all read notifications - Check if this endpoint exists
  const deleteAllRead = async () => {
    if (!window.confirm(
      language === "am" 
        ? "ሁሉንም የተነበቡ ማስታወቂያዎች መሰረዝ እንደምትፈልጉ ይረጋገጡ?" 
        : "Are you sure you want to delete all read notifications?"
    )) return;

    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete("/notifications/read/all");
      console.log("Delete all read response:", response.data);
      
      setNotifications(prev => prev.filter(n => !n.seen));
      toast.success(
        language === "am" 
          ? "ሁሉም የተነበቡ ማስታወቂያዎች ተሰርዘዋል" 
          : "All read notifications deleted"
      );
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      
      // If endpoint doesn't exist, do it client-side
      if (error.response?.status === 404) {
        toast.warning(
          language === "am" 
            ? "የአጠቃላይ ማስረጃ መንገድ አልተገኘም" 
            : "Bulk delete endpoint not found"
        );
        // Fallback: delete all read notifications locally
        setNotifications(prev => prev.filter(n => !n.seen));
        toast.success(
          language === "am" 
            ? "የተነበቡት ማስታወቂያዎች አግምተዋል (አይነተኛ)" 
            : "Read notifications cleared locally"
        );
      } else {
        toast.error(
          language === "am" 
            ? "ማስታወቂያዎችን ማሰረዝ አልተሳካም" 
            : "Failed to delete notifications"
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

  // Get notification icon based on type and status
  const getNotificationIcon = (notification) => {
    if (notification.type === "Leave") {
      switch (notification.status) {
        case "approved":
          return <FaCheckCircle className="text-green-500" />;
        case "rejected":
          return <FaTimesCircle className="text-red-500" />;
        default:
          return <FaClock className="text-yellow-500" />;
      }
    }
    return <FaBell className="text-blue-500" />;
  };

  // Get notification type text
  const getNotificationTypeText = (type, status) => {
    if (language === "am") {
      if (type === "Leave") {
        switch (status) {
          case "approved": return "የተፈቀደ እረፍት";
          case "rejected": return "የተቀበለ እረፍት";
          default: return "የእረፍት ጥያቄ";
        }
      }
      return type || "ማስታወቂያ";
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
      if (diffMins < 60) return `${diffMins} ደቂቃ በፊት`;
      if (diffHours < 24) return `${diffHours} ሰዓት በፊት`;
      if (diffDays === 1) return "ትላንት";
      if (diffDays < 7) return `${diffDays} ቀን በፊት`;
      return date.toLocaleDateString('am-ET', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      

      {/* Main Content */}
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
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} {language === "am" ? "ያልተነበቡ" : "unread"} / {totalCount} {language === "am" ? "በጠቅላላ" : "total"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === "am" ? "ማጣሪያ" : "Filter"}:
              </span>
              <div className="flex gap-2">
                {["all", "unread", "read"].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      filter === filterType
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {language === "am" 
                      ? filterType === "all" ? "ሁሉም" 
                        : filterType === "unread" ? "ያልተነበቡ" 
                        : "የተነበቡ"
                      : filterType.charAt(0).toUpperCase() + filterType.slice(1)
                    }
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === "am" ? "ሁሉም እንደተነበቡ ምልክት አድርግ" : "Mark all as read"}
              </button>
              
              <button
                onClick={deleteAllRead}
                disabled={notifications.filter(n => n.seen).length === 0 || isDeleting}
                className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaTrash className="text-xs" />
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
                {language === "am" ? "ምንም ማስታወቂያ የለም" : "No notifications found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "am" 
                  ? "በዚህ ጊዜ ምንም ማስታወቂያ የለም" 
                  : "You don't have any notifications at this time"}
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
                    <div className={`p-2 rounded-lg ${notification.seen ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
                      {getNotificationIcon(notification)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${notification.seen ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {getNotificationTypeText(notification.type, notification.status)}
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

                    {notification.leaveRequestId && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          <FaCalendarAlt />
                          {language === "am" ? "የእረፍት ጥያቄ" : "Leave Request"}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
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
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
                        >
                          {language === "am" ? "እንደተነበበ ምልክት አድርግ" : "Mark as read"}
                        </button>
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
                      {getNotificationIcon(selectedNotification)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === "am" ? "የማስታወቂያ ዝርዝር" : "Notification Details"}
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
                      <p className="text-gray-900 dark:text-white">
                        {selectedNotification.message}
                      </p>
                    </div>

                    {selectedNotification.type && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "ዓይነት" : "Type"}
                        </h4>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {getNotificationTypeText(selectedNotification.type, selectedNotification.status)}
                          {selectedNotification.status && (
                            <span className="ml-1">({selectedNotification.status})</span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "የተላከበት ቀን" : "Sent Date"}
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleString() : "N/A"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "ሁኔታ" : "Status"}
                        </h4>
                        <p className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                          selectedNotification.seen 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {selectedNotification.seen 
                            ? (language === "am" ? "ተነትቧል" : "Read") 
                            : (language === "am" ? "አልተነበበም" : "Unread")
                          }
                        </p>
                      </div>
                    </div>

                    {selectedNotification.leaveRequestId && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          {language === "am" ? "የተያያዘ እረፍት ጥያቄ" : "Related Leave Request"}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {language === "am" 
                              ? "ይህ ማስታወቂያ በእረፍት ጥያቄዎ ላይ የተመሠረተ ነው" 
                              : "This notification is related to a leave request"}
                          </p>
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
                  {!selectedNotification.seen && (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification._id);
                        setSelectedNotification({ ...selectedNotification, seen: true });
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      {language === "am" ? "እንደተነበበ ምልክት አድርግ" : "Mark as read"}
                    </button>
                  )}
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