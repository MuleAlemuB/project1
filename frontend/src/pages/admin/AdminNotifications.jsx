import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaBell,
  FaTrash,
  FaCheck,
  FaInfoCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaClock,
  FaFileAlt,
  FaBriefcase,
  FaBuilding,
  FaGraduationCap,
  FaUsers,
  FaCalendarAlt,
  FaVenusMars,
  FaHistory,
  FaPaperclip,
  FaExternalLinkAlt,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCommentAlt,
  FaSave
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------- Helper Functions ----------
const fileUrl = (path) =>
  path ? `${API_BASE}/${path.replace(/\\/g, "/")}` : "#";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : "-";

const calculateDays = (start, end) => {
  if (!start || !end) return "-";
  const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 3600 * 24)) + 1;
  return `${days} day${days !== 1 ? 's' : ''}`;
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Vacancy Application': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Leave': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Requisition': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Vacancy Application': return <FaUser className="inline mr-2" />;
    case 'Leave': return <FaCalendar className="inline mr-2" />;
    case 'Requisition': return <FaBriefcase className="inline mr-2" />;
    default: return <FaBell className="inline mr-2" />;
  }
};

// ---------- Translations ----------
const translations = {
  en: {
    adminNotifications: "Admin Notifications Center",
    loading: "Loading notifications...",
    type: "Type",
    status: "Status",
    actions: "Actions",
    clearAll: "Clear All Read",
    markAllAsRead: "Mark All as Read",
    filterBy: "Filter by",
    sortBy: "Sort by",
    search: "Search notifications...",
    noNotifications: "No notifications available",
    new: "New",
    read: "Read",
    applicantInformation: "Applicant Information",
    name: "Name",
    email: "Email",
    phone: "Phone",
    appliedAt: "Applied At",
    downloadCV: "Download CV",
    viewCV: "View CV",
    leaveRequestDetails: "Leave Request Details",
    employee: "Employee",
    start: "Start Date",
    end: "End Date",
    duration: "Duration",
    reason: "Reason",
    attachments: "Attachments",
    downloadAttachment: "Download Attachment",
    requisitionDetails: "Requisition Details",
    position: "Position",
    department: "Department",
    education: "Education Level",
    quantity: "Quantity Needed",
    term: "Contract Term",
    sex: "Gender Requirement",
    experience: "Experience Required",
    date: "Request Date",
    justification: "Justification",
    priority: "Priority Level",
    view: "View Details",
    hide: "Hide Details",
    seen: "Mark as Read",
    delete: "Delete",
    accept: "Accept",
    reject: "Reject",
    decision: "Decision",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    all: "All",
    vacancy: "Vacancy Applications",
    leave: "Leave Requests",
    requisition: "Requisitions",
    recent: "Most Recent",
    oldest: "Oldest",
    statusOrder: "By Status",
    showAll: "Show All Information",
    collapseAll: "Collapse All",
    downloadAll: "Download All Attachments",
    notificationDetails: "Notification Details",
    time: "Time Received",
    referenceId: "Reference ID",
    additionalInfo: "Additional Information",
    makeDecision: "Make Decision",
    confirmAccept: "Confirm Acceptance",
    confirmReject: "Confirm Rejection",
    confirmDelete: "Confirm Deletion",
    cancel: "Cancel",
    confirm: "Confirm",
    days: "days",
    attachmentsCount: "attachments",
    viewFile: "View File",
    openInNewTab: "Open in New Tab",
    reasonForDecision: "Reason for Decision (Optional)",
    reasonPlaceholder: "Enter reason for your decision (optional)...",
    submitDecision: "Submit Decision",
    decisionSuccess: "Decision submitted successfully",
    decisionError: "Failed to submit decision",
    adminComment: "Admin Comment",
    noComments: "No comments yet"
  },
  am: {
    adminNotifications: "የአስተዳደር ማሳወቂያ ማዕከል",
    loading: "ማሳወቂያዎች እየጫኑ ነው...",
    type: "አይነት",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    clearAll: "ሁሉንም የተነበቡ አጽዳ",
    markAllAsRead: "ሁሉንም እንደተነበቡ ምልክት አድርግ",
    filterBy: "አጣራ",
    sortBy: "ደርድር",
    search: "ማሳወቂያዎችን ፈልግ...",
    noNotifications: "ምንም ማሳወቂያ የለም",
    new: "አዲስ",
    read: "የተነበበ",
    applicantInformation: "የማመልከቻ መረጃ",
    name: "ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    appliedAt: "የተመለሰበት ቀን",
    downloadCV: "CV አውርድ",
    viewCV: "CV እይ",
    leaveRequestDetails: "የፈቃድ ጥያቄ ዝርዝሮች",
    employee: "ሰራተኛ",
    start: "የመጀመሪያ ቀን",
    end: "የመጨረሻ ቀን",
    duration: "ቆይታ",
    reason: "ምክንያት",
    attachments: "መያዣዎች",
    downloadAttachment: "መያዣ አውርድ",
    requisitionDetails: "የጥያቄ ዝርዝሮች",
    position: "ስራ ቦታ",
    department: "ክፍል",
    education: "የትምህርት ደረጃ",
    quantity: "የሚያስፈልገው ብዛት",
    term: "የስራ ጊዜ",
    sex: "የፆታ መስፈርት",
    experience: "የሚያስፈልገው ልምድ",
    date: "የጥያቄ ቀን",
    justification: "ማብራሪያ",
    priority: "ቅድሚያ ደረጃ",
    view: "ዝርዝሮችን እይ",
    hide: "ዝርዝሮችን ደብቅ",
    seen: "እንደተነበበ ምልክት አድርግ",
    delete: "ሰርዝ",
    accept: "ተቀበል",
    reject: "ተቀባ",
    decision: "ውሳኔ",
    pending: "በጥበቃ ላይ",
    approved: "የተፈቀደ",
    rejected: "የተቀባ",
    all: "ሁሉም",
    vacancy: "የስራ ማመልከቻዎች",
    leave: "የፈቃድ ጥያቄዎች",
    requisition: "የጥያቄዎች",
    recent: "አዲስ የተደረጉ",
    oldest: "የድሮ የተደረጉ",
    statusOrder: "በሁኔታ",
    showAll: "ሁሉንም መረጃ አሳይ",
    collapseAll: "ሁሉንም ደብቅ",
    downloadAll: "ሁሉንም መያዣዎች አውርድ",
    notificationDetails: "የማሳወቂያ ዝርዝሮች",
    time: "የተቀበለው ጊዜ",
    referenceId: "የማጣቀሻ መታወቂያ",
    additionalInfo: "ተጨማሪ መረጃ",
    makeDecision: "ውሳኔ ስጥ",
    confirmAccept: "መቀበልን አረጋግጥ",
    confirmReject: "መቀባትን አረጋግጥ",
    confirmDelete: "ማስወገድን አረጋግጥ",
    cancel: "ተወ",
    confirm: "አረጋግጥ",
    days: "ቀናት",
    attachmentsCount: "መያዣዎች",
    viewFile: "ፋይል እይ",
    openInNewTab: "በአዲስ ትር ክፈት",
    reasonForDecision: "ለውሳኔ ምክንያት (አማራጭ)",
    reasonPlaceholder: "ለውሳኔዎ ምክንያት ያስገቡ (አማራጭ)...",
    submitDecision: "ውሳኔ አስገባ",
    decisionSuccess: "ውሳኔ በተሳካ ሁኔታ ቀርቧል",
    decisionError: "ውሳኔ መላክ አልተሳካም",
    adminComment: "የአስተዳደር አስተያየት",
    noComments: "እስካሁን አስተያየት የለም"
  }
};

