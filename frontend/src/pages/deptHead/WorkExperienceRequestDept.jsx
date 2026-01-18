import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";

// Translations - Add delete translations
const translations = {
  en: {
    title: "Work Experience Request",
    subtitle: "Request your work experience certificate for official purposes",
    newRequest: "New Request",
    requestHistory: "Request History",
    submitRequest: "Submit Work Experience Request",
    submitFirstRequest: "Submit Your First Request",
    submit: "Submit",
    refresh: "Refresh",
    yourInformation: "Your Information",
    fullName: "Full Name",
    employeeID: "Employee ID",
    department: "Department",
    position: "Position",
    experience: "Experience",
    reasonForRequest: "Reason for Request",
    reasonPlaceholder: "Please provide a detailed reason for your work experience certificate request...",
    minimumCharacters: "Minimum 20 characters",
    uploadRequestLetter: "Upload Formal Request Letter (Optional)",
    dragDrop: "Drag & drop your PDF file here, or click to browse",
    maxFileSize: "Max file size: 5MB • PDF format only",
    browseFiles: "Browse Files",
    submittingRequest: "Submitting Request...",
    loadingRequests: "Loading your requests...",
    noRequests: "No Requests Yet",
    havenotSubmitted: "You haven't submitted any work experience requests yet.",
    requestStatistics: "Request Statistics",
    totalRequests: "Total Requests",
    pending: "Pending",
    approved: "Approved",
    completed: "Completed",
    rejected: "Rejected",
    howItWorks: "How It Works",
    step1: "Submit Request",
    step1Desc: "Fill out the form with reason and upload request letter",
    step2: "HR Review",
    step2Desc: "HR department reviews your request",
    step3: "Certificate Generation",
    step3Desc: "HR generates official certificate",
    step4: "Download",
    step4Desc: "Download certificate from request history",
    quickActions: "Quick Actions",
    footerNote: "Work experience certificates are official documents. Please ensure all information is accurate.",
    errorRequired: "Please provide a reason for your request",
    errorMinLength: "Reason should be at least 20 characters long",
    errorPDFOnly: "Please upload a PDF file only.",
    errorFileSize: "File size should be less than 5MB.",
    successSubmit: "Work experience request submitted successfully!",
    deleteConfirm: "Delete this request?",
    deleteSuccess: "Request deleted successfully",
    deleteFailed: "Failed to delete request",
    updateFailed: "Update failed",
    view: "View",
    download: "Download",
    delete: "Delete",
    processing: "Processing...",
    requestRejected: "Request Rejected",
    deleting: "Deleting...",
    deleteTitle: "Confirm Delete",
    deleteMessage: "Are you sure you want to delete this request? This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Yes, Delete",
    onlyPendingCanDelete: "Only pending requests can be deleted",
    actionFailed: "Action failed",
  },
  am: {
    title: "የሥራ ልምድ ጥያቄ",
    subtitle: "ለሥራ ልምድ ማረጋገጫ ለሚሰጡት ሰነዶች ያቅርቡ",
    newRequest: "አዲስ ጥያቄ",
    requestHistory: "የጥያቄ ታሪክ",
    submitRequest: "የሥራ ልምድ ጥያቄ አስገባ",
    submitFirstRequest: "የመጀመሪያ ጥያቄዎን አስገባ",
    submit: "አስገባ",
    refresh: "አድስ",
    yourInformation: "የእርስዎ መረጃ",
    fullName: "ሙሉ ስም",
    employeeID: "የሰራተኛ መለያ",
    department: "ክፍል",
    position: "ስራ",
    experience: "ልምድ",
    reasonForRequest: "የጥያቄ ምክንያት",
    reasonPlaceholder: "ለሥራ ልምድ ማረጋገጫ ጥያቄዎ ዝርዝር ምክንያት ይስጡ...",
    minimumCharacters: "ቢያንስ 20 ፊደላት",
    uploadRequestLetter: "የጥያቄ ደብዳቤ ይጫኑ (አማራጭ)",
    dragDrop: "PDF ፋይልዎን እዚህ ይጣል ወይም ለማሰስ ጠቅ ያድርጉ",
    maxFileSize: "ከፍተኛ ፋይል መጠን: 5MB • PDF ቅርጸት ብቻ",
    browseFiles: "ፋይሎችን ያስሱ",
    submittingRequest: "ጥያቄ በመላክ ላይ...",
    loadingRequests: "ጥያቄዎችዎ በመጫን ላይ...",
    noRequests: "እስካሁን ምንም ጥያቄዎች የሉም",
    havenotSubmitted: "እስካሁን ምንም የሥራ ልምድ ጥያቄዎች አላስገቡም።",
    requestStatistics: "የጥያቄ ስታቲስቲክስ",
    totalRequests: "ጠቅላላ ጥያቄዎች",
    pending: "በመጠባበቅ ላይ",
    approved: "የተፈቀደ",
    completed: "የተጠናቀቀ",
    rejected: "የተቀቀለ",
    howItWorks: "እንዴት እንደሚሰራ",
    step1: "ጥያቄ አስገባ",
    step1Desc: "የጥያቄ ቅጹን በምክንያት እና የጥያቄ ደብዳቤ ጫን ይሙሉ",
    step2: "ሰብአዊ ሀብት ግምገማ",
    step2Desc: "የሰብአዊ ሀብት ክፍል ጥያቄዎን ይገመግማል",
    step3: "ማረጋገጫ ማመንጨት",
    step3Desc: "ሰብአዊ ሀብት አግባብነት ያለው ማረጋገጫ ያመነጫል",
    step4: "ማውረድ",
    step4Desc: "ማረጋገጫውን ከጥያቄ ታሪክ ያውርዱ",
    quickActions: "ፈጣን ተግባራት",
    footerNote: "የሥራ ልምድ ማረጋገጫዎች አግባብነት ያላቸው ሰነዶች ናቸው። ሁሉም መረጃ ትክክል መሆኑን ያረጋግጡ።",
    errorRequired: "ለጥያቄዎ ምክንያት ይስጡ",
    errorMinLength: "ምክንያቱ ቢያንስ 20 ፊደላት መሆን አለበት",
    errorPDFOnly: "እባክዎን PDF ፋይል ብቻ ይጫኑ።",
    errorFileSize: "የፋይል መጠን ከ5MB ያነሰ መሆን አለበት።",
    successSubmit: "የሥራ ልምድ ጥያቄ በሚገባ ቀርቧል!",
    deleteConfirm: "ይህን ጥያቄ ማጥፋት ትፈልጋለህ?",
    deleteSuccess: "ጥያቄ በተሳካ ሁኔታ ተሰርዟል",
    deleteFailed: "ጥያቄ ማጥፋት አልተቻለም",
    updateFailed: "ማዘምን አልተቻለም",
    view: "እይ",
    download: "ማውረድ",
    delete: "ሰርዝ",
    processing: "በማቀናበር ላይ...",
    requestRejected: "ጥያቄ ተቀቅሏል",
    deleting: "በመሰረዝ ላይ...",
    deleteTitle: "ማረጋገጫ ሰርዝ",
    deleteMessage: "ይህን ጥያቄ ማጥፋት እርግጠኛ ነዎት? ይህ ተግባር መመለስ አይችልም።",
    cancel: "ይቅር",
    confirmDelete: "አዎ፣ ሰርዝ",
    onlyPendingCanDelete: "በመጠባበቅ ላይ ያሉ ጥያቄዎች ብቻ ሊሰረዙ ይችላሉ",
    actionFailed: "ተግባሩ አልተሳካም",
  },
};

