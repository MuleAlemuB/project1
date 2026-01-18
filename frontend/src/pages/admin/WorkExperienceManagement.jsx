import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import WorkExperienceDetailModal from "../../components/admin/WorkExperienceDetailModal";
import { useSettings } from "../../contexts/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEye, FaEdit, FaTrash, FaPlus, FaUsers, FaUserTie, FaTimes, 
  FaCheck, FaExclamationTriangle, FaDownload, FaUpload, FaFileAlt,
  FaClock, FaCheckCircle, FaTimesCircle, FaFilePdf, FaFilter,
  FaSearch, FaSync, FaFileExport, FaTrashAlt // Changed from FaBulkDelete to FaTrashAlt
} from "react-icons/fa";

// Translation objects
const translations = {
  en: {
    title: "Work Experience Management",
    subtitle: "Manage and process employee work experience requests",
    stats: {
      total: "Total Requests",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed"
    },
    status: {
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed"
    },
    table: {
      employee: "Employee",
      department: "Department",
      status: "Status",
      requestDate: "Request Date",
      actions: "Actions"
    },
    searchPlaceholder: "Search by name, email, department...",
    filterByStatus: "Filter by Status",
    filterByDate: "Filter by Date",
    empty: {
      title: "No requests found",
      message: "No work experience requests match your current filters.",
      action: "Clear all filters"
    },
    loading: "Loading work experience requests...",
    messages: {
      bulkApproveSuccess: "Requests approved successfully",
      bulkRejectSuccess: "Requests rejected successfully",
      bulkDeleteSuccess: "Requests deleted successfully",
      requestUpdated: "Request updated successfully",
      deleteSuccess: "Request deleted successfully",
      deleteConfirm: "Are you sure you want to delete this request? This action cannot be undone.",
      bulkDeleteConfirm: "Are you sure you want to delete {count} selected requests? This action cannot be undone.",
      fetchError: "Failed to load requests. Please try again.",
      actionError: "Failed to perform action. Please try again.",
      exportError: "Failed to export data.",
      letterGenerated: "Letter generated successfully",
      letterUploaded: "Letter uploaded successfully",
      downloadSuccess: "Letter downloaded successfully",
      downloadError: "Failed to download letter",
      deleteError: "Failed to delete request",
      tokenError: "No token, authorization denied. Please login again."
    },
    buttons: {
      refresh: "Refresh",
      export: "Export",
      filters: "Filters",
      view: "View",
      download: "Download",
      delete: "Delete",
      clearFilters: "Clear Filters",
      approve: "Approve",
      reject: "Reject",
      generateLetter: "Generate Letter",
      uploadLetter: "Upload Letter",
      bulkApprove: "Bulk Approve",
      bulkReject: "Bulk Reject",
      bulkDelete: "Bulk Delete",
      confirmDelete: "Yes, Delete",
      cancel: "Cancel"
    },
    filters: {
      allTime: "All Time",
      today: "Today",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days"
    },
    pagination: {
      showing: "Showing",
      to: "to",
      of: "of",
      results: "results"
    },
    itemsPerPage: "Items per page",
    bulkActions: "Bulk Actions",
    selectAll: "Select All",
    deselectAll: "Deselect All"
  },
  am: {
    title: "የስራ ልምድ አስተዳደር",
    subtitle: "የሰራተኞች የስራ ልምድ ጥያቄዎችን አስተዳድር እና አቀናብር",
    stats: {
      total: "ጠቅላላ ጥያቄዎች",
      pending: "በመጠባበቅ ላይ",
      approved: "የተጸድቀ",
      rejected: "የተቀቀለ",
      completed: "የተጠናቀቀ"
    },
    status: {
      all: "ሁሉም",
      pending: "በመጠባበቅ ላይ",
      approved: "የተጸድቀ",
      rejected: "የተቀቀለ",
      completed: "የተጠናቀቀ"
    },
    table: {
      employee: "ሰራተኛ",
      department: "ክፍል",
      status: "ሁኔታ",
      requestDate: "የጥያቄ ቀን",
      actions: "ድርጊቶች"
    },
    searchPlaceholder: "በስም፣ ኢሜል፣ ክፍል ፈልግ...",
    filterByStatus: "በሁኔታ አጣራ",
    filterByDate: "በቀን አጣራ",
    empty: {
      title: "ምንም ጥያቄ አልተገኘም",
      message: "ምንም የስራ ልምድ ጥያቄዎች ከአሁኑ ማጣሪያዎችዎ ጋር አይዛመዱም።",
      action: "ሁሉንም ማጣሪያዎች አጽዳ"
    },
    loading: "የስራ ልምድ ጥያቄዎች በመጫን ላይ...",
    messages: {
      bulkApproveSuccess: "ጥያቄዎቹ በተሳካ ሁኔታ ተፀድቀዋል",
      bulkRejectSuccess: "ጥያቄዎቹ በተሳካ ሁኔታ ተቀቅለዋል",
      bulkDeleteSuccess: "ጥያቄዎቹ በተሳካ ሁኔታ ተሰርዘዋል",
      requestUpdated: "ጥያቄው በተሳካ ሁኔታ ተዘምኗል",
      deleteSuccess: "ጥያቄው በተሳካ ሁኔታ ተሰርዟል",
      deleteConfirm: "ይህን ጥያቄ ለማጥፋት እርግጠኛ ነዎት? ይህ እርምጃ መመለስ አይችልም።",
      bulkDeleteConfirm: "{count} የተመረጡ ጥያቄዎችን ለማጥፋት እርግጠኛ ነዎት? ይህ እርምጃ መመለስ አይችልም።",
      fetchError: "ጥያቄዎችን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
      actionError: "እርምጃ ማከናወን አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
      exportError: "ውሂብ ማውጣት አልተቻለም።",
      letterGenerated: "ፅሁፉ በተሳካ ሁኔታ ተፈጥሯል",
      letterUploaded: "ፅሁፉ በተሳካ ሁኔታ ተጫኗል",
      downloadSuccess: "ፅሁፉ በተሳካ ሁኔታ ተወርውሯል",
      downloadError: "ፅሁፉን ማውረድ አልተቻለም",
      deleteError: "ጥያቄውን ማጥፋት አልተቻለም",
      tokenError: "ማረጋገጫ የለም፣ ፈቃድ ተቀቅሏል። እባክዎ እንደገና ይግቡ።"
    },
    buttons: {
      refresh: "አድስ",
      export: "ላክ",
      filters: "ማጣሪያዎች",
      view: "አሳይ",
      download: "አውርድ",
      delete: "ሰርዝ",
      clearFilters: "ማጣሪያዎችን አጽዳ",
      approve: "ይፀድቅ",
      reject: "ይቅር",
      generateLetter: "ፅሁፍ ፍጠር",
      uploadLetter: "ፅሁፍ ጫን",
      bulkApprove: "ብዛት አጸድቅ",
      bulkReject: "ብዛት አትቀበል",
      bulkDelete: "ብዛት ሰርዝ",
      confirmDelete: "አዎ፣ ሰርዝ",
      cancel: "ሰርዝ"
    },
    filters: {
      allTime: "ሁሉም ጊዜ",
      today: "ዛሬ",
      last7Days: "ያለፉት 7 ቀናት",
      last30Days: "ያለፉት 30 ቀናት"
    },
    pagination: {
      showing: "የሚታየው",
      to: "እስከ",
      of: "ከ",
      results: "ውጤቶች"
    },
    itemsPerPage: "በአንድ ገጽ ያሉ ንጥሎች",
    bulkActions: "የብዛት እርምጃዎች",
    selectAll: "ሁሉንም ምረጥ",
    deselectAll: "ሁሉንም አላስመልጥ"
  }
};

