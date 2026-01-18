import React, { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosInstance";
import { 
  FaEnvelope, FaPhone, FaIdBadge, FaBuilding, FaUserTie, 
  FaBriefcase, FaMapMarkerAlt, FaKey, FaCamera, FaHashtag, 
  FaDollarSign, FaCalendarAlt, FaLock, FaUserShield, FaShieldAlt,
  FaEdit, FaSave, FaTimes, FaUpload, FaUserCircle, FaEye, FaEyeSlash
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

const ProfilePage = () => {
  const { darkMode, language } = useSettings();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profileData");
    return saved ? JSON.parse(saved) : null;
  });
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ 
    current: "", 
    new: "", 
    confirm: "" 
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Texts for multilingual support
  const texts = {
    en: {
      myProfile: "My Professional Profile",
      personalInfo: "Personal Information",
      jobContactInfo: "Job & Contact Information",
      changePassword: "Change Password",
      securitySettings: "Security Settings",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
      editProfile: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      role: "Role",
      department: "Department",
      position: "Position",
      empId: "Employee ID",
      termOfEmployment: "Term of Employment",
      contactPerson: "Emergency Contact",
      contactPersonAddress: "Emergency Address",
      employeeStatus: "Employment Status",
      salary: "Salary",
      experience: "Experience",
      photo: "Profile Photo",
      uploadPhoto: "Upload Photo",
      removePhoto: "Remove Photo",
      passwordUpdated: "Password updated successfully",
      profileUpdated: "Profile updated successfully",
      passwordRequirements: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      passwordsNotMatch: "New password and confirmation do not match",
      currentPasswordWrong: "Current password is incorrect",
      loading: "Loading profile...",
      errorLoading: "Failed to load profile",
      updateSuccess: "Update successful",
      updateError: "Update failed",
      securityNote: "Your security is our priority. Please keep your password confidential.",
      validation: {
        required: "This field is required",
        email: "Please enter a valid email",
        phone: "Please enter a valid phone number",
        minLength: "Minimum length is {min} characters"
      }
    },
    am: {
      myProfile: "የእኔ ፕሮፌሽናል ፕሮፋይል",
      personalInfo: "የግል መረጃ",
      jobContactInfo: "የስራ እና የንግድ መረጃ",
      changePassword: "የይለፍ ቃል መቀየር",
      securitySettings: "የደህንነት ማስተካከያዎች",
      currentPassword: "አሁን ያለው የይለፍ ቃል",
      newPassword: "አዲስ የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃልን አረጋግጥ",
      updatePassword: "የይለፍ ቃል አዘምን",
      editProfile: "ፕሮፋይል አርትዕ",
      save: "ለውጦች አስቀምጥ",
      cancel: "ይቅር",
      firstName: "ስም",
      middleName: "የአባት ስም",
      lastName: "የአያት ስም",
      email: "ኢሜል አድራሻ",
      phoneNumber: "ስልክ ቁጥር",
      role: "ሚና",
      department: "የጽ/ቤት ስም",
      position: "የስራ አይነት",
      empId: "ሰራተኛ መታወቂያ",
      termOfEmployment: "የስራ ወቅት",
      contactPerson: "አደጋ የእውቀት ሰው",
      contactPersonAddress: "አደጋ የእውቀት አድራሻ",
      employeeStatus: "የስራ ሁኔታ",
      salary: "ደመወዝ",
      experience: "ልምድ",
      photo: "ፕሮፋይል ፎቶ",
      uploadPhoto: "ፎቶ ጫን",
      removePhoto: "ፎቶ አስወግድ",
      passwordUpdated: "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል",
      profileUpdated: "ፕሮፋይል በተሳካ ሁኔታ ተስተካክሏል",
      passwordRequirements: "የይለፍ ቃል ቢያንስ 8 ፊደላት፣ አቢይ ፊደል፣ ትንሽ ፊደል፣ ቁጥር እና ልዩ ምልክት ሊኖረው ይገባል",
      passwordsNotMatch: "አዲስ የይለፍ ቃል እና የማረጋገጫ ቃል አይዛመዱም",
      currentPasswordWrong: "አሁን ያለው የይለፍ ቃል ትክክል አይደለም",
      loading: "ፕሮፋይል በመጫን ላይ...",
      errorLoading: "ፕሮፋይል ማምጣት አልተሳካም",
      updateSuccess: "አዘምነት ተሳክቷል",
      updateError: "አዘምነት አልተሳካም",
      securityNote: "ደህንነትዎ ቅድሚያችን ነው። እባክዎ የይለፍ ቃልዎን ሚስጥር ያድርጉት።",
      validation: {
        required: "ይህ መስክ አስፈላጊ ነው",
        email: "እባክዎ ትክክለኛ ኢሜል ያስገቡ",
        phone: "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ",
        minLength: "ቢያንስ {min} ፊደላት መሆን ይገባል"
      }
    }
  };

  const t = texts[language] || texts.en;

  // Get proper photo URL
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // Remove leading slash if present
    const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
    
    // Check if it's already a full URL
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    
    // For Vite development - use relative path with API base
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${apiBase}/${cleanPath}`;
  };

  // Fetch profile and departments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const profileRes = await axios.get("/admin/me");
        const profileData = profileRes.data;
        setProfile(profileData);
        localStorage.setItem("profileData", JSON.stringify(profileData));

        // Fetch departments
        const deptRes = await axios.get("/departments");
        setDepartments(deptRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setErrors({ fetch: t.errorLoading });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t.errorLoading]);

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    const selectedDept = departments.find(dept => dept._id === departmentId);
    
    if (selectedDept) {
      const updatedProfile = { 
        ...profile, 
        department: departmentId,
        departmentName: selectedDept.name 
      };
      setProfile(updatedProfile);
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    
    // Clear password errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: language === 'am' ? 'ፋይሉ 5MB በላይ አይሁን' : 'File must be less than 5MB' });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ photo: language === 'am' ? 'እባክዎ የምስል ፋይል ይምረጡ' : 'Please select an image file' });
        return;
      }

      setPhotoFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      const updatedProfile = { ...profile, photo: previewUrl };
      setProfile(updatedProfile);
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));
    }
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    const updatedProfile = { ...profile, photo: null };
    setProfile(updatedProfile);
    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
    setErrors(prev => ({ ...prev, photo: undefined }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!profile.firstName?.trim()) newErrors.firstName = t.validation.required;
    if (!profile.lastName?.trim()) newErrors.lastName = t.validation.required;
    if (!profile.email?.trim()) newErrors.email = t.validation.required;
    
    // Email format validation
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = t.validation.email;
    }
    
    // Phone validation (optional)
    if (profile.phoneNumber && !/^[\d\s\-\+\(\)]{10,}$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = t.validation.phone;
    }
    
    return newErrors;
  };

  // Save profile
  const handleSave = async () => {
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setProfileLoading(true);
    setErrors({});
    
    try {
      // Prepare data for update - include department as ID
      const updateData = { 
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        role: profile.role,
        department: profile.department, // This should be department ID
        typeOfPosition: profile.typeOfPosition,
        empId: profile.empId,
        termOfEmployment: profile.termOfEmployment,
        contactPerson: profile.contactPerson,
        contactPersonAddress: profile.contactPersonAddress,
        employeeStatus: profile.employeeStatus,
        salary: profile.salary,
        experience: profile.experience // This will be read-only, but we still send it
      };
      
      // Update profile data
      const response = await axios.put("/admin/me", updateData);
      
      // Update local state with response data
      const updatedProfile = response.data;
      setProfile(updatedProfile);
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));

      // Upload photo if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        
        const photoResponse = await axios.put("/admin/me/photo", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        });
        
        // Update photo in state
        setProfile(prev => ({ ...prev, photo: photoResponse.data.photo }));
      }

      setSuccessMessage(t.profileUpdated);
      setEditMode(false);
      setPhotoFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err);
      setErrors({ 
        save: err.response?.data?.message || t.updateError 
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
  setPasswordLoading(true);
  setErrors({});

  console.log("🔐 Frontend - Password change attempt:", passwords);

  // Validate passwords
  if (!passwords.current?.trim()) {
    setErrors({ current: t.currentPassword + " is required" });
    setPasswordLoading(false);
    return;
  }

  if (!passwords.new?.trim()) {
    setErrors({ new: t.newPassword + " is required" });
    setPasswordLoading(false);
    return;
  }

  if (!passwords.confirm?.trim()) {
    setErrors({ confirm: "Password confirmation is required" });
    setPasswordLoading(false);
    return;
  }

  // Trim all passwords
  const trimmedCurrent = passwords.current.trim();
  const trimmedNew = passwords.new.trim();
  const trimmedConfirm = passwords.confirm.trim();

  console.log("🔐 Frontend - Trimmed passwords:", {
    current: trimmedCurrent,
    new: trimmedNew,
    confirm: trimmedConfirm,
    match: trimmedNew === trimmedConfirm
  });

  if (trimmedNew !== trimmedConfirm) {
    setErrors({ 
      confirm: t.passwordsNotMatch,
      details: `New: "${trimmedNew.substring(0, 10)}...", Confirm: "${trimmedConfirm.substring(0, 10)}..."`
    });
    setPasswordLoading(false);
    return;
  }

  if (!validatePassword(trimmedNew)) {
    setErrors({ new: t.passwordRequirements });
    setPasswordLoading(false);
    return;
  }

  try {
    // Send data with consistent field names
    // Try this format first - it matches what your backend expects
    const payload = {
      currentPassword: trimmedCurrent,
      newPassword: trimmedNew,
      confirm: trimmedConfirm
    };

    console.log("📤 Frontend - Sending payload:", payload);
    console.log("🌐 Frontend - API endpoint:", "/admin/change-password");

    const response = await axios.put("/admin/change-password", payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("📥 Frontend - Response received:", response.data);
    
    if (response.data.success) {
      setSuccessMessage(t.passwordUpdated);
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswords({ current: false, new: false, confirm: false });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrors({ password: response.data.message || t.updateError });
    }
  } catch (err) {
    console.error("❌ Frontend - Password change error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    
    const errorMsg = err.response?.data?.message || err.message;
    const errorDetails = err.response?.data?.details;
    
    console.log("📋 Frontend - Error details:", errorDetails);
    
    if (errorMsg?.includes('do not match')) {
      setErrors({ 
        confirm: t.passwordsNotMatch,
        details: errorDetails ? JSON.stringify(errorDetails) : undefined
      });
    } else if (errorMsg?.includes('Current password') || errorMsg?.includes('incorrect')) {
      setErrors({ 
        current: language === 'am' 
          ? 'አሁን ያለው የይለፍ ቃል ትክክል አይደለም' 
          : 'Current password is incorrect' 
      });
    } else if (errorMsg?.includes('required')) {
      const field = errorMsg.includes('Current') ? 'current' : 
                   errorMsg.includes('New') ? 'new' : 'confirm';
      setErrors({ 
        [field]: language === 'am' 
          ? 'ይህ መስክ ያስፈልጋል' 
          : 'This field is required' 
      });
    } else {
      setErrors({ password: errorMsg || t.updateError });
    }
  } finally {
    setPasswordLoading(false);
  }
};

  // Get department name for display
  const getDepartmentName = () => {
    if (!profile?.department) return "-";
    
    // If department is an object (populated)
    if (typeof profile.department === 'object' && profile.department !== null) {
      return profile.department.name || "-";
    }
    
    // If department is an ID string
    if (typeof profile.department === 'string') {
      const dept = departments.find(d => d._id === profile.department);
      return dept?.name || "-";
    }
    
    return "-";
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

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

  if (!profile) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"}`}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😞</div>
          <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{t.errorLoading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Success Notification */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3"
        >
          <FaSave />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2 flex items-center gap-3">
              <FaUserShield className="text-purple-600 dark:text-purple-400" />
              {t.myProfile}
            </h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {profile.empId} • {profile.role} • {getDepartmentName()}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
              editMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
            }`}
          >
            {editMode ? <FaTimes /> : <FaEdit />}
            {editMode ? t.cancel : t.editProfile}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Photo */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl shadow-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="relative group">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-lg">
                {profile.photo ? (
                  <img
                    src={getPhotoUrl(profile.photo) || profile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                      e.target.className = "w-full h-full bg-gray-200 dark:bg-gray-700 p-8";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {editMode && (
                <div className="absolute inset-0 w-48 h-48 mx-auto rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    <label className="cursor-pointer p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                      <FaCamera className="text-gray-700" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {profile.photo && (
                      <button
                        onClick={handleRemovePhoto}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {errors.photo && (
              <p className="text-red-500 text-sm text-center mt-2">{errors.photo}</p>
            )}
            
            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-purple-600 dark:text-purple-400 font-medium">
                {profile.role || "-"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {profile.empId || "-"}
              </p>
              
              {editMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <FaUpload /> {t.uploadPhoto}
                </button>
              )}
            </div>
          </motion.div>
          
          {/* Security Note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-6 rounded-2xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-green-500 text-xl" />
              <h3 className="font-bold text-gray-800 dark:text-white">{t.securitySettings}</h3>
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t.securityNote}
            </p>
          </motion.div>
        </div>

        {/* Middle Column - Personal Info */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Personal Information Card */}
            <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <FaUserTie className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.personalInfo}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { field: "firstName", icon: <FaIdBadge />, required: true },
                    { field: "middleName", icon: <FaIdBadge /> },
                    { field: "lastName", icon: <FaIdBadge />, required: true },
                    { field: "email", icon: <FaEnvelope />, type: "email", required: true },
                    { field: "phoneNumber", icon: <FaPhone />, type: "tel" },
                    { field: "role", icon: <FaUserTie /> },
                  ].map(({ field, icon, type = "text", required = false }) => (
                    <div key={field} className="space-y-2">
                      <label className={`text-sm font-medium flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {icon} {t[field]} {required && <span className="text-red-500">*</span>}
                      </label>
                      {editMode ? (
                        <div>
                          <input
                            type={type}
                            name={field}
                            value={profile[field] || ""}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                                : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                            }`}
                            required={required}
                          />
                          {errors[field] && (
                            <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                          )}
                        </div>
                      ) : (
                        <p className={`p-3 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                          {profile[field] || "-"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Job & Contact Information Card */}
            <div className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <FaBriefcase className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.jobContactInfo}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Field */}
                  <div className="space-y-2">
                    <label className={`text-sm font-medium flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaBuilding /> {t.department}
                    </label>
                    {editMode ? (
                      <select
                        name="department"
                        value={profile.department || ""}
                        onChange={handleDepartmentChange}
                        className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-gray-50 border border-gray-200 text-gray-900"
                        }`}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className={`p-3 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                        {getDepartmentName()}
                      </p>
                    )}
                  </div>

                  {/* Other Editable Fields */}
                  {[
                    { field: "typeOfPosition", icon: <FaBriefcase />, label: t.position },
                    { field: "empId", icon: <FaHashtag />, label: t.empId },
                    { field: "termOfEmployment", icon: <FaCalendarAlt />, label: t.termOfEmployment },
                    { field: "contactPerson", icon: <FaUserTie />, label: t.contactPerson },
                    { field: "contactPersonAddress", icon: <FaMapMarkerAlt />, label: t.contactPersonAddress },
                    { field: "employeeStatus", icon: <FaUserTie />, label: t.employeeStatus },
                    { field: "salary", icon: <FaDollarSign />, label: t.salary },
                  ].map(({ field, icon, label }) => (
                    <div key={field} className="space-y-2">
                      <label className={`text-sm font-medium flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {icon} {label}
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name={field}
                          value={profile[field] || ""}
                          onChange={handleChange}
                          className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                              : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                          }`}
                        />
                      ) : (
                        <p className={`p-3 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                          {profile[field] || "-"}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Experience Field - READ ONLY */}
                  <div className="space-y-2">
                    <label className={`text-sm font-medium flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaBriefcase /> {t.experience}
                    </label>
                    <p className={`p-3 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"} ${editMode ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {profile.experience || "-"}
                    </p>
                    {editMode && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'am' ? 'ልምድ ብቻ ሊታይ የሚችል መስክ ነው። ለማስተካከል አስተዳዳሪዎን ያነጋግሩ።' : 'Experience is a read-only field. Please contact your administrator to update.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-8 rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <FaLock className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.changePassword}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { field: "current", label: t.currentPassword },
              { field: "new", label: t.newPassword },
              { field: "confirm", label: t.confirmPassword },
            ].map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <label className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords[field] ? "text" : "password"}
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    className={`w-full p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder={label}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
          
          {errors.password && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
              {errors.password}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t.passwordRequirements}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                passwordLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
              }`}
            >
              <FaLock /> {passwordLoading ? (language === 'am' ? 'በመስራት ላይ...' : 'Processing...') : t.updatePassword}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Save Button for Edit Mode */}
      {editMode && (
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={profileLoading}
            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-300 ${
              profileLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl"
            }`}
          >
            <FaSave /> {profileLoading ? (language === 'am' ? 'በመስራት ላይ...' : 'Saving...') : t.save}
          </motion.button>
        </div>
      )}

      {errors.save && (
        <div className="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-center">
          {errors.save}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;