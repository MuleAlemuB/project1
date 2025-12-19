import React, { useEffect, useState } from "react";
import workExperienceService from "../../services/workExperienceService";
import { toast } from "react-toastify";
import { useSettings } from "../../contexts/SettingsContext";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaClock,
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaEye,
  FaFilePdf,
  FaUserCircle
} from "react-icons/fa";

const ManageWorkExperience = () => {
  const { language, darkMode } = useSettings();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    try {
      setIsLoading(true);
      const { data } = await workExperienceService.getAdminRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error(
        language === "am" 
          ? "ጥያቄዎች መጫን አልተሳካም" 
          : "Failed to load requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async (id, employeeName) => {
    try {
      await workExperienceService.approveRequest(id);
      toast.success(
        language === "am" 
          ? `የ${employeeName} ጥያቄ ተጸድቋል` 
          : `Approved ${employeeName}'s request`
      );
      load();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error(
        language === "am" 
          ? "ማጽደቅ አልተሳካም" 
          : "Failed to approve request"
      );
    }
  };

  const reject = async (id, employeeName) => {
    try {
      await workExperienceService.rejectRequest(id);
      toast.error(
        language === "am" 
          ? `የ${employeeName} ጥያቄ ተቀብሏል` 
          : `Rejected ${employeeName}'s request`
      );
      load();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error(
        language === "am" 
          ? "ማሰር አልተሳካም" 
          : "Failed to reject request"
      );
    }
  };

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = requests;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.employee?.name?.toLowerCase().includes(term) ||
        request.employee?.department?.toLowerCase().includes(term) ||
        request.yearsOfService?.toString().includes(term)
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  useEffect(() => {
    load();
  }, []);

  // Stats calculation
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "Pending").length,
    approved: requests.filter(r => r.status === "Approved").length,
    rejected: requests.filter(r => r.status === "Rejected").length,
  };

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FaFilePdf className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "am" ? "የስራ ልምድ ጥያቄዎች አስተዳደር" : "Work Experience Requests Management"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {language === "am" 
                  ? "የሰራተኞችን የስራ ልምድ ጥያቄዎች ይመልከቱ እና ያስተዳድሩ" 
                  : "Review and manage employee work experience certificate requests"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Requests Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ጠቅላላ ጥያቄዎች" : "Total Requests"}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaFilePdf className="text-xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "በመጠባበቅ ላይ" : "Pending"}
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FaClock className="text-xl text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ተጸድቀዋል" : "Approved"}
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaCheckCircle className="text-xl text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "am" ? "ተቀብሏል" : "Rejected"}
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {stats.rejected}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FaTimesCircle className="text-xl text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === "am" ? "በስም፣ ክፍል፣ ወይም ዓመታት ይፈልጉ..." : "Search by name, department, or years..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{language === "am" ? "ሁሉም ሁኔታዎች" : "All Status"}</option>
                <option value="Pending">{language === "am" ? "በመጠባበቅ ላይ" : "Pending"}</option>
                <option value="Approved">{language === "am" ? "ጸድቋል" : "Approved"}</option>
                <option value="Rejected">{language === "am" ? "ተቀብሏል" : "Rejected"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === "am" ? "ሁሉም ጥያቄዎች" : "All Requests"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {language === "am" 
                ? `ከጠቅላላ ${requests.length} ጥያቄዎች ውስጥ ${filteredRequests.length} ተገኝተዋል` 
                : `Showing ${filteredRequests.length} of ${requests.length} requests`
              }
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {language === "am" ? "ጥያቄዎች በመጫን ላይ..." : "Loading requests..."}
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <FaFilePdf className="w-full h-full" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {language === "am" ? "ምንም ጥያቄዎች አልተገኙም" : "No Requests Found"}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "am" 
                  ? "በአሁኑ ጊዜ በምትፈልጉት መመዘኛ የሚዛመዱ ጥያቄዎች የሉም" 
                  : "No requests match your current filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaUserCircle />
                        {language === "am" ? "ሰራተኛ" : "Employee"}
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaBuilding />
                        {language === "am" ? "ክፍል" : "Department"}
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {language === "am" ? "ዓመታት" : "Years"}
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FaClock />
                        {language === "am" ? "ሁኔታ" : "Status"}
                      </div>
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language === "am" ? "ተግባራት" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <FaUserTie className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {request.employee?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.employee?.empId || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <FaBuilding className="text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {request.employee?.department || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {request.yearsOfService}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {request.yearsOfService} {language === "am" ? "ዓመታት" : "years"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="p-4">
                        {request.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approve(request._id, request.employee?.name)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow hover:shadow-lg"
                            >
                              <FaCheckCircle />
                              {language === "am" ? "አጽድቅ" : "Approve"}
                            </button>
                            <button
                              onClick={() => reject(request._id, request.employee?.name)}
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 flex items-center gap-2 shadow hover:shadow-lg"
                            >
                              <FaTimesCircle />
                              {language === "am" ? "አሰር" : "Reject"}
                            </button>
                          </div>
                        ) : request.status === "Approved" ? (
                          <div className="flex items-center gap-3">
                            <a
                              href={`http://localhost:5000/${request.pdfFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow hover:shadow-lg"
                            >
                              <FaDownload />
                              {language === "am" ? "ደረሰኝ አውርድ" : "Download PDF"}
                            </a>
                            <button
                              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              onClick={() => toast.info("PDF downloaded successfully")}
                            >
                              <FaEye />
                              {language === "am" ? "ይመልከቱ" : "View"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic">
                            {language === "am" ? "ተቀብሏል" : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            {language === "am" 
              ? "• ሁሉንም የስራ ልምድ ጥያቄዎች በደህንነት ያስተዳድሩ" 
              : "• Securely manage all work experience requests"
            }
          </p>
          <p className="flex items-center gap-2">
            <FaClock className="text-blue-500" />
            {language === "am" 
              ? "የመጨረሻ ዝማኔ: ዛሬ" 
              : `Last updated: Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkExperience;