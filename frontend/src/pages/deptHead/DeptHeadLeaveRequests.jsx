import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import {
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaInfoCircle,
  FaList,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaFileAlt,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaHistory,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const translations = {
  en: {
    title: "Leave Management",
    employeeRequests: "Employee Requests",
    myLeaveRequests: "My Leave Requests",
    previousLeaveRequests: "Previous Leave Requests",
    showAll: "Show All",
    showPendingOnly: "Show Pending Only",
    applyLeave: "Apply for Leave",
    startDate: "Start Date",
    endDate: "End Date",
    reason: "Reason",
    attachments: "Attachments",
    submit: "Submit",
    cancel: "Cancel",
    noLeaveRequests: "No leave requests",
    details: "Details",
    approve: "Approve",
    reject: "Reject",
    delete: "Delete",
    employee: "Employee",
    status: "Status",
    actions: "Actions",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    department: "Department",
    email: "Email",
    loading: "Loading leave requests...",
    notAuthorized: "Not authorized",
    leaveSubmitted: "Leave request submitted successfully",
    leaveFailed: "Failed to submit leave request",
    deleteConfirm: "Are you sure you want to delete this request?",
    deleteSuccess: "Leave request deleted",
    deleteFailed: "Failed to delete leave request",
    decisionSuccess: "Leave request updated",
    decisionFailed: "Failed to update leave request",
    selectFiles: "Select files",
    filesSelected: "file(s) selected",
    viewDetails: "View Details",
    closeDetails: "Close Details",
    leaveForm: "Leave Application Form",
    manageRequests: "Manage Employee Requests",
    myLeaves: "My Leave History",
    applyNewLeave: "Apply New Leave",
    previousLeaves: "Previous Leave Requests",
    showPrevious: "Show Previous Requests",
    hidePrevious: "Hide Previous Requests",
    allDecidedRequests: "All Decided Requests",
    showDecidedOnly: "Show Decided Requests",
    fromDate: "From Date",
    toDate: "To Date",
    filterByDate: "Filter by Date",
    clearFilter: "Clear Filter",
    daysCount: "Days",
    requestedOn: "Requested On",
    decidedOn: "Decided On",
    decidedBy: "Decided By",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
  },
  am: {
    title: "የቅድመ ፈቃድ አስተዳደር",
    employeeRequests: "ሰራተኞች ጥያቄዎች",
    myLeaveRequests: "የእኔ ፈቃድ ጥያቄዎች",
    previousLeaveRequests: "ቀደም ያሉ ፈቃድ ጥያቄዎች",
    showAll: "ሁሉንም ይሳዩ",
    showPendingOnly: "ቅድመ ፈቃድ ብቻ ይሳዩ",
    applyLeave: "ፈቃድ ይጠይቁ",
    startDate: "የመጀመሪያ ቀን",
    endDate: "የመጨረሻ ቀን",
    reason: "ምክንያት",
    attachments: "አባሪዎች",
    submit: "ላክ",
    cancel: "ሰርዝ",
    noLeaveRequests: "ምንም ፈቃድ ጥያቄዎች የሉም",
    details: "ዝርዝሮች",
    approve: "ይፀድቁ",
    reject: "ይክሰሱ",
    delete: "ማጥፋት",
    employee: "ሰራተኛ",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    pending: "በመጠባበቅ ላይ",
    approved: "ተፀድቋል",
    rejected: "ተመላሽ ሆኗል",
    department: "ክፍል",
    email: "ኢሜይል",
    loading: "ፈቃድ ጥያቄዎች በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    leaveSubmitted: "ፈቃድ ጥያቄ በትክክል ተልኳል",
    leaveFailed: "ፈቃድ ጥያቄ ማስተላለፍ አልተቻለም",
    deleteConfirm: "ይህን ጥያቄ ማጥፋት እፈልጋለሁ?",
    deleteSuccess: "ፈቃድ ጥያቄ ተሰርዟል",
    deleteFailed: "ፈቃድ ጥያቄ ማጥፋት አልተሳካም",
    decisionSuccess: "ፈቃድ ጥያቄ ተሻሽሏል",
    decisionFailed: "ፈቃድ ጥያቄ ማሻሻያ አልተሳካም",
    selectFiles: "ፋይሎችን ይምረጡ",
    filesSelected: "ፋይል(ዎች) ተመርጠዋል",
    viewDetails: "ዝርዝሮችን አሳይ",
    closeDetails: "ዝርዝሮችን ዝጋ",
    leaveForm: "የፈቃድ ማመልከቻ ቅጽ",
    manageRequests: "የሰራተኞች ጥያቄዎችን ያስተዳድሩ",
    myLeaves: "የእኔ የፈቃድ ታሪክ",
    applyNewLeave: "አዲስ ፈቃድ ይጠይቁ",
    previousLeaves: "ቀደም ያሉ ፈቃድ ጥያቄዎች",
    showPrevious: "ቀደም ያሉ ጥያቄዎችን አሳይ",
    hidePrevious: "ቀደም ያሉ ጥያቄዎችን ደብቅ",
    allDecidedRequests: "ሁሉም የተወሰኑ ጥያቄዎች",
    showDecidedOnly: "የተወሰኑ ጥያቄዎችን ብቻ አሳይ",
    fromDate: "ከዚህ ቀን",
    toDate: "እስከዚህ ቀን",
    filterByDate: "በቀን አጣራ",
    clearFilter: "አጣሪውን አጥፋ",
    daysCount: "ቀናት",
    requestedOn: "በተጠየቀበት ቀን",
    decidedOn: "በተወሰነበት ቀን",
    decidedBy: "በየትኛው እጅ",
    expandAll: "ሁሉንም አስፍት",
    collapseAll: "ሁሉንም ዝጋ",
  },
};

const DeptHeadLeaveRequests = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("employee");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreviousRequests, setShowPreviousRequests] = useState(false);
  const [previousRequests, setPreviousRequests] = useState([]);
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [expandedAll, setExpandedAll] = useState(false);

  // Fetch all leave requests
  const fetchRequests = async () => {
    try {
      console.log("Fetching leave requests...");
      setLoading(true);
      
      // Fetch inbox requests (requests from employees to department head)
      const inboxResponse = await axios.get("/leaves/inbox");
      setEmployeeLeaves(inboxResponse.data || []);
      
      // Fetch my requests (requests I've made)
      const myResponse = await axios.get("/leaves/my");
      setMyLeaves(myResponse.data || []);
      
      // Also fetch previous requests (decided requests)
      if (showPreviousRequests) {
        await fetchPreviousRequests();
      }
      
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setMessage(err.response?.data?.message || t.decisionFailed);
    } finally {
      setLoading(false);
    }
  };

  // Fetch previous (decided) leave requests
  const fetchPreviousRequests = async () => {
    try {
      const response = await axios.get("/leaves/previous");
      setPreviousRequests(response.data || []);
    } catch (err) {
      console.error("Error fetching previous requests:", err);
      // Don't show error for previous requests
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      console.log("User loaded:", user);
      fetchRequests();
    } else if (!authLoading && !user) {
      console.log("No user found");
      setLoading(false);
    }
  }, [user, authLoading]);

  // Handle approve/reject decision
  const handleDecision = async (id, status) => {
    try {
      console.log(`Updating request ${id} to status: ${status}`);
      
      await axios.put(`/leaves/requests/${id}/status`, { status });
      setMessage(`${t.decisionSuccess} - Request ${status}`);
      
      // Refresh data
      await fetchRequests();
      
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      setMessage(`${t.decisionFailed}: ${err.response?.data?.message || err.message}`);
    }
  };

  // Handle delete for pending requests
  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await axios.delete(`/leaves/requests/${id}`);
      setMessage(t.deleteSuccess);
      fetchRequests();
    } catch (err) {
      console.error("Error deleting request:", err.response?.data || err.message);
      setMessage(t.deleteFailed);
    }
  };

  // Handle delete for previous requests
  const handleDeletePrevious = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await axios.delete(`/leaves/requests/${id}`);
      setMessage(t.deleteSuccess);
      fetchPreviousRequests();
    } catch (err) {
      console.error("Error deleting previous request:", err.response?.data || err.message);
      setMessage(t.deleteFailed);
    }
  };

  // Apply new leave - FIXED ENDPOINT
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!startDate || !endDate) {
      setMessage(t.leaveFailed + ": Please select both start and end dates");
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setMessage(t.leaveFailed + ": End date must be after start date");
      return;
    }
    
    const formData = new FormData();
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("reason", reason);
    
    // Add attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      // FIXED: Changed endpoint from "/leaves/request" to "/leaves"
      await axios.post("leaves/requests", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessage(t.leaveSubmitted);
      setShowApplyForm(false);
      setStartDate("");
      setEndDate("");
      setReason("");
      setAttachments([]);
      
      // Refresh data
      await fetchRequests();
      setActiveTab("myLeave");
      
    } catch (err) {
      console.error("Error submitting leave request:", err.response?.data || err);
      setMessage(`${t.leaveFailed}: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
    setDetailsOpen({});
  };

  const handleTogglePreviousRequests = async () => {
    const newShowState = !showPreviousRequests;
    setShowPreviousRequests(newShowState);
    
    if (newShowState) {
      // If we're showing previous requests, fetch them
      setExpandedAll(false);
      await fetchPreviousRequests();
    }
  };

  const handleToggleExpandAll = () => {
    if (expandedAll) {
      // Collapse all
      setDetailsOpen({});
    } else {
      // Expand all
      const expanded = {};
      previousRequests.forEach((req) => {
        expanded[req._id] = true;
      });
      setDetailsOpen(expanded);
    }
    setExpandedAll(!expandedAll);
  };

  // Filter previous requests by date
  const filteredPreviousRequests = previousRequests.filter((request) => {
    if (!filterFromDate && !filterToDate) return true;
    
    const requestDate = new Date(request.createdAt);
    const fromDate = filterFromDate ? new Date(filterFromDate) : null;
    const toDate = filterToDate ? new Date(filterToDate) : null;
    
    if (fromDate && toDate) {
      return requestDate >= fromDate && requestDate <= toDate;
    } else if (fromDate) {
      return requestDate >= fromDate;
    } else if (toDate) {
      return requestDate <= toDate;
    }
    return true;
  });

  // Calculate number of days between start and end dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  };

  const handleClearFilter = () => {
    setFilterFromDate("");
    setFilterToDate("");
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

  // Show only pending requests by default, or all if showAll is true
  const filteredEmployeeLeaves = showAll
    ? employeeLeaves
    : employeeLeaves.filter((r) => r.status === "pending");

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {activeTab === "employee" ? t.manageRequests : t.myLeaves}
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { 
              setActiveTab("employee"); 
              setShowApplyForm(false); 
              setShowPreviousRequests(false); 
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === "employee" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaList />
            {t.employeeRequests}
          </button>
          <button
            onClick={() => { 
              setActiveTab("myLeave"); 
              setShowApplyForm(true); 
              setShowPreviousRequests(false); 
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === "myLeave" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaHistory />
            {t.myLeaveRequests}
          </button>
          <button
            onClick={handleTogglePreviousRequests}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showPreviousRequests ? "bg-purple-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaHistory />
            {showPreviousRequests ? t.hidePrevious : t.showPrevious}
          </button>
        </div>
        
        {activeTab === "employee" && (
          <button
            onClick={handleToggleShowAll}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showAll ? "bg-yellow-600 text-white hover:bg-yellow-700" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            <FaList />
            {showAll ? t.showPendingOnly : t.showAll}
          </button>
        )}
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <div className={`mb-8 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaPaperPlane className="text-blue-500" />
            {t.leaveForm}
          </h2>
          
          <form onSubmit={handleApplySubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  {t.startDate} *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  {t.endDate} *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaFileAlt className="text-gray-400" />
                  {t.reason} *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder={language === "en" ? "Enter reason for leave..." : "ለፈቃድ ምክንያት ያስገቡ..."}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaFileAlt className="text-gray-400" />
                  {t.attachments}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(Array.from(e.target.files))}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                />
                {attachments.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {attachments.length} {t.filesSelected}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPaperPlane />
                {t.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Previous Leave Requests Section */}
      {showPreviousRequests && (
        <div className={`mb-8 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaHistory className="text-purple-500" />
              {t.previousLeaveRequests}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleToggleExpandAll}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  expandedAll 
                    ? "bg-red-600 text-white hover:bg-red-700" 
                    : darkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {expandedAll ? <FaAngleUp /> : <FaAngleDown />}
                {expandedAll ? t.collapseAll : t.expandAll}
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder={t.fromDate}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder={t.toDate}
                />
                {(filterFromDate || filterToDate) && (
                  <button
                    onClick={handleClearFilter}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    {t.clearFilter}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {filteredPreviousRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t.noLeaveRequests}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPreviousRequests.map((request) => (
                <div 
                  key={request._id} 
                  className={`rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${detailsOpen[request._id] ? "border-b" : ""} ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div>
                          <h3 className="font-medium">{request.requesterName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{request.department}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">{t.startDate}: </span>
                            {new Date(request.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{t.endDate}: </span>
                            {new Date(request.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{t.daysCount}: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}>
                              {calculateDays(request.startDate, request.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {request.status === "approved" ? t.approved : t.rejected}
                      </span>
                      
                      <button
                        onClick={() => setDetailsOpen(prev => ({ ...prev, [request._id]: !prev[request._id] }))}
                        className={`p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                      >
                        {detailsOpen[request._id] ? <FaAngleUp /> : <FaAngleDown />}
                      </button>
                      
                      <button
                        onClick={() => handleDeletePrevious(request._id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title={t.delete}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {detailsOpen[request._id] && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <DetailItem
                            icon={<FaUser />}
                            label={t.employee}
                            value={request.requesterName}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaEnvelope />}
                            label={t.email}
                            value={request.requesterEmail}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaBuilding />}
                            label={t.department}
                            value={request.department}
                            darkMode={darkMode}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <DetailItem
                            icon={<FaCalendarAlt />}
                            label={t.startDate}
                            value={new Date(request.startDate).toLocaleDateString()}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaCalendarAlt />}
                            label={t.endDate}
                            value={new Date(request.endDate).toLocaleDateString()}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaClock />}
                            label={t.daysCount}
                            value={calculateDays(request.startDate, request.endDate)}
                            darkMode={darkMode}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <DetailItem
                            icon={<FaCalendarAlt />}
                            label={t.requestedOn}
                            value={new Date(request.createdAt).toLocaleDateString()}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaCalendarAlt />}
                            label={t.decidedOn}
                            value={request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : "N/A"}
                            darkMode={darkMode}
                          />
                          <DetailItem
                            icon={<FaUser />}
                            label={t.decidedBy}
                            value={request.approvedBy || "N/A"}
                            darkMode={darkMode}
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <DetailItem
                            icon={<FaFileAlt />}
                            label={t.reason}
                            value={request.reason}
                            darkMode={darkMode}
                            fullWidth
                          />
                        </div>
                        
                        {/* Attachments */}
                        {request.attachments && request.attachments.length > 0 && (
                          <div className="md:col-span-3">
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <FaFileAlt className="text-gray-500" />
                              {t.attachments}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.attachments.map((file, index) => (
                                <a
                                  key={index}
                                  href={typeof file === 'object' ? file.url : `${BACKEND_URL}/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`px-3 py-2 rounded flex items-center gap-2 text-sm ${
                                    darkMode 
                                      ? "bg-gray-700 hover:bg-gray-600 text-blue-400" 
                                      : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                                  }`}
                                >
                                  <FaFileAlt />
                                  {typeof file === 'object' ? file.name : file.split("/").pop()}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Employee Requests Table */}
      {activeTab === "employee" && (
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="p-4 text-left font-medium">{t.employee}</th>
                  <th className="p-4 text-left font-medium">{t.startDate}</th>
                  <th className="p-4 text-left font-medium">{t.endDate}</th>
                  <th className="p-4 text-left font-medium">{t.reason}</th>
                  <th className="p-4 text-left font-medium">{t.status}</th>
                  <th className="p-4 text-left font-medium">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployeeLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      {t.noLeaveRequests}
                    </td>
                  </tr>
                ) : (
                  filteredEmployeeLeaves.map((request) => (
                    <React.Fragment key={request._id}>
                      <tr className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                        <td className="p-4">
                          <div className="font-medium">{request.requesterName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {request.department}
                          </div>
                        </td>
                        <td className="p-4">
                          {new Date(request.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate">{request.reason}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : request.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {request.status === "approved" && <FaCheckCircle className="inline mr-1" />}
                            {request.status === "rejected" && <FaTimesCircle className="inline mr-1" />}
                            {request.status === "pending" && <FaHourglassHalf className="inline mr-1" />}
                            {t[request.status] || request.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDetailsOpen(prev => ({ ...prev, [request._id]: !prev[request._id] }))}
                              className={`px-3 py-1 rounded flex items-center gap-1 text-sm ${
                                darkMode 
                                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              <FaEye />
                              {detailsOpen[request._id] ? t.closeDetails : t.viewDetails}
                            </button>
                            
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleDecision(request._id, "approved")}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 text-sm"
                                >
                                  <FaCheck />
                                  {t.approve}
                                </button>
                                <button
                                  onClick={() => handleDecision(request._id, "rejected")}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                                >
                                  <FaTimes />
                                  {t.reject}
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => handleDelete(request._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                            >
                              <FaTrash />
                              {t.delete}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Details Row */}
                      {detailsOpen[request._id] && (
                        <tr className={darkMode ? "bg-gray-700/30" : "bg-gray-50"}>
                          <td colSpan="6" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <DetailItem
                                  icon={<FaUser />}
                                  label={t.employee}
                                  value={request.requesterName}
                                  darkMode={darkMode}
                                />
                                <DetailItem
                                  icon={<FaEnvelope />}
                                  label={t.email}
                                  value={request.requesterEmail}
                                  darkMode={darkMode}
                                />
                                <DetailItem
                                  icon={<FaBuilding />}
                                  label={t.department}
                                  value={request.department}
                                  darkMode={darkMode}
                                />
                              </div>
                              
                              <div className="space-y-3">
                                <DetailItem
                                  icon={<FaCalendarAlt />}
                                  label={t.startDate}
                                  value={new Date(request.startDate).toLocaleDateString()}
                                  darkMode={darkMode}
                                />
                                <DetailItem
                                  icon={<FaCalendarAlt />}
                                  label={t.endDate}
                                  value={new Date(request.endDate).toLocaleDateString()}
                                  darkMode={darkMode}
                                />
                                <DetailItem
                                  icon={<FaFileAlt />}
                                  label={t.reason}
                                  value={request.reason}
                                  darkMode={darkMode}
                                />
                              </div>

                              {/* Attachments */}
                              {request.attachments && request.attachments.length > 0 && (
                                <div className="md:col-span-2">
                                  <p className="text-sm font-medium mb-2">{t.attachments}:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {request.attachments.map((file, index) => (
                                      <a
                                        key={index}
                                        href={typeof file === 'object' ? file.url : `${BACKEND_URL}/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`px-3 py-1 rounded flex items-center gap-2 text-sm ${
                                          darkMode 
                                            ? "bg-gray-700 hover:bg-gray-600 text-blue-400" 
                                            : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                                        }`}
                                      >
                                        <FaFileAlt />
                                        {typeof file === 'object' ? file.name : file.split("/").pop()}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My Leave Requests Table */}
      {activeTab === "myLeave" && (
        <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="p-4 text-left font-medium">{t.startDate}</th>
                  <th className="p-4 text-left font-medium">{t.endDate}</th>
                  <th className="p-4 text-left font-medium">{t.reason}</th>
                  <th className="p-4 text-left font-medium">{t.status}</th>
                  <th className="p-4 text-left font-medium">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      {t.noLeaveRequests}
                    </td>
                  </tr>
                ) : (
                  myLeaves.map((request) => (
                    <tr key={request._id} className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                      <td className="p-4">
                        {new Date(request.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs truncate">{request.reason}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {t[request.status] || request.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                        >
                          <FaTrash />
                          {t.delete}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value, darkMode, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <div className="flex items-center gap-2 mb-1">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
    <p className={`font-medium ${fullWidth ? "break-words" : ""}`}>{value || <span className="text-gray-400 italic">N/A</span>}</p>
  </div>
);

export default DeptHeadLeaveRequests;