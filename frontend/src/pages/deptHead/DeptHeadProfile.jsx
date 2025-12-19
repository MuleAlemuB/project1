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
  FaEdit,
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
  },
};

const DeptHeadProfile = () => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/depthead/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setMessage(t.profileError);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [language]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/depthead/update-password", passwordData);
      setMessage(t.passwordUpdated);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      setMessage(t.updateFailed);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? "en-US" : "am-ET", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const photoUrl = profile?.photo ? `${BACKEND_URL}${profile.photo}` : null;

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Overview */}
        <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex flex-col items-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <FaUserCircle className="w-24 h-24 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <h2 className="text-xl font-bold mb-1">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{profile?.typeOfPosition || "Department Head"}</p>
            
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
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.newPassword}</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? "bg-gray-700 border-gray-600 text-gray-100" 
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t.saveChanges}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: "", newPassword: "" });
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                {t.personalInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={<FaUser />}
                  label={t.firstName}
                  value={profile?.firstName}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaUser />}
                  label={t.middleName}
                  value={profile?.middleName}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaUser />}
                  label={t.lastName}
                  value={profile?.lastName}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaIdBadge />}
                  label={t.employeeId}
                  value={profile?.empId}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label={t.dateOfBirth}
                  value={formatDate(profile?.dateOfBirth)}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label={t.address}
                  value={profile?.address}
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaBriefcase className="text-green-500" />
                {t.employmentInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={<FaBuilding />}
                  label={t.department}
                  value={profile?.department?.name}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaBriefcase />}
                  label={t.position}
                  value={profile?.typeOfPosition}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaDollarSign />}
                  label={t.salary}
                  value={profile?.salary}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaFileAlt />}
                  label={t.experience}
                  value={profile?.experience}
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaAddressCard className="text-purple-500" />
                {t.contactInfo}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={<FaEnvelope />}
                  label={t.email}
                  value={profile?.email}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaPhone />}
                  label={t.phone}
                  value={profile?.phoneNumber || profile?.phone}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaUser />}
                  label={t.contactPerson}
                  value={profile?.contactPerson}
                  darkMode={darkMode}
                />
                <DetailItem
                  icon={<FaMapMarkerAlt />}
                  label={t.contactAddress}
                  value={profile?.contactPersonAddress}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value, darkMode }) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <div className="text-gray-500 dark:text-gray-400">{icon}</div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
    <p className="font-medium">
      {value || <span className="text-gray-400 italic">{darkMode ? "Not provided" : "አልተሰጠም"}</span>}
    </p>
  </div>
);

export default DeptHeadProfile;