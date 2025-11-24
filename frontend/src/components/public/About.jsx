import React from 'react';
import { FaUsers, FaUserShield, FaClipboardList, FaBell, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';

const AboutSystem = () => {
  const navigate = useNavigate();
  const { darkMode, language } = useSettings();

  const text = {
    en: {
      back: "Back to Dashboard",
      title: "Debre Tabor University HRMS",
      intro: `The Debre Tabor University Human Resource Management System (HRMS) is designed to streamline
all HR processes, making employee management, attendance tracking, leave requests, vacancy management,
and internal notifications easier and more efficient for administrators and department heads.`,
      features: {
        emp: "Employee Management",
        empDesc: "Easily manage employee records, personal info, and employment status in one place.",
        leave: "Leave & Attendance",
        leaveDesc: "Track absences, leave requests, and notify HR automatically after three absences.",
        role: "Role-Based Access",
        roleDesc: "Assign roles like HR Admin, Department Head, and Employee with customized permissions.",
        notif: "Notifications & Announcements",
        notifDesc: "Get instant notifications for leave approvals, vacancy applications, and announcements."
      },
      visionTitle: "Vision",
      vision: `To provide a streamlined, efficient, and reliable HR management system for Debre Tabor University,
enhancing productivity and employee satisfaction.`,
      missionTitle: "Mission",
      mission: `To automate HR processes, enable easy employee management, track attendance accurately, 
and facilitate communication between staff, department heads, and HR administrators.`
    },
    am: {
      back: "ወደ ዳሽቦርድ ተመለስ",
      title: "የደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት",
      intro: `የደብረ ታቦር ዩኒቨርሲቲ የሰው ኃይል አስተዳደር ስርዓት (HRMS) የእንቅስቃሴዎችን የሰው ኃይል ሂደቶች ለመቀላቀል፣
የሰራተኞችን መረጃ መቆጣጠር፣ መፈተሻ ፍላጎቶችን መቆጣጠር እና የክፍል ኃላፊዎችን እና ኤች.አር. አስተዳዳሪዎችን በቀላሉ ለማገናኘት ታስተካክሏል።`,
      features: {
        emp: "የሰራተኛ አስተዳደር",
        empDesc: "የሰራተኞችን መረጃ፣ የግል መረጃ እና የስራ ሁኔታ በአንድ ቦታ ቀላል አድርገው ያስተዳድሩ።",
        leave: "እረፍትና ቅድሚያ ተከታታይ",
        leaveDesc: "አልተገኙ ቀናቶችን እና የእረፍት ጥያቄዎችን ይቆጣጠሩ፣ ከሶስት አልተገኙ ቀናት በኋላ ኤች.አር. ማሳወቂያ በራሱ ይላካል።",
        role: "በሚና የተመሰረተ መዳረሻ",
        roleDesc: "እንደ ኤች.አር. አስተዳዳሪ፣ የክፍል ኃላፊ እና ሰራተኛ በሚና የተለያዩ ፈቃዶችን ይመድቡ።",
        notif: "ማሳወቂያዎችና መግለጫዎች",
        notifDesc: "የእረፍት ፍቃዶችን፣ የስራ እንቅስቃሴዎችን እና ማሳወቂያዎችን በቀጥታ ያግኙ።"
      },
      visionTitle: "ራዕይ",
      vision: `ለደብረ ታቦር ዩኒቨርሲቲ የተቀጣጠለ፣ ተፈጥሯዊ እና የታመነ የሰው ኃይል አስተዳደር ስርዓትን ለመስጠት፣ የስራ እንቅስቃሴን እና የሰራተኞችን ተስፋ ለማሳደግ።`,
      missionTitle: "ተልዕኮ",
      mission: `የሰው ኃይል ሂደቶችን ለማዘመን፣ የሰራተኞችን መረጃ በቀላሉ ለማስተዳደር፣ የመገኘትን እርግጠኝነት ትክክለኛ ለማድረግ እና አስተዳዳሪዎችን እና ሰራተኞችን በቀላሉ ለማገናኘት።`
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      
      {/* Back Button */}
      <div className="flex justify-start px-6 py-4 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 font-semibold"
        >
          <FaArrowLeft /> {text[language].back}
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center w-full px-4">
        <div className="relative w-full max-w-4xl h-[220px] md:h-[260px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg">
            {text[language].title}
          </h1>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto text-center mt-10 px-4">
        <p className="text-base md:text-lg mb-6 leading-relaxed text-gray-800 dark:text-gray-200">
          {text[language].intro}
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10 px-4">
        <div className="flex items-start gap-3 p-4 bg-indigo-100 dark:bg-indigo-700 rounded-xl shadow hover:shadow-lg transition">
          <FaUsers size={28} className="text-indigo-700 dark:text-white mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text[language].features.emp}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-200">{text[language].features.empDesc}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-100 dark:bg-green-700 rounded-xl shadow hover:shadow-lg transition">
          <FaClipboardList size={28} className="text-green-700 dark:text-white mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text[language].features.leave}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-200">{text[language].features.leaveDesc}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-purple-100 dark:bg-purple-700 rounded-xl shadow hover:shadow-lg transition">
          <FaUserShield size={28} className="text-purple-700 dark:text-white mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text[language].features.role}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-200">{text[language].features.roleDesc}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-yellow-100 dark:bg-yellow-700 rounded-xl shadow hover:shadow-lg transition">
          <FaBell size={28} className="text-yellow-700 dark:text-white mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{text[language].features.notif}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-200">{text[language].features.notifDesc}</p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-4xl mx-auto mb-10 px-4 grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl shadow hover:shadow-lg transition bg-indigo-50 dark:bg-indigo-800">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{text[language].visionTitle}</h3>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{text[language].vision}</p>
        </div>

        <div className="p-4 rounded-xl shadow hover:shadow-lg transition bg-green-50 dark:bg-green-800">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{text[language].missionTitle}</h3>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">{text[language].mission}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;
