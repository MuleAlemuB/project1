// src/pages/deptHead/DeptHeadProfile.jsx
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
import { useSettings } from "../../contexts/SettingsContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const DeptHeadProfile = () => {
  const { darkMode, language } = useSettings();
  const [profile, setProfile] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/depthead/profile");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setMessage(language === "am" ? "❌ መገለጫ ማስመዝገብ አልተሳካም።" : "❌ Failed to load profile.");
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
      const res = await axiosInstance.put("/depthead/update-password", passwordData);
      setMessage(`✅ ${res.data.message}`);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      setMessage(language === "am" ? "❌ የይለፍ ቃል ማሻሻያ አልተሳካም።" : "❌ Failed to update password.");
    }
  };

  if (loading)
    return (
      <p className={`p-6 text-center text-xl ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        {language === "am" ? "በመጫን ላይ..." : "Loading..."}
      </p>
    );

  const photoUrl = profile?.photo ? `${BACKEND_URL}${profile.photo}` : null;

  const textClass = darkMode ? "text-gray-200" : "text-gray-800";
  const inputBg = darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
  const formBg = darkMode ? "bg-gray-800 shadow-xl" : "bg-white shadow-3xl";

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-200"} min-h-screen flex justify-center py-12 px-4`}>
      <div className={`${formBg} rounded-3xl p-10 w-full max-w-5xl`}>
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-300 shadow-lg mb-4"
            />
          ) : (
            <FaUserCircle className="text-gray-400 dark:text-gray-200 text-32xl mb-4" />
          )}
          <h1 className={`text-4xl font-extrabold mb-1 ${textClass}`}>
            {language === "am" ? "መገለጫዬ" : "My Profile"}
          </h1>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            {language === "am" ? "ዝርዝሮችዎን በደህና ይመልከቱ እና የይለፍ ቃልዎን ያሻሽሉ" : "Securely view your details and update your password"}
          </p>
        </div>

        {/* Profile Info */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePasswordSubmit}>
          {/* Left Column */}
          <div className="space-y-4">
            {[
              { label: language === "am" ? "ስም" : "First Name", icon: FaUser, value: profile?.firstName },
              { label: language === "am" ? "የአባት ስም" : "Middle Name", icon: FaUser, value: profile?.middleName },
              { label: language === "am" ? "የአያት ስም" : "Last Name", icon: FaUser, value: profile?.lastName },
              { label: language === "am" ? "ኢሜይል" : "Email", icon: FaEnvelope, value: profile?.email },
              { label: language === "am" ? "ስልክ" : "Phone", icon: FaPhone, value: profile?.phoneNumber || profile?.phone },
              { label: language === "am" ? "የጽ/ቤት ስም" : "Department", icon: FaBuilding, value: profile?.department?.name },
            ].map((field, idx) => (
              <div key={idx}>
                <label className={`flex items-center gap-2 mb-1 font-semibold ${textClass}`}>
                  <field.icon className="text-green-500" /> {field.label}
                </label>
                <input
                  type="text"
                  value={field.value || ""}
                  disabled
                  className={`w-full px-4 py-3 border rounded-2xl shadow-inner focus:outline-none ${inputBg}`}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[
              { label: language === "am" ? "ስራ ክፍል" : "Position", icon: FaBriefcase, value: profile?.typeOfPosition || "Department Head" },
              { label: language === "am" ? "የሰራተኛ መታወቂያ" : "Employee ID", icon: FaIdBadge, value: profile?.empId },
              { label: language === "am" ? "ደመወዝ" : "Salary", icon: FaDollarSign, value: profile?.salary },
              { label: language === "am" ? "ልምድ" : "Experience", icon: FaFileAlt, value: profile?.experience },
              { label: language === "am" ? "የእውቅና ሰው" : "Contact Person", icon: FaUser, value: profile?.contactPerson },
              { label: language === "am" ? "የእውቅና አድራሻ" : "Contact Address", icon: FaAddressCard, value: profile?.contactPersonAddress },
              { label: language === "am" ? "ሁኔታ" : "Status", icon: FaBriefcase, value: profile?.employeeStatus || profile?.status || "Active" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className={`flex items-center gap-2 mb-1 font-semibold ${textClass}`}>
                  <field.icon className="text-green-500" /> {field.label}
                </label>
                <input
                  type="text"
                  value={field.value || ""}
                  disabled
                  className={`w-full px-4 py-3 border rounded-2xl shadow-inner focus:outline-none ${inputBg}`}
                />
              </div>
            ))}
          </div>

          {/* Password Section */}
          <div className="md:col-span-2 space-y-4">
            {[
              { label: language === "am" ? "የአሁኑ የይለፍ ቃል" : "Current Password", name: "currentPassword" },
              { label: language === "am" ? "አዲስ የይለፍ ቃል" : "New Password", name: "newPassword" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className={`flex items-center gap-2 mb-1 font-semibold ${textClass}`}>
                  <FaIdBadge className="text-green-500" /> {field.label}
                </label>
                <input
                  type="password"
                  name={field.name}
                  placeholder={field.label}
                  value={passwordData[field.name]}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 border rounded-2xl shadow-inner focus:outline-none ${inputBg}`}
                  required
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-200"
            >
              {language === "am" ? "የይለፍ ቃል አሻሽል" : "Update Password"}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`md:col-span-2 text-center font-semibold mt-3 ${
                message.includes("✅") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeptHeadProfile;
