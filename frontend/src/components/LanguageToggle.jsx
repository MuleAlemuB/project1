import React from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "am" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 border rounded-full text-sm transition hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {i18n.language === "en" ? "አማርኛ" : "English"}
    </button>
  );
};

export default LanguageToggle;
