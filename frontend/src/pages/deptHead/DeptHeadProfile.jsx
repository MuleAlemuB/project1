import React, { useEffect, useState, useRef } from "react";
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
  FaEdit,
  FaSave,
  FaTimes,
  FaGraduationCap,
  FaCamera,
  FaUpload,
  FaTrash,
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
    qualification: "Qualification",
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
    profileUpdated: "Profile updated successfully",
    address: "Address",
    dateOfBirth: "Date of Birth",
    security: "Security",
    personalInfo: "Personal Information",
    employmentInfo: "Employment Information",
    contactInfo: "Contact Information",
    changePassword: "Change Password",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancelEdit: "Cancel Edit",
    passwordRequirements: "Password must contain at least 6 characters including uppercase, lowercase, number, and special character",
    passwordsDontMatch: "Passwords do not match",
    passwordStrength: "Password Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    cannotEditSalary: "Salary cannot be edited",
    cannotEditExperience: "Experience cannot be edited",
    cannotEditQualification: "Qualification cannot be edited",
    cannotEditEmployeeId: "Employee ID cannot be edited",
    cannotEditDepartment: "Department cannot be edited",
    cannotEditEmail: "Email cannot be edited",
    saving: "Saving...",
    editMode: "Edit Mode",
    viewMode: "View Mode",
    // Photo upload translations
    changePhoto: "Change Photo",
    uploadPhoto: "Upload Photo",
    removePhoto: "Remove Photo",
    photoUploading: "Uploading photo...",
    photoUploaded: "Photo uploaded successfully",
    photoUploadFailed: "Failed to upload photo",
    photoRemoved: "Photo removed successfully",
    photoRemoveFailed: "Failed to remove photo",
    supportedFormats: "Supported formats: JPG, PNG, GIF",
    maxFileSize: "Max file size: 5MB",
    dragDrop: "Drag & drop or click to upload",
    browse: "Browse",
    invalidFileType: "Invalid file type. Please upload an image file.",
    fileTooLarge: "File is too large. Maximum size is 5MB.",
    uploadProgress: "Uploading: {progress}%",
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
    qualification: "ትምህርት",
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
    profileUpdated: "መገለጫ በትክክል ተሻሽሏል",
    address: "አድራሻ",
    dateOfBirth: "የልደት ቀን",
    security: "ደህንነት",
    personalInfo: "ግላዊ መረጃ",
    employmentInfo: "የስራ መረጃ",
    contactInfo: "የመገናኛ መረጃ",
    changePassword: "የይለፍ ቃል ቀይር",
    editProfile: "መገለጫ አርትዕ",
    saveChanges: "ለውጦችን አስቀምጥ",
    cancelEdit: "ማርትዕ ሰርዝ",
    passwordRequirements: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች ሊኖሩት ይገባል፣ ትልቅ ፊደል፣ ትንሽ ፊደል፣ ቁጥር እና ልዩ ቁምፊ ይዟል",
    passwordsDontMatch: "የይለፍ ቃሎች አይጣጣሙም",
    passwordStrength: "የይለፍ ቃል ጥንካሬ",
    weak: "ደካማ",
    medium: "መካከለኛ",
    strong: "ጠንካራ",
    cannotEditSalary: "ደመወዝ ማርትዕ አይቻልም",
    cannotEditExperience: "ልምድ ማርትዕ አይቻልም",
    cannotEditQualification: "ትምህርት ማርትዕ አይቻልም",
    cannotEditEmployeeId: "የሰራተኛ መታወቂያ ማርትዕ አይቻልም",
    cannotEditDepartment: "ክፍል ማርትዕ አይቻልም",
    cannotEditEmail: "ኢሜይል ማርትዕ አይቻልም",
    saving: "በመቀመጥ ላይ...",
    editMode: "የማርትዕ ሁነታ",
    viewMode: "የማየት ሁነታ",
    // Photo upload translations in Amharic
    changePhoto: "ምስል ቀይር",
    uploadPhoto: "ምስል ጫን",
    removePhoto: "ምስል አስወግድ",
    photoUploading: "ምስል በመጫን ላይ...",
    photoUploaded: "ምስል በተሳካ ሁኔታ ተጫኗል",
    photoUploadFailed: "ምስል መጫን አልተሳካም",
    photoRemoved: "ምስል በተሳካ ሁኔታ ተሰርዟል",
    photoRemoveFailed: "ምስል ማስወገድ አልተሳካም",
    supportedFormats: "የሚደገፉ ቅርጸቶች: JPG, PNG, GIF",
    maxFileSize: "ከፍተኛ ፋይል መጠን: 5MB",
    dragDrop: "ጎትት እና አስቀምጥ ወይም ለመጫን ጠቅ ያድርጉ",
    browse: "ያስሱ",
    invalidFileType: "ልክ ያልሆነ ፋይል አይነት። እባክዎ የምስል ፋይል ይጫኑ።",
    fileTooLarge: "ፋይሉ በጣም ትልቅ ነው። ከፍተኛው መጠን 5MB ነው።",
    uploadProgress: "በመጫን ላይ: {progress}%",
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
  const t = translations[language] || translations.en;

  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [language]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/depthead/profile");
      setProfile(res.data);
      setEditProfile(res.data); // Initialize edit data
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    // Create data object with only editable fields
    const updateData = {
      firstName: editProfile?.firstName || "",
      middleName: editProfile?.middleName || "",
      lastName: editProfile?.lastName || "",
      phoneNumber: editProfile?.phoneNumber || "",
      address: editProfile?.address || "",
      dateOfBirth: editProfile?.dateOfBirth || "",
      contactPerson: editProfile?.contactPerson || "",
      contactPersonAddress: editProfile?.contactPersonAddress || "",
      maritalStatus: editProfile?.maritalStatus || "",
      sex: editProfile?.sex || "",
      termOfEmployment: editProfile?.termOfEmployment || "",
      employeeStatus: editProfile?.employeeStatus || "",
      typeOfPosition: editProfile?.typeOfPosition || "",
    };
    
    // Validate required fields
    if (!updateData.firstName?.trim() || !updateData.lastName?.trim()) {
      showMessage("First name and last name are required", "error");
      return;
    }

    if (!updateData.phoneNumber?.trim()) {
      showMessage("Phone number is required", "error");
      return;
    }

    try {
      setSaving(true);
      const response = await axiosInstance.put("/depthead/profile", updateData);
      
      if (response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
        showMessage(t.profileUpdated, "success");
      } else {
        showMessage(response.data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      showMessage(err.response?.data?.message || t.updateFailed, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  // Photo Upload Functions
  const handlePhotoUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showMessage(t.invalidFileType, "error");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage(t.fileTooLarge, "error");
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setPhotoUploading(true);
      setPhotoProgress(0);

      const response = await axiosInstance.put('/depthead/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setPhotoProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setProfile(prev => ({ ...prev, photo: response.data.photo }));
        setEditProfile(prev => ({ ...prev, photo: response.data.photo }));
        showMessage(t.photoUploaded, "success");
      } else {
        showMessage(response.data.message || t.photoUploadFailed, "error");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      showMessage(err.response?.data?.message || t.photoUploadFailed, "error");
    } finally {
      setPhotoUploading(false);
      setPhotoProgress(0);
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile?.photo) return;

    try {
      const response = await axiosInstance.delete('/depthead/profile/photo');
      
      if (response.data.success) {
        setProfile(prev => ({ ...prev, photo: null }));
        setEditProfile(prev => ({ ...prev, photo: null }));
        showMessage(t.photoRemoved, "success");
      } else {
        showMessage(response.data.message || t.photoRemoveFailed, "error");
      }
    } catch (err) {
      console.error("Photo remove error:", err);
      showMessage(err.response?.data?.message || t.photoRemoveFailed, "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
    // Reset file input
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isEditing) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handlePhotoUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      const response = await axiosInstance.put("/depthead/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.data.success) {
        showMessage(t.passwordUpdated, "success");
        setPasswordData({ 
          currentPassword: "", 
          newPassword: "",
          confirmPassword: ""
        });
        setShowPasswordForm(false);
      } else {
        showMessage(response.data.message || t.updateFailed, "error");
      }
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
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditing ? t.editMode : t.viewMode}
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <FaEdit />
            {t.editProfile}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <FaTimes />
              {t.cancelEdit}
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t.saving}
                </>
              ) : (
                <>
                  <FaSave />
                  {t.saveChanges}
                </>
              )}
            </button>
          </div>
        )}
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
            {/* Profile Photo Section */}
            <div className="relative mb-6 group">
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.getElementById(`profile-fallback-${profile?.id}`);
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Edit overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          disabled={photoUploading}
                        >
                          <FaCamera className="w-6 h-6" />
                        </button>
                        <span className="text-white text-sm font-medium">{t.changePhoto}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  id={`profile-fallback-${profile?.id}`}
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${photoUploading ? 'bg-gray-300 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/30'} flex items-center justify-center border-4 border-blue-500 shadow-lg ${isEditing ? 'cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors' : ''}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {photoUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t.uploadProgress.replace('{progress}', photoProgress)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <FaUserCircle className="w-20 h-20 md:w-24 md:h-24 text-blue-600 dark:text-blue-400" />
                      {isEditing && (
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaUpload className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {/* Photo actions for editing mode */}
              {isEditing && (
                <div className="flex justify-center gap-2 mt-4">
                  {profile?.photo && (
                    <button
                      onClick={handleRemovePhoto}
                      disabled={photoUploading}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash className="w-3 h-3" />
                      {t.removePhoto}
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaUpload className="w-3 h-3" />
                    {profile?.photo ? t.changePhoto : t.uploadPhoto}
                  </button>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="hidden"
                disabled={photoUploading}
              />
              
              {/* Photo upload info */}
              {isEditing && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t.supportedFormats}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t.maxFileSize}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1">
                    {t.dragDrop}
                  </p>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.firstName} *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editProfile?.firstName || ""}
                    onChange={handleEditChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.lastName} *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editProfile?.lastName || ""}
                    onChange={handleEditChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.phone} *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editProfile?.phoneNumber || ""}
                    onChange={handleEditChange}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-100" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                {editProfile?.sex && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      name="sex"
                      value={editProfile?.sex || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
            
            <div className="mt-6 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FaShieldAlt className="text-blue-500" />
                  {t.security}
                </h3>
                {!showPasswordForm && !isEditing && (
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

        {/* Right Column - Details (same as before) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              {t.personalInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.middleName}</label>
                    <input
                      type="text"
                      name="middleName"
                      value={editProfile?.middleName || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.dateOfBirth}</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editProfile?.dateOfBirth?.split('T')[0] || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={editProfile?.maritalStatus || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Term of Employment</label>
                    <input
                      type="text"
                      name="termOfEmployment"
                      value={editProfile?.termOfEmployment || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t.address}</label>
                    <textarea
                      name="address"
                      value={editProfile?.address || ""}
                      onChange={handleEditChange}
                      rows="2"
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </>
              ) : (
                <>
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
                    note={t.cannotEditEmployeeId}
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
                  {profile?.sex && (
                    <DetailItem
                      icon={<FaUser />}
                      label="Gender"
                      value={profile?.sex}
                      darkMode={darkMode}
                      language={language}
                    />
                  )}
                  {profile?.maritalStatus && (
                    <DetailItem
                      icon={<FaUser />}
                      label="Marital Status"
                      value={profile?.maritalStatus}
                      darkMode={darkMode}
                      language={language}
                    />
                  )}
                  {profile?.termOfEmployment && (
                    <DetailItem
                      icon={<FaBriefcase />}
                      label="Term of Employment"
                      value={profile?.termOfEmployment}
                      darkMode={darkMode}
                      language={language}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Employment Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaBriefcase className="text-green-500" />
              {t.employmentInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.position}</label>
                    <input
                      type="text"
                      name="typeOfPosition"
                      value={editProfile?.typeOfPosition || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.status}</label>
                    <select
                      name="employeeStatus"
                      value={editProfile?.employeeStatus || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Note: Department, Salary, Experience, and Qualification cannot be edited. Contact HR/Admin for changes.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <DetailItem
                    icon={<FaBuilding />}
                    label={t.department}
                    value={profile?.department?.name}
                    darkMode={darkMode}
                    language={language}
                    note={t.cannotEditDepartment}
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
                    note={t.cannotEditSalary}
                  />
                  <DetailItem
                    icon={<FaFileAlt />}
                    label={t.experience}
                    value={profile?.experience}
                    darkMode={darkMode}
                    language={language}
                    note={t.cannotEditExperience}
                  />
                  <DetailItem
                    icon={<FaGraduationCap />}
                    label={t.qualification}
                    value={profile?.qualification}
                    darkMode={darkMode}
                    language={language}
                    note={t.cannotEditQualification}
                  />
                  <DetailItem
                    icon={<FaFileAlt />}
                    label={t.status}
                    value={profile?.employeeStatus || profile?.status}
                    darkMode={darkMode}
                    language={language}
                  />
                </>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className={`rounded-xl p-4 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaAddressCard className="text-purple-500" />
              {t.contactInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t.contactPerson}</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={editProfile?.contactPerson || ""}
                      onChange={handleEditChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">{t.contactAddress}</label>
                    <textarea
                      name="contactPersonAddress"
                      value={editProfile?.contactPersonAddress || ""}
                      onChange={handleEditChange}
                      rows="2"
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <DetailItem
                    icon={<FaEnvelope />}
                    label={t.email}
                    value={profile?.email}
                    darkMode={darkMode}
                    language={language}
                    isEmail={true}
                    note={t.cannotEditEmail}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items (same as before)
const DetailItem = ({ icon, label, value, darkMode, language, isEmail = false, note = "" }) => (
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
    {note && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
        {note}
      </p>
    )}
  </div>
);

export default DeptHeadProfile;