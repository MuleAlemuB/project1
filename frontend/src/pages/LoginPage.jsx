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

  // Load all persisted values from localStorage
  const [formData, setFormData] = useState({
    email: localStorage.getItem("loginEmail") || "",
    password: localStorage.getItem("loginPassword") || "",
    role: localStorage.getItem("loginRole") || "admin",
    showPassword: false,
  });

  const [error, setError] = useState("");

  const texts = {
    en: {
      login: "Login",
      email: "Email Address",
      password: "Password",
      selectRole: "Select Role",
      admin: "Administrator",
      employee: "Employee",
      deptHead: "Department Head",
      university: "Debre Tabor University | Human Resource Management System",
      failed: "Login failed. Please check your credentials.",
      backHome: "Back to Home",
      rememberMe: "Remember me",
    },
    am: {
      login: "መግቢያ",
      email: "የኢሜል አድራሻ",
      password: "የይለፍ ቃል",
      selectRole: "ሚና ይምረጡ",
      admin: "አስተዳዳሪ",
      employee: "ሰራተኛ",
      deptHead: "የመምሪያ ርዕሰ ክፍል",
      university: "ደብረ ታቦር ዩኒቨርሲቲ | የሰው ኃይል አስተዳደር ስርዓት",
      failed: "መግቢያ አልተሳካም። መለያ መረጃዎትን ያረጋግጡ።",
      backHome: "ወደ መነሻ ገጽ",
      rememberMe: "አስታውሰኝ",
    },
  };

  const t = texts[language];

  // Persist form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("loginEmail", formData.email);
    localStorage.setItem("loginPassword", formData.password);
    localStorage.setItem("loginRole", formData.role);
  }, [formData.email, formData.password, formData.role]);

  // Clear error when form data changes
  useEffect(() => {
    if (error) setError("");
  }, [formData.email, formData.password, formData.role]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setError(t.language === "en" 
        ? "Please fill in all fields" 
        : "እባክዎ ሁሉንም መስኮች ይሙሉ");
      return;
    }

    try {
      const userData = await loginUser(formData.email, formData.password, formData.role);
      const path =
        userData.role.toLowerCase() === "departmenthead"
          ? "/departmenthead/dashboard"
          : `/${userData.role.toLowerCase()}/dashboard`;
      navigate(path);
    } catch (err) {
      setError(err.message || t.failed);
    }
  };

  const togglePasswordVisibility = () => {
    handleInputChange("showPassword", !formData.showPassword);
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen transition-colors duration-700 overflow-hidden ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background with professional overlay */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-[url('/grid-dark.svg')] opacity-10"
              : "bg-[url('/grid-light.svg')] opacity-20"
          }`}
        />
      </div>

      {/* Professional header with back navigation */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-2 font-medium px-4 py-2.5 rounded-lg transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white"
              : "bg-white/70 text-gray-700 hover:bg-white hover:text-indigo-700 hover:shadow-md"
          } backdrop-blur-sm border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.backHome}
        </button>
        
        {/* University Badge */}
        <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-white/70'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <AcademicCapIcon className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className="font-semibold text-sm">DTU HRMS</span>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md px-6"
      >
        <form
          onSubmit={handleSubmit}
          className={`relative p-8 rounded-2xl shadow-2xl transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/80 text-gray-100 border border-gray-700/50"
              : "bg-white text-gray-900 border border-gray-100"
          } backdrop-blur-xl`}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{t.login}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.university}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.email}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/50 text-gray-100 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                    : "bg-gray-50 text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30"
                }`}
                placeholder="you@dtu.edu.et"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.password}
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <input
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/50 text-gray-100 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                    : "bg-gray-50 text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {formData.showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.selectRole}
            </label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border appearance-none focus:outline-none focus:ring-2 transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700/50 text-gray-100 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30"
                    : "bg-gray-50 text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30"
                }`}
              >
                <option value="admin">{t.admin}</option>
                <option value="employee">{t.employee}</option>
                <option value="departmenthead">{t.deptHead}</option>
              </select>
              <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 relative overflow-hidden group ${
              darkMode
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t.login}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </motion.button>

          {/* Security Notice */}
          <div className={`mt-6 pt-6 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p className={`text-xs text-center ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {language === "en" 
                ? "Your credentials are securely stored locally"
                : "የመግቢያ መረጃዎት በደህንነት በአካባቢዎ ይቀመጣሉ"}
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;