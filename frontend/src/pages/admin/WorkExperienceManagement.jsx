import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import WorkExperienceDetailModal from "../../components/admin/WorkExperienceDetailModal";

// Icons as SVG components (inline for single file)
const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  RefreshCw: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronUp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  Loader2: () => (
    <svg className="w-12 h-12 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  CheckSquare: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Square: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  FilePlus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  BulkDelete: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

// Translation object for English
const translations = {
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
};

// Custom components as inline functions
const StatusBadge = ({ status, label }) => {
  const getColorClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(status)}`}>
      {label}
    </span>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.ChevronLeft />
      </button>
      
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1.5 rounded-lg ${
            currentPage === number
              ? "bg-blue-600 text-white"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.ChevronRight />
      </button>
    </div>
  );
};

const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icons.FileText />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icons.Search />
          {actionText}
        </button>
      )}
    </div>
  );
};

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Icons.Loader2 />
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Icons.AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Confirm Deletion
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {count > 1 
              ? translations.messages.bulkDeleteConfirm.replace("{count}", count)
              : translations.messages.deleteConfirm
            }
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {translations.buttons.cancel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Icons.Trash className="w-4 h-4" />
                  {translations.buttons.confirmDelete}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkExperienceManagement = () => {
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
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [tokenError, setTokenError] = useState(false);

  // Fix token issue by ensuring axiosInstance includes token
  const ensureToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTokenError(true);
      setError(translations.messages.tokenError);
      return false;
    }
    return true;
  };

  // Handle letter download with proper token handling
  const handleDownloadLetter = async (requestId, requesterName, employeeId) => {
    if (!ensureToken()) return;
    
    try {
      setDownloading(true);
      setError(null);
      
      console.log('Downloading letter for request:', requestId);
      
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Method 1: Use axios with responseType blob
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        // Create blob from response
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `work_experience_${requesterName || requestId}_${employeeId || ''}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setSuccessMessage(translations.messages.downloadSuccess);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
      
    } catch (error) {
      console.error("Error downloading letter:", error);
      
      // Try alternative method if the first one fails
      try {
        const directUrl = `${axiosInstance.defaults.baseURL}/work-experience/${requestId}/download`;
        const token = localStorage.getItem("token");
        
        // Open in new tab with authorization header
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
          setError("Could not download letter. Please try again.");
        });
      } catch (altError) {
        console.error("All download methods failed:", altError);
        setError(translations.messages.downloadError);
      }
    } finally {
      setDownloading(false);
    }
  };

  const fetchRequests = async () => {
    if (!ensureToken()) return;
    
    try {
      setLoading(true);
      setError(null);
      setTokenError(false);
      
      const { data } = await axiosInstance.get("/work-experience");
      
      if (data.success) {
        setRequests(data.data);
        setFilteredRequests(data.data);
        updateStats(data.data);
      } else {
        setError(data.message || translations.messages.fetchError);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setTokenError(true);
          setError(translations.messages.tokenError);
        } else if (error.response.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else if (error.response.status === 404) {
          setError("API endpoint not found. Check backend routes.");
        } else {
          setError(error.response.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError("No response from server. Check your connection.");
      } else {
        setError(translations.messages.fetchError);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const applyFiltersAndSort = () => {
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
  };

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
      setError("Please select requests to perform bulk action");
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
        setSuccessMessage(response.data.message || `Requests ${action} successfully`);
        setSelectedRequests([]);
        fetchRequests();
        fetchStatistics();
        
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error in bulk action:", error);
      setError(error.response?.data?.message || translations.messages.actionError);
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
          setSuccessMessage(translations.messages.bulkDeleteSuccess);
          setSelectedRequests([]);
        }
      } else {
        // Single delete
        const response = await axiosInstance.delete(`/work-experience/${requestId}`);
        
        if (response.data.success) {
          setSuccessMessage(translations.messages.deleteSuccess);
          if (requestToDelete?._id === requestId) {
            setSelectedRequest(null);
          }
        }
      }
      
      fetchRequests();
      fetchStatistics();
      setShowDeleteModal(false);
      setRequestToDelete(null);
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting request:", error);
      setError(error.response?.data?.message || translations.messages.deleteError);
      setDeleteLoading(false);
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
      setError(translations.messages.exportError);
    }
  };

  const handleRequestUpdated = () => {
    fetchRequests();
    fetchStatistics();
    setSuccessMessage(translations.messages.requestUpdated);
    setTimeout(() => setSuccessMessage(""), 3000);
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
        setSuccessMessage(`Request ${status} successfully`);
        fetchRequests();
        fetchStatistics();
        
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || translations.messages.actionError);
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
        setSuccessMessage(translations.messages.letterGenerated);
        fetchRequests();
        fetchStatistics();
        
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error generating letter:", error);
      setError(error.response?.data?.message || translations.messages.actionError);
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
        setSuccessMessage(translations.messages.letterUploaded);
        fetchRequests();
        fetchStatistics();
        
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading letter:", error);
      setError(error.response?.data?.message || translations.messages.actionError);
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
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, statusFilter, dateFilter, sortField, sortOrder, requests]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Icons.Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <Icons.CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <Icons.XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <Icons.FileText className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const StatusFilterButton = ({ status, count, Icon }) => (
    <button
      onClick={() => setStatusFilter(status)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        statusFilter === status
          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{translations.status[status]}</span>
      <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
        {count}
      </span>
    </button>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && requests.length === 0) {
    return <LoadingSpinner message={translations.loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Token Error Message */}
        {tokenError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Icons.AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">{translations.messages.tokenError}</p>
                <p className="text-red-600 text-sm mt-1">
                  Please login again to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {translations.title}
              </h1>
              <p className="text-gray-600 mt-2">
                {translations.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRequests}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Icons.RefreshCw className="w-4 h-4" />
                {translations.buttons.refresh}
              </button>
              <button
                onClick={handleExport}
                disabled={tokenError}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Icons.Download className="w-4 h-4" />
                {translations.buttons.export}
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{translations.stats.total}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Icons.FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{translations.stats.pending}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <Icons.Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{translations.stats.approved}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
                <Icons.CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{translations.stats.rejected}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
                <Icons.XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{translations.stats.completed}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <Icons.Upload className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && !tokenError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <Icons.AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              &times;
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Icons.CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Bulk Actions Section */}
        {selectedRequests.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-700 font-medium">
                {selectedRequests.length} requests selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {selectedRequests.length === currentItems.length ? 
                  translations.deselectAll : 
                  translations.selectAll
                }
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("approved")}
                disabled={bulkActionLoading || tokenError}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Icons.CheckCircle className="w-4 h-4" />
                {translations.buttons.bulkApprove}
              </button>
              <button
                onClick={() => handleBulkAction("rejected")}
                disabled={bulkActionLoading || tokenError}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Icons.XCircle className="w-4 h-4" />
                {translations.buttons.bulkReject}
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={bulkActionLoading || tokenError}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                <Icons.BulkDelete className="w-4 h-4" />
                {translations.buttons.bulkDelete}
              </button>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={translations.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Filter className="w-5 h-5" />
                {translations.buttons.filters}
                {showFilters ? (
                  <Icons.ChevronUp className="w-5 h-5" />
                ) : (
                  <Icons.ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.filterByStatus}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <StatusFilterButton
                        status="all"
                        count={stats.total}
                        Icon={Icons.FileText}
                      />
                      <StatusFilterButton
                        status="pending"
                        count={stats.pending}
                        Icon={Icons.Clock}
                      />
                      <StatusFilterButton
                        status="approved"
                        count={stats.approved}
                        Icon={Icons.CheckCircle}
                      />
                      <StatusFilterButton
                        status="rejected"
                        count={stats.rejected}
                        Icon={Icons.XCircle}
                      />
                      <StatusFilterButton
                        status="completed"
                        count={stats.completed}
                        Icon={Icons.Upload}
                      />
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.filterByDate}
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="all">{translations.filters.allTime}</option>
                      <option value="today">{translations.filters.today}</option>
                      <option value="week">{translations.filters.last7Days}</option>
                      <option value="month">{translations.filters.last30Days}</option>
                    </select>
                  </div>

                  {/* Items Per Page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.itemsPerPage}
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            {currentItems.length === 0 ? (
              <EmptyState
                title={translations.empty.title}
                message={translations.empty.message}
                actionText={translations.empty.action}
                onAction={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
              />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 hover:text-blue-600"
                      >
                        {selectedRequests.length === currentItems.length ? (
                          <Icons.CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Icons.Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <Icons.User className="w-4 h-4" />
                        {translations.table.employee}
                        {sortField === "name" && (
                          sortOrder === "asc" ? <Icons.ChevronUp className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-2">
                        <Icons.Building className="w-4 h-4" />
                        {translations.table.department}
                        {sortField === "department" && (
                          sortOrder === "asc" ? <Icons.ChevronUp className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        {translations.table.status}
                        {sortField === "status" && (
                          sortOrder === "asc" ? <Icons.ChevronUp className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        <Icons.Calendar className="w-4 h-4" />
                        {translations.table.requestDate}
                        {sortField === "createdAt" && (
                          sortOrder === "asc" ? <Icons.ChevronUp className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.table.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSelectRequest(request._id)}
                          className="hover:text-blue-600"
                        >
                          {selectedRequests.includes(request._id) ? (
                            <Icons.CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Icons.Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icons.User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.requester?.name || request.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Icons.Mail className="w-3 h-3" />
                              {request.requester?.email || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <span className="font-medium">ID:</span>
                              {request.requester?.employeeId || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icons.Building className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {request.department || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <StatusBadge
                            status={request.status}
                            label={translations.status[request.status]}
                          />
                        </div>
                        {request.adminReason && request.status === "rejected" && (
                          <div className="text-xs text-red-600 mt-1 truncate max-w-xs" title={request.adminReason}>
                            {request.adminReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                            disabled={tokenError}
                          >
                            <Icons.Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">{translations.buttons.view}</span>
                          </button>
                          
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(request._id, "approved")}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                title="Approve Request"
                                disabled={tokenError}
                              >
                                <Icons.CheckCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">{translations.buttons.approve}</span>
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(request._id, "rejected", "Request rejected by admin")}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                title="Reject Request"
                                disabled={tokenError}
                              >
                                <Icons.XCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">{translations.buttons.reject}</span>
                              </button>
                            </>
                          )}
                          
                          {request.status === "approved" && (
                            <>
                              <button
                                onClick={() => handleGenerateLetter(request._id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                title="Generate Letter"
                                disabled={tokenError}
                              >
                                <Icons.FilePlus className="w-4 h-4" />
                                <span className="hidden sm:inline">{translations.buttons.generateLetter}</span>
                              </button>
                              <label className={`flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors ${tokenError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <Icons.Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">{translations.buttons.uploadLetter}</span>
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
                            <button
                              onClick={() => handleDownloadLetter(
                                request._id,
                                request.requester?.name || request.fullName,
                                request.requester?.employeeId
                              )}
                              disabled={downloading || tokenError}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                              title="Download Letter"
                            >
                              {downloading ? (
                                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Icons.Download className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">{translations.buttons.download}</span>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setRequestToDelete({ _id: request._id, bulk: false });
                              setShowDeleteModal(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete Request"
                            disabled={tokenError}
                          >
                            <Icons.Trash className="w-4 h-4" />
                            <span className="hidden sm:inline">{translations.buttons.delete}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <div className="px-6 py-4 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-700">
                  {translations.pagination.showing}{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  {translations.pagination.to}{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredRequests.length)}
                  </span>{" "}
                  {translations.pagination.of}{" "}
                  <span className="font-medium">{filteredRequests.length}</span>{" "}
                  {translations.pagination.results}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredRequests.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
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
          />
        )}

        {/* Delete Confirmation Modal */}
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
        />
      </div>
    </div>
  );
};

export default WorkExperienceManagement;