// Inline SVG Icons - Add Trash icon
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
  ),
  Trash: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Info: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const WorkExperienceRequest = () => {
  const { user } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

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
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Fetch user info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserLoading(true);
        
        const response = await axiosInstance.get("/employees/dashboard");
        const employeeData = response.data;
        
        if (employeeData) {
          const fullName = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim();
          
          let department = "Software Engineering";
          if (employeeData.department) {
            if (typeof employeeData.department === 'object' && employeeData.department.name) {
              department = employeeData.department.name;
            } else if (typeof employeeData.department === 'string') {
              department = employeeData.department;
            }
          }
          
          let experience = employeeData.experience || "N/A";
          
          if (!employeeData.experience && employeeData.startDate) {
            try {
              const startDate = new Date(employeeData.startDate);
              const currentDate = new Date();
              let years = currentDate.getFullYear() - startDate.getFullYear();
              const monthDiff = currentDate.getMonth() - startDate.getMonth();
              
              if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < startDate.getDate())) {
                years--;
              }
              
              if (years >= 0) {
                experience = `${years} year${years !== 1 ? 's' : ''}`;
              }
            } catch (dateError) {
              console.error("Error calculating experience:", dateError);
            }
          }
          
          setEmployeeInfo({
            fullName: fullName || (language === "en" ? "Not Available" : "የለም"),
            department: department || (language === "en" ? "Software Engineering" : "ሶፍትዌር ምህንድስና"),
            email: employeeData.email || "N/A",
            employeeId: employeeData.empId || employeeData.employeeId || "N/A",
            position: employeeData.typeOfPosition || employeeData.position || "N/A",
            experience: experience
          });
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setEmployeeInfo({
          fullName: language === "en" ? "Not Available" : "የለም",
          department: language === "en" ? "Software Engineering" : "ሶፍትዌር ምህንድስና",
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
  }, [language]);

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    if (language === "am") {
      const date = new Date(dateString);
      return date.toLocaleDateString('am-ET', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
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
    const base = darkMode ? {
      pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
      approved: "bg-green-900/30 text-green-400 border-green-800/50",
      rejected: "bg-red-900/30 text-red-400 border-red-800/50",
      completed: "bg-blue-900/30 text-blue-400 border-blue-800/50",
      default: "bg-gray-800 text-gray-400 border-gray-700"
    } : {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      completed: "bg-blue-100 text-blue-800 border border-blue-200",
      default: "bg-gray-100 text-gray-800 border border-gray-200"
    };

    switch (status?.toLowerCase()) {
      case "pending":
        return base.pending;
      case "approved":
        return base.approved;
      case "rejected":
        return base.rejected;
      case "completed":
        return base.completed;
      default:
        return base.default;
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

  // Get status label based on language
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": 
        return language === "en" ? "Pending Review" : "በግምገማ ላይ";
      case "approved": 
        return language === "en" ? "Approved" : "የተፈቀደ";
      case "rejected": 
        return language === "en" ? "Rejected" : "የተቀቀለ";
      case "completed": 
        return language === "en" ? "Letter Ready" : "ደብዳቤ ዝግጁ ነው";
      default: 
        return status || (language === "en" ? "Unknown" : "የማይታወቅ");
    }
  };

  // Check if request can be deleted (only pending requests)
  const canDeleteRequest = (status) => {
    return status?.toLowerCase() === "pending";
  };

  // Handle file upload
  const handleRequestLetterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError(t.errorPDFOnly);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t.errorFileSize);
      return;
    }

    setRequestLetterFile(file);
    setError("");
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!form.reason.trim()) {
      setError(t.errorRequired);
      return;
    }

    if (form.reason.trim().length < 20) {
      setError(t.errorMinLength);
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
        setSuccess(t.successSubmit);
        setForm({ reason: "" });
        setRequestLetterFile(null);
        fetchMyRequests();
        setActiveTab("history");
        
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || (language === "en" ? "Failed to submit request" : "ጥያቄ ማስገባት አልተቻለም"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || (language === "en" ? "Failed to submit request" : "ጥያቄ ማስገባት አልተቻለም"));
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
      setError(language === "en" ? "Failed to load your requests" : "ጥያቄዎችዎን መጫን አልተቻለም");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    setDeletingId(requestToDelete._id);
    
    try {
      const response = await axiosInstance.delete(`/work-experience/${requestToDelete._id}`);
      
      if (response.data.success) {
        setSuccess(t.deleteSuccess);
        // Remove the deleted request from the list
        setRequests(prev => prev.filter(req => req._id !== requestToDelete._id));
        setShowDeleteModal(false);
        setRequestToDelete(null);
        
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || t.deleteFailed);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || t.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (request) => {
    if (!canDeleteRequest(request.status)) {
      setError(t.onlyPendingCanDelete);
      return;
    }
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  // Download Certificate Function
  const downloadCertificate = async (requestId) => {
    if (!requestId) {
      setError(language === "en" ? "Invalid request ID" : "ልክ ያልሆነ የጥያቄ መለያ");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      const originalError = error;
      setError(language === "en" ? "Downloading certificate... Please wait." : "ማረጋገጫ በማውረድ ላይ... እባክዎ ይጠብቁ።");
      
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob'
      });
      
      setError(originalError);
      
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `work-experience-certificate-${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Download error:", error);
      setError(error.response?.data?.message || (language === "en" ? "Failed to download certificate. Please try again." : "ማረጋገጫ ማውረድ አልተቻለም። እባክዎ ደግሙ።"));
    }
  };

  // View Certificate Function
  const viewCertificate = async (requestId) => {
    if (!requestId) {
      setError(language === "en" ? "Invalid request ID" : "ልክ ያልሆነ የጥያቄ መለያ");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      const originalError = error;
      setError(language === "en" ? "Loading certificate... Please wait." : "ማረጋገጫ በመጫን ላይ... እባክዎ ይጠብቁ።");
      
      const response = await axiosInstance.get(`/work-experience/${requestId}/download`, {
        responseType: 'blob'
      });
      
      setError(originalError);
      
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        setError(language === "en" ? "Please allow popups to view the certificate" : "ማረጋገጫውን ለማየት ፖፕአፕስ ይፍቀዱ");
        downloadCertificate(requestId);
      }
      
    } catch (error) {
      console.error("View error:", error);
      setError(error.response?.data?.message || (language === "en" ? "Failed to view certificate. Please try again." : "ማረጋገጫ መመልከት አልተቻለም። እባክዎ ደግሙ።"));
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Theme-based class generator
  const themeClass = (lightClass, darkClass) => {
    return darkMode ? darkClass : lightClass;
  };

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      themeClass(
        "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50",
        "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      )
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            themeClass("text-gray-900", "text-gray-100")
          }`}>
            {t.title}
          </h1>
          <p className={themeClass("text-gray-600", "text-gray-400")}>
            {t.subtitle}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            themeClass(
              "bg-red-50 border border-red-200",
              "bg-red-900/30 border border-red-800/50"
            )
          }`}>
            <Icons.AlertCircle className={`w-5 h-5 flex-shrink-0 ${
              themeClass("text-red-500", "text-red-400")
            }`} />
            <p className={themeClass("text-red-700", "text-red-300") + " flex-1"}>
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className={themeClass("text-red-600 hover:text-red-800", "text-red-400 hover:text-red-300")}
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            themeClass(
              "bg-green-50 border border-green-200",
              "bg-green-900/30 border border-green-800/50"
            )
          }`}>
            <Icons.CheckCircle className={`w-5 h-5 flex-shrink-0 ${
              themeClass("text-green-500", "text-green-400")
            }`} />
            <p className={themeClass("text-green-700", "text-green-300") + " flex-1"}>
              {success}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Request Form */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-xl overflow-hidden border ${
              themeClass(
                "bg-white border-gray-200",
                "bg-gray-800 border-gray-700"
              )
            }`}>
              {/* Tabs */}
              <div className={`flex border-b ${
                themeClass("border-gray-200", "border-gray-700")
              }`}>
                <button
                  onClick={() => setActiveTab("new")}
                  className={`flex-1 py-4 font-medium text-center transition-all ${
                    activeTab === "new" 
                      ? themeClass(
                          "text-purple-600 border-b-2 border-purple-600 bg-purple-50",
                          "text-purple-400 border-b-2 border-purple-400 bg-purple-900/30"
                        )
                      : themeClass(
                          "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                          "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                        )
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icons.Plus className="w-4 h-4" />
                    {t.newRequest}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-4 font-medium text-center transition-all ${
                    activeTab === "history"
                      ? themeClass(
                          "text-purple-600 border-b-2 border-purple-600 bg-purple-50",
                          "text-purple-400 border-b-2 border-purple-400 bg-purple-900/30"
                        )
                      : themeClass(
                          "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                          "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                        )
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icons.FileText className="w-4 h-4" />
                    {t.requestHistory}
                    <span className={themeClass(
                      "bg-gray-200 text-gray-700",
                      "bg-gray-700 text-gray-300"
                    ) + " text-xs font-medium px-2 py-0.5 rounded-full"}>
                      {requests.length}
                    </span>
                  </div>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "new" ? (
                  <div>
                    {/* New Request Form - same as before */}
                    <div className="mb-8">
                      <h2 className={`text-xl font-bold mb-4 ${
                        themeClass("text-gray-900", "text-gray-100")
                      }`}>
                        {language === "en" ? "Submit New Request" : "አዲስ ጥያቄ አስገባ"}
                      </h2>
                      <p className={themeClass("text-gray-600", "text-gray-400") + " mb-6"}>
                        {language === "en" 
                          ? "Fill out the form below to request your work experience certificate."
                          : "የሥራ ልምድ ማረጋገጫዎን ለመጠየቅ ከታች ያለውን ቅጽ ይሙሉ።"}
                      </p>
                      
                      {/* User Info Display */}
                      <div className={`rounded-xl p-5 mb-6 ${
                        themeClass(
                          "bg-gray-50 border border-gray-200",
                          "bg-gray-700/30 border border-gray-600"
                        )
                      }`}>
                        <h3 className={`font-medium mb-3 flex items-center gap-2 ${
                          themeClass("text-gray-900", "text-gray-100")
                        }`}>
                          <Icons.User className={`w-5 h-5 ${
                            themeClass("text-purple-600", "text-purple-400")
                          }`} />
                          {t.yourInformation}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* User info fields - same as before */}
                          <div>
                            <p className={`text-sm mb-1 ${
                              themeClass("text-gray-600", "text-gray-400")
                            }`}>
                              {t.fullName}
                            </p>
                            <p className={`font-medium ${
                              themeClass("text-gray-900", "text-gray-100")
                            }`}>
                              {userLoading ? (language === "en" ? "Loading..." : "በመጫን ላይ...") : employeeInfo.fullName}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${
                              themeClass("text-gray-600", "text-gray-400")
                            }`}>
                              {t.employeeID}
                            </p>
                            <p className={`font-medium ${
                              themeClass("text-gray-900", "text-gray-100")
                            }`}>
                              {userLoading ? (language === "en" ? "Loading..." : "በመጫን ላይ...") : employeeInfo.employeeId}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${
                              themeClass("text-gray-600", "text-gray-400")
                            }`}>
                              {t.department}
                            </p>
                            <p className={`font-medium ${
                              themeClass("text-gray-900", "text-gray-100")
                            }`}>
                              {userLoading ? (language === "en" ? "Loading..." : "በመጫን ላይ...") : employeeInfo.department}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm mb-1 ${
                              themeClass("text-gray-600", "text-gray-400")
                            }`}>
                              {t.position}
                            </p>
                            <p className={`font-medium ${
                              themeClass("text-gray-900", "text-gray-100")
                            }`}>
                              {userLoading ? (language === "en" ? "Loading..." : "በመጫን ላይ...") : employeeInfo.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                      {/* Reason textarea - same as before */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          themeClass("text-gray-700", "text-gray-300")
                        }`}>
                          {t.reasonForRequest} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className={`w-full p-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none border ${
                            themeClass(
                              "border-gray-300 bg-white",
                              "border-gray-600 bg-gray-700 text-gray-100"
                            )
                          }`}
                          placeholder={t.reasonPlaceholder}
                          rows="5"
                          value={form.reason}
                          onChange={(e) => setForm({ ...form, reason: e.target.value })}
                          required
                        />
                        <div className="flex justify-between mt-1">
                          <p className={`text-xs ${
                            themeClass("text-gray-500", "text-gray-400")
                          }`}>
                            {t.minimumCharacters}
                          </p>
                          <p className={`text-xs ${
                            form.reason.length >= 20 
                              ? themeClass("text-green-600", "text-green-400")
                              : themeClass("text-gray-500", "text-gray-400")
                          }`}>
                            {form.reason.length}/500
                          </p>
                        </div>
                      </div>

                      {/* Upload Request Letter - same as before */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          themeClass("text-gray-700", "text-gray-300")
                        }`}>
                          {t.uploadRequestLetter}
                        </label>
                        <div className="space-y-3">
                          <div className={`border-2 border-dashed rounded-xl p-6 transition-all ${
                            requestLetterFile 
                              ? themeClass(
                                  "border-green-500 bg-green-50",
                                  "border-green-400 bg-green-900/20"
                                )
                              : themeClass(
                                  "border-gray-300 hover:border-purple-500",
                                  "border-gray-600 hover:border-purple-400"
                                )
                          }`}>
                            <div className="text-center">
                              <Icons.Upload className={`w-10 h-10 mx-auto mb-3 ${
                                requestLetterFile 
                                  ? themeClass("text-green-600", "text-green-400")
                                  : themeClass("text-gray-400", "text-gray-500")
                              }`} />
                              <p className={`text-sm mb-2 ${
                                themeClass("text-gray-600", "text-gray-400")
                              }`}>
                                {requestLetterFile ? requestLetterFile.name : t.dragDrop}
                              </p>
                              <p className={`text-xs mb-4 ${
                                themeClass("text-gray-500", "text-gray-500")
                              }`}>
                                {t.maxFileSize}
                              </p>
                              <label className="inline-block px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                                <span>{t.browseFiles}</span>
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
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${
                              themeClass(
                                "bg-green-50 border-green-200",
                                "bg-green-900/20 border-green-800/50"
                              )
                            }`}>
                              <div className="flex items-center gap-3">
                                <Icons.FileText className={themeClass("text-green-600", "text-green-400") + " w-5 h-5"} />
                                <div>
                                  <p className={themeClass("font-medium text-gray-900", "font-medium text-gray-100")}>
                                    {requestLetterFile.name}
                                  </p>
                                  <p className={themeClass("text-xs text-gray-600", "text-xs text-gray-400")}>
                                    {(requestLetterFile.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setRequestLetterFile(null)}
                                className={themeClass("text-red-600 hover:text-red-800", "text-red-400 hover:text-red-300")}
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
                              {t.submittingRequest}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Icons.Send className="w-5 h-5" />
                              {t.submitRequest}
                            </div>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className={`text-xl font-bold ${
                        themeClass("text-gray-900", "text-gray-100")
                      }`}>
                        {t.requestHistory}
                      </h2>
                      <button
                        onClick={fetchMyRequests}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          themeClass(
                            "bg-gray-100 hover:bg-gray-200 text-gray-700",
                            "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          )
                        }`}
                      >
                        <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {t.refresh}
                      </button>
                    </div>

                    {loading ? (
                      <div className="py-12 text-center">
                        <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
                          themeClass(
                            "border-purple-200 border-t-purple-600",
                            "border-purple-800 border-t-purple-400"
                          )
                        }`}></div>
                        <p className={themeClass("text-gray-600", "text-gray-400")}>
                          {t.loadingRequests}
                        </p>
                      </div>
                    ) : requests.length === 0 ? (
                      <div className="text-center py-12">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          themeClass("bg-gray-100", "bg-gray-700")
                        }`}>
                          <Icons.FileText className={`w-8 h-8 ${
                            themeClass("text-gray-400", "text-gray-500")
                          }`} />
                        </div>
                        <h3 className={`text-lg font-medium mb-2 ${
                          themeClass("text-gray-900", "text-gray-100")
                        }`}>
                          {t.noRequests}
                        </h3>
                        <p className={`mb-6 ${
                          themeClass("text-gray-600", "text-gray-400")
                        }`}>
                          {t.havenotSubmitted}
                        </p>
                        <button
                          onClick={() => setActiveTab("new")}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {t.submitFirstRequest}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <div
                            key={request._id}
                            className={`rounded-xl p-5 transition-all border ${
                              themeClass(
                                "bg-white border-gray-200 hover:border-purple-300",
                                "bg-gray-700/50 border-gray-600 hover:border-purple-400/50"
                              )
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              {/* Left side - Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                                    {getStatusIcon(request.status)}
                                    {getStatusLabel(request.status)}
                                  </span>
                                  <span className={`text-sm ${
                                    themeClass("text-gray-500", "text-gray-400")
                                  }`}>
                                    {formatDate(request.createdAt)}
                                  </span>
                                </div>
                                
                                <p className={`mb-2 line-clamp-2 ${
                                  themeClass("text-gray-700", "text-gray-300")
                                }`}>
                                  <span className="font-medium">
                                    {language === "en" ? "Reason:" : "ምክንያት:"}
                                  </span> {request.reason}
                                </p>
                                
                                <div className={`flex flex-wrap gap-3 text-sm ${
                                  themeClass("text-gray-600", "text-gray-400")
                                }`}>
                                  <div className="flex items-center gap-1">
                                    <Icons.Building className="w-4 h-4" />
                                    {request.department || employeeInfo.department}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Icons.Calendar className="w-4 h-4" />
                                    {language === "en" ? "Requested:" : "ተጠይቋል:"} {formatDate(request.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Right side - Actions */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                {request.letterPdf?.url ? (
                                  <>
                                    <button
                                      onClick={() => viewCertificate(request._id)}
                                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${
                                        themeClass(
                                          "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
                                          "bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border-blue-800/50"
                                        )
                                      }`}
                                    >
                                      <Icons.Eye className="w-4 h-4" />
                                      {t.view}
                                    </button>
                                    <button
                                      onClick={() => downloadCertificate(request._id)}
                                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${
                                        themeClass(
                                          "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
                                          "bg-green-900/30 hover:bg-green-800/50 text-green-300 border-green-800/50"
                                        )
                                      }`}
                                    >
                                      <Icons.Download className="w-4 h-4" />
                                      {t.download}
                                    </button>
                                    {canDeleteRequest(request.status) && (
                                      <button
                                        onClick={() => openDeleteModal(request)}
                                        disabled={deletingId === request._id}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${
                                          themeClass(
                                            "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 disabled:opacity-50",
                                            "bg-red-900/30 hover:bg-red-800/50 text-red-300 border-red-800/50 disabled:opacity-50"
                                          )
                                        }`}
                                      >
                                        {deletingId === request._id ? (
                                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Icons.Trash className="w-4 h-4" />
                                        )}
                                        {deletingId === request._id ? t.deleting : t.delete}
                                      </button>
                                    )}
                                  </>
                                ) : request.status?.toLowerCase() === "rejected" && request.adminReason ? (
                                  <>
                                    <div className={`rounded-lg p-3 flex-1 ${
                                      themeClass(
                                        "bg-red-50 border border-red-200",
                                        "bg-red-900/30 border border-red-800/50"
                                      )
                                    }`}>
                                      <p className={`text-sm font-medium mb-1 ${
                                        themeClass("text-red-700", "text-red-300")
                                      }`}>
                                        {t.requestRejected}
                                      </p>
                                      <p className={`text-xs ${
                                        themeClass("text-red-600", "text-red-400")
                                      }`}>
                                        {request.adminReason}
                                      </p>
                                    </div>
                                    {canDeleteRequest(request.status) && (
                                      <button
                                        onClick={() => openDeleteModal(request)}
                                        disabled={deletingId === request._id}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${
                                          themeClass(
                                            "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 disabled:opacity-50",
                                            "bg-red-900/30 hover:bg-red-800/50 text-red-300 border-red-800/50 disabled:opacity-50"
                                          )
                                        }`}
                                      >
                                        {deletingId === request._id ? (
                                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Icons.Trash className="w-4 h-4" />
                                        )}
                                        {deletingId === request._id ? t.deleting : t.delete}
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="flex gap-2">
                                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                                      themeClass(
                                        "bg-gray-50 text-gray-600 border-gray-200",
                                        "bg-gray-800 text-gray-400 border-gray-700"
                                      )
                                    }`}>
                                      <Icons.Clock className="w-4 h-4" />
                                      {t.processing}
                                    </div>
                                    {canDeleteRequest(request.status) && (
                                      <button
                                        onClick={() => openDeleteModal(request)}
                                        disabled={deletingId === request._id}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${
                                          themeClass(
                                            "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 disabled:opacity-50",
                                            "bg-red-900/30 hover:bg-red-800/50 text-red-300 border-red-800/50 disabled:opacity-50"
                                          )
                                        }`}
                                      >
                                        {deletingId === request._id ? (
                                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Icons.Trash className="w-4 h-4" />
                                        )}
                                        {deletingId === request._id ? t.deleting : t.delete}
                                      </button>
                                    )}
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

          {/* Right Column - same as before */}
          {/* ... (same content as before) */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className={`rounded-2xl shadow-xl p-6 border ${
              themeClass(
                "bg-white border-gray-200",
                "bg-gray-800 border-gray-700"
              )
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                themeClass("text-gray-900", "text-gray-100")
              }`}>
                {t.requestStatistics}
              </h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  themeClass(
                    "bg-purple-50",
                    "bg-purple-900/20"
                  )
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      themeClass("bg-purple-100", "bg-purple-800/30")
                    }`}>
                      <Icons.FileText className={`w-5 h-5 ${
                        themeClass("text-purple-600", "text-purple-400")
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm ${
                        themeClass("text-gray-600", "text-gray-400")
                      }`}>
                        {t.totalRequests}
                      </p>
                      <p className={`text-xl font-bold ${
                        themeClass("text-gray-900", "text-gray-100")
                      }`}>
                        {requests.length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${
                    themeClass("bg-yellow-50", "bg-yellow-900/20")
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Clock className={`w-4 h-4 ${
                        themeClass("text-yellow-600", "text-yellow-400")
                      }`} />
                      <p className={`text-xs font-medium ${
                        themeClass("text-yellow-800", "text-yellow-300")
                      }`}>
                        {t.pending}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {requests.filter(r => r.status?.toLowerCase() === "pending").length}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    themeClass("bg-green-50", "bg-green-900/20")
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.CheckCircle className={`w-4 h-4 ${
                        themeClass("text-green-600", "text-green-400")
                      }`} />
                      <p className={`text-xs font-medium ${
                        themeClass("text-green-800", "text-green-300")
                      }`}>
                        {t.approved}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {requests.filter(r => r.status?.toLowerCase() === "approved").length}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    themeClass("bg-blue-50", "bg-blue-900/20")
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.Check className={`w-4 h-4 ${
                        themeClass("text-blue-600", "text-blue-400")
                      }`} />
                      <p className={`text-xs font-medium ${
                        themeClass("text-blue-800", "text-blue-300")
                      }`}>
                        {t.completed}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {requests.filter(r => r.status?.toLowerCase() === "completed").length}
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    themeClass("bg-red-50", "bg-red-900/20")
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icons.XCircle className={`w-4 h-4 ${
                        themeClass("text-red-600", "text-red-400")
                      }`} />
                      <p className={`text-xs font-medium ${
                        themeClass("text-red-800", "text-red-300")
                      }`}>
                        {t.rejected}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {requests.filter(r => r.status?.toLowerCase() === "rejected").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className={`rounded-2xl shadow-xl p-6 border ${
              themeClass(
                "bg-white border-gray-200",
                "bg-gray-800 border-gray-700"
              )
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                themeClass("text-gray-900", "text-gray-100")
              }`}>
                {t.howItWorks}
              </h3>
              <div className="space-y-4">
                {/* How it works steps - same as before */}
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    themeClass("bg-purple-100", "bg-purple-800/30")
                  }`}>
                    <span className={`text-sm font-bold ${
                      themeClass("text-purple-600", "text-purple-400")
                    }`}>1</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {t.step1}
                    </h4>
                    <p className={`text-sm ${
                      themeClass("text-gray-600", "text-gray-400")
                    }`}>
                      {t.step1Desc}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    themeClass("bg-blue-100", "bg-blue-800/30")
                  }`}>
                    <span className={`text-sm font-bold ${
                      themeClass("text-blue-600", "text-blue-400")
                    }`}>2</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {t.step2}
                    </h4>
                    <p className={`text-sm ${
                      themeClass("text-gray-600", "text-gray-400")
                    }`}>
                      {t.step2Desc}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    themeClass("bg-green-100", "bg-green-800/30")
                  }`}>
                    <span className={`text-sm font-bold ${
                      themeClass("text-green-600", "text-green-400")
                    }`}>3</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {t.step3}
                    </h4>
                    <p className={`text-sm ${
                      themeClass("text-gray-600", "text-gray-400")
                    }`}>
                      {t.step3Desc}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    themeClass("bg-indigo-100", "bg-indigo-800/30")
                  }`}>
                    <span className={`text-sm font-bold ${
                      themeClass("text-indigo-600", "text-indigo-400")
                    }`}>4</span>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      themeClass("text-gray-900", "text-gray-100")
                    }`}>
                      {t.step4}
                    </h4>
                    <p className={`text-sm ${
                      themeClass("text-gray-600", "text-gray-400")
                    }`}>
                      {t.step4Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">{t.quickActions}</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("new")}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Icons.Plus className="w-5 h-5" />
                  {t.newRequest}
                </button>
                <button
                  onClick={fetchMyRequests}
                  className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Icons.RefreshCw className="w-5 h-5" />
                  {t.refresh}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${
            themeClass("text-gray-500", "text-gray-400")
          }`}>
            {t.footerNote}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl transform transition-all ${
            themeClass(
              "bg-white",
              "bg-gray-800"
            )
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  themeClass(
                    "bg-red-100",
                    "bg-red-900/30"
                  )
                }`}>
                  <Icons.AlertCircle className={`w-6 h-6 ${
                    themeClass("text-red-600", "text-red-400")
                  }`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${
                    themeClass("text-gray-900", "text-gray-100")
                  }`}>
                    {t.deleteTitle}
                  </h3>
                  <p className={`text-sm ${
                    themeClass("text-gray-600", "text-gray-400")
                  }`}>
                    {t.deleteMessage}
                  </p>
                </div>
              </div>
              
              {requestToDelete && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  themeClass(
                    "bg-gray-50 border-gray-200",
                    "bg-gray-700/30 border-gray-600"
                  )
                }`}>
                  <p className={`font-medium mb-1 ${
                    themeClass("text-gray-900", "text-gray-100")
                  }`}>
                    {requestToDelete.reason?.substring(0, 100)}...
                  </p>
                  <p className={`text-sm ${
                    themeClass("text-gray-600", "text-gray-400")
                  }`}>
                    {formatDate(requestToDelete.createdAt)}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setRequestToDelete(null);
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors border ${
                    themeClass(
                      "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
                      "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                    )
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteRequest}
                  disabled={deletingId === requestToDelete?._id}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {deletingId === requestToDelete?._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.deleting}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Icons.Trash className="w-4 h-4" />
                      {t.confirmDelete}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceRequest;