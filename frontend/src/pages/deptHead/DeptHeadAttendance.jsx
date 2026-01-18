import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axios from "../../utils/axiosInstance";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSearch,
  FaBell,
  FaUsers,
  FaChartBar,
  FaEye,
  FaPaperPlane,
  FaRedo,
  FaCalendar,
  FaCheckSquare,
  FaRegSquare,
  FaMoon,
  FaSun,
  FaGlobe
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const translations = {
  en: {
    loading: "Loading attendance data...",
    notAuthorized: "You are not authorized to view this page",
    searchPlaceholder: "Search by name or employee ID...",
    viewAttendanceHistory: "View Attendance History",
    backToForm: "Back to Today's Attendance",
    attendanceFormTitle: "Mark Attendance for Today",
    absentEmployees: "Absent Employees",
    noAbsentees: "All employees present today",
    close: "Close",
    absentDaysTitle: "Absence History",
    noAbsencesRecorded: "No absences recorded in selected period",
    submitAttendance: "Submit Attendance",
    attendanceSubmitted: "Attendance submitted successfully",
    attendanceFailed: "Failed to submit attendance. Please try again.",
    confirmReset: "Reset last 3 months of attendance?",
    attendanceResetSuccess: "Attendance data reset successfully",
    attendanceResetFailed: "Failed to reset attendance",
    noEmployeesFound: "No employees match your search",
    totalAbsences: "Total Absences",
    action: "Action",
    employeeName: "Employee Name",
    status: "Status",
    photo: "Photo",
    viewAbsents: "View Details",
    present: "Present",
    absent: "Absent",
    late: "Late",
    excused: "Excused",
    today: "Today",
    attendance: "Attendance",
    history: "History",
    consecutiveAbsences: "Consecutive Absences Alert",
    sendNotification: "Send Alert",
    notificationSent: "Notification sent successfully",
    notificationFailed: "Failed to send notification",
    fiveDayWarning: "⚠️ 5+ Consecutive Workdays Absent",
    employeeNotification: "You have been absent for 5+ consecutive workdays. Please report to HR.",
    deptHeadNotification: "Employee {name} has been absent for 5+ consecutive workdays.",
    adminNotification: "Critical: Employee {name} has been absent for 5+ consecutive workdays.",
    checkConsecutive: "Check Consecutive Absences",
    totalDaysAbsent: "Total Absent Days",
    consecutiveDaysAbsent: "Consecutive Absent Days",
    markAllPresent: "Mark All Present",
    markAllAbsent: "Mark All Absent",
    last5Days: "Last 5 Days",
    day: "Day",
    attendanceStatus: "Attendance Status",
    workDaysOnly: "Work Days Only",
    includeWeekends: "Include Weekends",
    attendanceReport: "Attendance Report",
    exportReport: "Export Report",
    weeklySummary: "Weekly Summary",
    monthlySummary: "Monthly Summary",
    department: "Department",
    employeeId: "Employee ID",
    date: "Date",
    time: "Time",
    remarks: "Remarks",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    selectAll: "Select All",
    clearAll: "Clear All",
    filter: "Filter",
    sortBy: "Sort By",
    attendanceRate: "Attendance Rate",
    presentCount: "Present",
    absentCount: "Absent",
    lateCount: "Late",
    overallStats: "Overall Statistics",
    quickActions: "Quick Actions",
    viewDetails: "View Details",
    customRange: "Custom Range",
    from: "From",
    to: "To",
    apply: "Apply",
    reset: "Reset",
    loadingData: "Loading data...",
    noData: "No data available",
    errorLoading: "Error loading data",
    retry: "Retry",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    english: "English",
    amharic: "Amharic"
  },
  am: {
    loading: "የመገኛ ውሂብ በመጫን ላይ...",
    notAuthorized: "ይህን ገጽ ለማየት ፈቃድ የለዎትም",
    searchPlaceholder: "በስም ወይም በሰራተኛ መለያ ይፈልጉ...",
    viewAttendanceHistory: "የመገኛ ታሪክ ይመልከቱ",
    backToForm: "ወደ የዛሬ መገኛ ተመለስ",
    attendanceFormTitle: "ለዛሬ መገኛ ምልክት ያድርጉ",
    absentEmployees: "የሌሉ ሰራተኞች",
    noAbsentees: "ሁሉም ሰራተኞች ዛሬ ተገኝተዋል",
    close: "ዝጋ",
    absentDaysTitle: "የማይገኙበት ታሪክ",
    noAbsencesRecorded: "በተመረጠው ጊዜ ውስጥ ምንም መዝግቦች የሉም",
    submitAttendance: "መገኛ አስገባ",
    attendanceSubmitted: "መገኛ በተሳካ ሁኔታ ተገብሯል",
    attendanceFailed: "መገኛ ማስገባት አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
    confirmReset: "የመጨረሻዎቹ 3 ወራት መገኛ ዳግም ያስጀምሩ?",
    attendanceResetSuccess: "የመገኛ ውሂብ በተሳካ ሁኔታ ተደምስሷል",
    attendanceResetFailed: "መገኛ መድገም ማስጀመር አልተቻለም",
    noEmployeesFound: "ምንም ሰራተኞች አልተገኙም",
    totalAbsences: "ጠቅላላ የማይገኙበት ቀናት",
    action: "ተግባር",
    employeeName: "የሰራተኛ ስም",
    status: "ሁኔታ",
    photo: "ፎቶ",
    viewAbsents: "ዝርዝሮችን ይመልከቱ",
    present: "ተገኝቷል",
    absent: "አልተገኘም",
    late: "ዘግይቷል",
    excused: "ፈቃድ ተሰጥቷል",
    today: "ዛሬ",
    attendance: "መገኛ",
    history: "ታሪክ",
    consecutiveAbsences: "ተከታታይ የማይገኙበት ማንቂያ",
    sendNotification: "ማንቂያ ይላኩ",
    notificationSent: "ማንቂያ በተሳካ ሁኔታ ተልኳል",
    notificationFailed: "ማንቂያ መላክ አልተቻለም",
    fiveDayWarning: "⚠️ 5+ ተከታታይ የስራ ቀናት አልተገኙም",
    employeeNotification: "ለ5+ ተከታታይ የስራ ቀናት አልተገኙም። እባክዎ ለHR ይህንን ይንገሩ።",
    deptHeadNotification: "ሰራተኛ {name} ለ5+ ተከታታይ የስራ ቀናት አልተገኙም።",
    adminNotification: "አስቸኳይ: ሰራተኛ {name} ለ5+ ተከታታይ የስራ ቀናት አልተገኙም።",
    checkConsecutive: "ተከታታይ የማይገኙበት ይፈትሹ",
    totalDaysAbsent: "ጠቅላላ የማይገኙበት ቀናት",
    consecutiveDaysAbsent: "ተከታታይ የማይገኙበት ቀናት",
    markAllPresent: "ሁሉንም ተገኝተው ምልክት ያድርጉ",
    markAllAbsent: "ሁሉንም አልተገኙም ምልክት ያድርጉ",
    last5Days: "መጨረሻ 5 ቀናት",
    day: "ቀን",
    attendanceStatus: "የመገኛ ሁኔታ",
    workDaysOnly: "የስራ ቀናት ብቻ",
    includeWeekends: "ሳምንት ሰንበቶችን ያካትቱ",
    attendanceReport: "የመገኛ ሪፖርት",
    exportReport: "ሪፖርት አልቀብር",
    weeklySummary: "ሳምንታዊ ማጠቃለያ",
    monthlySummary: "ወርሃዊ ማጠቃለያ",
    department: "ክፍል",
    employeeId: "የሰራተኛ መለያ",
    date: "ቀን",
    time: "ጊዜ",
    remarks: "ማስታወሻዎች",
    save: "አስቀምጥ",
    cancel: "አቋርጥ",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    confirm: "አረጋግጥ",
    selectAll: "ሁሉንም ምረጥ",
    clearAll: "ሁሉንም አጽዳ",
    filter: "አጣራ",
    sortBy: "በ... ደርድር",
    attendanceRate: "የመገኛ መጠን",
    presentCount: "ተገኝተዋል",
    absentCount: "አልተገኙም",
    lateCount: "ዘግይተዋል",
    overallStats: "ጠቅላላ ስታቲስቲክስ",
    quickActions: "ፈጣን ተግባራት",
    viewDetails: "ዝርዝሮችን ይመልከቱ",
    customRange: "ብጁ ክልል",
    from: "ከ",
    to: "እስከ",
    apply: "ተግብር",
    reset: "ዳግም ጀምር",
    loadingData: "ውሂብ በመጫን ላይ...",
    noData: "ውሂብ የለም",
    errorLoading: "ውሂብ በመጫን ላይ ስህተት",
    retry: "እንደገና ሞክር",
    success: "ተሳክቷል",
    error: "ስህተት",
    warning: "ማስጠንቀቂያ",
    info: "መረጃ",
    language: "ቋንቋ",
    theme: "ገጽታ",
    light: "ብርሃን",
    dark: "ጨለማ",
    english: "እንግሊዝኛ",
    amharic: "አማርኛ"
  },
};

