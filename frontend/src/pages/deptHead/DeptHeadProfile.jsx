import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaBuilding,
  FaBriefcase,
  FaPhone,
  FaIdBadge,
  FaUserCircle,
  FaFileAlt,
  FaUser,
  FaDollarSign,
  FaAddressCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const translations = {
  en: {
    title: "My Profile",
    subtitle: "View your details and manage your account",
    loading: "Loading profile...",
    firstName: "First Name",
    middleName: "Middle Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    department: "Department",
    position: "Position",
    employeeId: "Employee ID",
    salary: "Salary",
    experience: "Experience",
    contactPerson: "Emergency Contact",
    contactAddress: "Contact Address",
    status: "Status",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Update Password",
    passwordUpdated: "Password updated successfully",
    updateFailed: "Failed to update password",
    profileError: "Failed to load profile",
    address: "Address",
    dateOfBirth: "Date of Birth",
    security: "Security",
    personalInfo: "Personal Information",
    employmentInfo: "Employment Information",
    contactInfo: "Contact Information",
    changePassword: "Change Password",
    saveChanges: "Save Changes",
    passwordRequirements: "Password must contain at least 6 characters including uppercase, lowercase, number, and special character",
    passwordsDontMatch: "Passwords do not match",
    passwordStrength: "Password Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
  },
  am: {
    title: "መገለጫዬ",
    subtitle: "ዝርዝሮችዎን ይመልከቱ እና መለያዎን ያስተዳድሩ",
    loading: "መገለጫ በመጫን ላይ...",
    firstName: "የመጀመሪያ ስም",
    middleName: "የአባት ስም",
    lastName: "የአያት ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    department: "ክፍል",
    position: "ስራ",
    employeeId: "የሰራተኛ መታወቂያ",
    salary: "ደሞዝ",
    experience: "ልምድ",
    contactPerson: "የአደጋ አደጋ",
    contactAddress: "የመገናኛ አድራሻ",
    status: "ሁኔታ",
    currentPassword: "የአሁኑ የይለፍ ቃል",
    newPassword: "አዲስ የይለፍ ቃል",
    confirmPassword: "አዲሱን የይለፍ ቃል አረጋግጥ",
    updatePassword: "የይለፍ ቃል አሻሽል",
    passwordUpdated: "የይለፍ ቃል በትክክል ተሻሽሏል",
    updateFailed: "የይለፍ ቃል ማሻሻያ አልተሳካም",
    profileError: "መገለጫ ማስመዝገብ አልተሳካም",
    address: "አድራሻ",
    dateOfBirth: "የልደት ቀን",
    security: "ደህንነት",
    personalInfo: "ግላዊ መረጃ",
    employmentInfo: "የስራ መረጃ",
    contactInfo: "የመገናኛ መረጃ",
    changePassword: "የይለፍ ቃል ቀይር",
    saveChanges: "ለውጦችን አስቀምጥ",
    passwordRequirements: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል፣ ትልቅ ፊደል፣ ትንሽ ፊደል፣ ቁጥር እና ልዩ ቁምፊ ይዟል",
    passwordsDontMatch: "የይለፍ ቃሎች አይጣጣሙም",
    passwordStrength: "የይለፍ ቃል ጥንካሬ",
    weak: "ደካማ",
    medium: "መካከለኛ",
    strong: "ጠንካራ",
  },
};

// Password validation function
const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  }
  if (!hasUpperCase) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!hasLowerCase) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!hasNumbers) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  return { valid: true, message: "Password is strong" };
};

// Password strength checker
const checkPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "" };
  
  let score = 0;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  if (score <= 2) return { strength: 33, label: "weak" };
  if (score <= 4) return { strength: 66, label: "medium" };
  return { strength: 100, label: "strong" };
};

