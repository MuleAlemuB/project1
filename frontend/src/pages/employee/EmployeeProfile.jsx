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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeProfile = () => {
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
        setMessage("❌ Failed to load profile.");
        setLoading(false);
      });
  }, []);

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
      setMessage("❌ Failed to update password.");
    }
  };

  if (loading)
    return <p className="p-6 text-center text-xl text-gray-500">Loading...</p>;

  const photoUrl = profile?.photo
    ? `${BACKEND_URL}${profile.photo}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center py-12 px-4">
      <div className="bg-white shadow-3xl rounded-3xl p-10 w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-300 shadow-lg mb-4"
            />
          ) : (
            <FaUserCircle className="text-gray-300 text-32xl mb-4" />
          )}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-1">My Profile</h1>
          <p className="text-gray-500 text-sm">Securely view your details and update your password</p>
        </div>

        {/* Profile Info (Two Columns) */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handlePasswordSubmit}>
          {/* Left Column: Personal Info */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaUser className="text-green-600" /> First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile?.firstName || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaUser className="text-green-600" /> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile?.lastName || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaEnvelope className="text-green-600" /> Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaPhone className="text-green-600" /> Phone
              </label>
              <input
                type="text"
                value={profile?.phoneNumber || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaBuilding className="text-green-600" /> Department
              </label>
              <input
                type="text"
                value={profile?.department || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Work & Contact Info */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaBriefcase className="text-green-600" /> Position
              </label>
              <input
                type="text"
                value={profile?.typeOfPosition || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaIdBadge className="text-green-600" /> Employee ID
              </label>
              <input
                type="text"
                value={profile?.empId || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaDollarSign className="text-green-600" /> Salary
              </label>
              <input
                type="text"
                value={profile?.salary || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaFileAlt className="text-green-600" /> Experience
              </label>
              <input
                type="text"
                value={profile?.experience || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaUser className="text-green-600" /> Contact Person
              </label>
              <input
                type="text"
                value={profile?.contactPerson || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaAddressCard className="text-green-600" /> Contact Address
              </label>
              <input
                type="text"
                value={profile?.contactPersonAddress || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaBriefcase className="text-green-600" /> Status
              </label>
              <input
                type="text"
                value={profile?.employeeStatus || ""}
                disabled
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Section (full width) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaIdBadge className="text-green-600" /> Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-1 text-gray-600 font-semibold">
                <FaIdBadge className="text-green-600" /> New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border rounded-2xl shadow-inner bg-gray-50 focus:outline-none"
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
              Update Password
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
    </div>
  );
};

export default EmployeeProfile;