// Language and Theme Toggle Component
const LanguageThemeToggle = () => {
  const { darkMode, toggleDarkMode, language, toggleLanguage } = useSettings();
  const t = translations[language];

  return (
    <div className="flex items-center gap-2">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          darkMode 
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
        title={t.language}
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === "en" ? "EN" : "አማ"}
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          darkMode 
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
        }`}
        title={t.theme}
      >
        {darkMode ? (
          <FaSun className="w-4 h-4" />
        ) : (
          <FaMoon className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {darkMode ? t.light : t.dark}
        </span>
      </button>
    </div>
  );
};

// Day Indicator Component
const DayIndicator = React.memo(({ day, index, language }) => {
  const { darkMode } = useSettings();
  
  const getStatusColor = (status) => {
    switch(status) {
      case "Present": return "bg-emerald-500";
      case "Absent": return "bg-red-500";
      case "Late": return "bg-amber-500";
      case "Excused": return "bg-blue-500";
      default: return "bg-gray-300 dark:bg-gray-700";
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const locale = language === "en" ? "en-US" : "am-ET";
      return date.toLocaleDateString(locale, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col items-center" title={`${formatDate(day.date)}: ${day.status}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(day.status)} text-white text-xs font-medium`}>
        {index + 1}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {formatDate(day.date).split(' ')[0]}
      </div>
    </div>
  );
});

DayIndicator.displayName = 'DayIndicator';

// Loading Spinner Component
const LoadingSpinner = ({ message = "Loading..." }) => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
        darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"
      }`}></div>
      <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {message}
      </p>
    </div>
  );
};

