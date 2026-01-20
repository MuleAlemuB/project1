// src/components/employee/EmployeeSidebar.jsx
import React, { useState, useEffect } from "react";
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaBell, 
  FaUser,
  FaHome
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

const EmployeeSidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { language, darkMode } = useSettings();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const links = [
    {
      name: language === "am" ? "ዳሽቦርድ" : "Dashboard",
      path: "/employee/dashboard",
      icon: <FaTachometerAlt className="w-5 h-5" />,
    },
    {
      name: language === "am" ? "የእረፍት ጥያቄ" : "Leave Application",
      path: "/employee/leave",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      name: language === "am" ? "ማሳወቂያዎች" : "Notifications",
      path: "/employee/notifications",
      icon: <FaBell className="w-5 h-5" />,
    },
    {
      name: language === "am" ? "የስራ ልምድ" : "Work Experience",
      path: "/employee/work-experience",
      icon: <MdWork className="w-5 h-5" />,
    },
    {
      name: language === "am" ? "መግለጫ" : "Profile",
      path: "/employee/profile",
      icon: <FaUser className="w-5 h-5" />,
    },
  ];

  return (
    <div className={`flex flex-col h-screen w-64 transition-colors duration-200
      ${darkMode 
        ? "bg-gray-900 text-gray-100" 
        : "bg-white text-gray-800 border-r border-gray-100"
      }`}>
      
      {/* Header - Simplified */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-blue-50'
          }`}>
            <FaHome className={`h-6 w-6 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {language === "am" ? "ሰራተኛ ፓነል" : "Employee Panel"}
            </h1>
            <p className={`text-xs mt-0.5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === "am" ? "የስራ አስተዳደር" : "Work Management"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Cleaner */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = activeLink === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setActiveLink(link.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                    : darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-50 text-gray-600'
                  }
                `}
              >
                <div className={isActive && !darkMode ? 'text-blue-600' : ''}>
                  {link.icon}
                </div>
                <span className="font-medium text-sm">{link.name}</span>
                
                {isActive && (
                  <div className="ml-auto">
                    <div className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-white' : 'bg-blue-500'
                    }`}></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - Minimal */}
      <div className={`p-4 mt-auto border-t ${
        darkMode ? 'border-gray-800' : 'border-gray-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              darkMode ? 'bg-green-500' : 'bg-green-400'
            }`}></div>
            <span className={`text-xs font-medium ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {language === "am" ? "ንቁ" : "Active"}
            </span>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}>
            v2.0
          </div>
        </div>
        <p className={`text-xs mt-2 ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {language === "am" 
            ? "DTU HRMS" 
            : "DTU HRMS"}
        </p>
      </div>
    </div>
  );
};

export default EmployeeSidebar;