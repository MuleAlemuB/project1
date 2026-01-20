// src/pages/employee/EmployeeProfile.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  FaLock,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaVenusMars,
  FaGraduationCap,
  FaHome,
  FaHeart,
  FaSave,
  FaArrowLeft,
  FaCamera,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaSpinner
} from "react-icons/fa";
import { MdWork, MdDateRange, MdPerson } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeProfile = () => {
  const { language, darkMode } = useSettings();
  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    fetchProfile();
  }, [language]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/employees/dashboard");
      
      // Process the profile data to ensure we have proper experience calculation
      const profileData = processProfileData(res.data);
      
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(
        language === "am" 
          ? "መገለጫ መጫን አልተሳካም" 
          : "Failed to load profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Process profile data to calculate experience if not provided
  const processProfileData = (data) => {
    if (!data) return null;
    
    const processed = { ...data };
    
    // If experience is not provided in API response, calculate it
    if (!processed.experience && processed.startDate) {
      processed.experience = calculateExperienceFromStartDate(processed.startDate);
    }
    
    return processed;
  };

  // Fix: Use useCallback for password change to prevent re-renders
  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Validate password if it's the newPassword field
    if (name === "newPassword") {
      validatePassword(value);
    }
  }, []);

  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  // Fix: Use useCallback for profile edit
  const handleProfileEdit = useCallback((e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Fix: Handle save profile properly
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      
      // Create an object with only editable fields
      const updateData = {
        firstName: editedProfile?.firstName || "",
        lastName: editedProfile?.lastName || "",
        phoneNumber: editedProfile?.phoneNumber || "",
        contactPerson: editedProfile?.contactPerson || "",
        contactPersonAddress: editedProfile?.contactPersonAddress || ""
      };
      
      const res = await axiosInstance.put("/employees/update-profile", updateData);
      
      // Process the updated profile data
      const updatedProfile = processProfileData(res.data);
      
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      
      toast.success(
        language === "am" 
          ? "መገለጫ በተሳካ ሁኔታ ተዘመነ" 
          : "Profile updated successfully"
      );
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(
        errorMessage || 
        (language === "am" 
          ? "መገለጫ ማዘመን አልተሳካም" 
          : "Failed to update profile")
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handlePhotoUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(
        language === "am" 
          ? "እባክዎን ትክክለኛ የምስል ፋይል (JPEG, PNG, GIF) ይምረጡ" 
          : "Please select a valid image file (JPEG, PNG, GIF)"
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        language === "am" 
          ? "የምስል ፋይል መጠን ከ5MB መብለጥ የለበትም" 
          : "Image file size must not exceed 5MB"
      );
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const formData = new FormData();
      formData.append('photo', file);

      const response = await axiosInstance.post('/employees/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Process the updated profile data
      const updatedProfile = processProfileData(response.data);
      
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);

      toast.success(
        language === "am" 
          ? "የመገለጫ ምስል በተሳካ ሁኔታ ተስተካክሏል" 
          : "Profile photo updated successfully"
      );
    } catch (error) {
      console.error("Error uploading photo:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(
        errorMessage || 
        (language === "am" 
          ? "ምስል መስቀል አልተሳካም" 
          : "Failed to upload photo")
      );
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fix: Calculate experience from startDate
  const calculateExperienceFromStartDate = (startDate) => {
    if (!startDate) return "N/A";
    
    try {
      const start = new Date(startDate);
      const today = new Date();
      
      // Handle invalid dates
      if (isNaN(start.getTime())) return "N/A";
      
      let years = today.getFullYear() - start.getFullYear();
      let months = today.getMonth() - start.getMonth();
      let days = today.getDate() - start.getDate();
      
      // Adjust for negative months
      if (months < 0) {
        years--;
        months += 12;
      }
      
      // Adjust for negative days
      if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
        
        // If months went negative after day adjustment
        if (months < 0) {
          years--;
          months += 12;
        }
      }
      
      // Format the experience
      if (years === 0 && months === 0) {
        return days <= 0 ? "Less than 1 month" : `${days} day${days > 1 ? 's' : ''}`;
      } else if (years === 0) {
        return months === 1 ? "1 month" : `${months} months`;
      } else if (months === 0) {
        return years === 1 ? "1 year" : `${years} years`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
      }
    } catch (error) {
      console.error("Error calculating experience:", error);
      return "N/A";
    }
  };

  // Get experience value
  const getExperienceValue = () => {
    if (profile?.experience) {
      return profile.experience;
    }
    
    // Calculate from startDate if available
    if (profile?.startDate) {
      return calculateExperienceFromStartDate(profile.startDate);
    }
    
    return "N/A";
  };

  // Theme-based colors
  const mainBg = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const cardBorder = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800";
  const inputBorder = darkMode ? "border-gray-600" : "border-gray-300";
  const inputBorderFocus = darkMode ? "focus:border-blue-500" : "focus:border-blue-500";
  const disabledInputBg = darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-500";
  const successColor = darkMode ? "text-green-400" : "text-green-600";
  const errorColor = darkMode ? "text-red-400" : "text-red-600";

  // Editable fields
  const editableFields = ['firstName', 'lastName', 'phoneNumber', 'contactPerson', 'contactPersonAddress'];

  // Check if field is editable
  const isEditable = (fieldName) => editableFields.includes(fieldName);

  // PasswordInput component
  const PasswordInput = React.memo(({ name, value, onChange, placeholder, show, setShow }) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 pr-10 border ${inputBorder} rounded-lg ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder={placeholder}
        required
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  ));

  // Password requirement component
  const PasswordRequirement = React.memo(({ label, isValid }) => (
    <div className="flex items-center gap-2">
      {isValid ? (
        <FaCheck className={`text-sm ${successColor}`} />
      ) : (
        <FaTimes className={`text-sm ${errorColor}`} />
      )}
      <span className={`text-xs ${isValid ? successColor : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
    </div>
  ));

  // Render field function
  const renderField = (fieldName, label, icon, value) => {
    const IconComponent = icon;
    
    if (isEditing && isEditable(fieldName)) {
      return (
        <div key={fieldName}>
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700 dark:text-gray-300">
            <IconComponent className="text-blue-600 dark:text-blue-400" />
            {label}
          </label>
          <input
            type="text"
            name={fieldName}
            value={editedProfile?.[fieldName] || ""}
            onChange={handleProfileEdit}
            className={`w-full px-4 py-2.5 border ${inputBorder} ${inputBorderFocus} rounded-lg ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            autoComplete="off"
          />
        </div>
      );
    } else {
      return (
        <div key={fieldName}>
          <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700 dark:text-gray-300">
            <IconComponent className="text-blue-600 dark:text-blue-400" />
            {label}
            {!isEditable(fieldName) && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({language === "am" ? "አይስራም" : "Read-only"})
              </span>
            )}
          </label>
          <div className={`px-4 py-3 border ${inputBorder} rounded-lg ${!isEditable(fieldName) ? disabledInputBg : inputBg}`}>
            {value || "-"}
          </div>
        </div>
      );
    }
  };

  // Fix: Handle password submit with better state management
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      toast.error(
        language === "am" 
          ? "አሁን ያለው የይለፍ ቃል ያስፈልጋል" 
          : "Current password is required"
      );
      return;
    }

    // Validate new password
    if (!validatePassword(passwordData.newPassword)) {
      toast.error(
        language === "am" 
          ? "እባክዎን አዲሱ የይለፍ ቃል ሁሉንም የደህንነት መስፈርቶች እንዲያሟላ ያረጋግጡ" 
          : "Please ensure new password meets all security requirements"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(
        language === "am" 
          ? "የይለፍ ቃላት አይዛመዱም" 
          : "Passwords do not match"
      );
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const response = await axiosInstance.put("/employees/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success(
        language === "am" 
          ? "የይለፍ ቃል በተሳካ ሁኔታ ተዘመነ" 
          : response.data.message || "Password updated successfully"
      );
      
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      setPasswordErrors({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
    } catch (error) {
      console.error("Error updating password:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(
        errorMessage || 
        (language === "am" 
          ? "የይለፍ ቃል ማዘመን አልተሳካም" 
          : "Failed to update password")
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {language === "am" ? "መገለጫ በመጫን ላይ..." : "Loading profile..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const photoUrl = profile?.photo ? `${BACKEND_URL}${profile.photo}` : null;

  return (
    <div className="flex min-h-screen">
      <main className={`${mainBg} flex-1 p-6 overflow-auto transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          {/* Header with Edit Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "am" ? "መገለጫ" : "Profile"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "am" 
                  ? "የእርስዎን የሰራተኛ መረጃ ይመልከቱ እና ያስተካክሉ" 
                  : "View and manage your employee information"}
              </p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaEdit />
                {language === "am" ? "መገለጫ አስተካክል" : "Edit Profile"}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !editedProfile}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? (
                    <>
                      <FaSpinner className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === "am" ? "በማስቀመጥ ላይ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {language === "am" ? "አስቀምጥ" : "Save Changes"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={savingProfile}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTimes />
                  {language === "am" ? "ይቅር" : "Cancel"}
                </button>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-3">
                <FaEdit className="text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">
                    {language === "am" ? "የማስተካከያ ሁኔታ" : "Edit Mode"}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {language === "am" 
                      ? "የሚከተሉት መስኮች ብቻ ሊስተካከሉ ይችላሉ፡ ስም፣ የአባት ስም፣ ስልክ፣ የእድር ሰው፣ የእድር ሰው አድራሻ"
                      : "Only these fields can be edited: First Name, Last Name, Phone, Contact Person, Contact Person Address"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-2">
              <div className={`${cardBg} rounded-xl shadow-lg border ${cardBorder} p-6`}>
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  <div className="relative">
                    {photoUrl ? (
                      <div className="relative group">
                        <img
                          src={photoUrl}
                          alt="Profile"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        />
                        {isEditing && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={handlePhotoUploadClick}
                          >
                            <FaCamera className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                          {profile?.firstName?.charAt(0) || "E"}
                        </div>
                        {isEditing && (
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={handlePhotoUploadClick}
                          >
                            <FaCamera className="text-white text-2xl" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                          {profile?.firstName} {profile?.lastName}
                        </h2>
                        <p className="text-blue-600 dark:text-blue-400 mt-1">
                          {profile?.typeOfPosition || "Employee"}
                        </p>
                      </div>
                      
                      {isEditing && (
                        <button
                          onClick={handlePhotoUploadClick}
                          disabled={isUploadingPhoto}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isUploadingPhoto ? (
                            <>
                              <FaSpinner className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              {language === "am" ? "በመጫን ላይ..." : "Uploading..."}
                            </>
                          ) : (
                            <>
                              <FaCamera className="text-xs" />
                              {language === "am" ? "ምስል ቀይር" : "Change Photo"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className={`${disabledInputBg} rounded-lg px-4 py-2`}>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "am" ? "ሰራተኛ መታወቂያ" : "Employee ID"}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">{profile?.empId || "-"}</p>
                      </div>
                      
                      <div className={`${disabledInputBg} rounded-lg px-4 py-2`}>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "am" ? "ክፍል" : "Department"}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {typeof profile?.department === 'object' 
                            ? profile.department.name 
                            : profile?.department || "-"}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-4 py-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "am" ? "ሁኔታ" : "Status"}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">{profile?.employeeStatus || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-5">
                    {/* First Name - Editable */}
                    {renderField(
                      'firstName',
                      language === "am" ? "ስም" : "First Name",
                      FaUser,
                      profile?.firstName
                    )}

                    {/* Last Name - Editable */}
                    {renderField(
                      'lastName',
                      language === "am" ? "የአባት ስም" : "Last Name",
                      FaUser,
                      profile?.lastName
                    )}

                    {/* Email - Non-editable */}
                    {renderField(
                      'email',
                      "Email",
                      FaEnvelope,
                      profile?.email
                    )}

                    {/* Phone - Editable */}
                    {renderField(
                      'phoneNumber',
                      language === "am" ? "ስልክ" : "Phone",
                      FaPhone,
                      profile?.phoneNumber
                    )}

                    {/* Department - Non-editable */}
                    {renderField(
                      'department',
                      language === "am" ? "የክፍል ስም" : "Department",
                      FaBuilding,
                      typeof profile?.department === 'object' 
                        ? profile.department.name 
                        : profile?.department || "-"
                    )}
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-5">
                    {/* Position - Non-editable */}
                    {renderField(
                      'typeOfPosition',
                      language === "am" ? "የስራ አይነት" : "Position",
                      FaBriefcase,
                      profile?.typeOfPosition
                    )}

                    {/* Employee ID - Non-editable */}
                    {renderField(
                      'empId',
                      language === "am" ? "የሰራተኛ መታወቂያ" : "Employee ID",
                      FaIdBadge,
                      profile?.empId
                    )}

                    {/* Salary - Non-editable */}
                    {renderField(
                      'salary',
                      "Salary",
                      FaDollarSign,
                      profile?.salary ? `$${profile.salary.toLocaleString()}` : "-"
                    )}

                    {/* Experience - Non-editable */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        <FaFileAlt className="text-blue-600 dark:text-blue-400" />
                        {language === "am" ? "ልምድ" : "Experience"}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({language === "am" ? "አይስራም" : "Read-only"})
                        </span>
                      </label>
                      <div className={`px-4 py-3 border ${inputBorder} rounded-lg ${disabledInputBg}`}>
                        {getExperienceValue()}
                        {profile?.startDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {language === "am" ? "ከሚከተለው ቀን ጀምሮ" : "Since"} {new Date(profile.startDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Person - Editable */}
                    {renderField(
                      'contactPerson',
                      language === "am" ? "የእድር ሰው ስም" : "Contact Person",
                      FaUser,
                      profile?.contactPerson
                    )}
                  </div>
                </div>

                {/* Additional Info - Editable */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Person Address - Editable */}
                    {renderField(
                      'contactPersonAddress',
                      language === "am" ? "የእድር ሰው አድራሻ" : "Contact Address",
                      FaAddressCard,
                      profile?.contactPersonAddress
                    )}

                    {/* Status - Display only */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        <FaBriefcase className="text-blue-600 dark:text-blue-400" />
                        {language === "am" ? "ሁኔታ" : "Status"}
                      </label>
                      <div className={`px-4 py-3 border ${inputBorder} rounded-lg ${disabledInputBg}`}>
                        {profile?.employeeStatus || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Password Update */}
            <div>
              <div className={`${cardBg} rounded-xl shadow-lg border ${cardBorder} p-6 h-full`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FaLock className="text-blue-600 dark:text-blue-400" />
                    {language === "am" ? "የይለፍ ቃል ማዘመኛ" : "Password Update"}
                  </h3>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FaEdit className="text-xs" />
                      {language === "am" ? "ቀይር" : "Change"}
                    </button>
                  )}
                </div>

                {showPasswordForm ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "am" ? "የአሁኑ የይለፍ ቃል" : "Current Password"}
                      </label>
                      <PasswordInput
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        show={showCurrentPassword}
                        setShow={setShowCurrentPassword}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "am" ? "አዲስ የይለፍ ቃል" : "New Password"}
                      </label>
                      <PasswordInput
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        show={showNewPassword}
                        setShow={setShowNewPassword}
                      />
                      
                      {/* Password Requirements */}
                      <div className="mt-3 space-y-1">
                        <PasswordRequirement
                          label={language === "am" ? "ቢያንስ 6 ቁምፊዎች" : "At least 6 characters"}
                          isValid={passwordErrors.length}
                        />
                        <PasswordRequirement
                          label={language === "am" ? "አንድ አቢይ ፊደል (A-Z)" : "One uppercase letter (A-Z)"}
                          isValid={passwordErrors.uppercase}
                        />
                        <PasswordRequirement
                          label={language === "am" ? "አንድ ትንሽ ፊደል (a-z)" : "One lowercase letter (a-z)"}
                          isValid={passwordErrors.lowercase}
                        />
                        <PasswordRequirement
                          label={language === "am" ? "አንድ ቁጥር (0-9)" : "One number (0-9)"}
                          isValid={passwordErrors.number}
                        />
                        <PasswordRequirement
                          label={language === "am" ? "አንድ ልዩ ምልክት (!@#$%^&*)" : "One special character (!@#$%^&*)"}
                          isValid={passwordErrors.special}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "am" ? "አዲስ የይለፍ ቃል አረጋግጥ" : "Confirm New Password"}
                      </label>
                      <PasswordInput
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        show={showConfirmPassword}
                        setShow={setShowConfirmPassword}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword || !Object.values(passwordErrors).every(Boolean)}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isUpdatingPassword ? (
                          <>
                            <FaSpinner className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {language === "am" ? "በመዘመን ላይ..." : "Updating..."}
                          </>
                        ) : (
                          <>
                            <FaCheck />
                            {language === "am" ? "ያዘምኑ" : "Update"}
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ 
                            currentPassword: "", 
                            newPassword: "",
                            confirmPassword: ""
                          });
                          setPasswordErrors({
                            length: false,
                            uppercase: false,
                            lowercase: false,
                            number: false,
                            special: false
                          });
                        }}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaTimes />
                        {language === "am" ? "ይቅር" : "Cancel"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FaLock className="text-blue-600 dark:text-blue-400 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {language === "am" ? "የይለፍ ቃልዎን ያዘምኑ" : "Update Your Password"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      {language === "am" 
                        ? "የይለፍ ቃልዎን በደህንነት ለመቀየር ከታች ያለውን አዝራር ይጫኑ" 
                        : "Click the button below to securely change your password"}
                    </p>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      {language === "am" ? "የይለፍ ቃል ይቀይሩ" : "Change Password"}
                    </button>
                  </div>
                )}

                {/* Security Tips */}
                {!showPasswordForm && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {language === "am" ? "የደህንነት መስፈርቶች" : "Security Requirements"}
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        {language === "am" 
                          ? "ቢያንስ 6 ቁምፊዎች" 
                          : "At least 6 characters"}
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        {language === "am" 
                          ? "አንድ አቢይ ፊደል (A-Z)" 
                          : "One uppercase letter (A-Z)"}
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        {language === "am" 
                          ? "አንድ ትንሽ ፊደል (a-z)" 
                          : "One lowercase letter (a-z)"}
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        {language === "am" 
                          ? "አንድ ቁጥር (0-9)" 
                          : "One number (0-9)"}
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                        {language === "am" 
                          ? "አንድ ልዩ ምልክት (!@#$%^&*)" 
                          : "One special character (!@#$%^&*)"}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion Bar - Only if data exists */}
          {profile?.profileCompleted !== undefined && (
            <div className={`mt-6 ${cardBg} rounded-xl shadow-lg border ${cardBorder} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {language === "am" ? "መገለጫ ሙላት" : "Profile Completion"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {language === "am" 
                      ? "የመገለጫዎን ሙላት ያሻሽሉ" 
                      : "Improve your profile completeness"}
                  </p>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {profile.profileCompleted}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profile.profileCompleted}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {profile.profileCompleted === 100 
                  ? (language === "am" ? "መገለጫዎ ሙሉ በሙሉ ተሞልቷል! 🎉" : "Your profile is 100% complete! 🎉")
                  : (language === "am" 
                      ? `${100 - profile.profileCompleted}% ይቀራል ሙሉ ለማድረግ` 
                      : `${100 - profile.profileCompleted}% remaining to complete`
                    )
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeProfile;