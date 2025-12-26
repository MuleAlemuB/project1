import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useSettings } from "../contexts/SettingsContext";
import {
  FaBuilding,
  FaBriefcase,
  FaGraduationCap,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaBell,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFilePdf,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
} from "react-icons/fa";

const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl transition-all duration-300 transform ${
      type === "success"
        ? "bg-green-600 text-white border-l-4 border-green-800"
        : "bg-red-600 text-white border-l-4 border-red-800"
    } animate-slide-in flex items-center justify-between min-w-[300px]`}
  >
    <div className="flex items-center">
      {type === "success" ? (
        <FaCheck className="mr-3 text-white" />
      ) : (
        <FaExclamationTriangle className="mr-3 text-white" />
      )}
      <span className="font-medium">{message}</span>
    </div>
    <button
      onClick={onClose}
      className="ml-4 font-bold text-white hover:text-gray-200 transition"
    >
      <FaTimes />
    </button>
  </div>
);

const VacanciesHome = () => {
  const { darkMode, language } = useSettings();
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [newVacancyCount, setNewVacancyCount] = useState(0);
  const [newApplications, setNewApplications] = useState({});
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumePreview, setResumePreview] = useState(null);

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const res = await axios.get("/vacancies");
      setVacancies(res.data);

      const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
      const now = new Date();
      const newCount = res.data.filter(
        (v) =>
          now - new Date(v.postDate) < 24 * 60 * 60 * 1000 &&
          !viewed.includes(v._id)
      ).length;
      setNewVacancyCount(newCount);

      const allAppsRes = await axios.get("/applications");
      const allApps = allAppsRes.data;
      const apps = {};
      res.data.forEach((v) => {
        const newAppsCount = allApps.filter(
          (a) =>
            a.vacancy?._id === v._id &&
            now - new Date(a.appliedAt) < 24 * 60 * 60 * 1000
        ).length;
        apps[v._id] = newAppsCount;
      });
      setNewApplications(apps);
    } catch (err) {
      console.error(err);
      showNotification(
        language === "am" ? "የስራ ቦታዎችን ማምጣት አልተሳካም" : "Failed to fetch vacancies",
        "error"
      );
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    // Name validation
    if (!application.name.trim()) {
      errors.name = language === "am" ? "ስም ያስገቡ" : "Name is required";
    } else if (!nameRegex.test(application.name)) {
      errors.name = language === "am" ? "ልክ ያልሆነ ስም" : "Invalid name format";
    }

    // Email validation
    if (!application.email) {
      errors.email = language === "am" ? "ኢሜይል ያስገቡ" : "Email is required";
    } else if (!emailRegex.test(application.email)) {
      errors.email = language === "am" ? "ልክ ያልሆነ ኢሜይል" : "Invalid email format";
    }

    // Phone validation
    if (!application.phone) {
      errors.phone = language === "am" ? "ስልክ ቁጥር ያስገቡ" : "Phone number is required";
    } else if (!phoneRegex.test(application.phone)) {
      errors.phone = language === "am" ? "ስልክ ቁጥር 10 አሃዝ መሆን አለበት" : "Phone must be 10 digits";
    }

    // Resume validation
    if (!application.resume) {
      errors.resume = language === "am" ? "CV/የሥራ ታሪክ ያስገቡ" : "CV/Resume is required";
    } else {
      const fileSize = application.resume.size / 1024 / 1024; // in MB
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(application.resume.type) && !application.resume.name.match(/\.(pdf|doc|docx)$/i)) {
        errors.resume = language === "am" ? "PDF, DOC ወይም DOCX ፋይል ብቻ" : "Only PDF, DOC or DOCX files allowed";
      } else if (fileSize > 5) {
        errors.resume = language === "am" ? "ፋይል መጠን ከ 5MB መብለጥ የለበትም" : "File size must be less than 5MB";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Name validation - only letters and spaces
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }
    
    // Phone validation - only numbers, max 10 digits
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    
    setApplication({ ...application, [name]: value });
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplication({ ...application, resume: file });
      setResumePreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
      });
      
      // Clear resume error when file is selected
      if (formErrors.resume) {
        setFormErrors({ ...formErrors, resume: "" });
      }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedVacancy) return;

    // Check if deadline has passed
    const deadline = new Date(selectedVacancy.deadline);
    const now = new Date();
    if (deadline < now) {
      showNotification(
        language === "am" 
          ? "የማመልከቻ ጊዜ አልፏል" 
          : "Application deadline has passed",
        "error"
      );
      return;
    }

    // Validate form
    if (!validateForm()) {
      showNotification(
        language === "am" 
          ? "እባክዎ ሁሉንም መስኮች በትክክል ይሙሉ" 
          : "Please fill all fields correctly",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", application.name.trim());
    formData.append("email", application.email.trim());
    formData.append("phone", application.phone);
    formData.append("resume", application.resume);
    formData.append("vacancyId", selectedVacancy._id);

    try {
      await axios.post(`/applications/apply/${selectedVacancy._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification(
        language === "am"
          ? "ማመልከቻዎ በተሳካ ሁኔታ ተልኳል!"
          : "Application submitted successfully!",
        "success"
      );

      const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
      localStorage.setItem(
        "viewedVacancies",
        JSON.stringify([...viewed, selectedVacancy._id])
      );
      
      // Reset form
      setSelectedVacancy(null);
      setApplication({ name: "", email: "", phone: "", resume: null });
      setResumePreview(null);
      setFormErrors({});
      fetchVacancies();
    } catch (err) {
      console.error(err);
      showNotification(
        language === "am" 
          ? "ማመልከቻዎን ማቅረብ አልተሳካም" 
          : "Failed to submit application",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (v) => {
    // Check if deadline has passed
    const deadline = new Date(v.deadline);
    const now = new Date();
    
    if (deadline < now) {
      showNotification(
        language === "am" 
          ? "የማመልከቻ ጊዜ አልፏል" 
          : "Application deadline has passed",
        "error"
      );
      return;
    }
    
    setSelectedVacancy(v);
    const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
    if (!viewed.includes(v._id)) {
      localStorage.setItem("viewedVacancies", JSON.stringify([...viewed, v._id]));
    }
    
    // Reset form when opening new modal
    setApplication({ name: "", email: "", phone: "", resume: null });
    setResumePreview(null);
    setFormErrors({});
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getRemainingDays = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" 
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900"
      }`}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-block p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4 shadow-lg">
            <FaBriefcase className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {language === "am" ? "የሥራ ክፍት ቦታዎች" : "Career Opportunities"}
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            {language === "am" 
              ? "በቴክኖሎጂ እና ፈጠራ ውስጥ የሚገኙ ማራኪ እድሎችን ያግኙ"
              : "Discover exciting opportunities in technology and innovation"}
          </p>
          
          {newVacancyCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm md:text-base px-5 py-2 rounded-full animate-pulse font-semibold shadow-lg">
              <FaBell className="animate-bounce" />
              <span>{newVacancyCount} {language === "am" ? "አዲስ ስራዎች" : "New Positions"}</span>
            </div>
          )}
        </div>

        {/* Vacancies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vacancies.length > 0 ? (
            vacancies.map((v) => {
              const viewed = JSON.parse(localStorage.getItem("viewedVacancies") || "[]");
              const isNew = !viewed.includes(v._id) &&
                new Date() - new Date(v.postDate) < 24 * 60 * 60 * 1000;
              const deadlinePassed = isDeadlinePassed(v.deadline);
              const remainingDays = getRemainingDays(v.deadline);

              return (
                <div
                  key={v._id}
                  className={`relative rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                    darkMode 
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" 
                      : "bg-white border border-gray-200"
                  } ${deadlinePassed ? "opacity-80" : ""}`}
                >
                  {/* Badges Container */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    {/* New Badge */}
                    {isNew && !deadlinePassed && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <FaBell className="text-xs" /> 
                        {language === "am" ? "አዲስ" : "New"}
                      </span>
                    )}

                    {/* Deadline Passed Badge */}
                    {deadlinePassed && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <FaTimes className="text-xs" /> 
                        {language === "am" ? "ጊዜ አልፏል" : "Closed"}
                      </span>
                    )}

                    {/* Remaining Days Badge */}
                    {!deadlinePassed && remainingDays <= 7 && (
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                        {remainingDays} {language === "am" ? "ቀናት ቀርተዋል" : "days left"}
                      </span>
                    )}

                    {/* New Applications Badge */}
                    {newApplications[v._id] > 0 && (
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <FaBell className="text-xs" /> 
                        {newApplications[v._id]}+ {language === "am" ? "አዲስ" : "New"}
                      </span>
                    )}
                  </div>

                  {/* Vacancy Content */}
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 line-clamp-2">
                        {v.title}
                      </h2>

                      {/* Info Grid */}
                      <div className="grid gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <FaBuilding className="text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {language === "am" ? "ዲፓርትመንት" : "Department"}
                            </p>
                            <p className="font-medium text-sm">{v.department}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <FaBriefcase className="text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {language === "am" ? "የስራ አይነት" : "Position"}
                            </p>
                            <p className="font-medium text-sm">{v.position}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <FaClock className="text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {language === "am" ? "የስራ አይነት" : "Employment Type"}
                            </p>
                            <p className="font-medium text-sm">{v.employmentType}</p>
                          </div>
                        </div>

                        {v.qualification && (
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}>
                              <FaGraduationCap className="text-green-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {language === "am" ? "ትምህርት" : "Qualification"}
                              </p>
                              <p className="font-medium text-sm">{v.qualification}</p>
                            </div>
                          </div>
                        )}

                        {v.salary && (
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}>
                              <FaDollarSign className="text-teal-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {language === "am" ? "ደመወዝ" : "Salary"}
                              </p>
                              <p className="font-medium text-sm">{v.salary}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <FaCalendarAlt className="text-red-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {language === "am" ? "መዝጊያ ቀን" : "Deadline"}
                            </p>
                            <p className="font-medium text-sm">
                              {new Date(v.deadline).toLocaleDateString()}
                              {!deadlinePassed && (
                                <span className={`ml-2 text-xs ${remainingDays <= 3 ? 'text-red-500' : 'text-green-500'}`}>
                                  ({remainingDays} {language === "am" ? "ቀናት ቀርተዋል" : "days left"})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => handleOpenModal(v)}
                      disabled={deadlinePassed}
                      className={`mt-6 w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                        deadlinePassed
                          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      }`}
                    >
                      {deadlinePassed
                        ? language === "am" 
                          ? "ጊዜ አልፏል" 
                          : "Deadline Passed"
                        : language === "am"
                          ? "አሁን ይመልከቱ"
                          : "Apply Now"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-16">
              <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <FaBriefcase className="text-4xl text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {language === "am" ? "ምንም ክፍት የሥራ ቦታዎች የሉም" : "No vacancies available"}
              </h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                {language === "am" 
                  ? "በአሁኑ ጊዜ ምንም ክፍት የስራ ቦታዎች የሉም። እባክዎ ቆይተው ይመልከቱ።"
                  : "There are currently no open positions. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
              darkMode 
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700" 
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div className={`p-6 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {language === "am" ? "ማመልከቻ" : "Application Form"}
                </h3>
                <button
                  onClick={() => {
                    setSelectedVacancy(null);
                    setResumePreview(null);
                    setFormErrors({});
                  }}
                  className={`p-2 rounded-lg transition ${
                    darkMode 
                      ? "hover:bg-gray-700 text-gray-400" 
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-indigo-50"
                }`}>
                  <FaBriefcase className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === "am" ? "ለሚከተለው ስራ" : "Applying for"}
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {selectedVacancy.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}>
                  <FaCalendarAlt className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {language === "am" ? "መዝጊያ ቀን" : "Deadline"}
                  </p>
                  <p className="font-medium">
                    {new Date(selectedVacancy.deadline).toLocaleDateString()}
                    <span className={`ml-2 text-sm ${
                      getRemainingDays(selectedVacancy.deadline) <= 3 
                        ? "text-red-500" 
                        : "text-green-500"
                    }`}>
                      ({getRemainingDays(selectedVacancy.deadline)} {language === "am" ? "ቀናት ቀርተዋል" : "days left"})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleApply} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaUser className="text-indigo-500" />
                  {language === "am" ? "ሙሉ ስም" : "Full Name"} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={application.name}
                    onChange={handleChange}
                    placeholder={language === "am" ? "ሙሉ ስምዎን ያስገቡ" : "Enter your full name"}
                    className={`w-full px-4 pl-10 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } ${formErrors.name ? "border-red-500" : ""}`}
                    required
                  />
                  <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    formErrors.name ? "text-red-500" : "text-gray-400"
                  }`} />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-indigo-500" />
                  {language === "am" ? "ኢሜይል" : "Email"} *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={application.email}
                    onChange={handleChange}
                    placeholder={language === "am" ? "ኢሜይልዎን ያስገቡ" : "Enter your email"}
                    className={`w-full px-4 pl-10 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } ${formErrors.email ? "border-red-500" : ""}`}
                    required
                  />
                  <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    formErrors.email ? "text-red-500" : "text-gray-400"
                  }`} />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaPhone className="text-indigo-500" />
                  {language === "am" ? "ስልክ ቁጥር" : "Phone Number"} *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={application.phone}
                    onChange={handleChange}
                    placeholder={language === "am" ? "10 አሃዝ ስልክ ቁጥር" : "10-digit phone number"}
                    maxLength="10"
                    className={`w-full px-4 pl-10 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } ${formErrors.phone ? "border-red-500" : ""}`}
                    required
                  />
                  <FaPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    formErrors.phone ? "text-red-500" : "text-gray-400"
                  }`} />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FaExclamationTriangle className="text-xs" /> {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaFilePdf className="text-indigo-500" />
                  {language === "am" ? "CV/የሥራ ታሪክ" : "CV/Resume"} *
                </label>
                <div className="space-y-3">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className={`w-full opacity-0 absolute cursor-pointer ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                      id="resume-upload"
                      required
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`block w-full px-4 py-4 rounded-lg border-2 border-dashed cursor-pointer transition ${
                        formErrors.resume 
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20" 
                          : darkMode 
                            ? "border-gray-600 bg-gray-700 hover:border-indigo-500" 
                            : "border-gray-300 bg-gray-50 hover:border-indigo-500"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaUpload className={`text-2xl ${
                          formErrors.resume ? "text-red-500" : "text-indigo-500"
                        }`} />
                        <span className={`text-sm font-medium ${
                          formErrors.resume 
                            ? "text-red-600 dark:text-red-400" 
                            : darkMode 
                              ? "text-gray-300" 
                              : "text-gray-600"
                        }`}>
                          {language === "am" 
                            ? "CV ያስገቡ (PDF, DOC, DOCX)" 
                            : "Upload CV (PDF, DOC, DOCX)"}
                        </span>
                        <span className={`text-xs ${
                          formErrors.resume 
                            ? "text-red-500 dark:text-red-400" 
                            : darkMode 
                              ? "text-gray-400" 
                              : "text-gray-500"
                        }`}>
                          {language === "am" 
                            ? "ፋይሉ ከ 5MB መብለጥ የለበትም" 
                            : "Max file size: 5MB"}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* File Preview */}
                  {resumePreview && (
                    <div className={`p-3 rounded-lg flex items-center justify-between ${
                      darkMode ? "bg-gray-700" : "bg-green-50 border border-green-200"
                    }`}>
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 text-xl" />
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-white truncate max-w-[200px]">
                            {resumePreview.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resumePreview.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setApplication({ ...application, resume: null });
                          setResumePreview(null);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <FaTimes className="text-gray-500" />
                      </button>
                    </div>
                  )}

                  {formErrors.resume && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" /> {formErrors.resume}
                    </p>
                  )}
                </div>
              </div>

                            {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVacancy(null);
                    setResumePreview(null);
                    setFormErrors({});
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {language === "am" ? "ይቅር" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {language === "am" ? "በመላክ ላይ..." : "Submitting..."}
                    </div>
                  ) : (
                    language === "am" ? "አሁን ያመልክቱ" : "Submit Application"
                  )}
                </button>
              </div>

              {/* Form Notes */}
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                <p className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
                  <span>
                    {language === "am" 
                      ? "ሁሉም መስኮች መሞላት አለባቸው። ስልክ ቁጥር 10 አሃዝ መሆን አለበት።"
                      : "All fields are required. Phone number must be 10 digits."}
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacanciesHome;