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

  // theme helpers
  const bg = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800';
  const panelBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const subtleText = darkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`min-h-screen py-8 ${bg} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Back + small breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border focus:outline-none
                         hover:shadow-md transition-shadow duration-150
                         bg-transparent"
            >
              <FaArrowLeft className={`text-indigo-600 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
              <span className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{text[language].back}</span>
            </button>

            <div className={`ml-2 text-sm ${subtleText}`}> / About</div>
          </div>

          {/* small system label on right */}
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide font-semibold text-indigo-700 dark:text-indigo-300">HRMS</div>
            <div className={`text-sm ${subtleText}`}>Debre Tabor University</div>
          </div>
        </div>

        {/* Hero card */}
        <div className={`rounded-xl shadow-lg overflow-hidden border ${panelBg} mb-8`}>
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Logo / stats */}
            <div className="w-full md:w-2/5 p-6 bg-gradient-to-b from-indigo-700 to-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-2xl font-bold">
                  DTU
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{text[language].title}</h2>
                  <p className="text-sm opacity-90 mt-1">{text[language].visionTitle}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-md p-3">
                  <div className="text-xs uppercase tracking-wide">Modules</div>
                  <div className="mt-1 text-lg font-semibold">8+</div>
                  <div className="text-xs opacity-80">Core features</div>
                </div>

                <div className="bg-white/10 rounded-md p-3">
                  <div className="text-xs uppercase tracking-wide">Security</div>
                  <div className="mt-1 text-lg font-semibold">Role-based</div>
                  <div className="text-xs opacity-80">RBAC enforced</div>
                </div>

                <div className="bg-white/10 rounded-md p-3">
                  <div className="text-xs uppercase tracking-wide">Languages</div>
                  <div className="mt-1 text-lg font-semibold">Amh/Eng</div>
                  <div className="text-xs opacity-80">Multilingual</div>
                </div>

                <div className="bg-white/10 rounded-md p-3">
                  <div className="text-xs uppercase tracking-wide">Theme</div>
                  <div className="mt-1 text-lg font-semibold">Dark / Light</div>
                  <div className="text-xs opacity-80">User toggle</div>
                </div>
              </div>
            </div>

            {/* Right: Intro */}
            <div className={`w-full md:w-3/5 p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-3">{text[language].title}</h3>
              <p className="text-sm leading-relaxed mb-4 ${subtleText}" style={{ whiteSpace: 'pre-wrap' }}>
                {text[language].intro}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent text-sm font-medium hover:shadow-sm transition"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid (enterprise cards) */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg border ${panelBg} flex items-start gap-3`}>
            <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-700 text-indigo-700 dark:text-white">
              <FaUsers size={20} />
            </div>
            <div>
              <h4 className="font-semibold">{text[language].features.emp}</h4>
              <p className="text-sm mt-1">{text[language].features.empDesc}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${panelBg} flex items-start gap-3`}>
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-700 text-green-700 dark:text-white">
              <FaClipboardList size={20} />
            </div>
            <div>
              <h4 className="font-semibold">{text[language].features.leave}</h4>
              <p className="text-sm mt-1">{text[language].features.leaveDesc}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${panelBg} flex items-start gap-3`}>
            <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-700 text-purple-700 dark:text-white">
              <FaUserShield size={20} />
            </div>
            <div>
              <h4 className="font-semibold">{text[language].features.role}</h4>
              <p className="text-sm mt-1">{text[language].features.roleDesc}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${panelBg} flex items-start gap-3`}>
            <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-700 text-yellow-700 dark:text-white">
              <FaBell size={20} />
            </div>
            <div>
              <h4 className="font-semibold">{text[language].features.notif}</h4>
              <p className="text-sm mt-1">{text[language].features.notifDesc}</p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className={`p-6 rounded-lg border ${panelBg}`}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">{text[language].visionTitle}</h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed ${subtleText}" style={{ whiteSpace: 'pre-wrap' }}>
              {text[language].vision}
            </p>
          </div>

          <div className={`p-6 rounded-lg border ${panelBg}`}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">{text[language].missionTitle}</h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed ${subtleText}" style={{ whiteSpace: 'pre-wrap' }}>
              {text[language].mission}
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className={`text-sm rounded-md p-4 border ${panelBg} mb-12`}>
          <div className={`${subtleText}`}>
            <strong>Note:</strong> This HRMS prototype is built for academic demonstration and can be extended with
            PDF exports, email notifications, and more integrations for production use.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSystem;