const AdminNotifications = () => {
  const { language, darkMode } = useSettings();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [requisitionDetails, setRequisitionDetails] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [localComments, setLocalComments] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications/my");
        const seenState = JSON.parse(localStorage.getItem("notifSeen") || "{}");
        
        const merged = res.data.map((n) => ({
          ...n,
          seen: seenState[n._id] ?? n.seen,
          status: n.status?.toLowerCase(),
          timestamp: new Date(n.createdAt).getTime()
        }));
        
        setNotifications(merged);
        
        // Initialize local comments from localStorage
        const savedComments = JSON.parse(localStorage.getItem("notificationComments") || "{}");
        setLocalComments(savedComments);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const seenState = {};
    notifications.forEach((n) => (seenState[n._id] = n.seen));
    localStorage.setItem("notifSeen", JSON.stringify(seenState));
  }, [notifications]);

  // Filter and sort notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesStatus = filterStatus === "all" || notif.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      notif.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notif.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notif.leaveRequestId?.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.timestamp - a.timestamp;
      case "oldest":
        return a.timestamp - b.timestamp;
      case "status":
        return a.status?.localeCompare(b.status);
      default:
        return b.timestamp - a.timestamp;
    }
  });

  // Action handlers
  const markAsSeen = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/seen`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, seen: true } : n));
    } catch (error) {
      console.error("Error marking as seen:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllRead = async () => {
    const readIds = notifications.filter(n => n.seen).map(n => n._id);
    try {
      await Promise.all(readIds.map(id => axiosInstance.delete(`/notifications/${id}`)));
      setNotifications(prev => prev.filter(n => !n.seen));
    } catch (error) {
      console.error("Error clearing read notifications:", error);
    }
  };

  const handleDecision = async (notif, status, reason) => {
    setDecisionLoading(true);
    try {
      let endpoint, data;
      
      if (notif.type === "Leave") {
        endpoint = `/leaves/${notif.leaveRequestId?._id || notif.reference}/status`;
        data = { status, adminComment: reason || undefined };
      } else if (notif.type === "Requisition") {
        endpoint = `/requisitions/${notif.reference}/status`;
        data = { status, adminComment: reason || undefined };
      } else {
        throw new Error("Invalid notification type for decision");
      }
      
      await axiosInstance.put(endpoint, data);
      
      // Update notification status
      setNotifications(prev =>
        prev.map(n =>
          n._id === notif._id ? { ...n, status: status.toLowerCase() } : n
        )
      );
      
      // Save comment locally
      if (reason && reason.trim()) {
        const newComment = {
          text: reason.trim(),
          type: 'admin',
          status: status,
          createdAt: new Date().toISOString()
        };
        
        const updatedComments = {
          ...localComments,
          [notif._id]: [...(localComments[notif._id] || []), newComment]
        };
        
        setLocalComments(updatedComments);
        localStorage.setItem("notificationComments", JSON.stringify(updatedComments));
      }
      
      setShowDecisionModal(null);
      setDecisionReason("");
      
      // Show success message
      alert(t.decisionSuccess);
    } catch (error) {
      console.error("Error making decision:", error);
      alert(t.decisionError);
    } finally {
      setDecisionLoading(false);
    }
  };

  const toggleDetails = async (notif) => {
    setDetailsOpen(prev => ({ ...prev, [notif._id]: !prev[notif._id] }));

    // Only fetch requisition details if not already loaded and it's a requisition
    if (notif.type === "Requisition" && notif.reference && !requisitionDetails[notif._id]) {
      try {
        // Try different endpoints based on what might be available
        const endpoints = [
          `/requisitions/${notif.reference}`,
          `/api/requisitions/${notif.reference}`,
          `/requisitions/${notif.reference}/details`
        ];
        
        let success = false;
        for (const endpoint of endpoints) {
          try {
            const res = await axiosInstance.get(endpoint);
            setRequisitionDetails(prev => ({ ...prev, [notif._id]: res.data }));
            success = true;
            break;
          } catch (err) {
            continue; // Try next endpoint
          }
        }
        
        if (!success) {
          console.warn("Could not fetch requisition details from any endpoint");
          // Set empty data to avoid repeated attempts
          setRequisitionDetails(prev => ({ ...prev, [notif._id]: {} }));
        }
      } catch (error) {
        console.warn("Error fetching requisition details:", error.message);
        // Set empty data to avoid repeated attempts
        setRequisitionDetails(prev => ({ ...prev, [notif._id]: {} }));
      }
    }
  };

  const toggleAllDetails = (expand) => {
    if (expand) {
      const newState = {};
      sortedNotifications.forEach(n => { newState[n._id] = true; });
      setDetailsOpen(newState);
    } else {
      setDetailsOpen({});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2 flex items-center gap-3">
              <FaBell className="text-purple-600 dark:text-purple-400" />
              {t.adminNotifications}
            </h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {sortedNotifications.length} {language === 'am' ? 'ማሳወቂያዎች' : 'notifications'} •{" "}
              {sortedNotifications.filter(n => !n.seen).length} {t.new}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-white" 
                  : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              <FaCheck className="inline mr-2" /> {t.markAllAsRead}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllRead}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-white" 
                  : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              <FaTrash className="inline mr-2" /> {t.clearAll}
            </motion.button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-2xl shadow-lg p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                      : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaSearch className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <option value="all">{t.filterBy}: {t.type}</option>
                <option value="Vacancy Application">{t.vacancy}</option>
                <option value="Leave">{t.leave}</option>
                <option value="Requisition">{t.requisition}</option>
              </select>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-white" 
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                }`}
              >
                <option value="all">{t.filterBy}: {t.status}</option>
                <option value="pending">{t.pending}</option>
                <option value="approved">{t.approved}</option>
                <option value="rejected">{t.rejected}</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {t.sortBy}:
              </span>
              <div className="flex gap-2">
                {["recent", "oldest", "status"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      sortBy === option
                        ? "bg-purple-600 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t[option]}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAllDetails(true)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-white" 
                    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <FaEye className="inline mr-2" /> {t.showAll}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAllDetails(false)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-white" 
                    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                <FaEyeSlash className="inline mr-2" /> {t.collapseAll}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {sortedNotifications.length === 0 ? (
          <div className={`text-center p-12 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-6xl mb-4 text-gray-400">📭</div>
            <h3 className="text-xl font-semibold mb-2">{t.noNotifications}</h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? "Try adjusting your filters"
                : "All caught up! Check back later for new notifications"}
            </p>
          </div>
        ) : (
          sortedNotifications.map((notif) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                notif.seen
                  ? darkMode 
                    ? "bg-gray-800/50" 
                    : "bg-white/80"
                  : darkMode
                  ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-l-4 border-purple-500"
                  : "bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500"
              }`}
            >
              {/* Notification Header */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(notif.type)}`}>
                        {getTypeIcon(notif.type)}
                        {notif.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(notif.status)}`}>
                        {notif.status?.toUpperCase() || t.pending}
                      </span>
                      {!notif.seen && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          {t.new}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                      {notif.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <FaClock /> {formatDate(notif.createdAt)}
                      </span>
                      {notif.reference && (
                        <span className={`flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          <FaFileAlt /> {t.referenceId}: {notif.reference.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDetails(notif)}
                      className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-700 hover:bg-gray-600 text-white" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      {detailsOpen[notif._id] ? (
                        <>
                          <FaEyeSlash /> {t.hide}
                        </>
                      ) : (
                        <>
                          <FaInfoCircle /> {t.view}
                        </>
                      )}
                    </motion.button>
                    
                    {!notif.seen && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsSeen(notif._id)}
                        className="px-4 py-2 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all duration-300"
                      >
                        <FaCheck /> {t.seen}
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteConfirm(notif._id)}
                      className="px-4 py-2 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-all duration-300"
                    >
                      <FaTrash /> {t.delete}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <AnimatePresence>
                {detailsOpen[notif._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`overflow-hidden border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                      <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {t.notificationDetails}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - General Info */}
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h4 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              <FaBell /> {t.additionalInfo}
                            </h4>
                            <div className="space-y-2">
                              <p><b>{t.type}:</b> {notif.type}</p>
                              <p><b>{t.status}:</b> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(notif.status)}`}>
                                {notif.status?.toUpperCase() || t.pending}
                              </span></p>
                              <p><b>{t.time}:</b> {formatDate(notif.createdAt)}</p>
                              {notif.reference && (
                                <p><b>{t.referenceId}:</b> {notif.reference}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Local Comments Section (No API calls) */}
                          {(localComments[notif._id] || []).length > 0 && (
                            <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                              <h4 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <FaCommentAlt /> {t.adminComment}
                              </h4>
                              <div className="space-y-3 max-h-48 overflow-y-auto">
                                {localComments[notif._id].map((comment, idx) => (
                                  <div key={idx} className={`p-3 rounded-lg ${
                                    comment.type === 'admin' 
                                      ? darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                                      : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}>
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium text-sm">
                                        {comment.type === 'admin' ? t.adminComment : 'User'}
                                      </span>
                                      <span className="text-xs opacity-75">
                                        {formatDate(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                    {comment.status && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                                        comment.status === 'approved' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                      }`}>
                                        {comment.status.toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Right Column - Specific Details and Decision */}
                        <div className="space-y-4">
                          {/* Decision Action Section */}
                          {(notif.type === "Leave" || notif.type === "Requisition") &&
                            notif.status === "pending" && (
                            <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                              <h4 className={`font-semibold mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {t.makeDecision}
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    <FaCommentAlt className="inline mr-2" /> {t.reasonForDecision}
                                  </label>
                                  <textarea
                                    value={decisionReason}
                                    onChange={(e) => setDecisionReason(e.target.value)}
                                    placeholder={t.reasonPlaceholder}
                                    rows="3"
                                    className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                                      darkMode 
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                                    }`}
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDecisionModal({ id: notif._id, action: 'accept' })}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300"
                                  >
                                    <FaThumbsUp /> {t.accept}
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDecisionModal({ id: notif._id, action: 'reject' })}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300"
                                  >
                                    <FaThumbsDown /> {t.reject}
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Display existing comments if any */}
                          {notif.adminComment && (
                            <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                              <h4 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <FaCommentAlt /> {t.adminComment}
                              </h4>
                              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                <p className="text-sm">{notif.adminComment}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-2xl p-6 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">{t.confirmDelete}</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {language === 'am' ? 'ይህን ማሳወቂያ ለማስወገድ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this notification?'}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => deleteNotification(showDeleteConfirm)}
                  className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {showDecisionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-2xl p-6 max-w-md w-full ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${
                showDecisionModal.action === 'accept' ? 'text-green-600' : 'text-red-600'
              }`}>
                {showDecisionModal.action === 'accept' ? t.confirmAccept : t.confirmReject}
              </h3>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {decisionReason ? (
                  language === 'am' 
                    ? showDecisionModal.action === 'accept'
                      ? `ይህን ጥያቄ በዚህ ምክንያት ለመቀበል እርግጠኛ ነዎት: "${decisionReason}"`
                      : `ይህን ጥያቄ በዚህ ምክንያት ለመቀባት እርግጠኛ ነዎት: "${decisionReason}"`
                    : showDecisionModal.action === 'accept'
                    ? `Are you sure you want to accept this request with the reason: "${decisionReason}"?`
                    : `Are you sure you want to reject this request with the reason: "${decisionReason}"?`
                ) : (
                  language === 'am'
                    ? showDecisionModal.action === 'accept'
                      ? 'ይህን ጥያቄ ምንም ምክንያት ሳይጠቀሱ ለመቀበል እርግጠኛ ነዎት?'
                      : 'ይህን ጥያቄ ምንም ምክንያት ሳይጠቀሱ ለመቀባት እርግጠኛ ነዎት?'
                    : showDecisionModal.action === 'accept'
                    ? 'Are you sure you want to accept this request without providing a reason?'
                    : 'Are you sure you want to reject this request without providing a reason?'
                )}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDecisionModal(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    const notif = notifications.find(n => n._id === showDecisionModal.id);
                    if (notif) {
                      handleDecision(notif, showDecisionModal.action === 'accept' ? 'approved' : 'rejected', decisionReason);
                    }
                  }}
                  disabled={decisionLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 ${
                    decisionLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : showDecisionModal.action === 'accept'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {decisionLoading ? 'Processing...' : (showDecisionModal.action === 'accept' ? t.accept : t.reject)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotifications;