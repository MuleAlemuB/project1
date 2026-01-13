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
        "Streamline employee management, attendance tracking, leave requests, and vacancy management with our integrated digital platform.",
      getStarted: "Get Started",
      features: {
        employee: {
          title: "Employee Management",
          desc: "Centralized employee database with automated workflows and comprehensive profile management.",
        },
        attendance: {
          title: "Attendance Tracking",
          desc: "Real-time attendance monitoring with automated reporting and compliance tracking.",
        },
        leave: {
          title: "Leave & Vacancy Management",
          desc: "Streamlined leave approval workflow and efficient vacancy announcement system.",
        },
      },
      footer:
        "© 2025 Debre Tabor University HR Management System. All Rights Reserved.",
      home: "Home",
      about: "About",
      vacancies: "Vacancies",
      login: "Login",
    },
    am: {
      title: "እንኳን ወደ ደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት በደህና መጡ",
      subtitle:
        "የሰራተኞች አስተዳደር፣ የመገኘት መከታተያ፣ የእረፍት ጥያቄዎች እና የቅጥር አስተዳደርን በአንድ የዲጂታል መድረክ ያስተዳድሩ።",
      getStarted: "ጀምር",
      features: {
        employee: {
          title: "የሰራተኞች አስተዳደር",
          desc: "የሰራተኞች መረጃ መዝገብ ከራስ-ሰር የስራ ሂደት እና የተሟላ መገለጫ አስተዳደር።",
        },
        attendance: {
          title: "መገኘት መከታተያ",
          desc: "በቀጥታ የመገኘት መከታተያ ከራስ-ሰር ሪፖርት እና ከህጋዊ መስፈርቶች ጋር።",
        },
        leave: {
          title: "እረፍት እና ቅጥር አስተዳደር",
          desc: "የእረፍት ማፅደቂያ ስርዓት እና ውጤታማ የቅጥር ማስታወቂያ ስርዓት።",
        },
      },
      footer:
        "© 2025 የደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት። መብቱ በሙሉ የተጠበቀ ነው።",
      home: "መነሻ",
      about: "ስለ ስርዓቱ",
      vacancies: "የስራ ቦታዎች",
      login: "ግባ",
    },
  };

  const t = translations[language];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100" : "bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 text-gray-800"}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/5 dark:to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* ===== Enhanced Navigation Bar ===== */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 ${darkMode 
          ? "bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-black/20" 
          : "bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 backdrop-blur-xl border-b border-blue-100/50 shadow-2xl shadow-blue-100/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo with enhanced styling */}
          <NavLink to="/" className="group flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`relative h-14 w-14 rounded-xl overflow-hidden p-1.5 ${darkMode 
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-lg" 
                : "bg-gradient-to-br from-blue-50 to-white border border-blue-200/50 shadow-lg shadow-blue-200/30"
              }`}
            >
              <div className={`absolute inset-0 rounded-lg ${darkMode ? "bg-gradient-to-br from-blue-600/20 to-indigo-600/20" : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10"}`} />
              <img
                src="/dtu-logo.jpg"
                alt="DTU Logo"
                className="relative h-full w-full object-contain rounded-lg"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                Debre Tabor University
              </span>
              <span className={`text-xs font-semibold tracking-wide ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                HR MANAGEMENT SYSTEM
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 relative ${isActive
                  ? `${darkMode ? "text-blue-400" : "text-blue-600"} font-semibold`
                  : `${darkMode ? "text-gray-300 hover:text-blue-300" : "text-gray-600 hover:text-blue-500"}`
                }`
              }
            >
              {t.home}
            </NavLink>
            <NavLink
              to="/vacancies"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 relative ${isActive
                  ? `${darkMode ? "text-blue-400" : "text-blue-600"} font-semibold`
                  : `${darkMode ? "text-gray-300 hover:text-blue-300" : "text-gray-600 hover:text-blue-500"}`
                }`
              }
            >
              {t.vacancies}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 relative ${isActive
                  ? `${darkMode ? "text-blue-400" : "text-blue-600"} font-semibold`
                  : `${darkMode ? "text-gray-300 hover:text-blue-300" : "text-gray-600 hover:text-blue-500"}`
                }`
              }
            >
              {t.about}
            </NavLink>

            {/* Action Buttons with enhanced styling */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl ${darkMode 
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:from-gray-700 hover:to-gray-800" 
                  : "bg-gradient-to-br from-white to-blue-50 border border-blue-200/50 hover:from-blue-50 hover:to-white"
                } shadow-lg transition-all duration-300`}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-400 drop-shadow-lg" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-indigo-600 drop-shadow-lg" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === "en" ? "am" : "en")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${darkMode 
                  ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 text-gray-300 hover:from-gray-700/70 hover:to-gray-800/70 hover:text-white"
                  : "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200/50 text-blue-700 hover:from-blue-100/70 hover:to-indigo-100/70 hover:text-blue-900"
                } shadow-lg`}
              >
                {language === "en" ? "አማ" : "EN"}
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to="/login"
                  className={`font-medium px-7 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${darkMode 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-900/30"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30"
                  } hover:shadow-xl`}
                >
                  {t.login}
                </NavLink>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ===== Enhanced Hero Section ===== */}
      <main className="flex-grow relative">
        <section className={`relative py-24 overflow-hidden ${darkMode 
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" 
          : "bg-gradient-to-b from-blue-50/50 via-white to-indigo-50/50"
        }`}>
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode 
                  ? "from-blue-400 via-indigo-400 to-purple-400" 
                  : "from-blue-600 via-indigo-600 to-purple-600"
                } animate-gradient-x bg-[length:200%_auto]`}>
                  {t.title}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`text-xl max-w-3xl mx-auto mb-12 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t.subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to="/login"
                  className={`inline-flex items-center px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl ${darkMode 
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-900/40"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-500/40"
                  } hover:shadow-3xl`}
                >
                  {t.getStarted}
                  <motion.svg 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-3 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </motion.svg>
                </NavLink>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== Enhanced Features Section ===== */}
        <section className={`py-24 relative ${darkMode 
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-b from-white via-blue-50/30 to-white"
        }`}>
          <div className="absolute inset-0">
            <div className={`absolute inset-0 ${darkMode 
              ? "bg-gradient-to-br from-indigo-900/10 via-blue-900/5 to-purple-900/10" 
              : "bg-gradient-to-br from-blue-100/20 via-indigo-100/10 to-purple-100/20"
            }`} />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`text-4xl font-bold text-center mb-16 ${darkMode 
                ? "text-white" 
                : "text-gray-900"
              }`}
            >
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode 
                ? "from-blue-400 to-indigo-400" 
                : "from-blue-600 to-indigo-600"
              }`}>
                {language === "en" ? "Core Features" : "ዋና ዋና ባህሪያት"}
              </span>
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              {Object.values(t.features).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`relative rounded-2xl backdrop-blur-sm p-8 transition-all duration-500 shadow-2xl ${darkMode 
                    ? "bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 hover:border-blue-500/50"
                    : "bg-gradient-to-br from-white/80 via-white/60 to-white/80 border border-blue-200/50 hover:border-blue-300/70"
                  } hover:shadow-3xl`}
                >
                  <div className={`absolute inset-0 rounded-2xl ${darkMode 
                    ? "bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10" 
                    : "bg-gradient-to-br from-blue-100/20 via-indigo-100/10 to-purple-100/20"
                  }`} />
                  
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-xl ${darkMode 
                        ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30" 
                        : "bg-gradient-to-br from-blue-100 to-indigo-100"
                      } flex items-center justify-center mb-6`}
                    >
                      <div className={`w-10 h-10 ${darkMode 
                        ? "text-blue-400 drop-shadow-lg" 
                        : "text-blue-600 drop-shadow-lg"
                      }`}>
                        {index === 0 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8A2.5 2.5 0 1121 10.5 2.5 2.5 0 0118.5 8z" />
                          </svg>
                        )}
                        {index === 1 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {index === 2 && (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        )}
                      </div>
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold mb-4 ${darkMode 
                      ? "text-white" 
                      : "text-gray-900"
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${darkMode 
                      ? "text-gray-300" 
                      : "text-gray-700"
                    }`}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Enhanced CTA Section ===== */}
        <section className={`py-24 relative overflow-hidden ${darkMode 
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" 
          : "bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10"
        }`}>
          <div className="absolute inset-0">
            <div className={`absolute inset-0 ${darkMode 
              ? "bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-purple-900/20" 
              : "bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10"
            }`} />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl font-bold mb-8 ${darkMode 
                ? "text-white" 
                : "text-gray-900"
              }`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode 
                  ? "from-blue-400 to-indigo-400" 
                  : "from-blue-600 to-indigo-600"
                }`}>
                  {language === "en" ? "Ready to Transform Your HR Management?" : "የሰው ኃይል አስተዳደርዎን ለመቀየር ዝግጁ ነዎት?"}
                </span>
              </h2>
              <p className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${darkMode 
                ? "text-gray-300" 
                : "text-gray-700"
              }`}>
                {language === "en" 
                  ? "Join Debre Tabor University in modernizing human resource management with our comprehensive digital solution."
                  : "የደብረ ታቦር ዩኒቨርሲቲን በዘመናዊ የሰው ኃይል አስተዳደር መፈፀሚያ አማካይነት ተቀላቀሉ።"}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to="/login"
                  className={`inline-flex items-center px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-2xl ${darkMode 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-900/40"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/40"
                  } hover:shadow-3xl`}
                >
                  {language === "en" ? "Access System Portal" : "የስርዓት ፖርታል ይግቡ"}
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NavLink>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ===== Enhanced Footer ===== */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`py-10 border-t backdrop-blur-md ${darkMode 
          ? "bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border-gray-800/50 text-gray-400"
          : "bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 border-blue-200/50 text-gray-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-lg overflow-hidden p-1 ${darkMode 
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50" 
                  : "bg-gradient-to-br from-blue-50 to-white border border-blue-200/50"
                } shadow-lg`}>
                  <img
                    src="/dtu-logo.jpg"
                    alt="DTU Logo"
                    className="h-full w-full object-contain rounded-md"
                  />
                </div>
                <div>
                  <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Debre Tabor University
                  </span>
                  <span className={`block text-xs font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                    HR MANAGEMENT SYSTEM
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm font-medium mb-2">{t.footer}</p>
              <p className={`text-xs max-w-md ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                {language === "en" 
                  ? "A comprehensive human resource management solution for higher education institutions."
                  : "ለከፍተኛ ትምህርት ተቋማት የተሟላ የሰው ኃይል አስተዳደር መፍትሄ።"}
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;