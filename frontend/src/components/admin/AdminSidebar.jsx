import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  ClipboardDocumentIcon as ClipboardDocumentIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BellIcon as BellIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
} from "@heroicons/react/24/solid";
import { FaClipboardList, FaClipboardList as FaClipboardListSolid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    dashboard: "Dashboard",
    manageEmployees: "Manage Employees",
    manageDepartments: "Manage Departments",
    manageVacancies: "Manage Vacancies",
    reports: "Analytics",
    notifications: "Notifications",
    profile: "Profile Settings",
    logout: "Sign Out",
    adminPanel: "Admin Console",
  },
  am: {
    dashboard: "ዳሽቦርድ",
    manageEmployees: "ሰራተኞች አስተዳደር",
    manageDepartments: "የክፍሎች አስተዳደር",
    manageVacancies: "ባዶ ቦታዎች",
    reports: "ትንታኔዎች",
    notifications: "ማሳወቂያዎች",
    profile: "መመዝገቢያ",
    logout: "ዘግተው ይውጡ",
    adminPanel: "አስተዳዳሪ ፓነል",
  },
};

const AdminSidebar = ({ onLogout }) => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [unseenCount, setUnseenCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchUnseenCount();
    const interval = setInterval(fetchUnseenCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnseenCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications/unseen/count");
      setUnseenCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    {
      path: "",
      label: t.dashboard,
      icon: <HomeIcon className="h-5 w-5" />,
      activeIcon: <HomeIconSolid className="h-5 w-5" />,
      exact: true,
    },
    {
      path: "manage-employees",
      label: t.manageEmployees,
      icon: <UserGroupIcon className="h-5 w-5" />,
      activeIcon: <UserGroupIconSolid className="h-5 w-5" />,
    },
    {
      path: "manage-departments",
      label: t.manageDepartments,
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      activeIcon: <BuildingOfficeIconSolid className="h-5 w-5" />,
    },
    {
      path: "manage-vacancies",
      label: t.manageVacancies,
      icon: <FaClipboardList className="h-5 w-5" />,
      activeIcon: <FaClipboardListSolid className="h-5 w-5" />,
      fullPath: "/admin/manage-vacancies",
    },
    {
      path: "reports",
      label: t.reports,
      icon: <ChartBarIcon className="h-5 w-5" />,
      activeIcon: <ChartBarIconSolid className="h-5 w-5" />,
    },
    {
      path: "notifications",
      label: t.notifications,
      icon: <BellIcon className="h-5 w-5" />,
      activeIcon: <BellIconSolid className="h-5 w-5" />,
      badge: unseenCount > 0 ? unseenCount : null,
    },
    {
      path: "profile",
      label: t.profile,
      icon: <UserCircleIcon className="h-5 w-5" />,
      activeIcon: <Cog6ToothIconSolid className="h-5 w-5" />,
      fullPath: "/admin/profile",
    },
  ];

  const isActive = (item) => {
    if (item.fullPath) {
      return location.pathname === item.fullPath;
    }
    if (item.exact) {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(`/admin/${item.path}`);
  };

  return (
    <motion.div
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      className={`relative ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-b from-white via-blue-50 to-white"
      } min-h-screen flex flex-col justify-between shadow-2xl border-r ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } backdrop-blur-lg transition-all duration-300 overflow-hidden`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header with Logo */}
      <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          {!collapsed || isHovering ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <BriefcaseIconSolid className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
                  {t.adminPanel}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Enterprise Edition
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg mx-auto">
              <BriefcaseIconSolid className="h-6 w-6 text-white" />
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            } transition-all duration-300`}
          >
            {collapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item);
            const isHovered = hoveredItem === item.path;
            
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                {item.fullPath ? (
                  <Link
                    to={item.fullPath}
                    className={`group relative flex items-center ${
                      collapsed ? "justify-center px-4" : "px-4"
                    } py-3 rounded-xl transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-800/80"
                        : "text-gray-600 hover:text-gray-900 hover:bg-blue-50"
                    }`}
                  >
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                      />
                    )}
                    
                    {/* Icon */}
                    <div className={`relative ${active ? "text-white" : "text-blue-500"}`}>
                      {active ? item.activeIcon : item.icon}
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Label */}
                    {(!collapsed || isHovering) && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`ml-3 font-medium text-sm ${
                          active ? "text-white" : darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    
                    {/* Hover arrow */}
                    {(isHovered && !active) && (!collapsed || isHovering) && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-4"
                      >
                        <ChevronDoubleRightIcon className="h-4 w-4 text-blue-400" />
                      </motion.div>
                    )}
                  </Link>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive: navActive }) => 
                      `group relative flex items-center ${
                        collapsed ? "justify-center px-4" : "px-4"
                      } py-3 rounded-xl transition-all duration-300 ${
                        navActive || active
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : darkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-800/80"
                          : "text-gray-600 hover:text-gray-900 hover:bg-blue-50"
                      }`
                    }
                  >
                    {/* Active indicator */}
                    {(active || isActive(item)) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                      />
                    )}
                    
                    {/* Icon */}
                    <div className={`relative ${active ? "text-white" : "text-blue-500"}`}>
                      {active ? item.activeIcon : item.icon}
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Label */}
                    {(!collapsed || isHovering) && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`ml-3 font-medium text-sm ${
                          active ? "text-white" : darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    
                    {/* Hover arrow */}
                    {(isHovered && !active) && (!collapsed || isHovering) && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-4"
                      >
                        <ChevronDoubleRightIcon className="h-4 w-4 text-blue-400" />
                      </motion.div>
                    )}
                  </NavLink>
                )}
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer with User Info and Logout */}
      <div className="px-4 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <AnimatePresence>
          {(!collapsed || isHovering) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 px-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    administrator@company.com
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className={`group flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 
          text-white font-medium shadow-lg shadow-red-500/20 
          hover:from-red-500 hover:to-red-400 hover:shadow-red-500/40 
          transition-all duration-300`}
        >
          {(!collapsed || isHovering) && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold"
            >
              {t.logout}
            </motion.span>
          )}
          <div className="flex items-center">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {(!collapsed || isHovering) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                className="ml-2 text-sm"
              >
                →
              </motion.span>
            )}
          </div>
        </motion.button>

        {/* Version */}
        <AnimatePresence>
          {(!collapsed || isHovering) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                v2.1.0 • Enterprise
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsed hover helper */}
      {collapsed && !isHovering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-50"></div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminSidebar;