import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axios from "../../utils/axiosInstance";
import {
  FaDownload,
  FaEye,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaUserTie,
  FaBuilding,
  FaGraduationCap,
  FaUsers,
  FaClock,
  FaVenusMars,
  FaBriefcase,
  FaFileAlt,
  FaPaperPlane,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const translations = {
  en: {
    title: "Department Requisitions",
    newRequisition: "New Requisition",
    loading: "Loading requisitions...",
    notAuthorized: "Not authorized",
    position: "Position",
    status: "Status",
    actions: "Actions",
    details: "Details",
    delete: "Delete",
    noRequisitions: "No requisitions found",
    close: "Close",
    attachments: "Attachments",
    noAttachments: "No attachments",
    submit: "Submit",
    cancel: "Cancel",
    select: "Select",
    male: "Male",
    female: "Female",
    date: "Date",
    department: "Department",
    education: "Education Level",
    quantity: "Quantity",
    term: "Term of Employment",
    sex: "Gender",
    experience: "Experience Required",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    requisitionDetails: "Requisition Details",
    educationalLevel: "Education Level",
    termOfEmployment: "Term of Employment",
    submitRequisition: "Submit Requisition",
    requiredFields: "All required fields must be filled",
    deleteConfirm: "Are you sure you want to delete this requisition?",
    deleteSuccess: "Requisition deleted successfully",
    deleteFailed: "Failed to delete requisition",
    submitSuccess: "Requisition submitted successfully",
    submitFailed: "Failed to submit requisition",
    createdDate: "Created Date",
    viewDetails: "View Details",
    sendNotification: "Send to Admin",
    notificationSent: "Notification sent to admin",
    notificationFailed: "Failed to send notification",
    adminNotification: "New requisition submitted by Department Head {deptHead}: Position: {position}, Department: {department}, Quantity: {quantity}, Education: {education}",
  },
  am: {
    title: "የመምሪያ ጥያቄዎች",
    newRequisition: "አዲስ ጥያቄ",
    loading: "ጥያቄዎች በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    position: "ስራ",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    details: "ዝርዝሮች",
    delete: "ማጥፋት",
    noRequisitions: "ምንም ጥያቄ አልተገኘም",
    close: "ዝጋ",
    attachments: "አባሪዎች",
    noAttachments: "ምንም አባሪ",
    submit: "ላክ",
    cancel: "ሰርዝ",
    select: "ምረጥ",
    male: "ወንድ",
    female: "ሴት",
    date: "ቀን",
    department: "ክፍል",
    education: "የትምህርት ደረጃ",
    quantity: "ብዛት",
    term: "የስራ ጊዜ",
    sex: "ፆታ",
    experience: "የልምድ መስፈርት",
    pending: "በመጠባበቅ ላይ",
    approved: "ተፀድቋል",
    rejected: "ተመላሽ ሆኗል",
    requisitionDetails: "የጥያቄ ዝርዝር",
    educationalLevel: "የትምህርት ደረጃ",
    termOfEmployment: "የስራ ጊዜ",
    submitRequisition: "ጥያቄ ላክ",
    requiredFields: "ሁሉንም አስፈላጊ መስኮች ይሙሉ",
    deleteConfirm: "ይህን ጥያቄ ማጥፋት እፈልጋለሁ?",
    deleteSuccess: "ጥያቄ ተሳክቷል",
    deleteFailed: "ጥያቄ ማጥፋት አልተሳካም",
    submitSuccess: "ጥያቄ በትክክል ተልኳል",
    submitFailed: "ጥያቄ ማስተላለፍ አልተቻለም",
    createdDate: "የተፈጠረበት ቀን",
    viewDetails: "ዝርዝሮችን አሳይ",
    sendNotification: "ለአስተዳዳሪ ላክ",
    notificationSent: "ለአስተዳዳሪ ማስታወቂያ ተልኳል",
    notificationFailed: "ማስታወቂያ ማስተላለፍ አልተቻለም",
    adminNotification: "አዲስ ጥያቄ በመምሪያ ርዕሰ ክፍል {deptHead} ተልኳል፡ ስራ: {position}, ክፍል: {department}, ብዛት: {quantity}, ትምህርት: {education}",
  },
};

const DeptHeadRequisition = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [date, setDate] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [education, setEducation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [term, setTerm] = useState("");
  const [sex, setSex] = useState("");
  const [experience, setExperience] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Fetch requisitions
  const fetchRequisitions = async () => {
    try {
      const res = await axios.get("/requisitions/depthead");
      setRequisitions(res.data);
    } catch (err) {
      console.error("Fetch requisitions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchRequisitions();
  }, [user, authLoading]);

  // Send notification to admin
  const sendAdminNotification = async (requisitionData) => {
    try {
      const notificationMessage = t.adminNotification
        .replace("{deptHead}", `${user.firstName} ${user.lastName}`)
        .replace("{position}", requisitionData.position)
        .replace("{department}", requisitionData.department)
        .replace("{quantity}", requisitionData.quantity)
        .replace("{education}", requisitionData.education);

      await axios.post("/notifications", {
        message: notificationMessage,
        recipientRole: "Admin",
        type: "Requisition",
        reference: requisitionData._id,
        status: "pending",
        seen: false,
      });

      return true;
    } catch (err) {
      console.error("Send notification error:", err);
      return false;
    }
  };

  // Apply form submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!date || !position || !department || !education || !quantity || !term) {
      setMessage(t.requiredFields);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("position", position);
      formData.append("department", department);
      formData.append("education", education);
      formData.append("quantity", quantity);
      formData.append("term", term);
      formData.append("sex", sex);
      formData.append("experience", experience);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post("/requisitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Send notification to admin
      const notificationSent = await sendAdminNotification({
        ...res.data.requisition,
        position,
        department,
        education,
        quantity,
      });

      setMessage(notificationSent ? t.submitSuccess + " - " + t.notificationSent : t.submitSuccess);
      setShowApplyForm(false);
      resetForm();
      fetchRequisitions();
    } catch (err) {
      console.error("Apply requisition error:", err);
      setMessage(t.submitFailed);
    }
  };

  const resetForm = () => {
    setDate("");
    setPosition("");
    setDepartment("");
    setEducation("");
    setQuantity(1);
    setTerm("");
    setSex("");
    setExperience("");
    setAttachments([]);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await axios.delete(`/requisitions/${id}`);
      setMessage(t.deleteSuccess);
      fetchRequisitions();
    } catch (err) {
      console.error("Delete requisition error:", err);
      setMessage(t.deleteFailed);
    }
  };

  const sendNotification = async (requisition) => {
    try {
      const notificationSent = await sendAdminNotification(requisition);
      setMessage(notificationSent ? t.notificationSent : t.notificationFailed);
    } catch (err) {
      console.error("Send notification error:", err);
      setMessage(t.notificationFailed);
    }
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

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {requisitions.length} {language === "en" ? "requisitions" : "ጥያቄዎች"} in your department
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          {message}
        </div>
      )}

      {/* New Requisition Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowApplyForm(!showApplyForm)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          {t.newRequisition}
        </button>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div className={`mb-8 p-6 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaPaperPlane className="text-blue-500" />
            {t.submitRequisition}
          </h2>
          
          <form onSubmit={handleApplySubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaUserTie className="text-gray-400" />
                    {t.position} *
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={language === "en" ? "e.g., Senior Developer" : "ለምሳሌ፣ ከፍተኛ መሳሪያ አሰራር"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaBuilding className="text-gray-400" />
                    {t.department} *
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={user.department?.name || "Your department"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-gray-400" />
                    {t.education} *
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={language === "en" ? "e.g., Bachelor's Degree" : "ለምሳሌ፣ ባችለር ዲግሪ"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaUsers className="text-gray-400" />
                    {t.quantity} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    {t.term} *
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={language === "en" ? "e.g., Permanent, Contract" : "ለምሳሌ፣ ቋሚ፣ ውል"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaVenusMars className="text-gray-400" />
                    {t.sex}
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">{t.select}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-gray-400" />
                    {t.experience}
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={language === "en" ? "e.g., 3+ years" : "ለምሳሌ፣ 3+ አመታት"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    {t.date} *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Attachments */}
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
                    {attachments.length} {language === "en" ? "file(s) selected" : "ፋይል(ዎች) ተመርጠዋል"}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPaperPlane />
                {t.submit}
              </button>
              <button
                type="button"
                onClick={() => { setShowApplyForm(false); resetForm(); }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requisitions Table */}
      <div className={`rounded-xl border overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="p-4 text-left font-medium">{t.position}</th>
                <th className="p-4 text-left font-medium">{t.department}</th>
                <th className="p-4 text-left font-medium">{t.quantity}</th>
                <th className="p-4 text-left font-medium">{t.status}</th>
                <th className="p-4 text-left font-medium">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.length > 0 ? (
                requisitions.map((req) => (
                  <tr key={req._id} className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <td className="p-4">
                      <div className="font-medium">{req.position}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {req.educationalLevel || req.education}
                      </div>
                    </td>
                    <td className="p-4">{req.department}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {req.quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        req.status === "approved" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {req.status || t.pending}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className={`px-3 py-1 rounded flex items-center gap-1 text-sm ${
                            darkMode 
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <FaEye />
                          {t.viewDetails}
                        </button>
                        {(!req.status || req.status === "pending") && (
                          <button
                            onClick={() => sendNotification(req)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
                          >
                            <FaPaperPlane />
                            {t.sendNotification}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                        >
                          <FaTrash />
                          {t.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {t.noRequisitions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">{t.requisitionDetails}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {selectedReq.position} - {selectedReq.department}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Requisition Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.position}</p>
                    <p className="font-medium">{selectedReq.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.department}</p>
                    <p className="font-medium">{selectedReq.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.education}</p>
                    <p className="font-medium">{selectedReq.educationalLevel || selectedReq.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.quantity}</p>
                    <p className="font-medium">{selectedReq.quantity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.term}</p>
                    <p className="font-medium">{selectedReq.termOfEmployment || selectedReq.term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.sex}</p>
                    <p className="font-medium">{selectedReq.sex || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.experience}</p>
                    <p className="font-medium">{selectedReq.experience || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.createdDate}</p>
                    <p className="font-medium">
                      {new Date(selectedReq.date || selectedReq.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.status}</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    selectedReq.status === "approved" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : selectedReq.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {selectedReq.status || t.pending}
                  </span>
                </div>

                {/* Attachments */}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t.attachments}</p>
                  {selectedReq.attachments?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedReq.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={`${BACKEND_URL}/${file}`}
                          download
                          className={`flex items-center gap-2 p-2 rounded ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                          <FaDownload className="text-blue-500" />
                          <span className="truncate">{file.split("/").pop()}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">{t.noAttachments}</p>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadRequisition;