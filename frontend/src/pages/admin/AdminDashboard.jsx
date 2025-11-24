// =========================================================
//  ADMIN DASHBOARD  (Persistent User + Token + Stats Fix)
// =========================================================

import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaBell,
  FaMoon,
  FaSun,
  FaGlobe,
} from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import logo from "../../assets/logo.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";

// Translations
const translations = {
  en: {
    employees: "Employees",
    departments: "Departments",
    activeVacancies: "Active Vacancies",
    approvedLeaves: "Approved Leaves",
    recentApplications: "Recent Applications",
    recentVacancies: "Recent Vacancies",
    welcome: "Welcome",
    downloadCV: "Download CV",
    logout: "Logout",
    noItems: "No items",
    loadingDashboard: "Loading dashboard...",
    notificationError: "Failed to load notifications",
    statsError: "Failed to load stats",
  },
  am: {
    employees: "ሰራተኞች",
    departments: "ክፍሎች",
    activeVacancies: "ንግድ ቦታዎች",
    approvedLeaves: "የተፈቀደ ፈቃድ",
    recentApplications: "የቅርብ ማመልከቻዎች",
    recentVacancies: "የቅርብ ቦታዎች",
    welcome: "እንኳን ደህና መጡ",
    downloadCV: "CV አውርድ",
    logout: "ውጣ",
    noItems: "አንድም ነገር የለም",
    loadingDashboard: "ዳሽቦርድ እየተጫነ ነው...",
    notificationError: "ማሳወቂያዎችን ማንበብ አልተቻለም",
    statsError: "ስታቲስቲክ መረጃን ማንበብ አልተቻለም",
  },
};

const AdminDashboard = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();
  const { logoutUser, setUser, setToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const t = translations[language];

  // Load user and token from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      navigate("/login");
    }
  }, [setUser, setToken, navigate]);

  const user = JSON.parse(localStorage.getItem("user")) || { username: "Admin" };
  const token = localStorage.getItem("token");
  const adminName = user?.username || user?.name || "Admin";

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("language", language);
  }, [darkMode, language]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          totalEmployees: res.data.totalEmployees,
          totalDepartments: res.data.totalDepartments,
          totalLeaves: res.data.totalLeaves,
          activeVacanciesCount: res.data.activeVacancies || 0,
          recentApplications: res.data.recentApplications || [],
          recentVacancies: res.data.recentVacancies || [],
        });
      } catch (err) {
        console.error(err);
        setMessage(t.statsError);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, t.statsError]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.filter((n) => !n.seen));
      } catch (err) {
        console.error(err);
        setMessage(t.notificationError);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token, t.notificationError]);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "en" ? "am" : "en");

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gradient-to-r from-blue-50 via-blue-100 to-gray-100">
        <p className="text-gray-700 text-xl font-semibold animate-pulse">{t.loadingDashboard}</p>
      </div>
    );

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 text-gray-900"
      } min-h-screen w-full flex flex-col font-sans transition-colors duration-500`}
    >
      {/* HEADER */}
      <header
        className={`${
          darkMode ? "bg-gray-800/80" : "bg-white/80"
        } sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center p-6 backdrop-blur-md shadow-xl border-b border-gray-200`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md flex items-center justify-center bg-white">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-700 tracking-wide">DTU HRMS</h1>
            <p className="text-sm text-gray-600">
              {t.welcome}, <span className="font-semibold text-blue-700">{adminName}</span> |{" "}
              <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaGlobe className="text-xl" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>

          <button
            className="relative text-gray-700 hover:text-blue-600 transition"
            onClick={() => navigate("/admin/notifications")}
          >
            <FaBell className="text-2xl" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105 flex items-center gap-2"
          >
            <RiLogoutBoxRLine className="text-lg" />
            {t.logout}
          </button>
        </div>
      </header>

      {message && <div className="w-full p-4 text-center bg-red-500 text-white font-semibold">{message}</div>}

      {/* DASHBOARD CARDS */}
      <main className="p-8 flex-1 space-y-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          <StatCard
            icon={<FaUsers className="text-5xl text-blue-500" />}
            title={t.employees}
            value={stats?.totalEmployees || 0}
            darkMode={darkMode}
            borderColor="border-blue-500"
          />
          <StatCard
            icon={<FaBuilding className="text-5xl text-sky-500" />}
            title={t.departments}
            value={stats?.totalDepartments || 0}
            darkMode={darkMode}
            borderColor="border-sky-500"
          />
          <StatCard
            icon={<MdOutlineWorkOutline className="text-5xl text-indigo-500" />}
            title={t.activeVacancies}
            value={stats?.activeVacanciesCount || 0}
            darkMode={darkMode}
            borderColor="border-indigo-500"
          />
          <StatCard
            icon={<FaCheckCircle className="text-5xl text-teal-500" />}
            title={t.approvedLeaves}
            value={stats?.totalLeaves || 0}
            darkMode={darkMode}
            borderColor="border-teal-500"
          />
        </div>

        {/* RECENT APPLICATIONS */}
        <SectionCard
          title={t.recentApplications}
          items={stats?.recentApplications}
          darkMode={darkMode}
          isApplication={true}
          language={language}
        />

        {/* RECENT VACANCIES */}
        <SectionCard
          title={t.recentVacancies}
          items={stats?.recentVacancies}
          darkMode={darkMode}
          isApplication={false}
          language={language}
        />
      </main>

      {/* FOOTER */}
      <footer
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-blue-800 text-white"} p-4 text-center`}
      >
        © {new Date().getFullYear()} Debre Tabor University - HRMS
      </footer>
    </div>
  );
};

// STAT CARD
const StatCard = ({ icon, title, value, darkMode, borderColor }) => (
  <div
    className={`${
      darkMode ? "bg-gray-700/80" : "bg-white/70"
    } backdrop-blur-md rounded-3xl shadow-lg p-6 flex items-center gap-5 border-l-8 ${borderColor} hover:shadow-xl hover:scale-105 transition-transform duration-300`}
  >
    {icon}
    <div>
      <p className="text-gray-500 text-sm uppercase tracking-wide">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

// SECTION CARD

const SectionCard = ({ title, items, darkMode, isApplication = false, language, translations }) => {
  // Helper function to safely format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toDateString();
  };

  return (
    <section>
      <h2
        className={`${
          darkMode ? "text-blue-300" : "text-blue-700"
        } text-2xl font-bold mb-4 border-b-2 border-blue-500 pb-2`}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items?.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className={`${
                darkMode ? "bg-gray-700/70 text-white" : "bg-white/70 text-gray-900"
              } backdrop-blur-md rounded-2xl shadow-md p-4 flex flex-col gap-2 hover:shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-200`}
            >
              <p className="font-bold text-blue-700">
                {isApplication ? item.name : item.position || "N/A"}
              </p>

              {isApplication ? (
                <p className="text-blue-400 font-semibold">
                  {item.vacancy?.position || "N/A"}
                </p>
              ) : (
                <p className="text-blue-400 font-semibold">
                  {formatDate(item.postDate || item.createdAt)}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} italic text-sm`}>
            {translations?.[language]?.noItems || "No items available"}
          </p>
        )}
      </div>
    </section>
  );
};




export default AdminDashboard;
