// src/components/deptHead/DeptHeadSidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  DocumentPlusIcon,
  UserCircleIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useSettings } from "../../contexts/SettingsContext";

const DeptHeadSidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const links = [
    { to: "/departmenthead/dashboard", name: language === "am" ? "መዳረሻ" : "Dashboard", icon: HomeIcon },
    { to: "/departmenthead/employees", name: language === "am" ? "ሰራተኞች" : "Employees", icon: UsersIcon },
    { to: "/departmenthead/attendance", name: language === "am" ? "አቴንዳንስ" : "Attendance", icon: ClipboardDocumentCheckIcon },
    { to: "/departmenthead/requisition", name: language === "am" ? "ሪኩዥሽን" : "Requisition", icon: DocumentPlusIcon },
    { to: "/departmenthead/profile", name: language === "am" ? "መለያ" : "Profile", icon: UserCircleIcon },
    { to: "/departmenthead/leaverequests", name: language === "am" ? "የእረፍት ጥያቄዎች" : "Leave Requests", icon: ClipboardDocumentListIcon },
    { to: "/departmenthead/notifications", name: language === "am" ? "ማሳወቂያዎች" : "Notifications", icon: BellIcon },
  ];

  return (
    <div
      className={`w-64 min-h-screen flex flex-col transition-all duration-500 shadow-2xl
      ${darkMode
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-b from-purple-700 via-indigo-600 to-blue-600 text-white"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >

      {/* Header */}
      

      {/* Navigation */}
      <ul className="mt-6 flex-1 space-y-2 px-3">
        {links.map((link) => {
          const isActive = activeLink === link.to;

          return (
            <li key={link.name}>
              <Link
                to={link.to}
                onClick={() => setActiveLink(link.to)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  text-base font-medium transition-all duration-300
                  transform
                  ${isActive
                    ? "bg-white text-indigo-600 shadow-xl scale-105"
                    : "hover:bg-white/20 hover:scale-105"
                  }
                `}
                style={{
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              >
                <link.icon
                  className={`h-6 w-6 ${isActive ? "text-indigo-600" : "text-white"}`}
                />
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer Toggles */}
      
    </div>
  );
};

export default DeptHeadSidebar;
