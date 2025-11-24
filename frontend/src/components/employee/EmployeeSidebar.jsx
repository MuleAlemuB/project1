import React, { useState } from "react";
import { FaUser, FaEnvelope, FaBell, FaTachometerAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const EmployeeSidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const links = [
    { name: "Dashboard", path: "/employee/dashboard", icon: <FaTachometerAlt /> },
    { name: "Leave Application", path: "/employee/leave", icon: <FaEnvelope /> },
    { name: "Notifications", path: "/employee/notifications", icon: <FaBell /> },
    { name: "Profile", path: "/employee/profile", icon: <FaUser /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 text-white shadow-2xl flex flex-col transition-all duration-500">
      {/* Header */}
      <div className="p-6 text-center border-b border-blue-400">
        <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
          Employee Panel
        </h1>
      </div>

      {/* Links */}
      <ul className="mt-6 flex-1 space-y-3 px-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              onClick={() => setActiveLink(link.path)}
              className={`flex items-center gap-4 px-5 py-3 rounded-2xl font-medium transition-all duration-300 
                ${
                  activeLink === link.path
                    ? "bg-white text-blue-700 shadow-lg scale-105"
                    : "hover:bg-blue-400 hover:bg-opacity-30 hover:scale-105"
                }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="p-6 text-center border-t border-blue-400 mt-auto">
        <p className="text-blue-100 text-sm font-medium">DTU HRMS © 2025</p>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
