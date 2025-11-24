import React, { useEffect, useState, useContext } from "react";
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

// ================== TRANSLATIONS ==================
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

// ================== MAIN COMPONENT ==================
const DeptHeadDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const [deptName, setDeptName] = useState("");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Dept Head";

  // -------------------- FETCH DATA --------------------
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const deptId = user.department?._id || user.department;

        // Fetch department name
        let departmentName = "Unknown Department";
        if (deptId) {
          try {
            const deptRes = await axiosInstance.get(`/departments/${deptId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            departmentName = deptRes.data?.name || "Unknown Department";
          } catch (err) {
            console.warn("Failed to fetch department name:", err.message);
          }
        }
        setDeptName(departmentName);

        // Fetch employees
        let empRes = { data: [] };
        try {
          empRes = await axiosInstance.get(
            `/employees/department?department=${deptId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Error fetching employees:", err.response?.data || err.message);
        }

        // Pending leaves
        let leaveRes = { data: [] };
        try {
          leaveRes = await axiosInstance.get(
            `/leave/requests?department=${deptId}&status=pending`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.warn("Leave requests fetch failed:", err.response?.data || err.message);
        }

        // Notifications
        let notiRes = { data: [] };
        try {
          notiRes = await axiosInstance.get("/notifications/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.warn("Notifications fetch failed:", err.response?.data || err.message);
        }

        setStats({
          totalEmployees: empRes.data?.length || 0,
          pendingLeaves: leaveRes.data?.length || 0,
          notifications: notiRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // -------------------- LOGOUT --------------------
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 animate-pulse text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  const t = translations[language];

  return (
    <div
      className={`min-h-screen font-sans transition-all duration-500 ${
        darkMode
          ? "bg-gray-900 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800"
      }`}
    >
      {/* ================= NAVBAR ================= */}
      <header
        className={`flex justify-between items-center p-6 shadow-xl backdrop-blur-lg 
        ${darkMode ? "bg-gray-800/80" : "bg-white/80"} rounded-b-2xl`}
      >
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="DTU Logo"
            className={`w-16 h-16 rounded-full shadow-md object-cover border-2 ${
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

          {/* DISPLAY NAME */}
          <p className="font-semibold tracking-wide">{displayName}</p>

          {/* DEPARTMENT */}
          <p className="flex items-center gap-1 text-gray-400 font-medium">
            <FaBuilding /> {deptName}
          </p>

          {/* LANGUAGE */}
          <button
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border shadow-md
              transition-all duration-300 hover:scale-105 ${
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
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300
              flex items-center gap-2 shadow-md hover:scale-105 ${
                darkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-white border border-blue-400 text-blue-600 hover:bg-blue-100"
              }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}{" "}
            {darkMode ? "Light" : "Dark"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 
            rounded-xl shadow-lg text-white font-semibold transition-all duration-300 
            hover:scale-105"
          >
            <FaSignOutAlt /> {t.logout}
          </button>
        </div>
      </header>

      {/* ================= WELCOME SECTION ================= */}
      <section
        className={`p-10 my-10 mx-6 rounded-3xl shadow-xl backdrop-blur-lg transition-all 
        duration-500 hover:shadow-2xl ${
          darkMode
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-gradient-to-r from-blue-200 to-blue-100"
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

      {/* ================= STATS GRID ================= */}
      <section className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <StatCard
          icon={<FaUsers className="text-4xl text-blue-600" />}
          title={t.totalEmployees}
          value={stats.totalEmployees}
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaCalendarCheck className="text-4xl text-blue-600" />}
          title={t.pendingLeaves}
          value={stats.pendingLeaves}
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaBell className="text-4xl text-blue-600" />}
          title={t.notifications}
          value={stats.notifications}
          darkMode={darkMode}
        />
      </section>
    </div>
  );
};

// ================== STAT CARD COMPONENT ==================
const StatCard = ({ icon, title, value, darkMode }) => (
  <div
    className={`flex items-center gap-5 p-8 rounded-2xl shadow-xl transform 
      transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer
      backdrop-blur-lg ${
        darkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/80 border"
      }`}
  >
    <div
      className={`w-20 h-20 flex justify-center items-center rounded-full shadow-inner 
        ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}
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
        className={`text-4xl font-bold mt-1 ${
          darkMode ? "text-blue-300" : "text-blue-700"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default DeptHeadDashboard;
