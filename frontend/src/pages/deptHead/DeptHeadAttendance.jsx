import React, { useEffect, useState, useMemo } from "react";
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
    fiveDayWarning: "Warning: 5+ consecutive workdays absent",
    employeeNotification: "You have been absent for 5+ consecutive workdays. Please report to HR immediately.",
    deptHeadNotification: "Employee {name} has been absent for 5+ consecutive workdays. Please take necessary action.",
    adminNotification: "Employee {name} has been absent for 5+ consecutive workdays without permission. HR action required.",
    checkConsecutive: "Check 5-Day Consecutive Absences",
    totalDaysAbsent: "Total Days Absent",
    consecutiveDaysAbsent: "Consecutive Days Absent",
    markAllPresent: "Mark All Present",
    markAllAbsent: "Mark All Absent",
    last5Days: "Last 5 Days Status",
    day: "Day",
    attendanceStatus: "Attendance Status",
    workDaysOnly: "Work Days Only",
    includeWeekends: "Include Weekends",
    attendanceReport: "Attendance Report",
    exportReport: "Export Report",
    weeklySummary: "Weekly Summary",
    monthlySummary: "Monthly Summary",
  },
  am: {
    // ... (same Amharic translations)
  },
};

// Helper function to check if a day is a workday (Monday-Friday)
const isWorkDay = (date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
};

// Helper to get last N workdays
const getLastNWorkDays = (n) => {
  const days = [];
  const today = new Date();
  let count = 0;
  let date = new Date(today);
  
  while (count < n) {
    if (isWorkDay(date)) {
      const dateStr = date.toISOString().split("T")[0];
      days.unshift(dateStr); // Add to beginning to maintain chronological order
      count++;
    }
    date.setDate(date.getDate() - 1);
  }
  
  return days;
};

