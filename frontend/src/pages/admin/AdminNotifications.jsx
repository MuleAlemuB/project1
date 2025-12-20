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
  FaSave,
  FaCalendarCheck,
  FaCalendarTimes,
  FaUserTie,
  FaUniversity,
  FaCertificate,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileArchive,
  FaLink,
  FaUserCircle,
  FaIdCard,
  FaCalendarDay,
  FaStickyNote,
  FaExclamationTriangle
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

const formatSimpleDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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

const getFileIcon = (filename) => {
  if (!filename) return <FaFileAlt />;
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf': return <FaFilePdf className="text-red-500" />;
    case 'doc':
    case 'docx': return <FaFileWord className="text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return <FaFileImage className="text-green-500" />;
    case 'zip':
    case 'rar':
    case '7z': return <FaFileArchive className="text-yellow-500" />;
    default: return <FaFileAlt />;
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
    noComments: "No comments yet",
    cvFile: "CV File",
    leaveRequestBy: "Leave Request by",
    employeeDepartment: "Department",
    fromDate: "From Date",
    toDate: "To Date",
    totalDays: "Total Days",
    leaveReason: "Reason for Leave",
    viewAttachment: "View Attachment",
    submittedDate: "Submitted Date",
    requesterInfo: "Requester Information",
    requesterName: "Requester Name",
    requesterDepartment: "Department",
    positionTitle: "Position Title",
    educationLevel: "Education Level",
    quantityNeeded: "Quantity Needed",
    contractTerm: "Contract Term",
    genderRequirement: "Gender Requirement",
    experienceRequired: "Experience Required",
    requestDate: "Request Date",
    justification: "Justification",
    priorityLevel: "Priority Level",
    medium: "Medium",
    high: "High",
    low: "Low",
    attachmentFiles: "Attachment Files",
    viewDetails: "View Details",
    makeYourDecision: "Make Your Decision",
    acceptRequest: "Accept Request",
    rejectRequest: "Reject Request",
    optionalComment: "Optional Comment (for rejection)",
    writeComment: "Write your comment here...",
    submitDecision: "Submit Decision",
    vacancyInformation: "Vacancy Information",
    jobTitle: "Job Title",
    applicationId: "Application ID",
    leaveType: "Leave Type",
    annualLeave: "Annual Leave",
    supportingDocument: "Supporting document",
    anyGender: "Any",
    empId: "Employee ID",
    loadingDetails: "Loading details..."
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
    noComments: "እስካሁን አስተያየት የለም",
    cvFile: "የሪዝሜ ፋይል",
    leaveRequestBy: "የፈቃድ ጥያቄ በ",
    employeeDepartment: "ክፍል",
    fromDate: "ከቀን",
    toDate: "እስከ ቀን",
    totalDays: "አጠቃላይ ቀናት",
    leaveReason: "ለፈቃድ ምክንያት",
    viewAttachment: "መያዣ እይ",
    submittedDate: "የቀረበበት ቀን",
    requesterInfo: "የጠያቂ መረጃ",
    requesterName: "የጠያቂ ስም",
    requesterDepartment: "ክፍል",
    positionTitle: "የስራ መደብ",
    educationLevel: "የትምህርት ደረጃ",
    quantityNeeded: "የሚያስፈልገው ብዛት",
    contractTerm: "የስራ ጊዜ",
    genderRequirement: "የፆታ መስፈርት",
    experienceRequired: "የሚያስፈልገው ልምድ",
    requestDate: "የጥያቄ ቀን",
    justification: "ማብራሪያ",
    priorityLevel: "ቅድሚያ ደረጃ",
    medium: "መካከለኛ",
    high: "ከፍተኛ",
    low: "ዝቅተኛ",
    attachmentFiles: "የመያዣ ፋይሎች",
    viewDetails: "ዝርዝር እይ",
    makeYourDecision: "ውሳኔዎን ያድርጉ",
    acceptRequest: "ጥያቄ ተቀበል",
    rejectRequest: "ጥያቄ ተቀባ",
    optionalComment: "አማራጭ አስተያየት (ለመቀባት)",
    writeComment: "አስተያየትዎን እዚህ ይፃፉ...",
    submitDecision: "ውሳኔ አስገባ",
    vacancyInformation: "የስራ መረጃ",
    jobTitle: "የስራ ርዕስ",
    applicationId: "የማመልከቻ መታወቂያ",
    leaveType: "የፈቃድ አይነት",
    annualLeave: "ዓመታዊ ፈቃድ",
    supportingDocument: "የማገዝ ሰነድ",
    anyGender: "ማንኛውም",
    empId: "ሰራተኛ መታወቂያ",
    loadingDetails: "ዝርዝር እየጫነ ነው..."
  }
};

