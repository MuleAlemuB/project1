import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { 
  FaEnvelope, FaPhone, FaIdBadge, FaBuilding, FaUserTie, 
  FaBriefcase, FaMapMarkerAlt, FaKey, FaCamera, FaHashtag, FaDollarSign, FaCalendarAlt 
} from "react-icons/fa";
import { useSettings } from "../../contexts/SettingsContext";

const ProfilePage = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const [profile, setProfile] = useState(() => {
    // Try to load from localStorage on first render
    const saved = localStorage.getItem("profileData");
    return saved ? JSON.parse(saved) : null;
  });
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [departments, setDepartments] = useState([]);

  // Texts for multilingual support
  const texts = {
    en: {
      myProfile: "My Profile",
      personalInfo: "Personal Info",
      jobContactInfo: "Job & Contact Info",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
      editProfile: "Edit Profile",
      save: "Save",
      cancel: "Cancel",
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone",
      role: "Role",
      department: "Department",
      position: "Position",
      empId: "Emp ID",
      termOfEmployment: "Term of Employment",
      contactPerson: "Contact Person",
      contactPersonAddress: "Contact Address",
      employeeStatus: "Status",
      salary: "Salary",
      experience: "Experience",
      photo: "Photo"
    },
    am: {
      myProfile: "የእኔ ፕሮፋይል",
      personalInfo: "የግል መረጃ",
      jobContactInfo: "የስራ እና የንግድ መረጃ",
      changePassword: "የይለፍ ቃል መቀየር",
      currentPassword: "አሁን የሚጠቀሙት የይለፍ ቃል",
      newPassword: "አዲስ የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃልን አረጋግጥ",
      updatePassword: "የይለፍ ቃል ያዘምኑ",
      editProfile: "ፕሮፋይል አርትዕ",
      save: "አስቀምጥ",
      cancel: "አሰር",
      firstName: "ስም",
      middleName: "የአባት ስም",
      lastName: "የአያት ስም",
      email: "ኢሜል",
      phoneNumber: "ስልክ",
      role: "ሚና",
      department: "የጽ/ቤት ስም",
      position: "የስራ አይነት",
      empId: "ሰራተኛ መታወቂያ",
      termOfEmployment: "የስራ ወቅት",
      contactPerson: "የእውቀት ሰው",
      contactPersonAddress: "የእውቀት አድራሻ",
      employeeStatus: "ሁኔታ",
      salary: "ደመወዝ",
      experience: "ልምድ",
      photo: "ፎቶ"
    }
  };

  const t = texts[language] || texts.en;

  // Fetch profile and departments
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/admin/me");
        setProfile(res.data);
        localStorage.setItem("profileData", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    // Only fetch if profile not in localStorage
    if (!profile) fetchProfile();
    fetchDepartments();
  }, [profile]);

  // Handle input changes
  const handleChange = (e) => {
    const updatedProfile = { ...profile, [e.target.name]: e.target.value };
    setProfile(updatedProfile);
    localStorage.setItem("profileData", JSON.stringify(updatedProfile));
  };
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const updatedProfile = { ...profile, photo: URL.createObjectURL(file) };
      setProfile(updatedProfile);
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      await axios.put("/admin/me", profile);

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        await axios.put("/admin/me/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(language === "am" ? "ፕሮፋይል ተስተካክሏል" : "Profile updated successfully");
      setEditMode(false);
      setPhotoFile(null);
      localStorage.setItem("profileData", JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert(language === "am" ? "አዲስ የይለፍ ቃል እና የማረጋገጫ ቃል አይዛመዱ!" : "New password and confirm password do not match!");
      return;
    }
    try {
      await axios.put("/admin/change-password", passwords);
      alert(language === "am" ? "የይለፍ ቃል ተቀይሯል" : "Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Failed to change password:", err);
      alert(err.response?.data?.message || (language === "am" ? "የይለፍ ቃል መቀየር አልተሳካም" : "Password change failed"));
    }
  };

  // Department name
  const departmentName =
    profile?.department && typeof profile.department === "string"
      ? departments.find((d) => d._id === profile.department)?.name || "-"
      : profile?.department?.name || "-";

  if (!profile) return <p className="p-6 text-center text-xl text-gray-500">Loading profile...</p>;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50"} min-h-screen p-6 flex justify-center items-start transition-colors duration-300`}>
      <div className="w-full max-w-6xl space-y-10">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow-lg">{t.myProfile}</h2>
          
        </div>

        {/* Profile Photo Card */}
        <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-shadow">
          <div className="relative h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
            {profile.photo ? (
              <img
                src={profile.photo.startsWith("http") ? profile.photo : `http://localhost:5000${profile.photo}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover z-10 transform group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg z-10">
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </div>
            )}

            {editMode && (
              <label className="absolute w-32 h-32 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <FaCamera size={24} />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{profile.firstName} {profile.lastName}</h3>
            <p className="text-indigo-600 font-semibold">{profile.role || "-"}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">{t.personalInfo}</h3>
            <div className="space-y-3">
              {[
                { field: "firstName", icon: <FaIdBadge className="text-indigo-500" /> },
                { field: "middleName", icon: <FaIdBadge className="text-indigo-500" /> },
                { field: "lastName", icon: <FaIdBadge className="text-indigo-500" /> },
                { field: "email", icon: <FaEnvelope className="text-green-500" /> },
                { field: "phoneNumber", icon: <FaPhone className="text-blue-500" /> },
                { field: "role", icon: <FaUserTie className="text-purple-500" /> },
              ].map(({ field, icon }) => (
                <div className="flex items-center gap-3" key={field}>
                  {icon}
                  {editMode ? (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={profile[field] || ""}
                      onChange={handleChange}
                      placeholder={t[field] || field}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{profile[field] || "-"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Job & Contact Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">{t.jobContactInfo}</h3>
            <div className="space-y-3">
              {[
                { field: "department", icon: <FaBuilding className="text-green-500" /> },
                { field: "typeOfPosition", icon: <FaBriefcase className="text-indigo-500" /> },
                { field: "empId", icon: <FaHashtag className="text-purple-500" /> },
                { field: "termOfEmployment", icon: <FaCalendarAlt className="text-yellow-500" /> },
                { field: "contactPerson", icon: <FaUserTie className="text-pink-500" /> },
                { field: "contactPersonAddress", icon: <FaMapMarkerAlt className="text-red-500" /> },
                { field: "employeeStatus", icon: <FaUserTie className="text-blue-500" /> },
                { field: "salary", icon: <FaDollarSign className="text-green-500" /> },
                { field: "experience", icon: <FaBriefcase className="text-orange-500" /> },
              ].map(({ field, icon }) => (
                <div className="flex items-center gap-3" key={field}>
                  {icon}
                  {editMode ? (
                    <input
                      type="text"
                      name={field}
                      value={field === "department" ? departmentName : profile[field] || ""}
                      onChange={handleChange}
                      placeholder={t[field] || field}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {field === "department" ? departmentName : profile[field] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Password Change */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-red-600 flex items-center gap-2 mb-4">
            <FaKey /> {t.changePassword}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder={t.currentPassword}
              className="w-full border border-red-300 dark:border-red-500 rounded px-3 py-2 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder={t.newPassword}
              className="w-full border border-red-300 dark:border-red-500 rounded px-3 py-2 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
            />
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              placeholder={t.confirmPassword}
              className="w-full border border-red-300 dark:border-red-500 rounded px-3 py-2 focus:ring-2 focus:ring-red-300 focus:outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-4 w-full md:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
          >
            {t.updatePassword}
          </button>
        </div>

        {/* Edit / Save Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          {editMode ? (
            <>
              <button onClick={handleSave} className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105">
                {t.save}
              </button>
              <button onClick={() => setEditMode(false)} className="px-10 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl shadow-lg transition transform hover:scale-105">
                {t.cancel}
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-10 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105">
              {t.editProfile}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