// Helper to get employee attendance for specific dates
const getEmployeeAttendanceForDates = (employeeId, dates, historyData) => {
  return dates.map(date => {
    const dayRecord = historyData.find(h => h.date === date);
    if (dayRecord) {
      const empRecord = dayRecord.records?.find(r => r.employeeId === employeeId);
      return {
        date,
        status: empRecord?.status || "Unknown",
        isWorkDay: isWorkDay(new Date(date))
      };
    }
    return {
      date,
      status: "No Record",
      isWorkDay: isWorkDay(new Date(date))
    };
  });
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
  const [includeWeekends, setIncludeWeekends] = useState(false);

  const statusOptions = ["Present", "Absent", "Late", "Excused"];

  // Calculate filtered employees based on search term
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      `${emp.firstName || ''} ${emp.lastName || ''} ${emp.empId || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

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
        deptEmps.forEach(emp => { 
          initialForm[emp._id] = "Absent"; 
        });

        // Fetch today's attendance
        const attRes = await axios.get(`/attendance?department=${user.department}&date=${today}`);
        if (attRes.data.length > 0) setSubmittedToday(true);

        attRes.data.forEach(record => {
          if (record.employeeId) {
            initialForm[record.employeeId] = record.status;
          }
        });

        setAttendanceForm(initialForm);

        // Fetch history for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const fromDate = thirtyDaysAgo.toISOString().split("T")[0];
        
        const histRes = await axios.get(`/attendance/history?department=${user.department}&from=${fromDate}`);
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

  // Check for 5+ consecutive workday absences
  const checkConsecutiveAbsences = (emps, historyData) => {
    const fiveDayAbsents = [];
    
    emps.forEach(emp => {
      if (!emp || !emp._id) return;
      
      // Get last 30 days attendance for this employee
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let maxConsecutive = 0;
      let currentConsecutive = 0;
      let lastAbsentDate = null;
      
      // Loop through last 30 days
      for (let i = 0; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        // Only count workdays if includeWeekends is false
        if (!includeWeekends && !isWorkDay(date)) {
          continue;
        }
        
        const dayRecord = historyData.find(h => h.date === dateStr);
        let isAbsent = false;
        
        if (dayRecord && dayRecord.records) {
          const empRecord = dayRecord.records.find(r => r.employeeId === emp._id);
          isAbsent = empRecord && empRecord.status === "Absent";
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
            return total + (empRecord && empRecord.status === "Absent" ? 1 : 0);
          }
          return total;
        }, 0);
        
        fiveDayAbsents.push({
          employee: emp,
          consecutiveDays: maxConsecutive,
          lastAbsentDate: lastAbsentDate,
          totalAbsences: totalAbsences
        });
      }
    });
    
    setConsecutiveAbsences(fiveDayAbsents);
  };

  // Send notifications for 5-day absent employees
  const send5DayNotifications = async (employee, consecutiveDays) => {
    if (!employee || !employee._id) return false;
    
    try {
      // Notification to the employee
      await axios.post("/notifications", {
        userId: employee._id,
        title: "Attendance Warning",
        message: t.employeeNotification,
        type: "attendance_warning",
        priority: "high"
      });

      // Notification to department head
      await axios.post("/notifications", {
        recipientRole: "dept_head",
        title: "Employee Absence Warning",
        message: t.deptHeadNotification.replace("{name}", `${employee.firstName || ''} ${employee.lastName || ''}`),
        type: "attendance_alert",
        metadata: {
          employeeId: employee._id,
          employeeName: `${employee.firstName || ''} ${employee.lastName || ''}`,
          consecutiveDays: consecutiveDays
        }
      });

      // Notification to admin
      await axios.post("/notifications", {
        recipientRole: "admin",
        title: "Critical Attendance Alert",
        message: t.adminNotification.replace("{name}", `${employee.firstName || ''} ${employee.lastName || ''}`),
        type: "critical_attendance",
        priority: "urgent",
        metadata: {
          employeeId: employee._id,
          employeeName: `${employee.firstName || ''} ${employee.lastName || ''}`,
          consecutiveDays: consecutiveDays,
          department: employee.department || user.department
        }
      });

      return true;
    } catch (err) {
      console.error("Failed to send notifications:", err);
      return false;
    }
  };

  // Handle attendance form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split("T")[0];
      const records = employees.map(emp => ({
        employeeId: emp._id,
        date: today,
        status: attendanceForm[emp._id] || "Absent",
      }));

      await axios.post("/attendance/bulk", { records });
      setMessage(t.attendanceSubmitted);
      setSubmittedToday(true);

      // Refresh history after submission
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const fromDate = thirtyDaysAgo.toISOString().split("T")[0];
      
      const histRes = await axios.get(`/attendance/history?department=${user.department}&from=${fromDate}`);
      setHistory(histRes.data || []);
      
      // Check for new consecutive absences and send notifications
      const newAbsences = checkConsecutiveAbsencesAfterUpdate(employees, histRes.data || []);
      
      // Send notifications for newly reached 5-day absentees
      for (const absence of newAbsences) {
        if (absence.consecutiveDays === 5) { // Only notify when exactly 5 days
          const success = await send5DayNotifications(absence.employee, absence.consecutiveDays);
          if (success) {
            console.log(`Notifications sent for ${absence.employee.firstName} ${absence.employee.lastName}`);
          }
        }
      }

    } catch (err) {
      console.error(err);
      setMessage(t.attendanceFailed);
    }
  };

  // Helper to check for new consecutive absences after update
  const checkConsecutiveAbsencesAfterUpdate = (emps, historyData) => {
    const newFiveDayAbsents = [];
    
    emps.forEach(emp => {
      if (!emp || !emp._id) return;
      
      let currentConsecutive = 0;
      let maxConsecutive = 0;
      
      // Check last 30 days
      for (let i = 0; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        if (!includeWeekends && !isWorkDay(date)) {
          continue;
        }
        
        const dayRecord = historyData.find(h => h.date === dateStr);
        let isAbsent = false;
        
        if (dayRecord && dayRecord.records) {
          const empRecord = dayRecord.records.find(r => r.employeeId === emp._id);
          isAbsent = empRecord && empRecord.status === "Absent";
        }
        
        if (isAbsent) {
          currentConsecutive++;
          if (currentConsecutive > maxConsecutive) {
            maxConsecutive = currentConsecutive;
          }
        } else {
          currentConsecutive = 0;
        }
      }
      
      if (maxConsecutive >= 5) {
        // Check if this employee was already in our list
        const existing = consecutiveAbsences.find(a => a.employee && a.employee._id === emp._id);
        if (!existing || existing.consecutiveDays < maxConsecutive) {
          newFiveDayAbsents.push({
            employee: emp,
            consecutiveDays: maxConsecutive
          });
        }
      }
    });
    
    return newFiveDayAbsents;
  };

  // Handle mass status update
  const handleMassStatusUpdate = (status) => {
    const newForm = { ...attendanceForm };
    employees.forEach(emp => {
      if (emp._id) {
        newForm[emp._id] = status;
      }
    });
    setAttendanceForm(newForm);
  };

  // Get employee's last 5 days status
  const getLast5DaysStatus = (employeeId) => {
    const last5WorkDays = getLastNWorkDays(5);
    return getEmployeeAttendanceForDates(employeeId, last5WorkDays, history);
  };

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"}`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }
    
  if (!user || user.role?.toLowerCase() !== "departmenthead") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>{t.notAuthorized}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t.attendance}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {employees.length} employees in {employees[0]?.department?.name || "your"} department
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncludeWeekends(!includeWeekends)}
              className={`px-4 py-2 rounded-lg ${includeWeekends ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {includeWeekends ? t.workDaysOnly : t.includeWeekends}
            </button>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          {message}
        </div>
      )}

      {/* 5-Day Warning Alert */}
      {consecutiveAbsences.length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <div className="flex justify-between items-center">
            <div>
              <strong className="font-bold">{t.fiveDayWarning}</strong>
              <p className="mt-1">
                {consecutiveAbsences.length} employee{consecutiveAbsences.length > 1 ? 's' : ''} absent for 5+ consecutive workdays
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConsecutiveModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t.viewAbsents}
              </button>
              <button
                onClick={async () => {
                  for (const absence of consecutiveAbsences) {
                    if (absence.employee) {
                      await send5DayNotifications(absence.employee, absence.consecutiveDays);
                    }
                  }
                  setMessage(t.notificationSent);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                {t.sendNotification} All
              </button>
            </div>
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
          {!showHistoryView && (
            <>
              <button
                onClick={() => handleMassStatusUpdate("Present")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t.markAllPresent}
              </button>
              <button
                onClick={() => handleMassStatusUpdate("Absent")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t.markAllAbsent}
              </button>
            </>
          )}
          {showHistoryView && (
            <button
              onClick={() => setShowConsecutiveModal(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t.checkConsecutive}
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
                <th className="p-4 text-left">{t.totalDaysAbsent}</th>
                <th className="p-4 text-left">{t.consecutiveDaysAbsent}</th>
                <th className="p-4 text-left">{t.last5Days}</th>
                <th className="p-4 text-left">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {t.noEmployeesFound}
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
                    <tr key={emp._id} className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                            alt="Employee"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{emp.firstName || ''} {emp.lastName || ''}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{emp.empId || 'No ID'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-sm ${totalAbsences > 10 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : totalAbsences > 5 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                          {totalAbsences}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-sm ${is5DayAbsent ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"}`}>
                          {is5DayAbsent ? (consecutiveAbsences.find(a => a.employee && a.employee._id === emp._id)?.consecutiveDays || 0) : 0}
                          {is5DayAbsent && " ⚠️"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {last5Days.map((day, idx) => (
                            <span
                              key={idx}
                              title={`${new Date(day.date).toLocaleDateString()}: ${day.status}`}
                              className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                day.status === "Absent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                day.status === "Present" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                day.status === "Late" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {idx + 1}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            if (is5DayAbsent) {
                              const success = await send5DayNotifications(emp, consecutiveAbsences.find(a => a.employee && a.employee._id === emp._id)?.consecutiveDays || 5);
                              if (success) {
                                setMessage(t.notificationSent);
                              } else {
                                setMessage(t.notificationFailed);
                              }
                            }
                          }}
                          className={`px-3 py-1 rounded text-sm ${is5DayAbsent ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-600 text-white hover:bg-gray-700 opacity-50 cursor-not-allowed"}`}
                          disabled={!is5DayAbsent}
                        >
                          {t.sendNotification}
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
          <div className="overflow-x-auto rounded-lg border">
            <table className={`min-w-full ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="p-4 text-left">{t.employeeName}</th>
                  <th className="p-4 text-left">{t.status}</th>
                  <th className="p-4 text-left">{t.last5Days}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      {t.noEmployeesFound}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => {
                    if (!emp || !emp._id) return null;
                    
                    const is5DayAbsent = consecutiveAbsences.some(a => a.employee && a.employee._id === emp._id);
                    const last5Days = getLast5DaysStatus(emp._id);
                    
                    return (
                      <tr key={emp._id} className={`border-t ${is5DayAbsent ? 'bg-red-50 dark:bg-red-900/20' : ''} ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={emp.photo ? `${BACKEND_URL}${emp.photo}` : "/fallback-avatar.png"}
                              alt="Employee"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{emp.firstName || ''} {emp.lastName || ''}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{emp.empId || 'No ID'}</p>
                              {is5DayAbsent && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                  ⚠️ {t.fiveDayWarning}
                                </p>
                              )}
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
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              {last5Days.map((day, idx) => (
                                <span
                                  key={idx}
                                  title={`${new Date(day.date).toLocaleDateString()}: ${day.status}`}
                                  className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                                    day.status === "Absent" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                    day.status === "Present" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                    day.status === "Late" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                  }`}
                                >
                                  {idx + 1}
                                </span>
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

      {/* 5-Day Consecutive Absences Modal */}
      {showConsecutiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">{t.consecutiveAbsences}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Employees absent for 5+ consecutive workdays
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      for (const absence of consecutiveAbsences) {
                        if (absence.employee) {
                          await send5DayNotifications(absence.employee, absence.consecutiveDays);
                        }
                      }
                      setMessage(t.notificationSent);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    {t.sendNotification} All
                  </button>
                  <button
                    onClick={() => setShowConsecutiveModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {consecutiveAbsences.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t.noAbsencesRecorded}</p>
              ) : (
                <div className="space-y-4">
                  {consecutiveAbsences.map((item, index) => {
                    if (!item.employee) return null;
                    
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${darkMode ? "border-red-800 bg-red-900/20" : "border-red-200 bg-red-50"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.employee.photo ? `${BACKEND_URL}${item.employee.photo}` : "/fallback-avatar.png"}
                                alt="Employee"
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold">{item.employee.firstName || ''} {item.employee.lastName || ''}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.employee.empId || 'No ID'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.employee.department || 'No Department'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium mb-1">Attendance Statistics</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalDaysAbsent}</p>
                                <p className="text-lg font-bold">{item.totalAbsences}</p>
                              </div>
                              <div className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.consecutiveDaysAbsent}</p>
                                <p className="text-lg font-bold text-red-600 dark:text-red-400">{item.consecutiveDays}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <button
                              onClick={async () => {
                                const success = await send5DayNotifications(item.employee, item.consecutiveDays);
                                if (success) {
                                  setMessage(t.notificationSent);
                                } else {
                                  setMessage(t.notificationFailed);
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              {t.sendNotification}
                            </button>
                          </div>
                        </div>
                        
                        {item.lastAbsentDate && (
                          <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Last absent on: {new Date(item.lastAbsentDate).toLocaleDateString()}
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