import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axios from "../../utils/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const translations = {
  en: {
    loading: "Loading...",
    notAuthorized: "Not authorized",
    searchPlaceholder: "Search employees...",
    viewAttendanceHistory: "View Attendance History",
    backToForm: "Back to Attendance Form",
    resetLast3Months: "Reset Last 3 Months",
    attendanceFormTitle: "Mark Attendance for",
    absentEmployees: "Absent Employees",
    noAbsentees: "No absent employees",
    close: "Close",
    absentDaysTitle: "Absent Days for",
    noAbsencesRecorded: "No absences recorded",
    submitAttendance: "Submit Attendance",
    attendanceSubmitted: "Attendance submitted successfully",
    attendanceFailed: "Failed to submit attendance",
    confirmReset: "Are you sure you want to reset attendance for the last 3 months?",
    attendanceResetSuccess: "Attendance reset successfully",
    attendanceResetFailed: "Failed to reset attendance",
    noEmployeesFound: "No employees found",
    totalAbsences: "Total Absences",
    action: "Action",
    employeeName: "Employee Name",
    status: "Status",
    photo: "Photo",
    viewAbsents: "View Absent Days",
    present: "Present",
    absent: "Absent",
    late: "Late",
    excused: "Excused",
    today: "Today",
    attendance: "Attendance",
    history: "History",
    consecutiveAbsences: "Consecutive Absences",
    sendNotification: "Send Notification",
    notificationSent: "Notification sent successfully",
    notificationFailed: "Failed to send notification",
    sevenDayWarning: "Warning: 7+ days absent without permission",
    employeeNotification: "You have been absent for 7+ consecutive days without permission. Please report to HR immediately.",
    adminNotification: "Employee {name} has been absent for 7+ consecutive days without permission. HR action required.",
    checkConsecutive: "Check 7-Day Absences",
  },
  am: {
    loading: "በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    searchPlaceholder: "ሰራተኞችን ይፈልጉ...",
    viewAttendanceHistory: "የተገኙትን አባለስራ ታሪክ ይመልከቱ",
    backToForm: "ወደ የመግለጫ ቅጽ ተመለስ",
    resetLast3Months: "የመጨረሻዎቹ 3 ወር እንደገና ማስተካከያ",
    attendanceFormTitle: "አባለስራን ማስመዝገብ ለ",
    absentEmployees: "የጎደለ ሰራተኞች",
    noAbsentees: "ምንም ጎደለ ሰራተኞች የሉም።",
    close: "ዝጋ",
    absentDaysTitle: "የጎደለ ቀናት ለ",
    noAbsencesRecorded: "ጎደለ ቀናት አልተመዘገቡም።",
    submitAttendance: "አባለስራ ላክ",
    attendanceSubmitted: "አባለስራ በትክክል ተላክ።",
    attendanceFailed: "አባለስራን መላክ አልተቻለም።",
    confirmReset: "በመጨረሻዎቹ 3 ወር እንደገና ማስተካከያ መፈጸም ትፈልጋለህ?",
    attendanceResetSuccess: "በመጨረሻዎቹ 3 ወር አባለስራ በትክክል ተመላከተ።",
    attendanceResetFailed: "አባለስራን እንደገና ማስተካከያ አልተቻለም።",
    noEmployeesFound: "ምንም ሰራተኞች አልተገኙም።",
    totalAbsences: "ጠቅላላ ጎደሎች",
    action: "እርምጃ",
    employeeName: "የሰራተኛ ስም",
    status: "ሁኔታ",
    photo: "ፎቶ",
    viewAbsents: "ጎደሎችን ይመልከቱ",
    present: "ተገኝቷል",
    absent: "ጎደሏል",
    late: "ዘግይቷል",
    excused: "ቅድመ ፈቃድ",
    today: "ዛሬ",
    attendance: "መገኘት",
    history: "ታሪክ",
    consecutiveAbsences: "ተከታታይ ጎደሎች",
    sendNotification: "ማስታወቂያ ላክ",
    notificationSent: "ማስታወቂያ ተልኳል",
    notificationFailed: "ማስታወቂያ ማስተላለፍ አልተቻለም",
    sevenDayWarning: "ማስጠንቀቂያ: 7+ ቀናት ያለፍቃድ ጎደሏል",
    employeeNotification: "7+ ተከታታይ ቀናት ያለፍቃድ ጎደለዋል። ወደ HR ይምጡ።",
    adminNotification: "ሰራተኛ {name} 7+ ተከታታይ ቀናት ያለፍቃድ ጎድሏል። HR እርምጃ ያስፈልጋል።",
    checkConsecutive: "7-ቀን ጎደሎችን ይፈትሹ",
  },
};

