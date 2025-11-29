// src/pages/deptHead/DeptHeadAttendance.jsx
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
    noAbsentees: "No absentees.",
    close: "Close",
    absentDaysTitle: "Absent Days for",
    noAbsencesRecorded: "No absences recorded.",
    submitAttendance: "Submit Attendance",
    attendanceSubmitted: "Attendance submitted successfully!",
    attendanceFailed: "Failed to submit attendance.",
    confirmReset: "Are you sure you want to reset attendance for the last 3 months?",
    attendanceResetSuccess: "Attendance reset successfully for last 3 months!",
    attendanceResetFailed: "Failed to reset attendance.",
    noEmployeesFound: "No employees found.",
    totalAbsences: "Total Absences",
    action: "Action",
    employeeName: "Employee Name",
    status: "Status",
    photo: "Photo",
    viewAbsents: "View Absents",
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
  const [viewAbsent, setViewAbsent] = useState([]);
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [employeeAbsentModal, setEmployeeAbsentModal] = useState(false);
  const [selectedEmployeeAbsentDates, setSelectedEmployeeAbsentDates] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [submittedToday, setSubmittedToday] = useState(false);

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
      } catch (err) {
        console.error("Failed to fetch employees or attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading)
    return <div className="p-6 text-center">{t.loading}</div>;
  if (!user || user.role?.toLowerCase() !== "departmenthead")
    return <div className="p-6 text-center text-red-500">{t.notAuthorized}</div>;

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

      const res = await axios.post("/attendance/bulk", { records });

      let alertMessage = "";
      employees.forEach(emp => {
        const empRecords = res.data.filter(r => r.employeeId === emp._id && r.status === "Absent");
        if (empRecords.length > 0) {
          alertMessage += `⚠️ ${emp.firstName} ${emp.lastName} absent today.\n`;
        }
      });

      setMessage(alertMessage || t.attendanceSubmitted);

      // Disable button after submission
      setSubmittedToday(true);
    } catch (err) {
      console.error(err);
      setMessage(t.attendanceFailed);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAbsent = (date) => {
    const absentEmployees = [];
    history.forEach(record => {
      if (record.date === date) {
        record.records.forEach(r => {
          if (r.status === "Absent") {
            const emp = employees.find(e => e._id === r.employeeId);
            if (emp) absentEmployees.push(emp);
          }
        });
      }
    });
    setViewAbsent(absentEmployees);
    setShowAbsentModal(true);
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
      setSubmittedToday(false); // reset button state after reset
    } catch (err) {
      console.error(err);
      setMessage(t.attendanceResetFailed);
    }
  };

  const handleEmployeeClick = (emp) => {
    const empRecords = history.flatMap(rec =>
      rec.records.filter(r => r.employeeId === emp._id && r.status === "Absent").map(r => rec.date)
    );
    setSelectedEmployeeAbsentDates(empRecords);
    setSelectedEmployeeName(`${emp.firstName} ${emp.lastName}`);
    setEmployeeAbsentModal(true);
  };

  const tableBgClass = darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800";
  const inputBgClass = darkMode ? "bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600" : "bg-white text-gray-800 placeholder-gray-500 border-gray-300";

  return (
    <div className={`p-6 max-w-6xl mx-auto transition-colors duration-700 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {showHistoryView
            ? t.viewAttendanceHistory
            : `${t.attendanceFormTitle} ${employees[0]?.department?.name || "N/A"} Department`}
        </h2>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition`}
            onClick={() => setShowHistoryView(!showHistoryView)}
          >
            {showHistoryView ? t.backToForm : t.viewAttendanceHistory}
          </button>
          {showHistoryView && (
            <button
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              onClick={handleResetAttendance}
            >
              {t.resetLast3Months}
            </button>
          )}
        </div>
      </div>

      {showHistoryView ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`mb-4 w-full p-2 rounded border ${inputBgClass}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <div className="overflow-x-auto rounded shadow p-4">
            <table className={`min-w-full border ${tableBgClass}`}>
              <thead className={darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"}>
                <tr>
                  <th className="p-2 border">{t.employeeName}</th>
                  <th className="p-2 border text-center">{t.totalAbsences}</th>
                  <th className="p-2 border text-center">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const empRecords = history.flatMap(rec =>
                    rec.records.filter(r => r.employeeId === emp._id && r.status === "Absent").map(r => rec.date)
                  );
                  return (
                    <tr key={emp._id} className="border-b hover:bg-gray-600">
                      <td
                        className="p-2 text-blue-400 cursor-pointer underline"
                        onClick={() => handleEmployeeClick(emp)}
                      >
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="p-2 text-center">{empRecords.length}</td>
                      <td className="p-2 text-center">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => handleEmployeeClick(emp)}
                        >
                          {t.viewAbsents}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      {t.noEmployeesFound}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`mb-4 w-full p-2 rounded border ${inputBgClass}`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {message && (
            <div className="mb-4 p-3 bg-yellow-200 text-yellow-800 rounded whitespace-pre-line">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto rounded shadow">
              <table className={`min-w-full ${tableBgClass}`}>
                <thead className={darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"}>
                  <tr>
                    <th className="p-2 border">{t.photo}</th>
                    <th className="p-2 border">{t.employeeName}</th>
                    <th className="p-2 border">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp._id} className="border-b hover:bg-gray-600">
                      <td className="p-2">
                        <img
                          src={emp.photo ? `http://localhost:5000${emp.photo}` : "/fallback-avatar.png"}
                          alt="Employee"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="p-2">{emp.firstName} {emp.lastName}</td>
                      <td className="p-2">
                        <select
                          value={attendanceForm[emp._id]}
                          onChange={e => handleAttendanceChange(emp._id, e.target.value)}
                          className={`border p-1 rounded ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        {t.noEmployeesFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={submittedToday}
                className={`bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 transition ${submittedToday ? "opacity-50 cursor-not-allowed" : ""}`}
                title={submittedToday ? "Attendance already submitted for today" : ""}
              >
                {submittedToday ? "Attendance Submitted" : t.submitAttendance}
              </button>
            </div>
          </form>
        </>
      )}

      {/* Absent modal */}
      {showAbsentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full text-gray-900 dark:text-gray-100">
            <h3 className="text-xl font-bold mb-4">{t.absentEmployees}</h3>
            <div className="max-h-64 overflow-y-auto">
              {viewAbsent.length === 0 && <p>{t.noAbsentees}</p>}
              {viewAbsent.map(emp => (
                <div key={emp._id} className="flex items-center gap-3 mb-2">
                  <img
                    src={emp.photo ? `http://localhost:5000${emp.photo}` : "/fallback-avatar.png"}
                    alt="Employee"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span>{emp.firstName} {emp.lastName}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => setShowAbsentModal(false)}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Employee absent modal */}
      {employeeAbsentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full text-gray-900 dark:text-gray-100">
            <h3 className="text-xl font-bold mb-4">{t.absentDaysTitle} {selectedEmployeeName}</h3>
            {selectedEmployeeAbsentDates.length === 0 && <p>{t.noAbsencesRecorded}</p>}
            <ul className="list-disc pl-5 max-h-64 overflow-y-auto">
              {selectedEmployeeAbsentDates.map(date => (
                <li key={date}>{new Date(date).toLocaleDateString()}</li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => setEmployeeAbsentModal(false)}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadAttendance;
