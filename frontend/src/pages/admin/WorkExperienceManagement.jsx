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
    requestUpdated: "Request updated successfully",
    fetchError: "Failed to load requests. Please try again.",
    actionError: "Failed to perform action. Please try again.",
    exportError: "Failed to export data."
  },
  buttons: {
    refresh: "Refresh",
    export: "Export",
    filters: "Filters",
    view: "View",
    download: "Download",
    clearFilters: "Clear Filters"
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
  itemsPerPage: "Items per page"
};

// Theme configuration
const theme = {
  colors: {
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    success: "#10b981",
    successHover: "#059669",
    warning: "#f59e0b",
    warningHover: "#d97706",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    info: "#8b5cf6",
    infoHover: "#7c3aed",
    background: "#f9fafb",
    card: "#ffffff",
    border: "#e5e7eb",
    text: {
      primary: "#111827",
      secondary: "#6b7280",
      muted: "#9ca3af"
    }
  }
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

  const fetchRequests = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Changed from "/experience-requests/admin/all" to "/work-experience"
    const { data } = await axiosInstance.get("/work-experience");
    
    if (data.success) {
      setRequests(data.data);
      setFilteredRequests(data.data);
      updateStats(data.data);
    } else {
      setError(data.message || "Failed to load requests");
    }
  } catch (error) {
    console.error("Error fetching requests:", error);
    
    // More specific error message
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else if (error.response.status === 404) {
        setError("API endpoint not found. Check backend routes.");
      } else {
        setError(error.response.data?.message || `Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      setError("No response from server. Check your connection.");
    } else {
      // Something else happened
      setError("Failed to load requests. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const fetchStatistics = async () => {
    try {
      const { data } = await axiosInstance.get("/experience-requests/stats");
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
        return (
          request.employee?.name?.toLowerCase().includes(searchLower) ||
          request.employee?.employeeId?.toLowerCase().includes(searchLower) ||
          request.employee?.email?.toLowerCase().includes(searchLower) ||
          request.department?.toLowerCase().includes(searchLower)
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
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      filtered = filtered.filter(request => {
        const requestDate = new Date(request.createdAt);
        switch (dateFilter) {
          case "today":
            return requestDate.toDateString() === new Date().toDateString();
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
          aValue = a.employee?.name || "";
          bValue = b.employee?.name || "";
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

  const handleBulkAction = async (action, requestIds) => {
    try {
      setLoading(true);
      const promises = requestIds.map(id => {
        return axiosInstance.put(`/experience-requests/${id}/${action}`);
      });
      
      await Promise.all(promises);
      
      setSuccessMessage(action === 'approve' ? translations.messages.bulkApproveSuccess : translations.messages.bulkRejectSuccess);
      fetchRequests();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(translations.messages.actionError);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/experience-requests/export", {
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
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
        {error && (
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
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("employee.name")}
                    >
                      <div className="flex items-center gap-2">
                        <Icons.User className="w-4 h-4" />
                        {translations.table.employee}
                        {sortField === "employee.name" && (
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
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icons.User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.employee?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Icons.Mail className="w-3 h-3" />
                              {request.employee?.email || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <span className="font-medium">ID:</span>
                              {request.employee?.employeeId || "N/A"}
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
                        {request.requestedBy && request.requestedBy._id !== request.employee?._id && (
                          <div className="text-xs text-gray-500 mt-1">
                            Requested by: {request.requestedBy.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <StatusBadge
                            status={request.status}
                            label={translations.status[request.status]}
                          />
                        </div>
                        {request.adminRemarks && request.status === "rejected" && (
                          <div className="text-xs text-red-600 mt-1 truncate max-w-xs" title={request.adminRemarks}>
                            {request.adminRemarks}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Icons.Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">{translations.buttons.view}</span>
                          </button>
                          
                          {request.pdfFile?.url && (
                            <a
                              href={`${axiosInstance.defaults.baseURL}${request.pdfFile.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                              title="Download Letter"
                            >
                              <Icons.Download className="w-4 h-4" />
                              <span className="hidden sm:inline">{translations.buttons.download}</span>
                            </a>
                          )}
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
          />
        )}
      </div>
    </div>
  );
};

export default WorkExperienceManagement;