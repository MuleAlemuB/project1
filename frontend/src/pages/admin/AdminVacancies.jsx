import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaFileDownload, FaCalendarAlt, FaBriefcase, FaBuilding, FaMoneyBillWave, FaGraduationCap, FaClock, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    dashboard: "Vacancy Dashboard",
    addVacancy: "Add New Vacancy",
    create: "Create Vacancy",
    update: "Update Vacancy",
    cancel: "Cancel",
    department: "Department",
    position: "Position",
    employmentType: "Employment Type",
    qualification: "Qualification",
    experience: "Experience",
    salary: "Salary",
    description: "Job Description",
    post: "Post Date",
    deadline: "Application Deadline",
    applied: "Applied",
    applications: "Applications",
    name: "Applicant Name",
    email: "Email Address",
    phone: "Phone Number",
    resume: "Resume",
    appliedAt: "Applied At",
    seen: "Viewed",
    action: "Action",
    delete: "Delete",
    noApplications: "No applications yet.",
    viewDetails: "View Details",
    editVacancy: "Edit Vacancy",
    deleteVacancy: "Delete Vacancy",
    vacancyDetails: "Vacancy Details",
    loading: "Loading...",
    success: "Success!",
    error: "Error!",
    deleteSuccess: "Vacancy deleted successfully",
    updateSuccess: "Vacancy updated successfully",
    createSuccess: "Vacancy created successfully",
    deleteAppSuccess: "Application deleted successfully",
    confirmDelete: "Are you sure you want to delete this vacancy?",
    confirmDeleteApp: "Are you sure you want to delete this application?",
    download: "Download",
    open: "Open",
    closed: "Closed",
    status: "Status",
    totalVacancies: "Total Vacancies",
    totalApplications: "Total Applications",
    activeVacancies: "Active Vacancies",
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
      all: "All",
      active: "Active",
      closed: "Closed"
    }
  },
  am: {
    dashboard: "የስራ አደረጃጀት ማዕከል",
    addVacancy: "አዲስ ስራ ቦታ አክል",
    create: "ስራ ቦታ ፍጠር",
    update: "ስራ ቦታ አስተካክል",
    cancel: "ይቅር",
    department: "የመምሪያ ክፍል",
    position: "የስራ መደብ",
    employmentType: "የስራ አይነት",
    qualification: "ትምህርት ዝርዝር",
    experience: "ልምድ",
    salary: "ደመወዝ",
    description: "ስራ መግለጫ",
    post: "የተለጠፈበት ቀን",
    deadline: "የመጨረሻ ቀን",
    applied: "ተመዝግቧል",
    applications: "መተግበሪያዎች",
    name: "ማመልከቻ ሰሚ ስም",
    email: "ኢሜይል አድራሻ",
    phone: "ስልክ ቁጥር",
    resume: "የራስ መግለጫ",
    appliedAt: "በተመዘገበበት ጊዜ",
    seen: "ታይቷል",
    action: "ተግባር",
    delete: "ሰርዝ",
    noApplications: "እስካሁን ምንም ማመልከቻዎች የሉም።",
    viewDetails: "ዝርዝር ይመልከቱ",
    editVacancy: "ስራ ቦታ አስተካክል",
    deleteVacancy: "ስራ ቦታ ሰርዝ",
    vacancyDetails: "የስራ ቦታ ዝርዝር",
    loading: "በመጫን ላይ...",
    success: "ተሳክቷል!",
    error: "ስህተት!",
    deleteSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተሰርዟል",
    updateSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተስተካክሏል",
    createSuccess: "ስራ ቦታው በተሳካ ሁኔታ ተፈጥሯል",
    deleteAppSuccess: "ማመልከቻው በተሳካ ሁኔታ ተሰርዟል",
    confirmDelete: "ይህን ስራ ቦታ ለማጥፋት እርግጠኛ ነዎት?",
    confirmDeleteApp: "ይህን ማመልከቻ ለማጥፋት እርግጠኛ ነዎት?",
    download: "ያውርዱ",
    open: "ክፍት",
    closed: "ዝግ",
    status: "ሁኔታ",
    totalVacancies: "አጠቃላይ ስራ ቦታዎች",
    totalApplications: "አጠቃላይ ማመልከቻዎች",
    activeVacancies: "ንቁ ስራ ቦታዎች",
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
      all: "ሁሉም",
      active: "ንቁ",
      closed: "ዝግ"
    }
  }
};

