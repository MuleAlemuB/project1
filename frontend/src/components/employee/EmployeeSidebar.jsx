// src/components/employee/EmployeeSidebar.jsx
import React, { useState } from "react";
import { FaUser, FaEnvelope, FaBell, FaTachometerAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

const EmployeeSidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { language, darkMode } = useSettings(); // get language and darkMode

  const links = [
    {
      name: language === "am" ? "ዳሽቦርድ" : "Dashboard",
      path: "/employee/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: language === "am" ? "የእረፍት ጥያቄ" : "Leave Application",
      path: "/employee/leave",
      icon: <FaEnvelope />,
    },
    {
      name: language === "am" ? "ማሳወቂያዎች" : "Notifications",
      path: "/employee/notifications",
      icon: <FaBell />,
    },
    {
      name: language === "am" ? "መግለጫ" : "Profile",
      path: "/employee/profile",
      icon: <FaUser />,
    },
  ];

  // Dynamically set colors based on darkMode
  const sidebarBg = darkMode ? "bg-gray-900" : "bg-gray-100";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const activeBg = darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900";
  const hoverBg = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200";

  return (
    <div className={`w-64 min-h-screen ${sidebarBg} ${textColor} shadow-lg flex flex-col transition-all duration-500`}>
      {/* Header */}
      <div className={`p-6 text-center border-b ${borderColor}`}>
        <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-sm">
          {language === "am" ? "የሰራተኛ ገጽ" : "Employee Panel"}
        </h1>
      </div>

      {/* Links */}
      <ul className="mt-6 flex-1 space-y-3 px-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              onClick={() => setActiveLink(link.path)}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl font-medium transition-all duration-300
                ${
                  activeLink === link.path
                    ? activeBg + " shadow-md scale-105"
                    : hoverBg + " hover:scale-105"
                }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className={`p-6 text-center border-t ${borderColor} mt-auto`}>
        <p className="text-sm font-medium">
          {language === "am" ? "ዲቲዩ ኤች አር ኤም ኤስ © 2025" : "DTU HRMS © 2025"}
        </p>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