// Error Message Component
const ErrorMessage = ({ message, onRetry }) => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  return (
    <div className="text-center py-12">
      <FaExclamationTriangle className={`w-12 h-12 mx-auto mb-4 ${
        darkMode ? "text-red-400" : "text-red-500"
      }`} />
      <h3 className={`text-lg font-medium mb-2 ${
        darkMode ? "text-gray-100" : "text-gray-900"
      }`}>
        {t.error}
      </h3>
      <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <FaRedo className="w-4 h-4 mr-2" />
          {t.retry}
        </button>
      )}
    </div>
  );
};

// Helper function to get department name
const getDepartmentName = (employee) => {
  if (!employee || !employee.department) return "";
  
  // If department is an object with name property
  if (typeof employee.department === 'object' && employee.department !== null) {
    return employee.department.name || "";
  }
  
  // If department is a string
  if (typeof employee.department === 'string') {
    return employee.department;
  }
  
  return "";
};

// Main Attendance Component
const DeptHeadAttendance = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [employees, setEmployees] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [submittedToday, setSubmittedToday] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [consecutiveAbsences, setConsecutiveAbsences] = useState([]);
  const [showConsecutiveModal, setShowConsecutiveModal] = useState(false);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });

  const initialLoadRef = useRef(true);

  const statusOptions = [
    { value: "Present", label: t.present, icon: FaCheckCircle, color: "emerald" },
    { value: "Absent", label: t.absent, icon: FaTimesCircle, color: "red" },
    { value: "Late", label: t.late, icon: FaClock, color: "amber" },
    { value: "Excused", label: t.excused, icon: FaExclamationTriangle, color: "blue" }
  ];

  // Calculate statistics - memoized
  const calculateStats = useCallback(() => {
    if (employees.length === 0) {
      setStats({
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        attendanceRate: 0
      });
      return;
    }

    const total = employees.length;
    const presentCount = employees.filter(emp => attendanceForm[emp._id] === "Present").length;
    const absentCount = employees.filter(emp => attendanceForm[emp._id] === "Absent").length;
    const lateCount = employees.filter(emp => attendanceForm[emp._id] === "Late").length;
    const excusedCount = employees.filter(emp => attendanceForm[emp._id] === "Excused").length;
    const attendanceRate = total > 0 ? ((presentCount + lateCount + excusedCount) / total * 100).toFixed(1) : 0;

    setStats({
      total,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      attendanceRate
    });
  }, [employees, attendanceForm]);

  // Filter employees based on search term - memoized
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (!emp) return false;
      const searchStr = `${emp.firstName || ''} ${emp.lastName || ''} ${emp.empId || ''}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [employees, searchTerm]);

  // Get department name for display
  const departmentName = useMemo(() => {
    if (employees.length === 0) return t.department;
    return getDepartmentName(employees[0]) || t.department;
  }, [employees, t.department]);

  // Fetch data
  useEffect(() => {
    if (authLoading) return;
    if (!user?.department) {
      setLoading(false);
      setError("No department assigned");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split("T")[0];

        // Fetch department employees
        const [empRes, attRes, histRes] = await Promise.all([
          axios.get(`/employees/department?department=${user.department}`),
          axios.get(`/attendance?department=${user.department}&date=${today}`),
          axios.get(`/attendance/history?department=${user.department}&days=30`)
        ]);

        const deptEmps = empRes.data || [];
        setEmployees(deptEmps);

        // Initialize attendance form
        const initialForm = {};
        deptEmps.forEach(emp => {
          if (emp._id) {
            initialForm[emp._id] = "Absent";
          }
        });

        // Update with today's attendance if exists
        if (attRes.data?.length > 0) {
          setSubmittedToday(true);
          attRes.data.forEach(record => {
            if (record.employeeId && record.status) {
              initialForm[record.employeeId] = record.status;
            }
          });
        }

        setAttendanceForm(initialForm);
        setHistory(histRes.data || []);

        // Calculate initial stats
        calculateStats();

        // Check consecutive absences
        checkConsecutiveAbsences(deptEmps, histRes.data || []);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(t.errorLoading);
      } finally {
        setLoading(false);
        initialLoadRef.current = false;
      }
    };

    fetchData();
  }, [user, authLoading, t]);

  // Update stats when attendance form changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      calculateStats();
    }
  }, [attendanceForm, calculateStats]);

  const checkConsecutiveAbsences = useCallback((emps, historyData) => {
    const fiveDayAbsents = [];
    
    emps.forEach(emp => {
      if (!emp?._id) return;
      
      let maxConsecutive = 0;
      let currentConsecutive = 0;
      let lastAbsentDate = null;
      
      // Check last 30 days
      for (let i = 0; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        if (!includeWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
          continue;
        }
        
        const dayRecord = historyData.find(h => h.date === dateStr);
        let isAbsent = false;
        
        if (dayRecord?.records) {
          const empRecord = dayRecord.records.find(r => r.employeeId === emp._id);
          isAbsent = empRecord?.status === "Absent";
        }
        
        if (isAbsent) {
          currentConsecutive++;
          if (currentConsecutive > maxConsecutive) {
            maxConsecutive = currentConsecutive;
            lastAbsentDate = dateStr;
          }
        } else {
          currentConsecutive = 0;
        }
      }
      
      if (maxConsecutive >= 5) {
        const totalAbsences = historyData.reduce((total, day) => {
          if (day.records) {
            const empRecord = day.records.find(r => r.employeeId === emp._id);
            return total + (empRecord?.status === "Absent" ? 1 : 0);
          }
          return total;
        }, 0);
        
        fiveDayAbsents.push({
          employee: emp,
          consecutiveDays: maxConsecutive,
          lastAbsentDate,
          totalAbsences
        });
      }
    });
    
    setConsecutiveAbsences(fiveDayAbsents);
  }, [includeWeekends]);

  const handleAttendanceChange = useCallback((employeeId, status) => {
    setAttendanceForm(prev => ({
      ...prev,
      [employeeId]: status
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split("T")[0];
      const records = employees.map(emp => ({
        employeeId: emp._id,
        date: today,
        status: attendanceForm[emp._id] || "Absent",
        markedBy: user._id,
        department: user.department
      }));

      await axios.post("/attendance/bulk", { records });
      setMessage({ type: "success", text: t.attendanceSubmitted });
      setSubmittedToday(true);

      // Refresh history
      const histRes = await axios.get(`/attendance/history?department=${user.department}&days=30`);
      setHistory(histRes.data || []);

      // Check for new consecutive absences
      checkConsecutiveAbsences(employees, histRes.data || []);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t.attendanceFailed });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }
  };

  const handleMassStatusUpdate = useCallback((status) => {
    const newForm = { ...attendanceForm };
    employees.forEach(emp => {
      if (emp._id) {
        newForm[emp._id] = status;
      }
    });
    setAttendanceForm(newForm);
  }, [employees, attendanceForm]);

  const getLast5DaysStatus = useCallback((employeeId) => {
    const last5Days = [];
    const today = new Date();
    
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayRecord = history.find(h => h.date === dateStr);
      let status = "No Record";
      
      if (dayRecord?.records) {
        const empRecord = dayRecord.records.find(r => r.employeeId === employeeId);
        status = empRecord?.status || "No Record";
      }
      
      last5Days.push({ date: dateStr, status });
    }
    return last5Days;
  }, [history]);

  // Handle consecutive absences change when includeWeekends changes
  useEffect(() => {
    if (employees.length > 0 && history.length > 0) {
      checkConsecutiveAbsences(employees, history);
    }
  }, [includeWeekends, employees, history, checkConsecutiveAbsences]);

  if (authLoading || loading) {
    return <LoadingSpinner message={t.loading} />;
  }
    
  if (!user || user.role?.toLowerCase() !== "departmenthead") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{t.notAuthorized}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-200 ${
      darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.attendance}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {employees.length} {language === "en" ? "employees in" : "ሰራተኞች በ"} {departmentName}
            </p>
          </div>
          
          {/* Language and Theme Toggle */}
          <LanguageThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.department}</div>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.present}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.presentCount}</div>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.absentCount}</div>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.late}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.lateCount}</div>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.excused}</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.excused}</div>
          </div>
          <div className={`p-3 md:p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}>
            <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.attendanceRate}%</div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{t.attendanceRate}</div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
        }`}>
          {message.type === "success" ? (
            <FaCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FaExclamationTriangle className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* 5-Day Warning Alert */}
      {consecutiveAbsences.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <strong className="font-bold flex items-center gap-2 text-sm md:text-base">
                <FaExclamationTriangle className="w-4 h-4" />
                {t.fiveDayWarning}
              </strong>
              <p className="mt-1 text-sm">
                {consecutiveAbsences.length} {language === "en" ? "employees absent for 5+ consecutive workdays" : "ሰራተኞች ለ5+ ተከታታይ የስራ ቀናት አልተገኙም"}
              </p>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => setShowConsecutiveModal(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FaEye className="w-3 h-3" />
                {t.viewAbsents}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Actions */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHistoryView(false)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base ${
              !showHistoryView 
                ? "bg-blue-600 text-white" 
                : darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaCalendar className="w-3 h-3 md:w-4 md:h-4" />
            {t.today}
          </button>
          <button
            onClick={() => setShowHistoryView(true)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base ${
              showHistoryView 
                ? "bg-blue-600 text-white" 
                : darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaChartBar className="w-3 h-3 md:w-4 md:h-4" />
            {t.history}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {!showHistoryView && (
            <>
              <button
                onClick={() => handleMassStatusUpdate("Present")}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FaCheckSquare className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{t.markAllPresent}</span>
                <span className="sm:hidden">All Present</span>
              </button>
              <button
                onClick={() => handleMassStatusUpdate("Absent")}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
              >
                <FaRegSquare className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{t.markAllAbsent}</span>
                <span className="sm:hidden">All Absent</span>
              </button>
            </>
          )}
          {showHistoryView && (
            <button
              onClick={() => setShowConsecutiveModal(true)}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 text-sm"
            >
              <FaExclamationTriangle className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{t.checkConsecutive}</span>
              <span className="sm:hidden">Check</span>
            </button>
          )}
          <button
            onClick={() => setIncludeWeekends(!includeWeekends)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-2 text-sm ${
              includeWeekends 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaCalendarAlt className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">{includeWeekends ? t.workDaysOnly : t.includeWeekends}</span>
            <span className="sm:hidden">{includeWeekends ? 'Work Days' : 'Weekends'}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full pl-9 pr-4 py-2 md:pl-10 md:py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? "bg-gray-800 border-gray-700 text-gray-100" 
                : "bg-white border-gray-300 text-gray-900"
            }`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showHistoryView ? (
        /* History View */
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t.employeeName}
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t.totalDaysAbsent}
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t.consecutiveDaysAbsent}
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t.last5Days}
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t.action}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 md:px-6 md:py-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <FaUsers className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm md:text-base">{t.noEmployeesFound}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  if (!emp || !emp._id) return null;
                  
                  const totalAbsences = history.reduce((total, day) => {
                    if (day.records) {
                      const empRecord = day.records.find(r => r.employeeId === emp._id);
                      return total + (empRecord && empRecord.status === "Absent" ? 1 : 0);
                    }
                    return total;
                  }, 0);
                  
                  const is5DayAbsent = consecutiveAbsences.some(a => a.employee && a.employee._id === emp._id);
                  const last5Days = getLast5DaysStatus(emp._id);
                  
                  return (
                    <tr key={emp._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      is5DayAbsent ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <img
                            src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                            alt="Employee"
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">{emp.firstName || ''} {emp.lastName || ''}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{emp.empId || 'No ID'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{getDepartmentName(emp)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                          totalAbsences > 10 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                            : totalAbsences > 5 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {totalAbsences}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                          is5DayAbsent 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {is5DayAbsent ? (consecutiveAbsences.find(a => a.employee && a.employee._id === emp._id)?.consecutiveDays || 0) : 0}
                          {is5DayAbsent && " ⚠️"}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <div className="flex gap-1 md:gap-2">
                          {last5Days.map((day, idx) => (
                            <DayIndicator 
                              key={idx} 
                              day={day} 
                              index={idx} 
                              language={language}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4">
                        <button
                          onClick={async () => {
                            if (is5DayAbsent) {
                              try {
                                setMessage({ type: "success", text: t.notificationSent });
                                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
                              } catch (err) {
                                setMessage({ type: "error", text: t.notificationFailed });
                                setTimeout(() => setMessage({ type: "", text: "" }), 5000);
                              }
                            }
                          }}
                          className={`px-2 py-1 rounded text-xs md:text-sm flex items-center gap-1 ${
                            is5DayAbsent 
                              ? "bg-red-600 text-white hover:bg-red-700" 
                              : "bg-gray-600 text-white hover:bg-gray-700 opacity-50 cursor-not-allowed"
                          }`}
                          disabled={!is5DayAbsent}
                        >
                          <FaBell className="w-2 h-2 md:w-3 md:h-3" />
                          <span className="hidden sm:inline">{t.sendNotification}</span>
                          <span className="sm:hidden">Alert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Today's Attendance Form */
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {t.employeeName}
                  </th>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {t.last5Days}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-6 md:px-6 md:py-8 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <FaUsers className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm md:text-base">{t.noEmployeesFound}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => {
                    if (!emp || !emp._id) return null;
                    
                    const is5DayAbsent = consecutiveAbsences.some(a => a.employee && a.employee._id === emp._id);
                    const last5Days = getLast5DaysStatus(emp._id);
                    
                    return (
                      <tr key={emp._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        is5DayAbsent ? 'bg-red-50 dark:bg-red-900/20' : ''
                      }`}>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <img
                              src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                              alt="Employee"
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-sm md:text-base truncate">{emp.firstName || ''} {emp.lastName || ''}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{emp.empId || 'No ID'}</p>
                              {is5DayAbsent && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                  <FaExclamationTriangle className="w-2 h-2 md:w-3 md:h-3" />
                                  <span className="truncate">{t.fiveDayWarning}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <select
                            value={attendanceForm[emp._id] || "Absent"}
                            onChange={e => handleAttendanceChange(emp._id, e.target.value)}
                            className={`w-full px-2 py-1 md:px-3 md:py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600 text-gray-100" 
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                          >
                            {statusOptions.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-1 md:gap-2">
                              {last5Days.map((day, idx) => (
                                <DayIndicator 
                                  key={idx} 
                                  day={day} 
                                  index={idx} 
                                  language={language}
                                />
                              ))}
                            </div>
                            {is5DayAbsent && (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                {consecutiveAbsences.find(a => a.employee && a.employee._id === emp._id)?.consecutiveDays || 0} {t.consecutiveDaysAbsent}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={submittedToday}
              className={`w-full py-2 md:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base ${
                submittedToday 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {submittedToday ? (
                <>
                  <FaCheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  {t.attendanceSubmitted}
                </>
              ) : (
                <>
                  <FaCheckSquare className="w-4 h-4 md:w-5 md:h-5" />
                  {t.submitAttendance}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 5-Day Consecutive Absences Modal */}
      {showConsecutiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <FaExclamationTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                    {t.consecutiveAbsences}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {language === "en" 
                      ? "Employees absent for 5+ consecutive workdays" 
                      : "ሰራተኞች ለ5+ ተከታታይ የስራ ቀናት አልተገኙም"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConsecutiveModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xl md:text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {consecutiveAbsences.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6 md:py-8">
                  {t.noAbsencesRecorded}
                </p>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {consecutiveAbsences.map((item, index) => {
                    if (!item.employee) return null;
                    
                    return (
                      <div key={index} className={`p-3 md:p-4 rounded-lg border ${
                        darkMode ? "border-red-800 bg-red-900/20" : "border-red-200 bg-red-50"
                      }`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <div>
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <img
                                src={item.employee.photo ? `${BACKEND_URL}${item.employee.photo}` : "/fallback-avatar.png"}
                                alt="Employee"
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-sm md:text-base truncate">{item.employee.firstName || ''} {item.employee.lastName || ''}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.employee.empId || 'No ID'}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{getDepartmentName(item.employee)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs md:text-sm font-medium mb-1">
                              {language === "en" ? "Attendance Statistics" : "የመገኛ ስታቲስቲክስ"}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className={`text-center p-2 rounded ${
                                darkMode ? "bg-gray-700" : "bg-white"
                              }`}>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalDaysAbsent}</p>
                                <p className="text-base md:text-lg font-bold">{item.totalAbsences}</p>
                              </div>
                              <div className={`text-center p-2 rounded ${
                                darkMode ? "bg-gray-700" : "bg-white"
                              }`}>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.consecutiveDaysAbsent}</p>
                                <p className="text-base md:text-lg font-bold text-red-600 dark:text-red-400">{item.consecutiveDays}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-start md:justify-end mt-2 md:mt-0">
                            <button
                              onClick={async () => {
                                try {
                                  setMessage({ type: "success", text: t.notificationSent });
                                  setTimeout(() => setMessage({ type: "", text: "" }), 3000);
                                  setShowConsecutiveModal(false);
                                } catch (err) {
                                  setMessage({ type: "error", text: t.notificationFailed });
                                  setTimeout(() => setMessage({ type: "", text: "" }), 5000);
                                }
                              }}
                              className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                            >
                              <FaPaperPlane className="w-3 h-3 md:w-4 md:h-4" />
                              {t.sendNotification}
                            </button>
                          </div>
                        </div>
                        
                        {item.lastAbsentDate && (
                          <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-red-200 dark:border-red-800">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {language === "en" 
                                ? `Last absent on: ${new Date(item.lastAbsentDate).toLocaleDateString(language === "en" ? "en-US" : "am-ET")}`
                                : `የመጨረሻ ያልተገኙበት ቀን: ${new Date(item.lastAbsentDate).toLocaleDateString("am-ET")}`
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadAttendance;