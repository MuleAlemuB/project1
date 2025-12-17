import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  LockClosedIcon,
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const { darkMode, language } = useSettings();
  const navigate = useNavigate();

  // Load persisted values from localStorage if available
  const [email, setEmail] = useState(localStorage.getItem("loginEmail") || "");
  const [password, setPassword] = useState(localStorage.getItem("loginPassword") || "");
  const [role, setRole] = useState(localStorage.getItem("loginRole") || "admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const texts = {
    en: {
      login: "Login",
      email: "Email",
      password: "Password",
      selectRole: "Select Role",
      admin: "Admin",
      employee: "Employee",
      deptHead: "Department Head",
      university: "Debre Tabor University | Human Resource Management System",
      failed: "Login failed",
      backHome: "Back to Home",
      forgotPassword: "Forgot Password?",
    },
    am: {
      login: "መግቢያ",
      email: "ኢሜል",
      password: "የይለፍ ቃል",
      selectRole: "የሚገባውን ሚና ይምረጡ",
      admin: "አድሚን",
      employee: "ሰራተኛ",
      deptHead: "የመምሪያ ርዕሰ ክፍል",
      university: "ደብረ ታቦር ዩኒቨርሲቲ | የሰው ኃይል አስተዳደር ስርዓት",
      failed: "መግቢያ አልተሳካም",
      backHome: "ወደ መነሻ ገጽ ተመለስ",
      forgotPassword: "የይለፍ ቃል ይረሳል?",
    },
  };

  const t = texts[language];

  // Persist values in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("loginEmail", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("loginPassword", password);
  }, [password]);

  useEffect(() => {
    localStorage.setItem("loginRole", role);
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await loginUser(email, password, role);
      const path =
        userData.role.toLowerCase() === "departmenthead"
          ? "/departmenthead/dashboard"
          : `/${userData.role.toLowerCase()}/dashboard`;
      navigate(path);
    } catch (err) {
      setError(err.message || t.failed);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen transition-colors duration-700 overflow-hidden ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Back to Home */}
      <div className="absolute top-5 left-5 z-20">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-2 font-semibold px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition ${
            darkMode
              ? "bg-gray-700/80 text-gray-100 hover:bg-gray-600/90"
              : "bg-white/80 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          &#8592; {t.backHome}
        </button>
      </div>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/dtu-campus.jpg"
          alt="DTU Background"
          className="w-full h-full object-cover brightness-75 dark:brightness-50"
        />
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gray-900/70"
              : "bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-400/20"
          }`}
        ></div>
      </div>

      {/* Login Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className={`relative p-10 rounded-3xl shadow-2xl w-96 border backdrop-blur-2xl transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/80 border-gray-700 text-gray-100"
            : "bg-white/80 border-gray-200 text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <AcademicCapIcon
              className={`h-8 w-8 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
            />
            <h1 className="text-3xl font-bold">{t.login}</h1>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}

        {/* Email */}
        <div className="relative mb-4">
          <UserIcon
            className={`absolute left-3 top-3 w-6 h-6 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          />
          <motion.input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            className={`w-full pl-10 p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-indigo-300"
                : "bg-gray-50 text-gray-900 border-gray-200 focus:ring-indigo-400"
            }`}
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <LockClosedIcon
            className={`absolute left-3 top-3 w-6 h-6 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          />
          <motion.input
            type={showPassword ? "text" : "password"} 
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            className={`w-full pl-10 pr-10 p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-indigo-300"
                : "bg-gray-50 text-gray-900 border-gray-200 focus:ring-indigo-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 w-6 h-6 text-gray-500 hover:text-indigo-500 transition"
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className={`text-sm font-semibold underline hover:opacity-80 transition ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            {t.forgotPassword}
          </button>
        </div>

        {/* Role */}
        <motion.select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          whileFocus={{ scale: 1.02 }}
          className={`w-full p-3 mb-6 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
            darkMode
              ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-indigo-300"
              : "bg-gray-50 text-gray-900 border-gray-200 focus:ring-indigo-400"
          }`}
        >
          <option value="admin">{t.admin}</option>
          <option value="employee">{t.employee}</option>
          <option value="departmenthead">{t.deptHead}</option>
        </motion.select>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(79,70,229,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          {t.login}
        </motion.button>

        {/* Footer */}
        <p
          className={`text-center mt-6 text-sm transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t.university}
        </p>
      </motion.form>
    </div>
  );
};

export default LoginPage;