const DeptHeadProfile = () => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [language]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/depthead/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      showMessage(t.profileError, "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Validate new password in real-time
    if (name === "newPassword") {
      const validation = validatePassword(value);
      if (!validation.valid) {
        setPasswordErrors(prev => ({ ...prev, newPassword: validation.message }));
      } else {
        setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setPasswordErrors({});
    
    // Validate fields
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const validation = validatePassword(passwordData.newPassword);
      if (!validation.valid) {
        errors.newPassword = validation.message;
      }
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t.passwordsDontMatch;
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      showMessage("Please fix the errors below", "error");
      return;
    }
    
    try {
      // Send only currentPassword and newPassword to backend
      await axiosInstance.put("/depthead/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      showMessage(t.passwordUpdated, "success");
      setPasswordData({ 
        currentPassword: "", 
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error("Password update error:", err);
      const errorMsg = err.response?.data?.message || err.message || t.updateFailed;
      
      // Handle specific error cases
      if (errorMsg.includes("Current password is incorrect")) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          currentPassword: "Current password is incorrect" 
        }));
      }
      
      showMessage(errorMsg, "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString(language === "en" ? "en-US" : "am-ET", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    if (typeof salary === 'number' || !isNaN(salary)) {
      return new Intl.NumberFormat(language === "en" ? "en-US" : "am-ET", {
        style: 'currency',
        currency: 'ETB'
      }).format(salary);
    }
    return salary;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"}`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  const photoUrl = profile?.photo ? 
    (profile.photo.startsWith('http') ? profile.photo : `${BACKEND_URL}${profile.photo}`) : 
    null;

  const passwordStrength = checkPasswordStrength(passwordData.newPassword);

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
          messageType === "success" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" 
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          <div className="flex justify-between items-center">
            <span>{message}</span>
            <button 
              onClick={() => setMessage("")}
              className="text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Profile Overview */}
        <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
          <div className="flex flex-col items-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${photoUrl ? 'hidden' : 'flex'} items-center justify-center mb-4 ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
              <FaUserCircle className="w-20 h-20 md:w-24 md:h-24 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h2 className="text-xl font-bold mb-1 text-center">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
              {profile?.typeOfPosition || "Department Head"}
            </p>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              (profile?.employeeStatus || profile?.status)?.toLowerCase() === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
            }`}>
              {profile?.employeeStatus || profile?.status || "Active"}
            </div>
            
            <div className="mt-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FaShieldAlt className="text-blue-500" />
                  {t.security}
                </h3>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <FaLock />
                    {t.changePassword}
                  </button>
                )}
              </div>
              
              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.currentPassword}</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        } ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.newPassword}</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        } ${passwordErrors.newPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{t.passwordStrength}:</span>
                          <span className={`font-medium ${
                            passwordStrength.label === "weak" ? "text-red-600" :
                            passwordStrength.label === "medium" ? "text-yellow-600" :
                            "text-green-600"
                          }`}>
                            {t[passwordStrength.label]}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.label === "weak" ? "bg-red-500" :
                              passwordStrength.label === "medium" ? "bg-yellow-500" :
                              "bg-green-500"
                            }`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword}</p>
                    )}
                    
                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {t.passwordRequirements}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        } ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 font-medium"
                    >
                      {t.updatePassword}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setPasswordErrors({});
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      {language === "en" ? "Cancel" : "ሰርዝ"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              {t.personalInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <DetailItem
                icon={<FaUser />}
                label={t.firstName}
                value={profile?.firstName}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaUser />}
                label={t.middleName}
                value={profile?.middleName}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaUser />}
                label={t.lastName}
                value={profile?.lastName}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaIdBadge />}
                label={t.employeeId}
                value={profile?.empId}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaCalendarAlt />}
                label={t.dateOfBirth}
                value={formatDate(profile?.dateOfBirth)}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaMapMarkerAlt />}
                label={t.address}
                value={profile?.address}
                darkMode={darkMode}
                language={language}
              />
            </div>
          </div>

          {/* Employment Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaBriefcase className="text-green-500" />
              {t.employmentInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <DetailItem
                icon={<FaBuilding />}
                label={t.department}
                value={profile?.department?.name}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaBriefcase />}
                label={t.position}
                value={profile?.typeOfPosition}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaDollarSign />}
                label={t.salary}
                value={formatSalary(profile?.salary)}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaFileAlt />}
                label={t.experience}
                value={profile?.experience}
                darkMode={darkMode}
                language={language}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaAddressCard className="text-purple-500" />
              {t.contactInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <DetailItem
                icon={<FaEnvelope />}
                label={t.email}
                value={profile?.email}
                darkMode={darkMode}
                language={language}
                isEmail={true}
              />
              <DetailItem
                icon={<FaPhone />}
                label={t.phone}
                value={profile?.phoneNumber || profile?.phone}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaUser />}
                label={t.contactPerson}
                value={profile?.contactPerson}
                darkMode={darkMode}
                language={language}
              />
              <DetailItem
                icon={<FaMapMarkerAlt />}
                label={t.contactAddress}
                value={profile?.contactPersonAddress}
                darkMode={darkMode}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value, darkMode, language, isEmail = false }) => (
  <div className="break-words">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
    {isEmail && value ? (
      <a 
        href={`mailto:${value}`}
        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <p className="font-medium break-all">
        {value || (
          <span className="text-gray-400 italic">
            {darkMode ? (language === "en" ? "Not provided" : "አልተሰጠም") : (language === "en" ? "Not provided" : "አልተሰጠም")}
          </span>
        )}
      </p>
    )}
  </div>
);

export default DeptHeadProfile;