// Custom Notification Component
const Notification = ({ type, message, onClose, darkMode }) => {
  const bgColor = type === 'success' 
    ? (darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-500') 
    : type === 'error' 
    ? (darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-500') 
    : (darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-500');
  
  const textColor = darkMode ? 'text-gray-200' : 'text-white';
  const icon = type === 'success' ? <FaCheck /> : type === 'error' ? <FaExclamationTriangle /> : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-xl shadow-xl z-[100] flex items-center gap-3 min-w-[300px] ${darkMode ? 'border' : ''}`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className={`${textColor} hover:opacity-80`}>
        <FaTimes />
      </button>
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, label, darkMode }) => {
  const getColorClasses = (status, darkMode) => {
    switch (status) {
      case "pending":
        return darkMode ? "bg-yellow-900/30 text-yellow-300 border-yellow-700" : "bg-yellow-100 text-yellow-800";
      case "approved":
        return darkMode ? "bg-green-900/30 text-green-300 border-green-700" : "bg-green-100 text-green-800";
      case "rejected":
        return darkMode ? "bg-red-900/30 text-red-300 border-red-700" : "bg-red-100 text-red-800";
      case "completed":
        return darkMode ? "bg-blue-900/30 text-blue-300 border-blue-700" : "bg-blue-100 text-blue-800";
      default:
        return darkMode ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses(status, darkMode)}`}>
      {label}
    </span>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border transition-all duration-300 ${
          darkMode 
            ? 'border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
            : 'border-gray-300 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <FaTimes className="rotate-180" />
      </button>
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${
            currentPage === number
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : darkMode 
                ? "border border-gray-700 hover:bg-gray-800 text-gray-300"
                : "border border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border transition-all duration-300 ${
          darkMode 
            ? 'border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
            : 'border-gray-300 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, message, actionText, onAction, darkMode }) => {
  return (
    <div className="py-12 text-center">
      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
        darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
      }`}>
        <FaFileAlt className="text-2xl" />
      </div>
      <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`mb-6 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {message}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          <FaSearch />
          {actionText}
        </button>
      )}
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count, loading, darkMode, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`rounded-3xl shadow-2xl p-8 w-full max-w-md ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            darkMode ? 'bg-red-900/30' : 'bg-red-100'
          }`}>
            <FaExclamationTriangle className={`text-2xl ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {count > 1 
              ? t.messages.bulkDeleteConfirm.replace("{count}", count)
              : t.messages.deleteConfirm
            }
          </p>
          <p className={`mt-4 ${darkMode ? "text-red-400" : "text-red-500"}`}>
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            {t.buttons.cancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash />
                {t.buttons.confirmDelete}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const WorkExperienceManagement = () => {
  const { darkMode, language, toggleTheme, toggleLanguage } = useSettings();
  const t = translations[language] || translations.en; // Fallback to English

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [tokenError, setTokenError] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fix token issue by ensuring axiosInstance includes token
  const ensureToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTokenError(true);
      setError(t.messages.tokenError);
      showNotification('error', t.messages.tokenError);
      return false;
    }
    return true;
  };

  // Fetch requests and statistics
  const fetchRequests = useCallback(async () => {
    if (!ensureToken()) return;
    
    try {
      setLoading(true);
      setError("");
      setTokenError(false);
      
      const { data } = await axiosInstance.get("/work-experience");
      
      if (data.success) {
        setRequests(data.data);
        setFilteredRequests(data.data);
        updateStats(data.data);
      } else {
        setError(data.message || t.messages.fetchError);
        showNotification('error', data.message || t.messages.fetchError);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      const errorMessage = err.response?.data?.message || t.messages.fetchError;
      setError(errorMessage);
      showNotification('error', `${t.error || "Error!"} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchStatistics = async () => {
    if (!ensureToken()) return;
    
    try {
      const { data } = await axiosInstance.get("/work-experience/stats");
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const updateStats = (requestsList) => {
    const stats = {
      total: requestsList.length,
      pending: requestsList.filter(r => r.status === 'pending').length,
      approved: requestsList.filter(r => r.status === 'approved').length,
      rejected: requestsList.filter(r => r.status === 'rejected').length,
      completed: requestsList.filter(r => r.status === 'completed').length
    };
    setStats(stats);
  };

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...requests];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => {
        const searchLower = searchTerm.toLowerCase();
        const requester = request.requester || {};
        return (
          requester.name?.toLowerCase().includes(searchLower) ||
          requester.employeeId?.toLowerCase().includes(searchLower) ||
          requester.email?.toLowerCase().includes(searchLower) ||
          request.department?.toLowerCase().includes(searchLower) ||
          request.fullName?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date();
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        switch (dateFilter) {
          case "today":
            return requestDate.toDateString() === today.toDateString();
          case "week":
            return requestDate >= sevenDaysAgo;
          case "month":
            return requestDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "name":
          aValue = a.requester?.name || a.fullName || "";
          bValue = b.requester?.name || b.fullName || "";
          break;
        case "department":
          aValue = a.department || "";
          bValue = b.department || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, sortField, sortOrder, requests]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRequests.length === 0) {
      showNotification('error', "Please select requests to perform bulk action");
      return;
    }

    if (!ensureToken()) return;

    try {
      setBulkActionLoading(true);
      
      if (action === "delete") {
        setRequestToDelete({ ids: selectedRequests, bulk: true });
        setShowDeleteModal(true);
        return;
      }
      
      const response = await axiosInstance.put("/work-experience/bulk/status", {
        requestIds: selectedRequests,
        status: action,
        adminReason: action === "rejected" ? "Bulk rejection" : ""
      });
      
      if (response.data.success) {
        showNotification('success', response.data.message || t.messages[`bulk${action.charAt(0).toUpperCase() + action.slice(1)}Success`]);
        setSelectedRequests([]);
        fetchRequests();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error in bulk action:", error);
      showNotification('error', error.response?.data?.message || t.messages.actionError);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId, isBulk = false) => {
    if (!ensureToken()) return;

    try {
      setDeleteLoading(true);
      
      if (isBulk) {
        // Bulk delete
        const response = await axiosInstance.delete("/work-experience/bulk", {
          data: { requestIds: requestId.ids }
        });
        
        if (response.data.success) {
          showNotification('success', t.messages.bulkDeleteSuccess);
          setSelectedRequests([]);
        }
      } else {
        // Single delete
        const response = await axiosInstance.delete(`/work-experience/${requestId}`);
        
        if (response.data.success) {
          showNotification('success', t.messages.deleteSuccess);
          if (requestToDelete?._id === requestId) {
            setSelectedRequest(null);
          }
        }
      }
      
      fetchRequests();
      fetchStatistics();
      setShowDeleteModal(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error("Error deleting request:", error);
      showNotification('error', error.response?.data?.message || t.messages.deleteError);
      setDeleteLoading(false);
    }
  };

  const handleDownloadLetter = async (requestId, requesterName, employeeId) => {
    if (!ensureToken()) return;
    
    try {
      setDownloading(true);
      setError("");
      
      console.log('Downloading letter for request:', requestId);
      
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `work_experience_${requesterName || requestId}_${employeeId || ''}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification('success', t.messages.downloadSuccess);
      }
      
    } catch (error) {
      console.error("Error downloading letter:", error);
      
      // Try alternative method
      try {
        const directUrl = `${axiosInstance.defaults.baseURL}/work-experience/${requestId}/download`;
        const token = localStorage.getItem("token");
        
        const newWindow = window.open('', '_blank');
        fetch(directUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          newWindow.location.href = url;
        })
        .catch(fetchError => {
          console.error("Alternative download failed:", fetchError);
          showNotification('error', "Could not download letter. Please try again.");
        });
      } catch (altError) {
        console.error("All download methods failed:", altError);
        showNotification('error', t.messages.downloadError);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleExport = async () => {
    if (!ensureToken()) return;
    
    try {
      const response = await axiosInstance.get("/work-experience/export", {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `work-experience-requests-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting:", error);
      showNotification('error', t.messages.exportError);
    }
  };

  const handleRequestUpdated = () => {
    fetchRequests();
    fetchStatistics();
    showNotification('success', t.messages.requestUpdated);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === currentItems.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(currentItems.map(item => item._id));
    }
  };

  const handleStatusUpdate = async (requestId, status, adminReason = "") => {
    if (!ensureToken()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/work-experience/${requestId}/status`, {
        status,
        adminReason
      });
      
      if (response.data.success) {
        showNotification('success', `Request ${status} successfully`);
        fetchRequests();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification('error', error.response?.data?.message || t.messages.actionError);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLetter = async (requestId) => {
    if (!ensureToken()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/work-experience/${requestId}/generate`);
      
      if (response.data.success) {
        showNotification('success', t.messages.letterGenerated);
        fetchRequests();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      showNotification('error', error.response?.data?.message || t.messages.actionError);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLetter = async (requestId, file) => {
    if (!ensureToken()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", file);
      
      const response = await axiosInstance.post(`/work-experience/${requestId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        showNotification('success', t.messages.letterUploaded);
        fetchRequests();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error uploading letter:", error);
      showNotification('error', error.response?.data?.message || t.messages.actionError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStatistics();
    
    const interval = setInterval(() => {
      fetchRequests();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchRequests]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className={`w-4 h-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />;
      case "approved":
        return <FaCheckCircle className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />;
      case "rejected":
        return <FaTimesCircle className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />;
      case "completed":
        return <FaFilePdf className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />;
      default:
        return null;
    }
  };

  const StatusFilterButton = ({ status, count, Icon }) => (
    <button
      onClick={() => setStatusFilter(status)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
        statusFilter === status
          ? darkMode
            ? "bg-gradient-to-r from-purple-900/30 to-indigo-900/30 text-purple-300 border-2 border-purple-500"
            : "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-2 border-purple-300"
          : darkMode
            ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{t.status[status]}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
      }`}>
        {count}
      </span>
    </button>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && requests.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">{t.title}</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              title="Toggle theme"
            >
              {darkMode ? (
                <span className="text-yellow-400">☀️</span>
              ) : (
                <span className="text-gray-700">🌙</span>
              )}
              <span className="text-sm hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              title="Toggle language"
            >
              <span className="text-lg">🌐</span>
              <span className="text-sm hidden sm:inline">{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaSync />
              {t.buttons.refresh}
            </button>
            <button
              onClick={handleExport}
              disabled={tokenError}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <FaFileExport />
              {t.buttons.export}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow p-6 border-l-4 border-blue-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.stats.total}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FaFileAlt className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow p-6 border-l-4 border-yellow-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.stats.pending}</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <FaClock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow p-6 border-l-4 border-green-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.stats.approved}</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow p-6 border-l-4 border-red-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.stats.rejected}</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <FaTimesCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow p-6 border-l-4 border-purple-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.stats.completed}</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <FaFilePdf className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Section */}
      {selectedRequests.length > 0 && (
        <div className={`mb-6 p-4 ${darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'} border rounded-xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className={`${darkMode ? 'text-purple-300' : 'text-purple-700'} font-medium`}>
              {selectedRequests.length} requests selected
            </span>
            <button
              onClick={handleSelectAll}
              className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
            >
              {selectedRequests.length === currentItems.length ? 
                t.deselectAll : 
                t.selectAll
              }
            </button>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAction("approved")}
              disabled={bulkActionLoading || tokenError}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              <FaCheckCircle />
              {t.buttons.bulkApprove}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAction("rejected")}
              disabled={bulkActionLoading || tokenError}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              <FaTimesCircle />
              {t.buttons.bulkReject}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAction("delete")}
              disabled={bulkActionLoading || tokenError}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white rounded-xl transition-all duration-300 disabled:opacity-50"
            >
              <FaTrashAlt /> {/* Changed from FaBulkDelete to FaTrashAlt */}
              {t.buttons.bulkDelete}
            </motion.button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-4 pl-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" 
                  : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <FaSearch className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
          </div>
        </div>
        
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-full p-4 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex items-center justify-center gap-2 ${
              darkMode 
                ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" 
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaFilter />
            {t.buttons.filters}
            {showFilters ? (
              <FaTimes className="rotate-180" />
            ) : (
              <FaTimes />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className={`mb-6 p-6 rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.filterByStatus}
              </label>
              <div className="flex flex-wrap gap-2">
                <StatusFilterButton
                  status="all"
                  count={stats.total}
                  Icon={FaFileAlt}
                />
                <StatusFilterButton
                  status="pending"
                  count={stats.pending}
                  Icon={FaClock}
                />
                <StatusFilterButton
                  status="approved"
                  count={stats.approved}
                  Icon={FaCheckCircle}
                />
                <StatusFilterButton
                  status="rejected"
                  count={stats.rejected}
                  Icon={FaTimesCircle}
                />
                <StatusFilterButton
                  status="completed"
                  count={stats.completed}
                  Icon={FaFilePdf}
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.filterByDate}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <option value="all">{t.filters.allTime}</option>
                <option value="today">{t.filters.today}</option>
                <option value="week">{t.filters.last7Days}</option>
                <option value="month">{t.filters.last30Days}</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.itemsPerPage}
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 border-gray-700 text-white" 
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className={`rounded-3xl shadow-2xl overflow-hidden border ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`font-semibold ${
              darkMode 
                ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white" 
                : "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-900"
            }`}>
              <tr>
                <th className="p-6 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    {selectedRequests.length === currentItems.length ? (
                      <FaCheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <div className={`w-4 h-4 border rounded ${darkMode ? 'border-gray-600' : 'border-gray-400'}`} />
                    )}
                  </button>
                </th>
                <th 
                  className="p-6 text-left cursor-pointer hover:bg-opacity-80"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    <FaUserTie />
                    {t.table.employee}
                    {sortField === "name" && (
                      sortOrder === "asc" ? <FaTimes className="rotate-180" /> : <FaTimes />
                    )}
                  </div>
                </th>
                <th 
                  className="p-6 text-left cursor-pointer hover:bg-opacity-80"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    {t.table.department}
                    {sortField === "department" && (
                      sortOrder === "asc" ? <FaTimes className="rotate-180" /> : <FaTimes />
                    )}
                  </div>
                </th>
                <th 
                  className="p-6 text-left cursor-pointer hover:bg-opacity-80"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    {t.table.status}
                    {sortField === "status" && (
                      sortOrder === "asc" ? <FaTimes className="rotate-180" /> : <FaTimes />
                    )}
                  </div>
                </th>
                <th 
                  className="p-6 text-left cursor-pointer hover:bg-opacity-80"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-2">
                    <FaFileAlt />
                    {t.table.requestDate}
                    {sortField === "createdAt" && (
                      sortOrder === "asc" ? <FaTimes className="rotate-180" /> : <FaTimes />
                    )}
                  </div>
                </th>
                <th className="p-6 text-left">{t.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((request, index) => (
                  <motion.tr 
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b transition-all duration-300 ${
                      darkMode 
                        ? "hover:bg-gray-750 border-gray-700" 
                        : "hover:bg-purple-50/50 border-gray-100"
                    }`}
                  >
                    <td className="p-6">
                      <button
                        onClick={() => handleSelectRequest(request._id)}
                        className="hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        {selectedRequests.includes(request._id) ? (
                          <FaCheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <div className={`w-4 h-4 border rounded ${darkMode ? 'border-gray-600' : 'border-gray-400'}`} />
                        )}
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-gray-700' : 'bg-purple-100'
                        }`}>
                          <FaUserTie className={`${darkMode ? 'text-gray-300' : 'text-purple-600'}`} />
                        </div>
                        <div>
                          <div className="font-semibold">{request.requester?.name || request.fullName || "N/A"}</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {request.requester?.email || "N/A"}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                            ID: {request.requester?.employeeId || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <FaUsers className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span>{request.department || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <StatusBadge
                          status={request.status}
                          label={t.status[request.status]}
                          darkMode={darkMode}
                        />
                      </div>
                      {request.adminReason && request.status === "rejected" && (
                        <div className={`text-xs mt-1 truncate max-w-xs ${
                          darkMode ? 'text-red-400' : 'text-red-600'
                        }`} title={request.adminReason}>
                          {request.adminReason}
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedRequest(request)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                          title={t.buttons.view}
                        >
                          <FaEye />
                        </motion.button>
                        
                        {request.status === "pending" && (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusUpdate(request._id, "approved")}
                              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                              title={t.buttons.approve}
                            >
                              <FaCheck />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusUpdate(request._id, "rejected", "Request rejected by admin")}
                              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                              title={t.buttons.reject}
                            >
                              <FaTimes />
                            </motion.button>
                          </>
                        )}
                        
                        {request.status === "approved" && (
                          <>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleGenerateLetter(request._id)}
                              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                              title={t.buttons.generateLetter}
                            >
                              <FaFileAlt />
                            </motion.button>
                            <label className={`bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                              tokenError ? 'opacity-50 cursor-not-allowed' : ''
                            }`}>
                              <FaUpload />
                              <span>{t.buttons.uploadLetter}</span>
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                disabled={tokenError}
                                onChange={(e) => {
                                  if (e.target.files[0] && !tokenError) {
                                    handleUploadLetter(request._id, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </>
                        )}
                        
                        {request.letterPdf?.url && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownloadLetter(
                              request._id,
                              request.requester?.name || request.fullName,
                              request.requester?.employeeId
                            )}
                            disabled={downloading || tokenError}
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                            title={t.buttons.download}
                          >
                            {downloading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <FaDownload />
                            )}
                          </motion.button>
                        )}

                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setRequestToDelete({ _id: request._id, bulk: false });
                            setShowDeleteModal(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                          title={t.buttons.delete}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className={`text-6xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>📄</div>
                    <EmptyState
                      title={t.empty.title}
                      message={t.empty.message}
                      actionText={t.empty.action}
                      onAction={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setDateFilter("all");
                      }}
                      darkMode={darkMode}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.pagination.showing}{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                {t.pagination.to}{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredRequests.length)}
                </span>{" "}
                {t.pagination.of}{" "}
                <span className="font-medium">{filteredRequests.length}</span>{" "}
                {t.pagination.results}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredRequests.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <WorkExperienceDetailModal
          request={selectedRequest}
          close={() => setSelectedRequest(null)}
          refresh={handleRequestUpdated}
          onApprove={(requestId) => handleStatusUpdate(requestId, "approved")}
          onReject={(requestId, reason) => handleStatusUpdate(requestId, "rejected", reason)}
          onGenerateLetter={handleGenerateLetter}
          onUploadLetter={handleUploadLetter}
          onDownloadLetter={(requestId, requesterName, employeeId) => 
            handleDownloadLetter(requestId, requesterName, employeeId)
          }
          onDelete={(requestId) => {
            setRequestToDelete({ _id: requestId, bulk: false });
            setShowDeleteModal(true);
          }}
          darkMode={darkMode}
          language={language}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setRequestToDelete(null);
            }}
            onConfirm={() => {
              if (requestToDelete?.bulk) {
                handleDeleteRequest(requestToDelete, true);
              } else {
                handleDeleteRequest(requestToDelete?._id, false);
              }
            }}
            count={requestToDelete?.bulk ? requestToDelete.ids.length : 1}
            loading={deleteLoading}
            darkMode={darkMode}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkExperienceManagement;