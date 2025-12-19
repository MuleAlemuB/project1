// src/pages/employee/EmployeeLeave.jsx
import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaPaperclip, 
  FaTrash, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaDownload,
  FaEye
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import { useSettings } from "../../contexts/SettingsContext";

const EmployeeLeave = () => {
  const { darkMode, language } = useSettings();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "annual"
  });

  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(true);
  const [stats, setStats] = useState({
    totalDays: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Calculate leave days
  const calculateLeaveDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch all leave requests for the logged-in employee
  const fetchMyLeaves = async () => {
    try {
      setIsLoadingLeaves(true);
      const res = await axiosInstance.get("/employee-leave/my-requests");
      setMyLeaves(res.data);
      
      // Calculate stats
      const totalDays = res.data.reduce((sum, leave) => {
        return sum + calculateLeaveDays(leave.startDate, leave.endDate);
      }, 0);
      
      const approved = res.data.filter(l => l.status === "approved").length;
      const pending = res.data.filter(l => l.status === "pending").length;
      const rejected = res.data.filter(l => l.status === "rejected").length;
      
      setStats({
        totalDays,
        approved,
        pending,
        rejected
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error(
        language === "am" 
          ? "የእረፍት ጥያቄዎችን ማውረድ አልተሳካም" 
          : "Failed to fetch your leave requests"
      );
    } finally {
      setIsLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning(language === "am" 
        ? "ከፍተኛው 5 ፋይሎች ብቻ ይፈቀዳሉ" 
        : "Maximum 5 files allowed"
      );
      return;
    }
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate, reason, leaveType } = formData;

    // Validation
    if (!startDate || !endDate || !reason || !leaveType) {
      toast.error(
        language === "am" 
          ? "እባክዎ ሁሉንም የግድ የሚሆኑ መስኮች ይሙሉ" 
          : "Please fill in all required fields"
      );
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error(
        language === "am" 
          ? "መነሻ ቀን ከመጨረሻ ቀን በፊት መሆን አለበት" 
          : "Start date must be before end date"
      );
      return;
    }

    const data = new FormData();
    data.append("startDate", startDate);
    data.append("endDate", endDate);
    data.append("reason", reason);
    data.append("leaveType", leaveType);
    
    // Append each file
    attachments.forEach((file) => {
      data.append("attachments", file);
    });

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/employee-leave/request", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        language === "am" 
          ? "የእረፍት ጥያቄዎ በተሳካ ሁኔታ ቀርቧል!" 
          : res.data.message || "Leave request submitted successfully!"
      );
      
      // Reset form
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "annual"
      });
      setAttachments([]);
      fetchMyLeaves(); // Refresh the list
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
        (language === "am" 
          ? "የእረፍት ጥያቄ ማስገባት አልተሳካም" 
          : "Failed to submit leave request")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a leave request
  const handleDelete = async (id) => {
    if (!window.confirm(
      language === "am" 
        ? "ይህን የእረፍት ጥያቄ መሰረዝ እንደምትፈልጉ ይረጋገጡ?" 
        : "Are you sure you want to delete this leave request?"
    )) return;

    try {
      await axiosInstance.delete(`/employee-leave/${id}`);
      toast.success(
        language === "am" 
          ? "የእረፍት ጥያቄ ተሰርዟል" 
          : "Leave request deleted successfully"
      );
      fetchMyLeaves();
    } catch (error) {
      console.error(error);
      toast.error(
        language === "am" 
          ? "የእረፍት ጥያቄ ማሰረዝ አልተሳካም" 
          : "Failed to delete leave request"
      );
    }
  };

  // View attachment
  const handleViewAttachment = (url) => {
    window.open(url, '_blank');
  };

  const leaveTypes = [
    { value: "annual", label: language === "am" ? "አመታዊ እረፍት" : "Annual Leave" },
    { value: "sick", label: language === "am" ? "የበሽታ እረፍት" : "Sick Leave" },
    { value: "maternity", label: language === "am" ? "የማህፀን እረፍት" : "Maternity Leave" },
    { value: "paternity", label: language === "am" ? "የአባትነት እረፍት" : "Paternity Leave" },
    { value: "emergency", label: language === "am" ? "አስቸኳይ እረፍት" : "Emergency Leave" },
    { value: "unpaid", label: language === "am" ? "ያልተከፈለ እረፍት" : "Unpaid Leave" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getStatusText = (status) => {
    if (language === "am") {
      switch (status) {
        case "approved": return "ተፈቅዷል";
        case "rejected": return "ተቀባል";
        case "pending": return "በሂደት ላይ";
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getLeaveTypeText = (type) => {
    const found = leaveTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {language === "am" ? "እረፍት አስተዳደር" : "Leave Management"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
            {language === "am" 
              ? "እረፍት ጥያቄዎችን ያስገቡ እና ያስተዳድሩ" 
              : "Submit and manage your leave requests"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Days */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ጠቅላላ የተጠየቁ ቀናት" : "Total Days Requested"}
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDays}
                </p>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-lg md:text-xl" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "የተፈቀዱ ጥያቄዎች" : "Approved"}
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FaClock className="text-yellow-600 dark:text-yellow-400 text-lg md:text-xl" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "በመጠባበቅ ላይ" : "Pending"}
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <FaTimesCircle className="text-red-600 dark:text-red-400 text-lg md:text-xl" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "የተቀበሉ" : "Rejected"}
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Leave Request Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaFileAlt className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {language === "am" ? "አዲስ የእረፍት ጥያቄ" : "New Leave Request"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "am" ? "የእረፍት አይነት" : "Leave Type"} *
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    required
                  >
                    {leaveTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Days Counter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "am" ? "የቀን ብዛት" : "Duration"}
                  </label>
                  <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                    {calculateLeaveDays(formData.startDate, formData.endDate)} 
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
                      {language === "am" ? "ቀናት" : "days"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "am" ? "መነሻ ቀን" : "Start Date"} *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "am" ? "መጨረሻ ቀን" : "End Date"} *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "am" ? "ምክንያት" : "Reason"} *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder={language === "am" ? "ለእረፍትዎ ዝርዝር ምክንያት ያቅርቡ..." : "Provide detailed reason for your leave..."}
                  required
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FaPaperclip />
                    {language === "am" ? "አባሪዎች" : "Attachments"}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({language === "am" ? "አማራጭ" : "Optional"})
                    </span>
                  </div>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-xs md:text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {attachments.length > 0 && (
                  <div className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{attachments.length}</span> 
                    {language === "am" ? " ፋይል(ዎች) ተመርጠዋል" : " file(s) selected"}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 md:py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {language === "am" ? "በመላክ ላይ..." : "Submitting..."}
                  </>
                ) : (
                  language === "am" ? "ጥያቄ ላክ" : "Submit Leave Request"
                )}
              </button>
            </form>
          </div>

          {/* My Leave Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaCalendarAlt className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {language === "am" ? "የእረፍት ታሪክ" : "Leave History"}
                </h2>
              </div>
              <button
                onClick={fetchMyLeaves}
                className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                disabled={isLoadingLeaves}
              >
                {language === "am" ? "አዘምን" : "Refresh"}
              </button>
            </div>

            {isLoadingLeaves ? (
              <div className="flex justify-center py-8 md:py-12">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : myLeaves.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <FaCalendarAlt className="w-10 h-10 md:w-12 md:h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {language === "am" 
                    ? "ምንም የእረፍት ጥያቄዎች አልተገኙም" 
                    : "No leave requests found"}
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {language === "am" 
                    ? "የመጀመሪያ ጥያቄዎን ያስገቡ" 
                    : "Submit your first request"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {language === "am" ? "ቀን" : "Date"}
                          </th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {language === "am" ? "ቀናት" : "Days"}
                          </th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {language === "am" ? "ሁኔታ" : "Status"}
                          </th>
                          <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {language === "am" ? "ድርጊቶች" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {myLeaves.map((leave) => {
                          const days = calculateLeaveDays(leave.startDate, leave.endDate);
                          return (
                            <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                                  {formatDate(leave.startDate)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {language === "am" ? "እስከ" : "to"} {formatDate(leave.endDate)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {getLeaveTypeText(leave.leaveType)}
                                </div>
                              </td>
                              <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                  {days} {language === "am" ? "ቀን" : "day"}{days !== 1 ? (language === "am" ? "ዎች" : "s") : ""}
                                </span>
                              </td>
                              <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(leave.status)}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                                    {getStatusText(leave.status)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {/* View Attachments */}
                                  {leave.attachments && leave.attachments.length > 0 && (
                                    <div className="relative group">
                                      <button
                                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                        title={language === "am" ? "አባሪዎችን ይመልከቱ" : "View attachments"}
                                        onClick={() => {
                                          // Show attachments in a modal or new window
                                          if (leave.attachments.length === 1) {
                                            const att = leave.attachments[0];
                                            if (typeof att === 'string') {
                                              try {
                                                const parsed = JSON.parse(att);
                                                handleViewAttachment(parsed.url);
                                              } catch {
                                                handleViewAttachment(att);
                                              }
                                            } else {
                                              handleViewAttachment(att.url);
                                            }
                                          } else {
                                            // Multiple attachments - show list
                                            alert(`${leave.attachments.length} attachments available`);
                                          }
                                        }}
                                      >
                                        <FaEye />
                                      </button>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                        {language === "am" ? "አባሪዎች" : "Attachments"}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Delete Button */}
                                  {leave.status === "pending" && (
                                    <button
                                      onClick={() => handleDelete(leave._id)}
                                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                      title={language === "am" ? "ሰርዝ" : "Delete"}
                                    >
                                      <FaTrash />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Show more details for mobile */}
                <div className="mt-4 md:hidden">
                  <details className="text-xs text-gray-600 dark:text-gray-400">
                    <summary className="cursor-pointer">
                      {language === "am" ? "ተጨማሪ መረጃ" : "Show more details"}
                    </summary>
                    {myLeaves.map((leave) => (
                      <div key={leave._id} className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <p><strong>{language === "am" ? "ምክንያት" : "Reason"}:</strong> {leave.reason}</p>
                        {leave.attachments && leave.attachments.length > 0 && (
                          <p><strong>{language === "am" ? "አባሪዎች" : "Attachments"}:</strong> {leave.attachments.length}</p>
                        )}
                      </div>
                    ))}
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 md:mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm md:text-base font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {language === "am" ? "መረጃ" : "Information"}
          </h3>
          <ul className="text-xs md:text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• {language === "am" ? "የእረፍት ጥያቄዎች ለክፍል አለቃ ይላካሉ" : "Leave requests are sent to your Department Head"}</li>
            <li>• {language === "am" ? "እረፍቶችን ከተፈቀዱ በኋላ ብቻ መውሰድ ይችላሉ" : "You can only take leaves after they are approved"}</li>
            <li>• {language === "am" ? "በሂደት ላይ ያሉ ጥያቄዎችን መሰረዝ ይችላሉ" : "You can delete pending requests"}</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLeave;