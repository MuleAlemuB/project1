import React, { useEffect, useState, useContext } from "react";
import { FaUser, FaClipboardList, FaEnvelope, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import logo from "../../assets/logo.jpg";
import { AuthContext } from "../../contexts/AuthContext"; // Your AuthContext

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EmployeeDashboard = () => {
  const { logoutUser } = useContext(AuthContext); // Get the actual logout function
  const navigate = useNavigate(); // For redirecting
  const [profile, setProfile] = useState(null);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/employees/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logoutUser(); // Clear user and localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!stats)
    return <p className="p-6 text-center text-xl">Loading dashboard...</p>;

  const photoUrl = profile?.photo
    ? `${BACKEND_URL}${profile.photo}`
    : null;

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 min-h-screen p-6">
      {/* Top Branding Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl shadow-xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="DTU Logo"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">DTU HRMS</h1>
            <p className="text-blue-100 text-sm font-medium">Employee Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-100 transition shadow"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center gap-5 mb-10">
        {photoUrl ? (
            <img
                      src={
  emp.photo
    ? `http://localhost:5000${emp.photo}`
    : "/fallback-avatar.png"
}

                      alt="Employee"
                      className="w-12 h-12 rounded-full object-cover"
                    />
        ) : (
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl shadow-inner">
            {stats.firstName?.charAt(0) || "E"}
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-blue-900">
            Welcome, {stats.firstName} {stats.lastName} 👋
          </h2>
          <p className="text-blue-700 font-medium">
            Department: <span className="text-blue-900">{stats.department || "-"}</span>
          </p>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-center gap-4">
          <FaUser className="text-3xl text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Profile</h2>
            <p className="text-blue-500 text-sm">{stats.profileCompleted}% Completed</p>
          </div>
        </div>

        {/* Placement */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-center gap-4">
          <FaClipboardList className="text-3xl text-indigo-600" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Placement</h2>
            <p className="text-blue-500 text-sm">{stats.placementStatus}</p>
          </div>
        </div>

        {/* Leave */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-center gap-4">
          <FaEnvelope className="text-3xl text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Leave</h2>
            <p className="text-blue-500 text-sm">{stats.leaveBalance} days left</p>
          </div>
        </div>

        {/* Requisition */}
        <div className="bg-white border border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex items-center gap-4">
          <FaFileAlt className="text-3xl text-rose-600" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Requisition</h2>
            <p className="text-blue-500 text-sm">{stats.requisitions} pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
