import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

// Inline SVG Icons
const Icons = {
  FileText: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  RefreshCw: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};

const WorkExperienceRequest = () => {
  const [form, setForm] = useState({
    fullName: "",
    department: "",
    reason: "",
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("new");

  // Get user info from localStorage or API
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Icons.Clock className="w-4 h-4" />;
      case "approved":
        return <Icons.CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <Icons.XCircle className="w-4 h-4" />;
      case "completed":
        return <Icons.Check className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "Pending Review";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "completed": return "Letter Ready";
      default: return status || "Unknown";
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.reason.trim()) {
      setError("Please provide a reason for your request");
      return;
    }

    setSubmitLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post("/work-experience", {
        ...form,
        fullName: user.name || form.fullName,
        department: user.department || form.department,
      });

      if (response.data.success) {
        setSuccess("Work experience request submitted successfully!");
        setForm({ fullName: "", department: "", reason: "" });
        fetchMyRequests();
        setActiveTab("history");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fetch user's requests
  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/work-experience/my");
      setRequests(Array.isArray(data?.data) ? data.data : data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  // Download letter
  const downloadLetter = (letterPdf) => {
    if (letterPdf?.url) {
      window.open(`${axiosInstance.defaults.baseURL}${letterPdf.url}`, '_blank');
    }
  };

  // View letter
  const viewLetter = (letterPdf) => {
    if (letterPdf?.url) {
      window.open(`${axiosInstance.defaults.baseURL}${letterPdf.url}`, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Work Experience Request
          </h1>
          <p className="text-gray-600">
            Request your work experience certificate for official purposes
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <Icons.AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              <Icons.XCircle />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <Icons.CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 flex-1">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("new")}
                  className={`flex-1 py-4 font-medium text-center transition-all ${activeTab === "new" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icons.Plus className="w-4 h-4" />
                    New Request
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-4 font-medium text-center transition-all ${activeTab === "history" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icons.FileText className="w-4 h-4" />
                    Request History
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {requests.length}
                    </span>
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "new" ? (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Submit New Request</h2>
                      <p className="text-gray-600 mb-6">
                        Fill out the form below to request your work experience certificate. 
                        This certificate can be used for visa applications, higher studies, or other official purposes.
                      </p>
                      
                      {/* Info Box */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Icons.AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Important Information</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Requests are typically processed within 3-5 working days</li>
                              <li>• You will be notified via email when your certificate is ready</li>
                              <li>• Please provide clear and detailed reason for your request</li>
                              <li>• Contact HR department for urgent requests</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                      {/* User Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Icons.User className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50"
                              placeholder="John Doe"
                              value={user.name || form.fullName}
                              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                              required
                              disabled={!!user.name}
                            />
                          </div>
                          {user.name && (
                            <p className="mt-1 text-xs text-gray-500">Auto-filled from your profile</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Icons.Building className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50"
                              placeholder="Engineering Department"
                              value={user.department || form.department}
                              onChange={(e) => setForm({ ...form, department: e.target.value })}
                              required
                              disabled={!!user.department}
                            />
                          </div>
                          {user.department && (
                            <p className="mt-1 text-xs text-gray-500">Auto-filled from your profile</p>
                          )}
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Request <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                          placeholder="Please provide a detailed reason for your work experience certificate request (e.g., For visa application, higher studies, job application, etc.)"
                          rows="5"
                          value={form.reason}
                          onChange={(e) => setForm({ ...form, reason: e.target.value })}
                          required
                        />
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            Minimum 20 characters
                          </p>
                          <p className={`text-xs ${form.reason.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                            {form.reason.length}/500
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={submitLoading || form.reason.length < 20}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          {submitLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting Request...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Icons.Send className="w-5 h-5" />
                              Submit Work Experience Request
                            </div>
                          )}
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-3">
                          Your request will be reviewed by the HR department
                        </p>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Request History</h2>
                      <button
                        onClick={fetchMyRequests}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>

                    {loading ? (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your requests...</p>
                      </div>
                    ) : requests.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icons.FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't submitted any work experience requests yet.</p>
                        <button
                          onClick={() => setActiveTab("new")}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Submit Your First Request
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <div
                            key={request._id}
                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Left side - Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                                    {getStatusIcon(request.status)}
                                    {getStatusLabel(request.status)}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(request.createdAt)}
                                  </span>
                                </div>
                                
                                <p className="text-gray-700 mb-2 line-clamp-2">
                                  <span className="font-medium">Reason:</span> {request.reason}
                                </p>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Icons.Building className="w-4 h-4" />
                                    {request.department}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Icons.Calendar className="w-4 h-4" />
                                    Requested: {formatDate(request.requestDate)}
                                  </div>
                                </div>
                              </div>

                              {/* Right side - Actions */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {request.letterPdf?.url ? (
                                  <>
                                    <button
                                      onClick={() => viewLetter(request.letterPdf)}
                                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-blue-200"
                                    >
                                      <Icons.Eye className="w-4 h-4" />
                                      View
                                    </button>
                                    <button
                                      onClick={() => downloadLetter(request.letterPdf)}
                                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-green-200"
                                    >
                                      <Icons.Download className="w-4 h-4" />
                                      Download
                                    </button>
                                  </>
                                ) : request.status?.toLowerCase() === "rejected" && request.adminReason ? (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700 font-medium mb-1">Request Rejected</p>
                                    <p className="text-xs text-red-600">{request.adminReason}</p>
                                  </div>
                                ) : (
                                  <div className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 flex items-center gap-2">
                                    <Icons.Clock className="w-4 h-4" />
                                    Processing...
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Request Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icons.FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Requests</p>
                      <p className="text-xl font-bold text-gray-900">{requests.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Clock className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs font-medium text-yellow-800">Pending</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {requests.filter(r => r.status?.toLowerCase() === "pending").length}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-xs font-medium text-green-800">Approved</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {requests.filter(r => r.status?.toLowerCase() === "approved").length}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Check className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-800">Completed</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {requests.filter(r => r.status?.toLowerCase() === "completed").length}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-xs font-medium text-red-800">Rejected</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {requests.filter(r => r.status?.toLowerCase() === "rejected").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Submit Request</h4>
                    <p className="text-sm text-gray-600">Fill out the request form with your details and reason</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Admin Review</h4>
                    <p className="text-sm text-gray-600">HR department reviews and approves your request</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Letter Generation</h4>
                    <p className="text-sm text-gray-600">Official work experience letter is generated</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Download</h4>
                    <p className="text-sm text-gray-600">Download your certificate from request history</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact HR department for any questions about work experience certificates
                </p>
                <div className="text-sm">
                  <p className="text-gray-700">📧 hr@company.com</p>
                  <p className="text-gray-700">📞 +251-XXX-XXXXXX</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("new")}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Icons.Plus className="w-5 h-5" />
                  New Request
                </button>
                <button
                  onClick={fetchMyRequests}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Icons.RefreshCw className="w-5 h-5" />
                  Refresh List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Work experience certificates are official documents. Please ensure all information is accurate before submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceRequest;