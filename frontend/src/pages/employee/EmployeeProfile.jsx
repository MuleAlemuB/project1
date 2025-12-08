// src/pages/employee/EmployeeProfile.jsx
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
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import EmployeeSidebar from "../../components/employee/EmployeeSidebar";
import { useSettings } from "../../contexts/SettingsContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeProfile = () => {
  const { language, darkMode } = useSettings(); // Using SettingsContext
  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/employees/dashboard")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage(language === "am" ? "❌ መግለጫ ማንበብ አልተሳካም።" : "❌ Failed to load profile.");
        setLoading(false);
      });
  }, [language]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put("/employees/update-password", passwordData);
      setMessage(`✅ ${res.data.message}`);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage(language === "am" ? "❌ የይለፍ ቃል ማዘዣ አልተሳካም።" : "❌ Failed to update password.");
    }
  };

  if (loading)
    return (
      <p className={`p-6 text-center text-xl ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
        {language === "am" ? "በመጫን ላይ..." : "Loading..."}
      </p>
    );

  const photoUrl = profile?.photo ? `${BACKEND_URL}${profile.photo}` : null;

  // Theme-based colors
  const mainBg = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-200";
  const cardBg = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const inputBg = darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800";
  const inputBorder = darkMode ? "border-gray-600" : "border-gray-300";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content */}
      <main className={`${mainBg} flex-1 p-6 flex justify-center py-12 px-4 transition-all duration-500`}>
        <div className={`${cardBg} shadow-3xl rounded-3xl p-10 w-full max-w-5xl`}>
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-300 shadow-lg mb-4"
              />
            ) : (
              <FaUserCircle
                className={`text-32xl mb-4 ${darkMode ? "text-gray-400" : "text-gray-300"}`}
              />
            )}
            <h1 className={`text-4xl font-extrabold mb-1 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
              {language === "am" ? "መግለጫዬ" : "My Profile"}
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} text-sm`}>
              {language === "am"
                ? "በደህና ዝርዝሮችዎን ይመልከቱ እና የይለፍ ቃልዎን ያዘውሩ"
                : "Securely view your details and update your password"}
            </p>
          </div>

          {/* Profile Info (Two Columns) */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePasswordSubmit}>
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaUser className="text-green-600" /> {language === "am" ? "ስም" : "First Name"}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile?.firstName || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaUser className="text-green-600" /> {language === "am" ? "የአባት ስም" : "Last Name"}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile?.lastName || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none focus:ring-2 focus:ring-green-400`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaEnvelope className="text-green-600" /> Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaPhone className="text-green-600" /> {language === "am" ? "ስልክ" : "Phone"}
                </label>
                <input
                  type="text"
                  value={profile?.phoneNumber || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaBuilding className="text-green-600" /> {language === "am" ? "የክፍል ስም" : "Department"}
                </label>
                <input
                  type="text"
                  value={profile?.department || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaBriefcase className="text-green-600" /> {language === "am" ? "የስራ አይነት" : "Position"}
                </label>
                <input
                  type="text"
                  value={profile?.typeOfPosition || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaIdBadge className="text-green-600" /> {language === "am" ? "የሰራተኛ መታወቂያ" : "Employee ID"}
                </label>
                <input
                  type="text"
                  value={profile?.empId || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaDollarSign className="text-green-600" /> Salary
                </label>
                <input
                  type="text"
                  value={profile?.salary || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaFileAlt className="text-green-600" /> {language === "am" ? "ልምድ" : "Experience"}
                </label>
                <input
                  type="text"
                  value={profile?.experience || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaUser className="text-green-600" /> {language === "am" ? "የእድር ሰው ስም" : "Contact Person"}
                </label>
                <input
                  type="text"
                  value={profile?.contactPerson || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaAddressCard className="text-green-600" /> {language === "am" ? "የእድር ሰው አድራሻ" : "Contact Address"}
                </label>
                <input
                  type="text"
                  value={profile?.contactPersonAddress || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaBriefcase className="text-green-600" /> {language === "am" ? "ሁኔታ" : "Status"}
                </label>
                <input
                  type="text"
                  value={profile?.employeeStatus || ""}
                  disabled
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaIdBadge className="text-green-600" />{" "}
                  {language === "am" ? "የአሁኑ የይለፍ ቃል" : "Current Password"}
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder={language === "am" ? "የአሁኑ የይለፍ ቃል" : "Current Password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 mb-1 font-semibold">
                  <FaIdBadge className="text-green-600" /> {language === "am" ? "አዲስ የይለፍ ቃል" : "New Password"}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder={language === "am" ? "አዲስ የይለፍ ቃል" : "New Password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-2xl shadow-inner ${inputBg} focus:outline-none`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-200"
              >
                {language === "am" ? "የይለፍ ቃል አዘዝ" : "Update Password"}
              </button>
            </div>

            {/* Message */}
            {message && (
              <p
                className={`md:col-span-2 text-center font-semibold mt-3 ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployeeProfile;
