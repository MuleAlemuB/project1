// src/pages/admin/ManageVacancies.jsx
import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus, FaBriefcase, FaBuilding, FaCalendarAlt, FaClock, FaUsers, FaMoneyBillWave, FaGraduationCap, FaCertificate } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axios";
import { useSettings } from "../contexts/SettingsContext";

const translations = {
  en: {
    title: "Vacancy Management",
    create: "Post New Vacancy",
    search: "Search vacancies...",
    actions: "Actions",
    jobTitle: "Job Title",
    department: "Department",
    position: "Position",
    employmentType: "Employment Type",
    postDate: "Post Date",
    deadline: "Deadline",
    status: "Status",
    open: "Open",
    expired: "Expired",
    view: "View Details",
    edit: "Edit",
    delete: "Delete",
    noVacancies: "No vacancies found",
    confirmDelete: "Are you sure you want to delete this vacancy?",
    update: "Update Vacancy",
    createButton: "Post Vacancy",
    vacancyDetails: "Vacancy Details",
    editVacancy: "Edit Vacancy",
    createVacancy: "Post New Vacancy",
    qualification: "Qualification",
    experience: "Experience",
    salary: "Salary",
    description: "Job Description",
    save: "Save Changes",
    cancel: "Cancel",
    loading: "Loading...",
    success: "Success!",
    error: "Error!",
    deleteSuccess: "Vacancy deleted successfully",
    updateSuccess: "Vacancy updated successfully",
    createSuccess: "Vacancy created successfully",
    applicants: "Applicants",
    active: "Active",
    closed: "Closed",
    today: "Today",
    validation: {
      titleRequired: "Job title is required",
      departmentRequired: "Department is required",
      positionRequired: "Position is required",
      employmentTypeRequired: "Employment type is required",
      postDateRequired: "Post date is required",
      deadlineRequired: "Deadline is required"
    },
    filters: {
      all: "All Vacancies",
      active: "Active Only",
      expired: "Expired Only"
    }
  },
  am: {
    title: "የስራ ቦታ አስተዳደር",
    create: "አዲስ ስራ ቦታ ለጥፍ",
    search: "ስራ ቦታዎችን ፈልግ...",
    actions: "እርምጃዎች",
    jobTitle: "የስራ ርዕስ",
    department: "ክፍል",
    position: "ቦታ",
    employmentType: "የሥራ አይነት",
    postDate: "የመለያየት ቀን",
    deadline: "የመጨረሻ ቀን",
    status: "ሁኔታ",
    open: "ክፍት",
    expired: "ያልተጠናቀቀ",
    view: "ዝርዝር ይመልከቱ",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    noVacancies: "ምንም ስራ ቦታዎች አልተገኙም",
    confirmDelete: "ይህን ስራ ቦታ ለማጥፋት እርግጠኛ ነዎት?",
    update: "ስራ ቦታ አስተካክል",
    createButton: "ስራ ቦታ ለጥፍ",
    vacancyDetails: "የስራ ቦታ ዝርዝር",
    editVacancy: "ስራ ቦታ አስተካክል",
    createVacancy: "አዲስ ስራ ቦታ ለጥፍ",
    qualification: "ትምህርት",
    experience: "ልምድ",
    salary: "ደመወዝ",
    description: "የስራ መግለጫ",
    save: "ለውጦችን አስቀምጥ",
    cancel: "ይቅር",
    loading: "በመጫን ላይ...",
    success: "ተሳክቷል!",
    error: "ስህተት!",
    deleteSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተሰርዟል",
    updateSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተስተካክሏል",
    createSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተፈጥሯል",
    applicants: "ማመልከቻዎች",
    active: "ንቁ",
    closed: "ዝግ",
    today: "ዛሬ",
    validation: {
      titleRequired: "የስራ ርዕስ ያስፈልጋል",
      departmentRequired: "ክፍል ያስፈልጋል",
      positionRequired: "ቦታ ያስፈልጋል",
      employmentTypeRequired: "የሥራ አይነት ያስፈልጋል",
      postDateRequired: "የመለያየት ቀን ያስፈልጋል",
      deadlineRequired: "የመጨረሻ ቀን ያስፈልጋል"
    },
    filters: {
      all: "ሁሉም ስራ ቦታዎች",
      active: "ንቁ ብቻ",
      expired: "ያልተጠናቀቀ ብቻ"
    }
  }
};

