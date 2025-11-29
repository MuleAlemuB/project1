// src/components/deptHead/DeptHeadSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  DocumentPlusIcon,
  UserCircleIcon,
  BellIcon,
  ClipboardDocumentListIcon,
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
    { to: "/departmenthead/profile", name: language === "am" ? "መለያ" : "Profile", icon: UserCircleIcon },
    { to: "/departmenthead/leaverequests", name: language === "am" ? "የእረፍት ጥያቄዎች" : "Leave Requests", icon: ClipboardDocumentListIcon },
    { to: "/departmenthead/notifications", name: language === "am" ? "ማሳወቂያዎች" : "Notifications", icon: BellIcon },
  ];

  return (
    <div
      className={`w-64 min-h-screen flex flex-col transition-all duration-300 shadow-xl
        ${
          darkMode
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100"
            : "bg-white text-gray-800 border-r border-gray-200"
        }
      `}
    >
      {/* Navigation */}
      <ul className="mt-6 flex-1 space-y-1 px-3">
        {links.map((link) => {
          const isActive = activeLink === link.to;

          return (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setActiveLink(link.to)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  font-medium transition-all duration-200
                  ${
                    isActive
                      ? darkMode
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }
                `}
              >
                <link.icon
                  className={`h-6 w-6
                    ${
                      isActive
                        ? darkMode
                          ? "text-white"
                          : "text-indigo-600"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-500"
                    }
                  `}
                />
                <span>{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DeptHeadSidebar;
