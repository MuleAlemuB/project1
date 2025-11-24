import React from "react";
import { useSettings } from "../contexts/SettingsContext";

const ThemeLanguageToggle = () => {
  const { darkMode, setDarkMode, language, setLanguage } = useSettings();

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === "en" ? "am" : "en");

  return (
    <div className="flex gap-3 items-center">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`px-3 py-1 rounded-md transition ${
          darkMode ? "bg-yellow-400 text-black" : "bg-gray-800 text-white"
        }`}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className={`px-3 py-1 rounded-md transition ${
          darkMode ? "bg-blue-400 text-black" : "bg-gray-800 text-white"
        }`}
      >
        {language === "en" ? "አማ" : "EN"}
      </button>
    </div>
  );
};

export default ThemeLanguageToggle;
