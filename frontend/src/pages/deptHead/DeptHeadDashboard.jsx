import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaUsers,
  FaCalendarCheck,
  FaBell,
  FaSignOutAlt,
  FaBuilding,
  FaMoon,
  FaSun,
  FaGlobe,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    welcome: "Welcome",
    totalEmployees: "Total Employees",
    pendingLeaves: "Pending Leaves",
    notifications: "Notifications",
    logout: "Logout",
    department: "Department",
  },
  am: {
    welcome: "እንኳን በደህና መጡ",
    totalEmployees: "ጠቅላላ ሰራተኞች",
    pendingLeaves: "የቆዩ ፈቃዶች",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    department: "ክፍል",
  },
};

const DeptHeadDashboard = () => {
  const { user: authUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const [deptHead, setDeptHead] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    if (!authUser) return;

    const fetchDeptHeadData = async () => {
      try {
        // 1️⃣ Fetch DeptHead profile
        const profileRes = await axiosInstance.get("/depthead/profile");
        const profile = profileRes.data;
        console.log("DeptHead Profile:", profile);
        setDeptHead(profile);

        // Use department name (backend expects name)
        const deptName = profile.department?.name || profile.department;
        console.log("Dept Name:", deptName);

        // 2️⃣ Fetch employees
        const empRes = await axiosInstance.get(
          `/employees/department?department=${encodeURIComponent(deptName)}`
        );
        const employees = Array.isArray(empRes.data) ? empRes.data : [];
        console.log("Employees:", employees);

        // 3️⃣ Fetch pending leaves for this department
        const leaveRes = await axiosInstance.get("/leave/requests");
        const pendingLeaves = Array.isArray(leaveRes.data) ? leaveRes.data : [];
        console.log("Pending Leaves:", pendingLeaves);

        // 4️⃣ Fetch notifications
        const notiRes = await axiosInstance.get("/notifications/my");
        const notifications = Array.isArray(notiRes.data) ? notiRes.data : [];
        console.log("Notifications:", notifications);

        // 5️⃣ Set dashboard stats
        setStats({
          totalEmployees: employees.length,
          pendingLeaves: pendingLeaves.length,
          notifications: notifications.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeptHeadData();
  }, [authUser]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!deptHead || loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 animate-pulse text-xl font-semibold">
        Loading dashboard...
      </div>
    );

  const displayName = `${deptHead.firstName} ${deptHead.lastName}`;
  const deptName = deptHead.department?.name || deptHead.department || "N/A";

  return (
    <div
      className={`min-h-screen font-sans transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 text-gray-800"
      }`}
    >
      {/* NAVBAR */}
      <header
        className={`flex justify-between items-center p-6 shadow-2xl backdrop-blur-xl ${
          darkMode
            ? "bg-gray-800/70 border-b border-gray-700"
            : "bg-white/70 border-b border-blue-200"
        } rounded-b-3xl`}
      >
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="DTU Logo"
            className={`w-16 h-16 rounded-full shadow-xl object-cover border-2 ${
              darkMode ? "border-gray-500" : "border-blue-400"
            }`}
          />
          <h1
            className={`text-3xl font-extrabold tracking-wide ${
              darkMode ? "text-blue-300" : "text-blue-700"
            }`}
          >
            DTU HRMS
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <p className="font-semibold tracking-wide">{displayName}</p>
          <p className="flex items-center gap-1 text-gray-400 font-medium">
            <FaBuilding /> {deptName}
          </p>

          {/* LANGUAGE */}
          <button
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border shadow-md transition-all duration-300 hover:scale-105 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-blue-300 text-gray-800"
            }`}
          >
            <FaGlobe /> {language.toUpperCase()}
          </button>

          {/* THEME */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 ${
              darkMode
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-white border border-blue-400 text-blue-600 hover:bg-blue-100"
            }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 hover:scale-105"
          >
            <FaSignOutAlt /> {t.logout}
          </button>
        </div>
      </header>

      {/* WELCOME SECTION */}
      <section
        className={`p-10 my-10 mx-6 rounded-3xl shadow-3xl backdrop-blur-xl transition-all duration-500 hover:shadow-4xl border border-opacity-30 ${
          darkMode
            ? "bg-gray-800/70 border-gray-700"
            : "bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 border-blue-200"
        }`}
      >
        <h2
          className={`text-4xl font-extrabold mb-2 tracking-wide ${
            darkMode ? "text-blue-300" : "text-blue-800"
          }`}
        >
          {t.welcome}, {displayName}!
        </h2>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg`}>
          {t.department}: {deptName}
        </p>
      </section>

      {/* STATS GRID */}
      <section className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <StatCard
          icon={<FaUsers className="text-6xl text-blue-400 glow" />}
          title={t.totalEmployees}
          value={stats.totalEmployees}
          darkMode={darkMode}
          color="blue"
        />
        <StatCard
          icon={<FaCalendarCheck className="text-6xl text-green-400 glow" />}
          title={t.pendingLeaves}
          value={stats.pendingLeaves}
          darkMode={darkMode}
          color="green"
        />
        <StatCard
          icon={<FaBell className="text-6xl text-yellow-400 glow" />}
          title={t.notifications}
          value={stats.notifications}
          darkMode={darkMode}
          color="yellow"
        />
      </section>
    </div>
  );
};

// STAT CARD COMPONENT
const StatCard = ({ icon, title, value, darkMode, color }) => (
  <div
    className={`flex items-center gap-6 p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-4xl cursor-pointer backdrop-blur-xl ${
      darkMode
        ? "bg-gray-800/70 border border-gray-700"
        : `bg-white/80 border border-${color}-200`
    }`}
  >
    <div
      className={`w-24 h-24 flex justify-center items-center rounded-full shadow-inner ${
        darkMode ? "bg-gray-700" : `bg-${color}-100`
      }`}
    >
      {icon}
    </div>

    <div>
      <p
        className={`text-sm uppercase tracking-wide ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {title}
      </p>
      <p
        className={`text-5xl font-extrabold mt-2 ${
          darkMode ? "text-blue-300" : `text-${color}-600`
        }`}
      >
        {value || 0}
      </p>
    </div>
  </div>
);

export default DeptHeadDashboard;
