// src/pages/admin/AdminProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { FaEnvelope, FaBuilding, FaBriefcase, FaPhone } from "react-icons/fa";

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/admin/me"); // real admin data
      setProfile(res.data);
      setFormData({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
        position: res.data.position || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/employees/${profile.id}`, formData); // update admin info
      await fetchProfile(); // refresh data
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
    setUpdating(false);
  };

  if (loading) return <p className="p-6 text-center text-xl text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex justify-center items-start">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-4xl shadow-md">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
          )}
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-blue-500 font-semibold">{profile.role?.toUpperCase()}</p>
        </div>

        {!editing ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-sm">
              <FaEnvelope className="text-blue-500" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-sm">
              <FaBuilding className="text-green-500" />
              <span>{profile.department?.name || profile.department || "-"}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-sm">
              <FaBriefcase className="text-purple-500" />
              <span>{profile.position || profile.typeOfPosition || "-"}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow-sm">
              <FaPhone className="text-gray-500" />
              <span>{profile.phoneNumber || "-"}</span>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transform transition duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={updating}
                className="bg-green-500 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transform transition duration-200"
              >
                {updating ? "Updating..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transform transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