// Custom Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <FaCertificate /> : type === 'error' ? <FaCertificate /> : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-xl z-[100] flex items-center gap-3 min-w-[300px]`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        ✕
      </button>
    </motion.div>
  );
};

const ManageVacancies = ({ isAdmin = false }) => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(""); // "view" or "edit"
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applicantsCount, setApplicantsCount] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    position: "",
    employmentType: "",
    qualification: "",
    experience: "",
    salary: "",
    postDate: new Date().toISOString().split('T')[0],
    deadline: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch vacancies
  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/vacancies");
      setVacancies(res.data);
      
      // Fetch applicants count for each vacancy
      const counts = {};
      for (const vacancy of res.data) {
        try {
          const appsRes = await axiosInstance.get(`/admin/vacancies/${vacancy._id}/applicants`);
          counts[vacancy._id] = appsRes.data.length || 0;
        } catch (err) {
          counts[vacancy._id] = 0;
        }
      }
      setApplicantsCount(counts);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch vacancies";
      showNotification('error', `${t.error} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // Check if vacancy is expired
  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Check if vacancy is new (posted within last 7 days)
  const isNew = (postDate) => {
    if (!postDate) return false;
    const postDateObj = new Date(postDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return postDateObj > sevenDaysAgo;
  };

  // Handle form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = t.validation.titleRequired;
    if (!formData.department.trim()) errors.department = t.validation.departmentRequired;
    if (!formData.position.trim()) errors.position = t.validation.positionRequired;
    if (!formData.employmentType.trim()) errors.employmentType = t.validation.employmentTypeRequired;
    if (!formData.postDate) errors.postDate = t.validation.postDateRequired;
    if (!formData.deadline) errors.deadline = t.validation.deadlineRequired;
    
    // Check if deadline is after post date
    if (formData.postDate && formData.deadline) {
      if (new Date(formData.deadline) < new Date(formData.postDate)) {
        errors.deadline = language === 'am' ? 'የመጨረሻ ቀን ከመለያየት ቀን በኋላ መሆን አለበት' : 'Deadline must be after post date';
      }
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.post("/admin/vacancies", formData);
      setVacancies([...vacancies, res.data]);
      setIsCreateOpen(false);
      showNotification('success', t.createSuccess);
      
      // Reset form
      setFormData({
        title: "",
        department: "",
        position: "",
        employmentType: "",
        qualification: "",
        experience: "",
        salary: "",
        postDate: new Date().toISOString().split('T')[0],
        deadline: "",
        description: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create vacancy";
      showNotification('error', `${t.error} ${errorMessage}`);
    }
  };

  const openModal = (type, vacancy) => {
    setModalType(type);
    setSelectedVacancy(vacancy);
    setFormData({
      title: vacancy.title || "",
      department: vacancy.department || "",
      position: vacancy.position || "",
      employmentType: vacancy.employmentType || "",
      qualification: vacancy.qualification || "",
      experience: vacancy.experience || "",
      salary: vacancy.salary || "",
      postDate: vacancy.postDate ? new Date(vacancy.postDate).toISOString().split('T')[0] : "",
      deadline: vacancy.deadline ? new Date(vacancy.deadline).toISOString().split('T')[0] : "",
      description: vacancy.description || "",
    });
    setFormErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.put(`/admin/vacancies/${selectedVacancy._id}`, formData);
      setVacancies(vacancies.map((v) => (v._id === res.data._id ? res.data : v)));
      setModalType("");
      showNotification('success', t.updateSuccess);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update vacancy";
      showNotification('error', `${t.error} ${errorMessage}`);
    }
  };

  const handleDeleteClick = (vacancy) => {
    setVacancyToDelete(vacancy);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vacancyToDelete) return;
    
    try {
      await axiosInstance.delete(`/admin/vacancies/${vacancyToDelete._id}`);
      setVacancies(vacancies.filter((v) => v._id !== vacancyToDelete._id));
      showNotification('success', t.deleteSuccess);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete vacancy";
      showNotification('error', `${t.error} ${errorMessage}`);
    } finally {
      setIsDeleteConfirmOpen(false);
      setVacancyToDelete(null);
    }
  };

  // Filter vacancies based on search and status
  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch = searchTerm === "" || 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && !isExpired(v.deadline)) ||
      (statusFilter === "expired" && isExpired(v.deadline));
    
    return matchesSearch && matchesStatus;
  });

  // Employment type options
  const employmentTypes = [
    "Full-time",
    "Part-time", 
    "Contract",
    "Temporary",
    "Internship",
    "Remote"
  ].map(type => ({
    en: type,
    am: type === "Full-time" ? "ሙሉ ጊዜ" : 
        type === "Part-time" ? "ከፊል ጊዜ" :
        type === "Contract" ? "ኮንትራት" :
        type === "Temporary" ? "ጊዜያዊ" :
        type === "Internship" ? "ኢንተርንሺፕ" :
        type === "Remote" ? "ሩቅ" : type
  }));

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">{t.title}</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {language === 'am' ? 'ስራ ቦታዎችን ያስተዳድሩ፣ ማመልከቻዎችን ይከታተሉ፣ እና የሰው ኃይልን ያቀናብሩ' : 'Manage vacancies, track applicants, and streamline your hiring process'}
            </p>
          </div>
          
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300"
            >
              <FaPlus /> {t.create}
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-4 pl-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" 
                  : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {['all', 'active', 'expired'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                statusFilter === filter
                  ? darkMode
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 text-white"
                  : darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
              }`}
            >
              {t.filters[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => {
            const expired = isExpired(vacancy.deadline);
            const newPost = isNew(vacancy.postDate);
            const applicants = applicantsCount[vacancy._id] || 0;
            
            return (
              <motion.div
                key={vacancy._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 border-gray-700" 
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Header with status badge */}
                <div className={`p-6 ${expired ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'} text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{vacancy.title}</h3>
                      <p className="text-sm opacity-90">{vacancy.department}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${expired ? 'bg-red-700' : 'bg-green-700'}`}>
                        {expired ? t.expired : t.open}
                      </span>
                      {newPost && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500 text-black">
                          {t.today}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vacancy Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaBriefcase className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className="font-medium">{vacancy.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBuilding className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span>{vacancy.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span>{new Date(vacancy.postDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className={`${expired ? 'text-red-500' : darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={expired ? 'text-red-500' : ''}>
                        {new Date(vacancy.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {vacancy.salary && (
                    <div className="flex items-center gap-2 mb-4">
                      <FaMoneyBillWave className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className="font-semibold text-green-600 dark:text-green-400">{vacancy.salary}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaUsers className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className="text-sm">
                        {applicants} {t.applicants.toLowerCase()}
                      </span>
                    </div>
                    {vacancy.qualification && (
                      <div className="flex items-center gap-2">
                        <FaGraduationCap className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className="text-sm">{vacancy.qualification}</span>
                      </div>
                    )}
                  </div>

                  {vacancy.description && (
                    <div className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {vacancy.description}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isAdmin && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal("view", vacancy)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-300"
                      >
                        <FaEye /> {t.view}
                      </motion.button>
                      {!expired && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal("edit", vacancy)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-300"
                        >
                          <FaEdit /> {t.edit}
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(vacancy)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-300"
                      >
                        <FaTrash /> {t.delete}
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <div className={`text-6xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>📋</div>
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.noVacancies}</p>
            <p className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
              {searchTerm ? "Try a different search term" : isAdmin ? t.create : "No vacancies available"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* View Modal */}
        {modalType === "view" && selectedVacancy && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-white">{t.vacancyDetails}</h2>
                <button 
                  onClick={() => setModalType("")}
                  className="text-gray-500 hover:text-red-500 text-3xl transition-colors duration-300"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.jobTitle}</label>
                    <p className="text-lg font-semibold">{selectedVacancy.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.department}</label>
                    <p className="text-lg font-semibold">{selectedVacancy.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.position}</label>
                    <p className="text-lg font-semibold">{selectedVacancy.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.employmentType}</label>
                    <p className="text-lg font-semibold">{selectedVacancy.employmentType}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.postDate}</label>
                    <p className="text-lg font-semibold">
                      {new Date(selectedVacancy.postDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.deadline}</label>
                    <p className={`text-lg font-semibold ${isExpired(selectedVacancy.deadline) ? 'text-red-600' : 'text-green-600'}`}>
                      {new Date(selectedVacancy.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.status}</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isExpired(selectedVacancy.deadline)
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}>
                      {isExpired(selectedVacancy.deadline) ? t.expired : t.open}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.applicants}</label>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {applicantsCount[selectedVacancy._id] || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.description}</label>
                <div className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-700"
                }`}>
                  {selectedVacancy.description || t.noDescription}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setModalType("")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                {!isExpired(selectedVacancy.deadline) && isAdmin && (
                  <button
                    onClick={() => setModalType("edit")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    {t.edit}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit/Create Modal */}
        {(modalType === "edit" || isCreateOpen) && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-white">
                  {modalType === "edit" ? t.editVacancy : t.createVacancy}
                </h2>
                <button 
                  onClick={() => { setModalType(""); setIsCreateOpen(false); }}
                  className="text-gray-500 hover:text-red-500 text-3xl transition-colors duration-300"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={modalType === "edit" ? handleEditSubmit : handleCreateSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.jobTitle} *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter job title"
                    />
                    {formErrors.title && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.department} *</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.department ? 'border-red-500' : ''}`}
                      placeholder="Enter department name"
                    />
                    {formErrors.department && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.department}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.position} *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.position ? 'border-red-500' : ''}`}
                      placeholder="Enter position"
                    />
                    {formErrors.position && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.position}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.employmentType} *</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.employmentType ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select employment type</option>
                      {employmentTypes.map((type, index) => (
                        <option key={index} value={type.en}>
                          {language === 'am' ? type.am : type.en}
                        </option>
                      ))}
                    </select>
                    {formErrors.employmentType && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.employmentType}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.qualification}</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      placeholder="e.g., BSc, MSc, PhD"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.experience}</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      placeholder="e.g., 2+ years"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.salary}</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      placeholder="e.g., $50,000 - $70,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.postDate} *</label>
                    <input
                      type="date"
                      name="postDate"
                      value={formData.postDate}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.postDate ? 'border-red-500' : ''}`}
                    />
                    {formErrors.postDate && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.postDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.deadline} *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={formData.postDate}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.deadline ? 'border-red-500' : ''}`}
                    />
                    {formErrors.deadline && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.deadline}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">{t.description}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      placeholder="Enter detailed job description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setModalType(""); setIsCreateOpen(false); }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      darkMode 
                        ? "bg-gray-800 hover:bg-gray-700 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    {modalType === "edit" ? t.update : t.createButton}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && vacancyToDelete && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-md ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <FaTrash className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.confirmDelete}</h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t.jobTitle}: <span className="font-semibold">{vacancyToDelete.title}</span>
                  <br />
                  {t.department}: <span className="font-semibold">{vacancyToDelete.department}</span>
                </p>
                <p className={`mt-4 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                  {language === 'am' ? 'ይህ ተግባር መገልበጥ አይችልም።' : 'This action cannot be undone.'}
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageVacancies;