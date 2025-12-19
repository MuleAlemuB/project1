import React, { useEffect, useState } from "react";
import workExperienceService from "../../services/workExperienceService";
import { toast } from "react-toastify";
import { useSettings } from "../../contexts/SettingsContext";
import {
  FaFilePdf,
  FaHistory,
  FaPaperPlane,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaHourglassHalf
} from "react-icons/fa";

const WorkExperienceRequest = () => {
  const { language, darkMode } = useSettings();
  const [years, setYears] = useState("");
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downloadCertificate = async (requestId) => {
    try {
      const response = await workExperienceService.downloadLetter(requestId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `work-experience-certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error(
        language === "am" 
          ? "የ PDF መጫን አልተሳካም" 
          : "Failed to download PDF"
      );
    }
  };

  const loadMyRequests = async () => {
    try {
      setIsLoading(true);
      const { data } = await workExperienceService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error(
        language === "am" 
          ? "የጥያቄዎች መጫን አልተሳካም" 
          : "Failed to load requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async () => {
    if (!years) {
      toast.error(
        language === "am" 
          ? "እባክዎ የአገልግሎት ዓመታትን ያስገቡ" 
          : "Please enter years of service"
      );
      return;
    }

    if (parseInt(years) <= 0) {
      toast.error(
        language === "am" 
          ? "የአገልግሎት ዓመታት አዎንታዊ ቁጥር መሆን አለበት" 
          : "Years of service must be a positive number"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await workExperienceService.createRequest(years);
      toast.success(
        language === "am" 
          ? "ጥያቄዎ በተሳካ ሁኔታ ቀርቧል" 
          : "Request submitted successfully"
      );
      setYears("");
      await loadMyRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(
        error.response?.data?.message ||
        (language === "am" 
          ? "ጥያቄ መላክ አልተሳካም" 
          : "Failed to submit request")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case "Approved":
          return {
            bg: "bg-green-100 dark:bg-green-900/30",
            text: "text-green-800 dark:text-green-300",
            icon: <FaCheckCircle className="text-green-500" />,
            label: language === "am" ? "ጸድቋል" : "Approved"
          };
        case "Rejected":
          return {
            bg: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-800 dark:text-red-300",
            icon: <FaTimesCircle className="text-red-500" />,
            label: language === "am" ? "ተቀብሏል" : "Rejected"
          };
        default:
          return {
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
            text: "text-yellow-800 dark:text-yellow-300",
            icon: <FaClock className="text-yellow-500" />,
            label: language === "am" ? "በመጠባበቅ ላይ" : "Pending"
          };
      }
    };

    const config = getStatusConfig();

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        <span>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FaFilePdf className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "am" ? "የስራ ልምድ ማመልከቻ" : "Work Experience Request"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {language === "am" 
                  ? "የስራ ልምድዎን የሚያረጋግጥ የ PDF ደረሰኝ ይጠይቁ" 
                  : "Request a PDF certificate verifying your work experience"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaPaperPlane className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {language === "am" ? "አዲስ ጥያቄ አቅርብ" : "Submit New Request"}
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === "am" ? "የአገልግሎት ዓመታት" : "Years of Service"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === "am" ? "የአገልግሎት ዓመታት ያስገቡ" : "Enter years of service"}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {language === "am" ? "ዓመታት" : "years"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {language === "am" 
                      ? "በዚህ ድርጅት ያገለገሉትን አጠቃላይ ዓመታት ያስገቡ" 
                      : "Enter total years you have served in this organization"}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={submit}
                    disabled={isSubmitting || !years}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {language === "am" ? "በመላክ ላይ..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        {language === "am" ? "ጥያቄ አቅርብ" : "Submit Request"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Information Box */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaHourglassHalf className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {language === "am" ? "ማስታወሻ" : "Note"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {language === "am" 
                        ? "• ጥያቄዎ ከተጸድቀ በኋላ PDF ደረሰኙን ማውረድ ይችላሉ\n• የጥያቄ ሂደቱ ከ2-3 የስራ ቀናት ሊወስድ ይችላል\n• ትክክለኛ የአገልግሎት ዓመታትን መስጠትዎን ያረጋግጡ"
                        : "• You can download the PDF certificate once your request is approved\n• The approval process may take 2-3 working days\n• Ensure you provide accurate years of service"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaHistory />
                {language === "am" ? "የጥያቄ ሁኔታ" : "Request Status"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === "am" ? "ጠቅላላ ጥያቄዎች" : "Total Requests"}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {requests.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === "am" ? "ተጸድቀዋል" : "Approved"}
                  </span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {requests.filter(r => r.status === "Approved").length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === "am" ? "በመጠባበቅ ላይ" : "Pending"}
                  </span>
                  <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    {requests.filter(r => r.status === "Pending").length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === "am" ? "ተቀብሏል" : "Rejected"}
                  </span>
                  <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {requests.filter(r => r.status === "Rejected").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requests History */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaHistory />
                {language === "am" ? "የጥያቄዎች ታሪክ" : "Request History"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {language === "am" 
                  ? "ያለፉት ሁሉ የስራ ልምድ ጥያቄዎች" 
                  : "All your previous work experience requests"}
              </p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ጥያቄዎች በመጫን ላይ..." : "Loading requests..."}
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <FaFilePdf className="w-full h-full" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {language === "am" ? "ምንም ጥያቄዎች የሉም" : "No Requests Found"}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "am" 
                    ? "የስራ ልምድ ማመልከቻ ለመጀመር ከላይ ያለውን ቅጽ ይጠቀሙ" 
                    : "Use the form above to submit your first work experience request"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === "am" ? "የአገልግሎት ዓመታት" : "Years of Service"}
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === "am" ? "ሁኔታ" : "Status"}
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === "am" ? "የ PDF ደረሰኝ" : "PDF Certificate"}
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === "am" ? "ቀን" : "Date"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {request.yearsOfService}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {request.yearsOfService} {language === "am" ? "ዓመታት" : "years"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="p-4">
                          {request.status === "Approved" ? (
                            <button
                              onClick={() => downloadCertificate(request._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <FaDownload />
                              <span>{language === "am" ? "PDF አውርድ" : "Download PDF"}</span>
                            </button>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 italic">
                              {request.status === "Pending" 
                                ? (language === "am" ? "በመጠባበቅ ላይ" : "Awaiting approval")
                                : (language === "am" ? "ደረሰኝ የለም" : "Certificate not available")
                              }
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceRequest;