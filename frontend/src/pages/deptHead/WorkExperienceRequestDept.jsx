import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

// Inline SVG Icons - COMPLETE SET
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
  ),
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

const WorkExperienceRequest = () => {
  const [form, setForm] = useState({
    reason: "",
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const [requestLetterFile, setRequestLetterFile] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState({
    fullName: "",
    department: "",
    email: "",
    employeeId: "",
    position: "",
    experience: ""
  });
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserLoading(true);
        
        // Try multiple endpoints
        let employeeData = null;
        
        // Try dashboard endpoint first (most likely to work)
        try {
          const { data: dashboardData } = await axiosInstance.get("/employee/dashboard");
          employeeData = dashboardData;
          console.log("Got data from /employee/dashboard");
        } catch (dashboardError) {
          console.log("Dashboard endpoint failed, trying /employee/my-profile");
          
          // Try my-profile endpoint
          try {
            const { data: profileData } = await axiosInstance.get("/employee/my-profile");
            employeeData = profileData;
            console.log("Got data from /employee/my-profile");
          } catch (profileError) {
            console.log("Profile endpoint failed, using localStorage");
            
            // Fallback to localStorage
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            employeeData = user;
          }
        }
        
        if (employeeData) {
          // Extract full name
          const fullName = employeeData.firstName && employeeData.lastName 
            ? `${employeeData.firstName} ${employeeData.middleName || ''} ${employeeData.lastName}`.trim()
            : employeeData.name || "Not Available";
          
          // Extract employee ID
          const employeeId = employeeData.empId || employeeData.employeeId || "N/A";
          
          // Extract department
          let department = "Software Engineering"; // Default
          if (employeeData.department) {
            if (typeof employeeData.department === 'object') {
              department = employeeData.department.name || "Software Engineering";
            } else {
              department = employeeData.department;
            }
          }
          
          // Extract position
          const position = employeeData.typeOfPosition || employeeData.position || "N/A";
          
          setEmployeeInfo({
            fullName: fullName.replace(/\s+/g, ' '), // Remove extra spaces
            department: department,
            email: employeeData.email || "N/A",
            employeeId: employeeId,
            position: position,
            experience: employeeData.experience || "N/A"
          });
        }
      } catch (err) {
        console.error("Error in fetchUserInfo:", err);
        // Set defaults
        setEmployeeInfo({
          fullName: "Not Available",
          department: "Software Engineering",
          email: "N/A",
          employeeId: "N/A",
          position: "N/A",
          experience: "N/A"
        });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

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

  // Handle file upload
  const handleRequestLetterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return;
    }

    setRequestLetterFile(file);
    setError("");
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!form.reason.trim()) {
      setError("Please provide a reason for your request");
      return;
    }

    if (form.reason.trim().length < 20) {
      setError("Reason should be at least 20 characters long");
      return;
    }

    setSubmitLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("reason", form.reason);
      formData.append("department", employeeInfo.department);
      
      if (requestLetterFile) {
        formData.append("requestLetter", requestLetterFile);
      }
      
      const response = await axiosInstance.post("/work-experience", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess("Work experience request submitted successfully!");
        setForm({ reason: "" });
        setRequestLetterFile(null);
        fetchMyRequests();
        setActiveTab("history");
        
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

  // Fixed Download Certificate Function using axios blob
  const downloadCertificate = async (requestId) => {
    if (!requestId) {
      setError("Invalid request ID");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      // Show loading message
      const originalError = error;
      setError("Downloading certificate... Please wait.");
      
      // Use axiosInstance which already has the token in headers
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob' // Important for file downloads
      });
      
      // Clear loading message
      setError(originalError);
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `work-experience-certificate-${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Download error:", error);
      setError(error.response?.data?.message || "Failed to download certificate. Please try again.");
    }
  };

  // Fixed View Certificate Function using axios blob
  const viewCertificate = async (requestId) => {
    if (!requestId) {
      setError("Invalid request ID");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      // Show loading message
      const originalError = error;
      setError("Loading certificate... Please wait.");
      
      // Use axiosInstance which already has the token in headers
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob'
      });
      
      // Clear loading message
      setError(originalError);
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf'
      });
      
      // Create object URL for viewing
      const url = window.URL.createObjectURL(blob);
      
      // Try to open in new tab
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        setError("Please allow popups to view the certificate");
        // If popup blocked, download instead
        downloadCertificate(requestId);
      }
      
      // Note: We don't revoke the URL here as it's being used by the new window
      // The browser will clean it up when the window is closed
      
    } catch (error) {
      console.error("View error:", error);
      setError(error.response?.data?.message || "Failed to view certificate. Please try again.");
    }
  };

  // Fixed Download Request Letter Function
  const downloadRequestLetter = async (requestLetterUrl) => {
    if (!requestLetterUrl) {
      setError("No request letter found");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      // Show loading message
      const originalError = error;
      setError("Downloading request letter... Please wait.");
      
      // If it's a relative URL, we need to handle it differently
      if (!requestLetterUrl.startsWith('http')) {
        // For relative URLs, use axiosInstance
        const response = await axiosInstance.get(requestLetterUrl, {
          responseType: 'blob'
        });
        
        // Clear loading message
        setError(originalError);
        
        // Create blob from response
        const blob = new Blob([response.data], { 
          type: response.headers['content-type'] || 'application/pdf'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from URL or response headers
        let filename = 'request-letter.pdf';
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // For absolute URLs, just open in new window
        // Clear loading message
        setError(originalError);
        window.open(requestLetterUrl, '_blank');
      }
      
    } catch (error) {
      console.error("Download error:", error);
      setError(error.response?.data?.message || "Failed to download request letter. Please try again.");
    }
  };

  // Add an effect to ensure token is available for downloads
  useEffect(() => {
    // Ensure the authorization token is available
    const token = axiosInstance.defaults.headers.common['Authorization'];
    if (token && !localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', token);
    }
  }, []);

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
              <Icons.X className="w-5 h-5" />
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
                      </p>
                      
                      {/* User Info Display */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Icons.User className="w-5 h-5 text-purple-600" />
                          Your Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Full Name</p>
                            <p className="font-medium text-gray-900">
                              {userLoading ? "Loading..." : employeeInfo.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Employee ID</p>
                            <p className="font-medium text-gray-900">
                              {userLoading ? "Loading..." : employeeInfo.employeeId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Department</p>
                            <p className="font-medium text-gray-900">
                              {userLoading ? "Loading..." : employeeInfo.department}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Position</p>
                            <p className="font-medium text-gray-900">
                              {userLoading ? "Loading..." : employeeInfo.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Request <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                          placeholder="Please provide a detailed reason for your work experience certificate request..."
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

                      {/* Upload Request Letter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Formal Request Letter (Optional)
                        </label>
                        <div className="space-y-3">
                          <div className={`border-2 border-dashed ${requestLetterFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-purple-500'} rounded-xl p-6 transition-all`}>
                            <div className="text-center">
                              <Icons.Upload className={`w-10 h-10 mx-auto mb-3 ${requestLetterFile ? 'text-green-600' : 'text-gray-400'}`} />
                              <p className="text-sm text-gray-600 mb-2">
                                {requestLetterFile ? requestLetterFile.name : 'Drag & drop your PDF file here, or click to browse'}
                              </p>
                              <p className="text-xs text-gray-500 mb-4">
                                Max file size: 5MB • PDF format only
                              </p>
                              <label className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                                <span>Browse Files</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,application/pdf"
                                  onChange={handleRequestLetterUpload}
                                />
                              </label>
                            </div>
                          </div>
                          
                          {requestLetterFile && (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Icons.FileText className="w-5 h-5 text-green-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{requestLetterFile.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {(requestLetterFile.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setRequestLetterFile(null)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Icons.X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
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
                                    {request.department || employeeInfo.department}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Icons.Calendar className="w-4 h-4" />
                                    Requested: {formatDate(request.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Right side - Actions */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {request.letterPdf?.url ? (
                                  <>
                                    <button
                                      onClick={() => viewCertificate(request._id)}
                                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-blue-200"
                                    >
                                      <Icons.Eye className="w-4 h-4" />
                                      View
                                    </button>
                                    <button
                                      onClick={() => downloadCertificate(request._id)}
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

          {/* Right Column */}
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
                    <p className="text-sm text-gray-600">Fill out the form with reason and upload request letter</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">HR Review</h4>
                    <p className="text-sm text-gray-600">HR department reviews your request</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Certificate Generation</h4>
                    <p className="text-sm text-gray-600">HR generates official certificate</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Download</h4>
                    <p className="text-sm text-gray-600">Download certificate from request history</p>
                  </div>
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
            Work experience certificates are official documents. Please ensure all information is accurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceRequest;