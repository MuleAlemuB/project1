import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ role }) => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    role === "admin" && { to: "/admin", label: "Dashboard" },
    role === "employee" && { to: "/employee", label: "Dashboard" },
    role === "depthead" && { to: "/depthead", label: "Dashboard" },
  ].filter(Boolean);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap justify-between items-center transition-all duration-500">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-md hover:scale-110 transition-transform duration-300">
          <img
            src="/dtu-logo.jpg"
            alt="DTU Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
        <span className="text-gray-800 dark:text-white font-extrabold text-xl tracking-wide">
          DTU HRMS
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`relative font-medium text-gray-700 dark:text-gray-200 text-sm md:text-base px-4 py-2 rounded-lg transition-all duration-300
              ${
                location.pathname === link.to
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                  : "hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-700 dark:hover:text-white"
              }`}
          >
            {link.label}
            {location.pathname === link.to && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-md shadow-md"></span>
            )}
          </Link>
        ))}

        {/* Logout */}
        <Link
          to="/login"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
