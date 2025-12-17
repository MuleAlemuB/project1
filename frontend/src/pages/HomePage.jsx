import React from "react";
import { NavLink } from "react-router-dom";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useSettings } from "../contexts/SettingsContext";

const HomePage = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const translations = {
    en: {
      title: "Welcome to Debre Tabor University HR Management System",
      subtitle:
        "Manage employees, attendance, leaves, and vacancies with a seamless, modern digital solution.",
      getStarted: "Get Started",
      features: {
        employee: {
          title: "Employee Management",
          desc: "Easily register, update, and track employee data with automation.",
        },
        attendance: {
          title: "Attendance Tracking",
          desc: "Simplified attendance records with smart HR notifications.",
        },
        leave: {
          title: "Leave & Vacancy Management",
          desc: "Handle leave requests and publish vacancies effortlessly.",
        },
      },
      footer:
        "© 2025 Debre Tabor University Employee Management System. All rights reserved.",
      home: "Home",
      about: "About",
      vacancies: "Vacancies",
      login: "Login",
    },
    am: {
      title: "እንኳን ወደ ደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት በደህና መጡ",
      subtitle:
        "ሰራተኞችን፣ መገኘትን፣ የእረፍት ጥያቄዎችን እና ቅጥርን በቀላሉ እና በዘመናዊ መንገድ ያስተዳድሩ።",
      getStarted: "ጀምር",
      features: {
        employee: {
          title: "የሰራተኞች አስተዳደር",
          desc: "ሰራተኞችን በቀላሉ ያክሉ፣ ያሻሽሉ እና ይከታተሉ።",
        },
        attendance: {
          title: "መገኘት መከታተያ",
          desc: "የሰራተኞችን መገኘት በቀላሉ ያስተዳድሩ።",
        },
        leave: {
          title: "እረፍት እና ቅጥር አስተዳደር",
          desc: "የእረፍት ጥያቄዎችን ያጽዱ እና የቅጥር ማስታወቂያዎችን ያስቀምጡ።",
        },
      },
      footer:
        "© 2025 የደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት። መብቱ በፍጹም ይጠበቃል።",
      home: "መነሻ",
      about: "ስለ ስርዓቱ",
      vacancies: "የስራ ቦታዎች",
      login: "ግባ",
    },
  };

  const t = translations[language];

  const activeClass =
    "text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-500";

  const inactiveClass = "hover:text-indigo-500 font-medium transition-colors";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-700 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
      }`}
    >
      {/* ===== Enhanced Navbar ===== */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className={`px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl ${
          darkMode 
            ? "bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 text-gray-100 border-b border-gray-700" 
            : "bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 text-gray-800 border-b border-indigo-100"
        } backdrop-blur-xl rounded-b-3xl`}
      >
        {/* Enhanced Logo Container */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`h-16 w-16 rounded-2xl overflow-hidden flex items-center justify-center p-1 ${
              darkMode 
                ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/50 shadow-lg shadow-indigo-900/20" 
                : "bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 shadow-lg shadow-blue-200/50"
            }`}
          >
            <motion.img
              src="/dtu-logo.jpg"
              alt="DTU Logo"
              className="h-full w-full object-contain rounded-xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 250 }}
            />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            DTU HRMS
          </motion.span>
        </NavLink>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            {t.home}
          </NavLink>
          <NavLink
            to="/vacancies"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            {t.vacancies}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            {t.about}
          </NavLink>
          
          {/* Enhanced Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/50"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300"
              }
            >
              {t.login}
            </NavLink>
          </motion.div>

          {/* Enhanced Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl ${
              darkMode 
                ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30" 
                : "bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200"
            } shadow-lg transition-all duration-300`}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400 drop-shadow-lg" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-600 drop-shadow-lg" />
            )}
          </motion.button>

          {/* Enhanced Language toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
              darkMode
                ? "bg-gradient-to-r from-indigo-800/30 to-purple-800/30 border border-indigo-700/50 text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-700/50 hover:to-purple-700/50 hover:text-white"
                : "bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200 text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-200 hover:to-blue-200 hover:text-indigo-900"
            } shadow-lg`}
          >
            {language === "en" ? "አማ" : "EN"}
          </motion.button>
        </div>
      </motion.nav>

      {/* ===== Enhanced Hero Section ===== */}
      <header
        className={`relative flex-grow flex flex-col justify-center items-center text-center py-24 px-6 overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
        }`}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            darkMode 
              ? "from-indigo-600/10 via-purple-600/5 to-blue-600/10" 
              : "from-indigo-400/10 via-blue-400/5 to-purple-400/10"
          }`} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl rounded-full animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
          className="relative max-w-5xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-400 dark:via-blue-400 dark:to-purple-400">
              {t.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className={`text-2xl md:text-3xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t.subtitle}
          </motion.p>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <NavLink
              to="/login"
              className="inline-block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white font-bold px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300 text-xl"
            >
              {t.getStarted}
            </NavLink>
          </motion.div>
        </motion.div>
      </header>

      {/* ===== Enhanced Features Section ===== */}
      <section className={`py-24 px-6 ${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-indigo-50 to-blue-50"}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {Object.values(t.features).map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl border-2 ${
                  darkMode
                    ? "bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-indigo-800/30 text-gray-200 hover:border-indigo-600/50"
                    : "bg-gradient-to-b from-white/90 to-blue-50/90 border-indigo-200/50 text-gray-800 hover:border-indigo-400/70"
                } transition-all duration-500`}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-2xl mb-6 ${
                    darkMode 
                      ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30" 
                      : "bg-gradient-to-r from-indigo-100 to-blue-100"
                  }`}
                >
                  <div className={`h-12 w-12 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`} />
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Enhanced Footer ===== */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`py-8 text-center border-t backdrop-blur-lg ${
          darkMode
            ? "bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 text-gray-300 border-gray-700"
            : "bg-gradient-to-r from-indigo-50/80 via-blue-50/80 to-purple-50/80 text-gray-700 border-indigo-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg font-medium">
            {t.footer}
          </p>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="mt-4 inline-flex items-center space-x-2"
          >
            <div className={`h-1 w-12 rounded-full ${
              darkMode ? "bg-indigo-600" : "bg-gradient-to-r from-indigo-500 to-blue-500"
            }`} />
            <div className={`h-1 w-12 rounded-full ${
              darkMode ? "bg-blue-600" : "bg-gradient-to-r from-blue-500 to-purple-500"
            }`} />
            <div className={`h-1 w-12 rounded-full ${
              darkMode ? "bg-purple-600" : "bg-gradient-to-r from-purple-500 to-indigo-500"
            }`} />
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;