const AdminNotifications = () => {
  const { language, darkMode } = useSettings();
  const t = translations[language];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});
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
          timestamp: new Date(n.createdAt).getTime(),
          metadata: n.metadata ? (typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata) : {}
        }));
        
        setNotifications(merged);
        
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
      } else if (notif.type === "Vacancy Application") {
        endpoint = `/applications/${notif.reference}/status`;
        data = { status, adminComment: reason || undefined };
      } else {
        throw new Error("Invalid notification type for decision");
      }
      
      await axiosInstance.put(endpoint, data);
      
      setNotifications(prev =>
        prev.map(n =>
          n._id === notif._id ? { ...n, status: status.toLowerCase() } : n
        )
      );
      
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
      
      alert(t.decisionSuccess);
    } catch (error) {
      console.error("Error making decision:", error);
      alert(t.decisionError);
    } finally {
      setDecisionLoading(false);
    }
  };

  const toggleDetails = (notif) => {
    setDetailsOpen(prev => ({ ...prev, [notif._id]: !prev[notif._id] }));
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

  const renderVacancyDetails = (notif) => {
    const applicant = notif.applicant || notif.metadata?.applicant || {};
    const vacancy = notif.vacancy || notif.metadata?.vacancy || {};
    
    return (
      <div className="space-y-6">
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaUserCircle /> {t.applicantInformation}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.name}</p>
              <p className="font-medium">{applicant.name || notif.metadata?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.email}</p>
              <p className="font-medium">{applicant.email || notif.metadata?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.phone}</p>
              <p className="font-medium">{applicant.phone || notif.metadata?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.appliedAt}</p>
              <p className="font-medium">{formatSimpleDate(applicant.appliedAt || notif.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaBriefcase /> {t.vacancyInformation}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.jobTitle}</p>
              <p className="font-medium">{vacancy.title || notif.metadata?.vacancyTitle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.department}</p>
              <p className="font-medium">{vacancy.department || notif.metadata?.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.position}</p>
              <p className="font-medium">{vacancy.position || notif.metadata?.position || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.applicationId}</p>
              <p className="font-medium font-mono text-sm">{notif.reference || "N/A"}</p>
            </div>
          </div>
        </div>
        
        {(applicant.resume || notif.metadata?.resume) && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <FaFileAlt /> {t.cvFile}
            </h4>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
              <div className="flex items-center gap-3">
                {getFileIcon(applicant.resume || notif.metadata?.resume)}
                <div>
                  <p className="font-medium">
                    {applicant.resume?.split('/').pop() || notif.metadata?.resume?.split('/').pop() || "resume.pdf"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {applicant.resume ? "CV uploaded by applicant" : "CV attached"}
                  </p>
                </div>
              </div>
              <a
                href={fileUrl(applicant.resume || notif.metadata?.resume)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaDownload /> {t.downloadCV}
              </a>
            </div>
          </div>
        )}
        
        {notif.status === "pending" && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {t.makeYourDecision}
            </h4>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <FaCommentAlt className="inline mr-2" /> {t.optionalComment}
                </label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={t.writeComment}
                  rows="3"
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
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
                  <FaThumbsUp /> {t.acceptRequest}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDecisionModal({ id: notif._id, action: 'reject' })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300"
                >
                  <FaThumbsDown /> {t.rejectRequest}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLeaveDetails = (notif) => {
    const leave = notif.leaveRequestId || notif.metadata || {};
    const employee = leave.employeeId || leave.employee || {};
    
    return (
      <div className="space-y-6">
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaUserTie /> {t.leaveRequestBy}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.name}</p>
              <p className="font-medium">{employee.name || leave.employeeName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.employeeDepartment}</p>
              <p className="font-medium">{employee.department || leave.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.empId}</p>
              <p className="font-medium">{employee.empId || leave.empId || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.submittedDate}</p>
              <p className="font-medium">{formatSimpleDate(leave.createdAt || notif.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaCalendarCheck /> {t.leaveRequestDetails}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.fromDate}</p>
              <p className="font-medium">{formatSimpleDate(leave.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.toDate}</p>
              <p className="font-medium">{formatSimpleDate(leave.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.totalDays}</p>
              <p className="font-medium">{calculateDays(leave.startDate, leave.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.leaveType}</p>
              <p className="font-medium">{leave.leaveType || t.annualLeave}</p>
            </div>
          </div>
        </div>
        
        {leave.reason && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <FaStickyNote /> {t.leaveReason}
            </h4>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <p className="whitespace-pre-wrap">{leave.reason}</p>
            </div>
          </div>
        )}
        
        {(leave.attachments && leave.attachments.length > 0) && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <FaPaperclip /> {t.attachments}
            </h4>
            <div className="space-y-2">
              {leave.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    {getFileIcon(attachment)}
                    <div>
                      <p className="font-medium">{attachment.split('/').pop()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.supportingDocument}</p>
                    </div>
                  </div>
                  <a
                    href={fileUrl(attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaDownload /> {t.downloadAttachment}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {notif.status === "pending" && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {t.makeYourDecision}
            </h4>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <FaCommentAlt className="inline mr-2" /> {t.optionalComment}
                </label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={t.writeComment}
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
                  <FaThumbsUp /> {t.acceptRequest}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDecisionModal({ id: notif._id, action: 'reject' })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300"
                >
                  <FaThumbsDown /> {t.rejectRequest}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRequisitionDetails = (notif) => {
    const requisition = notif.metadata || {};
    const requester = requisition.requester || {};
    
    return (
      <div className="space-y-6">
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaUserTie /> {t.requesterInfo}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.requesterName}</p>
              <p className="font-medium">{requester.name || requisition.requesterName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.requesterDepartment}</p>
              <p className="font-medium">{requester.department || requisition.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.email}</p>
              <p className="font-medium">{requester.email || requisition.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.submittedDate}</p>
              <p className="font-medium">{formatSimpleDate(requisition.requestDate || notif.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <FaBriefcase /> {t.requisitionDetails}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.positionTitle}</p>
              <p className="font-medium">{requisition.position || requisition.positionTitle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.department}</p>
              <p className="font-medium">{requisition.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.educationLevel}</p>
              <p className="font-medium">{requisition.educationLevel || requisition.education || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.quantityNeeded}</p>
              <p className="font-medium">{requisition.quantity || requisition.quantityNeeded || "1"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.contractTerm}</p>
              <p className="font-medium">{requisition.termOfEmployment || requisition.contractTerm || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.genderRequirement}</p>
              <p className="font-medium">{requisition.sex || requisition.gender || t.anyGender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.experienceRequired}</p>
              <p className="font-medium">{requisition.experience || requisition.experienceRequired || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.requestDate}</p>
              <p className="font-medium">{formatSimpleDate(requisition.requestDate || requisition.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.priorityLevel}</p>
              <p className="font-medium capitalize">{requisition.priority || requisition.priorityLevel || "medium"}</p>
            </div>
          </div>
        </div>
        
        {requisition.justification && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <FaStickyNote /> {t.justification}
            </h4>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <p className="whitespace-pre-wrap">{requisition.justification}</p>
            </div>
          </div>
        )}
        
        {(requisition.attachments && requisition.attachments.length > 0) && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <FaPaperclip /> {t.attachmentFiles}
            </h4>
            <div className="space-y-2">
              {requisition.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    {getFileIcon(attachment)}
                    <div>
                      <p className="font-medium">{attachment.split('/').pop()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t.supportingDocument}</p>
                    </div>
                  </div>
                  <a
                    href={fileUrl(attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaDownload /> {t.downloadAttachment}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {notif.status === "pending" && (
          <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h4 className={`font-semibold mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {t.makeYourDecision}
            </h4>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <FaCommentAlt className="inline mr-2" /> {t.optionalComment}
                </label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={t.writeComment}
                  rows="3"
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
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
                  <FaThumbsUp /> {t.acceptRequest}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDecisionModal({ id: notif._id, action: 'reject' })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-300"
                >
                  <FaThumbsDown /> {t.rejectRequest}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGeneralDetails = (notif) => {
    return (
      <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          <FaInfoCircle /> {t.additionalInfo}
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
    );
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
                      <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {t.notificationDetails}
                      </h3>
                      
                      {notif.type === "Vacancy Application" && renderVacancyDetails(notif)}
                      {notif.type === "Leave" && renderLeaveDetails(notif)}
                      {notif.type === "Requisition" && renderRequisitionDetails(notif)}
                      {!["Vacancy Application", "Leave", "Requisition"].includes(notif.type) && renderGeneralDetails(notif)}
                      
                      {(localComments[notif._id] || []).length > 0 && (
                        <div className={`p-5 rounded-xl mt-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

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