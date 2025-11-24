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
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800"
      }`}
    >
      {/* ===== Navbar ===== */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md ${
          darkMode ? "bg-gray-900/90 text-gray-100" : "bg-white/90 text-gray-800"
        } backdrop-blur-lg rounded-b-xl`}
      >
        {/* Logo Container */}
        <NavLink to="/" className="flex items-center space-x-3">
          <div
            className={`h-14 w-14 rounded-full overflow-hidden flex items-center justify-center border-2 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <motion.img
              src="/dtu-logo.jpg"
              alt="DTU Logo"
              className="h-full w-full object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 250 }}
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            DTU HRMS
          </span>
        </NavLink>

        <div className="flex items-center space-x-5">
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
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold shadow-md"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            }
          >
            {t.login}
          </NavLink>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform duration-300"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-indigo-500" />
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            className="px-3 py-1 rounded-full border border-indigo-400 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-300 font-semibold"
          >
            {language === "en" ? "Amharic" : "English"}
          </button>
        </div>
      </motion.nav>

      {/* ===== Hero Section ===== */}
      <header
        className={`relative flex-grow flex flex-col justify-center items-center text-center py-24 px-6 overflow-hidden ${
          darkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-blue-400/10 to-purple-500/20 -z-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/30 dark:bg-indigo-700/30 blur-3xl opacity-30 rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/30 dark:bg-purple-900/30 blur-3xl opacity-30 rounded-full animate-pulse" />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            {t.title}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className={`text-lg md:text-xl max-w-2xl mb-10 leading-relaxed ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {t.subtitle}
        </motion.p>

        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}>
          <NavLink
            to="/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {t.getStarted}
          </NavLink>
        </motion.div>
      </header>

      {/* ===== Features Section ===== */}
      <section className={`py-20 px-6 ${darkMode ? "bg-gray-950" : "bg-indigo-50"}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {Object.values(t.features).map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`backdrop-blur-xl rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl border ${
                darkMode
                  ? "bg-gray-800/80 border-gray-700 text-gray-200"
                  : "bg-white/80 border-gray-100 text-gray-800"
              }`}
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                {feature.title}
              </h3>
              <p className="leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`py-6 text-center border-t ${
          darkMode
            ? "bg-gray-900 text-gray-300 border-gray-700"
            : "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        <p>{t.footer}</p>
      </motion.footer>
    </div>
  );
};

export default HomePage;
