// src/components/deptHead/DeptHeadSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  DocumentPlusIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  UserCircleIcon,
  DocumentTextIcon, // Added for Work Experience
} from "@heroicons/react/24/outline";
import { useSettings } from "../../contexts/SettingsContext";

const DeptHeadSidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { darkMode, language } = useSettings();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const links = [
    { to: "/departmenthead/dashboard", name: language === "am" ? "መዳረሻ" : "Dashboard", icon: HomeIcon },
    { to: "/departmenthead/employees", name: language === "am" ? "ሰራተኞች" : "Employees", icon: UsersIcon },
    { to: "/departmenthead/attendance", name: language === "am" ? "አቴንዳንስ" : "Attendance", icon: ClipboardDocumentCheckIcon },
    { to: "/departmenthead/requisition", name: language === "am" ? "ሪኩዥሽን" : "Requisition", icon: DocumentPlusIcon },
    { to: "/departmenthead/work-experience", name: language === "am" ? "የስራ ልምድ ጥያቄ" : "Work Experience", icon: DocumentTextIcon }, // Added here
    { to: "/departmenthead/leaverequests", name: language === "am" ? "የእረፍት ጥያቄዎች" : "Leave Requests", icon: ClipboardDocumentListIcon },
    { to: "/departmenthead/notifications", name: language === "am" ? "ማሳወቂያዎች" : "Notifications", icon: BellIcon },
    { to: "/departmenthead/profile", name: language === "am" ? "መለያ" : "Profile", icon: UserCircleIcon },
  ];

  return (
    <div
      className={`w-64 min-h-screen flex flex-col transition-all duration-300 shadow-xl
        ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 border-r border-gray-800"
            : "bg-gradient-to-b from-white via-gray-50 to-white text-gray-800 border-r border-gray-200"
        }
      `}
    >
      {/* Logo/Section Header */}
      <div className={`px-6 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {language === "am" ? "የምድብ ኃላፊ" : "Department Head"}
        </h2>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {language === "am" ? "የማኔጅመንት ፓነል" : "Management Panel"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-3">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = activeLink === link.to;
            const Icon = link.icon;

            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setActiveLink(link.to)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    font-medium transition-all duration-200 group
                    ${
                      isActive
                        ? darkMode
                          ? "bg-indigo-600/90 text-white shadow-md"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                        : darkMode
                          ? "hover:bg-gray-800/80 hover:text-white"
                          : "hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200
                      ${
                        isActive
                          ? darkMode
                            ? "text-white"
                            : "text-indigo-600"
                          : darkMode
                            ? "text-gray-400 group-hover:text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                      }
                    `}
                  />
                  <span className="text-sm tracking-wide">{link.name}</span>
                  {isActive && (
                    <span className={`ml-auto h-1.5 w-1.5 rounded-full ${
                      darkMode ? 'bg-white' : 'bg-indigo-600'
                    }`}></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom separator */}
        <div className={`mt-8 mx-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
      </nav>

      {/* Version/Status (optional) */}
      <div className={`px-4 py-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="flex items-center justify-between">
          <span>{language === "am" ? "ተገቢ አድራሻ" : "Active Session"}</span>
          <span className={`h-2 w-2 rounded-full ${darkMode ? 'bg-green-500' : 'bg-green-400'}`}></span>
        </div>
      </div>
    </div>
  );
};

export default DeptHeadSidebar;