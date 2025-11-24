// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useSettings } from "../contexts/SettingsContext";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useSettings(); // Only read darkMode for sidebar styling

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-3 rounded hover:bg-gray-700 transition ${
      isActive ? "bg-gray-700 font-bold" : ""
    }`;

  const menuItems = [
    { name: "Dashboard", to: "/admin/dashboard", icon: <HomeIcon className="h-5 w-5" /> },
    { name: "Manage Employees", to: "/admin/manage-employees", icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: "Manage Departments", to: "/admin/manage-departments", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    { name: "Vacancies", to: "/admin/vacancies", icon: <ClipboardDocumentIcon className="h-5 w-5" /> },
    { name: "Reports", to: "/admin/reports", icon: <ClipboardDocumentIcon className="h-5 w-5" /> },
    { name: "Notifications", to: "/admin/notifications", icon: <BellIcon className="h-5 w-5" /> },
    { name: "Profile", to: "/admin/profile", icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white p-4 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className="text-center cursor-pointer mb-6"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="text-2xl font-bold">{collapsed ? "A" : "Admin Panel"}</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <NavLink key={item.name} to={item.to} className={linkClass}>
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