// Custom Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <FaCheck /> : type === 'error' ? <FaExclamationTriangle /> : null;
  
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
        <FaTimes />
      </button>
    </motion.div>
  );
};

const AdminVacancies = () => {
  const { language, darkMode } = useSettings();
  const t = translations[language] || translations.en;

  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteAppConfirmOpen, setIsDeleteAppConfirmOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState(null);
  const [appToDelete, setAppToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
      const res = await axiosInstance.get("/vacancies");
      const vacanciesData = res.data;

      const apps = await axiosInstance.get("/applications");
      const appsByVacancy = apps.data.reduce((acc, app) => {
        const id = app.vacancy?._id;
        if (id) acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const updatedVacancies = vacanciesData.map((v) => ({
        ...v,
        appCount: appsByVacancy[v._id] || 0,
        isExpired: new Date(v.deadline) < new Date()
      }));

      setVacancies(updatedVacancies);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to fetch vacancies"}`);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  // Check if vacancy is new (posted within last 3 days)
  const isNew = (postDate) => {
    if (!postDate) return false;
    const postDateObj = new Date(postDate);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return postDateObj > threeDaysAgo;
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
    
    return errors;
  };

  const handleCreateOpen = () => {
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
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.post("/vacancies", formData);
      setVacancies([...vacancies, { ...res.data, appCount: 0, isExpired: false }]);
      setIsCreateOpen(false);
      showNotification('success', t.createSuccess);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to create vacancy"}`);
    }
  };

  const handleEditOpen = (vacancy) => {
    setSelectedVacancy(vacancy);
    setFormData({
      ...vacancy,
      postDate: vacancy.postDate?.slice(0, 10),
      deadline: vacancy.deadline?.slice(0, 10),
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.put(`/vacancies/${selectedVacancy._id}`, formData);
      setVacancies(vacancies.map((v) => 
        v._id === res.data._id ? { ...res.data, appCount: v.appCount, isExpired: new Date(res.data.deadline) < new Date() } : v
      ));
      setIsEditOpen(false);
      setSelectedVacancy(null);
      showNotification('success', t.updateSuccess);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to update vacancy"}`);
    }
  };

  const handleDeleteClick = (vacancy) => {
    setVacancyToDelete(vacancy);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vacancyToDelete) return;
    
    try {
      await axiosInstance.delete(`/vacancies/${vacancyToDelete._id}`);
      setVacancies(vacancies.filter((v) => v._id !== vacancyToDelete._id));
      showNotification('success', t.deleteSuccess);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to delete vacancy"}`);
    } finally {
      setIsDeleteConfirmOpen(false);
      setVacancyToDelete(null);
    }
  };

  const handleView = async (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsViewOpen(true);
    try {
      const res = await axiosInstance.get("/applications");
      const filtered = res.data.filter((app) => app.vacancy?._id === vacancy._id);
      setApplications(filtered);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to fetch applications"}`);
    }
  };

  const handleDeleteAppClick = (application) => {
    setAppToDelete(application);
    setIsDeleteAppConfirmOpen(true);
  };

  const handleDeleteAppConfirm = async () => {
    if (!appToDelete) return;
    
    try {
      await axiosInstance.delete(`/applications/${appToDelete._id}`);
      setApplications(applications.filter((app) => app._id !== appToDelete._id));
      setVacancies(vacancies.map(v => 
        v._id === selectedVacancy._id ? { ...v, appCount: v.appCount - 1 } : v
      ));
      showNotification('success', t.deleteAppSuccess);
    } catch (err) {
      showNotification('error', `${t.error} ${err.response?.data?.message || "Failed to delete application"}`);
    } finally {
      setIsDeleteAppConfirmOpen(false);
      setAppToDelete(null);
    }
  };

  // In your AdminVacancies.jsx file, update the handleDownload function:

const handleDownload = async (filename) => {
  try {
    console.log('Downloading file:', filename);
    
    // Get the base URL from axios instance
    const baseUrl = axiosInstance.defaults.baseURL;
    console.log('Base URL from axios:', baseUrl);
    
    // If baseUrl already ends with /api, don't add it again
    let downloadUrl;
    if (baseUrl && baseUrl.endsWith('/api')) {
      // Remove /api from baseUrl and reconstruct
      const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
      downloadUrl = `${cleanBaseUrl}/api/files/download/${filename}`;
    } else {
      // Use the baseUrl as is
      downloadUrl = `${baseUrl}/files/download/${filename}`;
    }
    
    console.log('Constructed download URL:', downloadUrl);
    
    // Alternative: Construct URL based on current location
    const currentOrigin = window.location.origin; // http://localhost:3000
    const apiUrl = `${currentOrigin}/api/files/download/${filename}`;
    console.log('Alternative URL:', apiUrl);
    
    // Try different methods
    
    // Method 1: Direct anchor tag download (for same-origin)
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank'; // Open in new tab
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Direct download initiated');
      return;
    } catch (directError) {
      console.log('Direct method failed, trying fetch:', directError);
    }
    
    // Method 2: Fetch with authorization
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
    } catch (fetchError) {
      console.error('Fetch method failed:', fetchError);
      
      // Method 3: Last resort - window.open
      window.open(downloadUrl, '_blank');
    }
    
    setNotification({
      type: 'success',
      message: 'Download started'
    });
    
  } catch (error) {
    console.error('Download error:', error);
    setNotification({
      type: 'error',
      message: `Failed to download: ${error.message}`
    });
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Filter vacancies based on status and search
  const filteredVacancies = vacancies.filter((v) => {
    const matchesSearch = searchTerm === "" || 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && !v.isExpired) ||
      (statusFilter === "closed" && v.isExpired);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalVacancies = vacancies.length;
  const activeVacancies = vacancies.filter(v => !v.isExpired).length;
  const totalApplications = vacancies.reduce((sum, v) => sum + v.appCount, 0);

  // Employment type options
  const employmentTypes = [
    "Full-time",
    "Part-time", 
    "Contract",
    "Temporary",
    "Internship",
    "Remote"
  ];

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
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">{t.dashboard}</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {language === 'am' ? 'ስራ ቦታዎችን ያስተዳድሩ፣ ማመልከቻዎችን ይከታተሉ፣ እና የሰው ኃይልን ያቀናብሩ' : 'Manage job vacancies, track applications, and streamline recruitment'}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateOpen}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300"
          >
            <FaPlus /> {t.addVacancy}
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalVacancies}</p>
              <p className="text-3xl font-bold mt-2 text-purple-600">{totalVacancies}</p>
            </div>
            <FaBriefcase className="text-4xl text-purple-500 opacity-70" />
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalApplications}</p>
              <p className="text-3xl font-bold mt-2 text-indigo-600">{totalApplications}</p>
            </div>
            <FaUsers className="text-4xl text-indigo-500 opacity-70" />
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.activeVacancies}</p>
              <p className="text-3xl font-bold mt-2 text-green-600">{activeVacancies}</p>
            </div>
            <FaBuilding className="text-4xl text-green-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'am' ? 'ስራ ቦታዎችን ፈልግ...' : 'Search vacancies...'}
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
          {['all', 'active', 'closed'].map((filter) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => (
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
              <div className={`p-6 ${vacancy.isExpired ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-500 to-indigo-500'} text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1">{vacancy.title}</h3>
                    <p className="text-sm opacity-90">{vacancy.department}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${vacancy.isExpired ? 'bg-gray-700' : 'bg-green-700'}`}>
                      {vacancy.isExpired ? t.closed : t.open}
                    </span>
                    {isNew(vacancy.postDate) && !vacancy.isExpired && (
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
                    <FaClock className={`${vacancy.isExpired ? 'text-red-500' : darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={vacancy.isExpired ? 'text-red-500' : ''}>
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

                {vacancy.qualification && (
                  <div className="flex items-center gap-2 mb-4">
                    <FaGraduationCap className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className="text-sm">{vacancy.qualification}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaUsers className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className="text-sm font-semibold">
                      {vacancy.appCount} {t.applied.toLowerCase()}
                    </span>
                  </div>
                </div>

                {vacancy.description && (
                  <div className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {vacancy.description}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleView(vacancy)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-1 transition-all duration-300"
                  >
                    <FaEye /> {t.viewDetails}
                  </motion.button>
                  {!vacancy.isExpired && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditOpen(vacancy)}
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
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
            <div className={`text-6xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>📋</div>
            <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {language === 'am' ? 'ምንም ስራ ቦታዎች አልተገኙም' : 'No vacancies found'}
            </p>
            <p className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
              {searchTerm ? 
                (language === 'am' ? 'የተለየ የፍለጋ ቃል ይሞክሩ' : 'Try a different search term') : 
                (language === 'am' ? 'የመጀመሪያ ስራ ቦታዎን ይፍጠሩ' : 'Create your first vacancy')
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* View Modal */}
        {isViewOpen && selectedVacancy && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-white">{t.vacancyDetails}</h2>
                <button 
                  onClick={() => setIsViewOpen(false)}
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
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.post}</label>
                    <p className="text-lg font-semibold">
                      {new Date(selectedVacancy.postDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.deadline}</label>
                    <p className={`text-lg font-semibold ${selectedVacancy.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      {new Date(selectedVacancy.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.status}</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedVacancy.isExpired
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}>
                      {selectedVacancy.isExpired ? t.closed : t.open}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.applied}</label>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedVacancy.appCount}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedVacancy.description && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.description}</label>
                  <div className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {selectedVacancy.description}
                  </div>
                </div>
              )}

              <h4 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
                <FaUsers /> {t.applications} ({applications.length})
              </h4>
              
              {applications.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full">
                    <thead className={`font-semibold ${
                      darkMode 
                        ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white" 
                        : "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-900"
                    }`}>
                      <tr>
                        <th className="p-4 text-left">{t.name}</th>
                        <th className="p-4 text-left">{t.email}</th>
                        <th className="p-4 text-left">{t.phone}</th>
                        <th className="p-4 text-left">{t.resume}</th>
                        <th className="p-4 text-left">{t.appliedAt}</th>
                        <th className="p-4 text-left">{t.seen}</th>
                        <th className="p-4 text-left">{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} className={`border-b transition-all duration-300 ${
                          darkMode 
                            ? "hover:bg-gray-750 border-gray-700" 
                            : "hover:bg-purple-50/50 border-gray-100"
                        }`}>
                          <td className="p-4">{app.name}</td>
                          <td className="p-4">{app.email}</td>
                          <td className="p-4">{app.phone}</td>
                          <td className="p-4">
                            {app.resume ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDownload(app.resume)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors duration-300"
                              >
                                <FaFileDownload /> {t.download}
                              </motion.button>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="p-4">
                            {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.seen
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}>
                              {app.seen ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="p-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteAppClick(app)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
                            >
                              {t.delete}
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={`text-4xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>📄</div>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.noApplications}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                {!selectedVacancy.isExpired && (
                  <button
                    onClick={() => {
                      setIsViewOpen(false);
                      handleEditOpen(selectedVacancy);
                    }}
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
        {(isEditOpen || isCreateOpen) && (
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
                  {isEditOpen ? t.editVacancy : t.addVacancy}
                </h2>
                <button 
                  onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }}
                  className="text-gray-500 hover:text-red-500 text-3xl transition-colors duration-300"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit}>
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
                      placeholder={language === 'am' ? 'የስራ ርዕስ ያስገቡ' : 'Enter job title'}
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
                      placeholder={language === 'am' ? 'የክፍል ስም ያስገቡ' : 'Enter department name'}
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
                      placeholder={language === 'am' ? 'የስራ መደብ ያስገቡ' : 'Enter position'}
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
                      <option value="">{language === 'am' ? 'የሥራ አይነት ይምረጡ' : 'Select employment type'}</option>
                      {employmentTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
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
                      placeholder={language === 'am' ? 'ምህርት ይግቡ' : 'e.g., BSc, MSc, PhD'}
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
                      placeholder={language === 'am' ? 'ልምድ ይግቡ' : 'e.g., 2+ years'}
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
                      placeholder={language === 'am' ? 'ደመወዝ ይግቡ' : 'e.g., $50,000 - $70,000'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.post} *</label>
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
                      placeholder={language === 'am' ? 'የስራውን ዝርዝር መግለጫ ያስገቡ' : 'Enter detailed job description'}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }}
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
                    {isEditOpen ? t.update : t.create}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Vacancy Confirmation Modal */}
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

        {/* Delete Application Confirmation Modal */}
        {isDeleteAppConfirmOpen && appToDelete && (
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
                <h3 className="text-xl font-bold mb-2">{t.confirmDeleteApp}</h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t.name}: <span className="font-semibold">{appToDelete.name}</span>
                  <br />
                  {t.email}: <span className="font-semibold">{appToDelete.email}</span>
                </p>
                <p className={`mt-4 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                  {language === 'am' ? 'ይህ ተግባር መገልበጥ አይችልም።' : 'This action cannot be undone.'}
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteAppConfirmOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteAppConfirm}
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

export default AdminVacancies;