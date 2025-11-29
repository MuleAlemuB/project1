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

const translations = {
  en: {
    dashboard: "Dashboard",
    manageEmployees: "Manage Employees",
    manageDepartments: "Manage Departments",
    vacancies: "Vacancies",
    reports: "Reports",
    notifications: "Notifications",
    profile: "Profile",
    adminPanel: "Admin Panel",
  },
  am: {
    dashboard: "ዳሽቦርድ",
    manageEmployees: "ሰራተኞችን አስተዳደር",
    manageDepartments: "የክፍሎችን አስተዳደር",
    vacancies: "ቦታዎች",
    reports: "ሪፖርቶች",
    notifications: "ማሳወቂያዎች",
    profile: "ፕሮፋይል",
    adminPanel: "አስተዳደር ፓነል",
  },
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-3 rounded hover:bg-gray-700 transition ${
      isActive
        ? darkMode
          ? "bg-gray-700 font-bold"
          : "bg-blue-200 text-black font-bold"
        : ""
    }`;

  const menuItems = [
    { name: t.dashboard, to: "/admin/dashboard", icon: <HomeIcon className="h-5 w-5" /> },
    { name: t.manageEmployees, to: "/admin/manage-employees", icon: <UserGroupIcon className="h-5 w-5" /> },
    { name: t.manageDepartments, to: "/admin/manage-departments", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    { name: t.vacancies, to: "/admin/vacancies", icon: <ClipboardDocumentIcon className="h-5 w-5" /> },
    { name: t.reports, to: "/admin/reports", icon: <ClipboardDocumentIcon className="h-5 w-5" /> },
    { name: t.notifications, to: "/admin/notifications", icon: <BellIcon className="h-5 w-5" /> },
    { name: t.profile, to: "/admin/profile", icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <aside
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        } p-4 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
      >
        <div
          className="text-center cursor-pointer mb-6"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="text-2xl font-bold">{collapsed ? "A" : t.adminPanel}</span>
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
