import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

// Inline SVG Icons - same as before
const Icons = {
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  UserCheck: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

const WorkExperienceDetailModal = ({ request, close, refresh }) => {
  const [adminReason, setAdminReason] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("details");
  const contentRef = useRef(null);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "Pending";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "completed": return "Completed";
      default: return status || "Unknown";
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        setError("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  // Update status
  const updateStatus = async (status) => {
    if (status === "rejected" && !adminReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.put(
        `/work-experience/${request._id}/status`,
        { 
          status: status.toLowerCase(), 
          adminReason: adminReason || "" 
        }
      );

      if (response.data.success) {
        setSuccess(`Request ${status.toLowerCase()} successfully`);
        setTimeout(() => {
          refresh();
          close();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Generate letter
  const generateLetter = async () => {
    if (request.status?.toLowerCase() !== "approved") {
      setError("Request must be approved before generating letter");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post(
        `/work-experience/${request._id}/generate`
      );

      if (response.data.success) {
        setSuccess("Letter generated successfully");
        setTimeout(() => {
          refresh();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to generate letter");
      }
    } catch (err) {
      console.error("Generate letter error:", err);
      setError(err.response?.data?.message || "Failed to generate letter");
    } finally {
      setLoading(false);
    }
  };

  // Upload PDF
  const uploadPdf = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (request.status?.toLowerCase() !== "approved") {
      setError("Request must be approved before uploading letter");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axiosInstance.post(
        `/work-experience/${request._id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSuccess("Letter uploaded successfully");
        setTimeout(() => {
          refresh();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to upload letter");
      }
    } catch (err) {
      console.error("Upload PDF error:", err);
      setError(err.response?.data?.message || "Failed to upload letter");
    } finally {
      setLoading(false);
    }
  };

  // Send letter to user
  const sendLetter = async () => {
    if (!request.letterPdf?.url) {
      setError("No letter found. Please generate or upload a letter first");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post(
        `/work-experience/${request._id}/send`
      );

      if (response.data.success) {
        setSuccess("Letter sent to user successfully");
        setTimeout(() => {
          refresh();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to send letter");
      }
    } catch (err) {
      console.error("Send letter error:", err);
      setError(err.response?.data?.message || "Failed to send letter");
    } finally {
      setLoading(false);
    }
  };

  // Download letter
  const downloadLetter = () => {
    if (request.letterPdf?.url) {
      window.open(`${axiosInstance.defaults.baseURL}${request.letterPdf.url}`, '_blank');
    }
  };

  // View letter
  const viewLetter = () => {
    if (request.letterPdf?.url) {
      window.open(`${axiosInstance.defaults.baseURL}${request.letterPdf.url}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    setAdminReason("");
    setFile(null);
    setFileName("");
    setError("");
    setSuccess("");
    setActiveTab("details");
  }, [request]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Work Experience Request Details</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
                <span className="text-white/80 text-sm">
                  ID: {request._id?.substring(0, 8)}...
                </span>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <Icons.Calendar className="w-4 h-4" />
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
            <button
              onClick={close}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <Icons.X />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium transition-all flex-1 text-center ${activeTab === "details" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`px-6 py-3 font-medium transition-all flex-1 text-center ${activeTab === "actions" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Actions
            </button>
            <button
              onClick={() => setActiveTab("letter")}
              className={`px-6 py-3 font-medium transition-all flex-1 text-center ${activeTab === "letter" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Letter
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 flex-shrink-0">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fadeIn">
              <Icons.AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 flex-1">{error}</p>
              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-800"
              >
                <Icons.X />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
              <Icons.CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 flex-1">{success}</p>
            </div>
          )}
        </div>

        {/* Content Area - Now scrollable without fixed height */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: 'calc(90vh - 250px)' }}
        >
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Main Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Icons.User className="w-5 h-5 text-purple-600" />
                      Employee Information
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                        <p className="mt-1 text-gray-900 font-medium">{request.fullName || request.requester?.name || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</label>
                        <p className="mt-1 text-gray-900 font-medium">{request.requester?.employeeId || "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Icons.Mail className="w-4 h-4 text-gray-400" />
                        {request.requester?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Role</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                          <Icons.UserCheck className="w-4 h-4" />
                          {request.requesterRole || "Employee"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Icons.Calendar className="w-5 h-5 text-blue-600" />
                      Request Information
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Department</label>
                        <p className="mt-1 text-gray-900 font-medium flex items-center gap-2">
                          <Icons.Building className="w-4 h-4 text-gray-400" />
                          {request.department || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</label>
                        <p className="mt-1 text-gray-900 font-medium">{formatDate(request.requestDate || request.createdAt)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                    {request.reviewedBy && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed By</label>
                        <p className="mt-1 text-gray-900 font-medium">{request.reviewedBy?.name || "Admin"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Request Reason</h3>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[80px]">
                    <p className="text-gray-800 whitespace-pre-wrap">{request.reason || "No reason provided"}</p>
                  </div>
                </div>
              </div>

              {/* Admin Remarks Card (if exists) */}
              {request.adminReason && (
                <div className="bg-white border border-yellow-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Icons.AlertCircle className="w-5 h-5 text-yellow-600" />
                      Admin Remarks
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <p className="text-gray-800">{request.adminReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-6">
              {/* Status Update Section */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Update Request Status</h3>
                  <p className="text-sm text-gray-600 mt-1">Approve or reject this work experience request</p>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Remarks <span className="text-gray-500">(Required for rejection)</span>
                    </label>
                    <textarea
                      placeholder="Enter your remarks here. This will be visible to the employee..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none transition-all"
                      rows="4"
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => updateStatus("approved")}
                      disabled={loading || request.status?.toLowerCase() === "approved"}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Icons.CheckCircle className="w-5 h-5" />
                          Approve Request
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => updateStatus("rejected")}
                      disabled={loading || request.status?.toLowerCase() === "rejected"}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Icons.XCircle className="w-5 h-5" />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>

              {/* Letter Management Section (only if approved) */}
              {request.status?.toLowerCase() === "approved" && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Letter Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate or upload work experience letter</p>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Generate Letter */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Generate Automatic Letter</h4>
                      <button
                        onClick={generateLetter}
                        disabled={loading || request.isGenerated}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Icons.FileText className="w-5 h-5" />
                        {request.isGenerated ? "✓ Letter Already Generated" : "Generate Experience Letter"}
                      </button>
                    </div>

                    {/* Upload Letter */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Upload Custom Letter</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                            className="hidden"
                            disabled={loading}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border border-gray-300"
                          >
                            <Icons.Upload className="w-5 h-5" />
                            Select PDF File
                          </button>
                          {fileName && (
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 truncate">
                                Selected: <span className="font-medium">{fileName}</span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {file ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : ""}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={uploadPdf}
                          disabled={loading || !file}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Icons.Upload className="w-5 h-5" />
                          Upload Letter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "letter" && (
            <div className="space-y-6">
              {/* Letter Status Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Letter Information</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                        {request.letterGeneratedDate && (
                          <Icons.Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    
                    {request.letterPdf?.url && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Type</label>
                          <p className="text-gray-900 font-medium">
                            {request.isGenerated ? "System Generated" : "Admin Uploaded"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date Created</label>
                          <p className="text-gray-900 font-medium">{formatDate(request.letterGeneratedDate)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">File</label>
                          <p className="text-gray-900 font-medium truncate">
                            {request.letterPdf.url.split('/').pop()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Letter Actions */}
              {request.letterPdf?.url ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Letter Actions</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage the work experience letter</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={viewLetter}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Icons.Eye className="w-5 h-5" />
                        View Letter
                      </button>
                      <button
                        onClick={downloadLetter}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Icons.Download className="w-5 h-5" />
                        Download Letter
                      </button>
                      <button
                        onClick={sendLetter}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Icons.Send className="w-5 h-5" />
                        Send to Employee
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Letter Available</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {request.status?.toLowerCase() === "approved"
                        ? "Generate or upload a work experience letter to proceed. The letter will be available for the employee to download."
                        : "This request must be approved before you can generate or upload a letter."}
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setActiveTab("actions")}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Go to Actions Tab
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Icons.Clock className="w-4 h-4" />
              Last updated: {formatDate(request.updatedAt)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-medium transition-colors shadow-sm"
              >
                Close
              </button>
              <button
                onClick={refresh}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4 animate-spin hidden" id="refresh-spinner">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add CSS animation
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default WorkExperienceDetailModal;