const DeptHeadAttendance = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [employees, setEmployees] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [submittedToday, setSubmittedToday] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [consecutiveAbsences, setConsecutiveAbsences] = useState([]);
  const [showConsecutiveModal, setShowConsecutiveModal] = useState(false);

  const statusOptions = ["Present", "Absent", "Late", "Excused"];

  // Fetch employees and attendance
  useEffect(() => {
    if (authLoading) return;
    if (!user?.department) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Fetch department employees
        const res = await axios.get(`/employees/department?department=${user.department}`);
        const deptEmps = res.data || [];
        setEmployees(deptEmps);

        // Initialize attendance form
        const initialForm = {};
        deptEmps.forEach(emp => { initialForm[emp._id] = "Absent"; });

        // Fetch today's attendance
        const attRes = await axios.get(`/attendance?department=${user.department}&date=${today}`);
        if (attRes.data.length > 0) setSubmittedToday(true);

        attRes.data.forEach(record => {
          initialForm[record.employeeId] = record.status;
        });

        setAttendanceForm(initialForm);

        // Fetch history
        const histRes = await axios.get(`/attendance/history?department=${user.department}`);
        setHistory(histRes.data || []);

        // Check for consecutive absences
        checkConsecutiveAbsences(deptEmps, histRes.data || []);

      } catch (err) {
        console.error("Failed to fetch employees or attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Check for 7+ consecutive absences
  const checkConsecutiveAbsences = (emps, historyData) => {
    const sevenDayAbsents = [];
    const today = new Date();
    
    emps.forEach(emp => {
      let consecutiveCount = 0;
      const last7Days = [];
      
      // Get last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        last7Days.push(dateStr);
      }
      
      // Check attendance for each day
      last7Days.forEach(date => {
        const dayRecord = historyData.find(h => h.date === date);
        if (dayRecord) {
          const empRecord = dayRecord.records?.find(r => r.employeeId === emp._id);
          if (empRecord && empRecord.status === "Absent") {
            consecutiveCount++;
          }
        }
      });
      
      if (consecutiveCount >= 7) {
        sevenDayAbsents.push({
          employee: emp,
          consecutiveDays: consecutiveCount,
          lastAbsentDate: last7Days[0]
        });
      }
    });
    
    setConsecutiveAbsences(sevenDayAbsents);
  };

  const send7DayNotification = async (employee) => {
    try {
      // Notification for employee
      await axios.post("/notifications", {
        message: t.employeeNotification,
        recipientRole: "Employee",
        employee: {
          _id: employee._id,
          email: employee.email,
          name: `${employee.firstName} ${employee.lastName}`
        },
        type: "Attendance",
        status: "warning"
      });

      // Notification for admin
      await axios.post("/notifications", {
        message: t.adminNotification.replace("{name}", `${employee.firstName} ${employee.lastName}`),
        recipientRole: "Admin",
        type: "Attendance",
        status: "urgent"
      });

      setMessage(t.notificationSent);
    } catch (err) {
      console.error("Failed to send notification:", err);
      setMessage(t.notificationFailed);
    }
  };

  const handleAttendanceChange = (employeeId, value) => {
    setAttendanceForm({ ...attendanceForm, [employeeId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split("T")[0];
      const records = employees.map(emp => ({
        employeeId: emp._id,
        date: today,
        status: attendanceForm[emp._id],
      }));

      await axios.post("/attendance/bulk", { records });
      setMessage(t.attendanceSubmitted);
      setSubmittedToday(true);

      // Refresh history after submission
      const histRes = await axios.get(`/attendance/history?department=${user.department}`);
      setHistory(histRes.data || []);
      checkConsecutiveAbsences(employees, histRes.data || []);

    } catch (err) {
      console.error(err);
      setMessage(t.attendanceFailed);
    }
  };

  const handleResetAttendance = async () => {
    if (!window.confirm(t.confirmReset)) return;
    try {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      await axios.delete(`/attendance/reset?department=${user.department}&from=${threeMonthsAgo.toISOString()}`);
      setMessage(t.attendanceResetSuccess);
      const histRes = await axios.get(`/attendance/history?department=${user.department}`);
      setHistory(histRes.data || []);
      setSubmittedToday(false);
      checkConsecutiveAbsences(employees, histRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage(t.attendanceResetFailed);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"}`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
    
  if (!user || user.role?.toLowerCase() !== "departmenthead")
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{t.notAuthorized}</p>
      </div>
    );

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t.attendance}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {employees.length} employees in {employees[0]?.department?.name || "your"} department
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          {message}
        </div>
      )}

      {/* 7-Day Warning Alert */}
      {consecutiveAbsences.length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <div className="flex justify-between items-center">
            <div>
              <strong className="font-bold">{t.sevenDayWarning}</strong>
              <p className="mt-1">
                {consecutiveAbsences.length} employee{consecutiveAbsences.length > 1 ? 's' : ''} has been absent for 7+ consecutive days
              </p>
            </div>
            <button
              onClick={() => setShowConsecutiveModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {t.viewAbsents}
            </button>
          </div>
        </div>
      )}

      {/* Tabs and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHistoryView(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${!showHistoryView ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {t.today}
          </button>
          <button
            onClick={() => setShowHistoryView(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${showHistoryView ? "bg-blue-600 text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {t.history}
          </button>
        </div>
        
        <div className="flex space-x-2">
          {showHistoryView && (
            <button
              onClick={() => setShowConsecutiveModal(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t.checkConsecutive}
            </button>
          )}
          {showHistoryView && (
            <button
              onClick={handleResetAttendance}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t.resetLast3Months}
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {showHistoryView ? (
        /* History View */
        <div className="overflow-x-auto rounded-lg border">
          <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="p-4 text-left">{t.employeeName}</th>
                <th className="p-4 text-left">{t.totalAbsences}</th>
                <th className="p-4 text-left">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => {
                const empAbsences = history.flatMap(rec =>
                  rec.records?.filter(r => r.employeeId === emp._id && r.status === "Absent") || []
                );
                const is7DayAbsent = consecutiveAbsences.some(a => a.employee._id === emp._id);
                
                return (
                  <tr key={emp._id} className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                          alt="Employee"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{emp.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${is7DayAbsent ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                        {empAbsences.length}
                        {is7DayAbsent && " ⚠️"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          if (is7DayAbsent) {
                            send7DayNotification(emp);
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm ${is7DayAbsent ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-600 text-white hover:bg-gray-700"}`}
                        disabled={!is7DayAbsent}
                      >
                        {t.sendNotification}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Today's Attendance Form */
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-lg border">
            <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="p-4 text-left">{t.employeeName}</th>
                  <th className="p-4 text-left">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp._id} className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                          alt="Employee"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{emp.empId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={attendanceForm[emp._id] || "Absent"}
                        onChange={e => handleAttendanceChange(emp._id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {t[status.toLowerCase()] || status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submittedToday}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${submittedToday ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {submittedToday ? t.attendanceSubmitted : t.submitAttendance}
            </button>
          </div>
        </form>
      )}

      {/* 7-Day Consecutive Absences Modal */}
      {showConsecutiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t.consecutiveAbsences}</h3>
                <button
                  onClick={() => setShowConsecutiveModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              {consecutiveAbsences.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t.noAbsencesRecorded}</p>
              ) : (
                <div className="space-y-4">
                  {consecutiveAbsences.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${darkMode ? "border-red-800 bg-red-900/20" : "border-red-200 bg-red-50"}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{item.employee.firstName} {item.employee.lastName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.consecutiveDays} consecutive days absent
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last absent: {new Date(item.lastAbsentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => send7DayNotification(item.employee)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          {t.sendNotification}
                        </button>
                      </div>
                    </div>
                  ))}
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