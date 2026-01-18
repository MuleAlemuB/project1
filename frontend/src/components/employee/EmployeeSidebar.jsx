// src/components/employee/EmployeeSidebar.jsx
import React, { useState, useEffect } from "react";
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaBell, 
  FaFileAlt, 
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
      name: language === "am" ? "የስራ ልምድ ጥያቄ" : "Work Experience",
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
    <div className={`flex flex-col h-screen w-64 transition-all duration-300
      ${darkMode 
        ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100" 
        : "bg-gradient-to-b from-white to-gray-50 text-gray-800 shadow-lg"
      }`}>
      
      {/* Header */}
      <div className="px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-2xl shadow-lg ${
            darkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40' : 'bg-gradient-to-br from-blue-100 to-blue-50'
          }`}>
            <FaHome className={`h-8 w-8 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">
              {language === "am" ? "ሰራተኛ ፓነል" : "Employee Panel"}
            </h1>
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === "am" ? "የስራ አስተዳደር" : "Work Management"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = activeLink === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setActiveLink(link.path)}
                className={`
                  flex items-center gap-4 px-5 py-3.5 rounded-xl
                  transition-all duration-300 transform
                  ${isActive
                    ? darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-[1.02]'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-[1.02]'
                    : darkMode
                      ? 'hover:bg-gray-800/70 hover:scale-[1.01] hover:shadow-md'
                      : 'hover:bg-gray-100 hover:scale-[1.01] hover:shadow-md'
                  }
                `}
              >
                <div className={`transition-transform duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}>
                  {link.icon}
                </div>
                <span className="font-medium tracking-wide">{link.name}</span>
                
                {isActive && (
                  <div className="ml-auto">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      darkMode ? 'bg-white/80' : 'bg-white'
                    }`}></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={`p-6 border-t ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              darkMode ? 'bg-green-500' : 'bg-green-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}>
              {language === "am" ? "ንቁ" : "Active"}
            </span>
          </div>
          <p className={`text-xs ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          } text-center`}>
            {language === "am" 
              ? "የዲቢቲዩ ሰብአዊ ሀብት ማኔጅመንት ሲስተም" 
              : "DTU HR Management System"}
          </p>
          <div className={`text-xs px-3 py-1 rounded-full ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
          }`}>
            v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;