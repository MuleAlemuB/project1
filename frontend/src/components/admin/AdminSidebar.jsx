import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaClipboardList } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const AdminSidebar = ({ onLogout }) => {
  const [unseenCount, setUnseenCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchUnseenCount();
    const interval = setInterval(fetchUnseenCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnseenCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications/unseen/count");
      setUnseenCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-600/90 text-white shadow-md shadow-blue-400/40 scale-[1.03]"
        : "text-gray-200 hover:bg-blue-500/30 hover:text-white"
    }`;

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-blue-950 via-blue-900 to-gray-900 text-white min-h-screen flex flex-col justify-between p-4 shadow-xl border-r border-blue-700/40 backdrop-blur-lg bg-opacity-70 transition-all duration-500`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <h2 className="text-2xl font-extrabold tracking-wide text-blue-300 drop-shadow-lg ml-2">
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-blue-700/40 transition"
        >
          {collapsed ? (
            <Bars3Icon className="h-6 w-6 text-blue-300" />
          ) : (
            <XMarkIcon className="h-6 w-6 text-blue-300" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="" end className={linkClass}>
          <HomeIcon className="h-5 w-5" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="manage-employees" className={linkClass}>
          <UserGroupIcon className="h-5 w-5" />
          {!collapsed && <span>Manage Employees</span>}
        </NavLink>

        <NavLink to="manage-departments" className={linkClass}>
          <BuildingOfficeIcon className="h-5 w-5" />
          {!collapsed && <span>Manage Departments</span>}
        </NavLink>

        <Link
          to="/admin/manage-vacancies"
          className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            location.pathname === "/admin/manage-vacancies"
              ? "bg-blue-600/90 text-white shadow-md shadow-blue-400/40 scale-[1.03]"
              : "text-gray-200 hover:bg-blue-500/30 hover:text-white"
          }`}
        >
          <FaClipboardList className="h-5 w-5" />
          {!collapsed && <span>Manage Vacancies</span>}
        </Link>

        <NavLink to="reports" className={linkClass}>
          <ClipboardDocumentIcon className="h-5 w-5" />
          {!collapsed && <span>Reports</span>}
        </NavLink>

        <NavLink to="notifications" className={linkClass}>
          <span className="flex items-center gap-2">
            <span>🔔</span>
            {!collapsed && <span>Notifications</span>}
          </span>
          {unseenCount > 0 && (
            <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-auto animate-pulse">
              {unseenCount}
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          <UserCircleIcon className="h-5 w-5" />
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl w-full 
          bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold
          hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-blue-400/60"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
