// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BriefcaseIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  BellIcon as BellIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../contexts/SettingsContext";

const translations = {
  en: {
    dashboard: "Dashboard",
    manageEmployees: "Manage Employees",
    manageDepartments: "Manage Departments",
    vacancies: "Vacancies",
    reports: "Analytics",
    notifications: "Notifications",
    profile: "My Profile",
    adminPanel: "HRMS Admin",
    quickActions: "Quick Actions",
    addEmployee: "Add Employee",
    viewReports: "View Reports",
    online: "Online",
    version: "v2.1.0",
  },
  am: {
    dashboard: "ዳሽቦርድ",
    manageEmployees: "ሰራተኞችን አስተዳደር",
    manageDepartments: "የክፍሎችን አስተዳደር",
    vacancies: "ቦታዎች",
    reports: "ትንታኔ",
    notifications: "ማሳወቂያዎች",
    profile: "ፕሮፋይሌ",
    adminPanel: "HRMS አስተዳደር",
    quickActions: "ፈጣን ተግባራት",
    addEmployee: "ሰራተኛ ጨምር",
    viewReports: "ሪፖርቶች ይመልከቱ",
    online: "በመስመር ላይ",
    version: "v2.1.0",
  },
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { darkMode, language } = useSettings();
  const location = useLocation();
  const t = translations[language];

  const menuItems = [
    { 
      name: t.dashboard, 
      to: "/admin/dashboard", 
      icon: <HomeIcon className="h-5 w-5" />,
      activeIcon: <HomeIconSolid className="h-5 w-5" />,
      exact: true
    },
    { 
      name: t.manageEmployees, 
      to: "/admin/manage-employees", 
      icon: <UserGroupIcon className="h-5 w-5" />,
      activeIcon: <UserGroupIconSolid className="h-5 w-5" />
    },
    { 
      name: t.manageDepartments, 
      to: "/admin/manage-departments", 
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      activeIcon: <BuildingOfficeIconSolid className="h-5 w-5" />
    },
    { 
      name: t.vacancies, 
      to: "/admin/vacancies", 
      icon: <BriefcaseIcon className="h-5 w-5" />,
      activeIcon: <BriefcaseIconSolid className="h-5 w-5" />
    },
    { 
      name: t.reports, 
      to: "/admin/reports", 
      icon: <ChartBarIcon className="h-5 w-5" />,
      activeIcon: <ChartBarIconSolid className="h-5 w-5" />
    },
    { 
      name: t.notifications, 
      to: "/admin/notifications", 
      icon: <BellIcon className="h-5 w-5" />,
      activeIcon: <BellIconSolid className="h-5 w-5" />,
      badge: 3
    },
  ];

  const quickActions = [
    { 
      name: t.addEmployee, 
      to: "/admin/manage-employees?action=add",
      icon: <PlusCircleIcon className="h-4 w-4" />
    },
    { 
      name: t.viewReports, 
      to: "/admin/reports",
      icon: <DocumentChartBarIcon className="h-4 w-4" />
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        className={`relative ${
          darkMode
            ? "bg-gradient-to-b from-gray-800 to-gray-900"
            : "bg-gradient-to-b from-white to-gray-50"
        } flex flex-col shadow-2xl border-r ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition-all duration-300 overflow-hidden`}
      >
        {/* Header with Logo */}
        <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <div className="text-white font-bold">DTU</div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
                    {t.adminPanel}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Human Resource Management
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg mx-auto">
                <div className="text-white font-bold">D</div>
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
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions Section (visible when not collapsed) */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3"
            >
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                  {t.quickActions}
                </p>
              </div>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <NavLink
                    key={action.name}
                    to={action.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`
                    }
                  >
                    {action.icon}
                    <span className="truncate">{action.name}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item);
              
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <NavLink
                    to={item.to}
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
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`ml-3 font-medium text-sm ${
                          active ? "text-white" : darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                    
                    {/* Hover arrow */}
                    {(hoveredItem === item.name && !active) && !collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-4"
                      >
                        <ChevronRightIcon className="h-4 w-4 text-blue-400" />
                      </motion.div>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer */}
        <div className="px-4 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
          {/* Profile Section */}
          <div className="relative">
            <NavLink
              to="/admin/profile"
              className={`flex items-center ${
                collapsed ? "justify-center" : "justify-between"
              } w-full p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              } transition-colors duration-200`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <UserCircleIconSolid className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                {!collapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {t.online}
                    </p>
                  </div>
                )}
              </div>
              
              {!collapsed && (
                <Cog6ToothIcon className="h-4 w-4 text-gray-400" />
              )}
            </NavLink>
          </div>

          {/* Version */}
          {!collapsed && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.version} • DTU HRMS © {new Date().getFullYear()}
              </p>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;