import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext"; // darkMode and language context
import axiosInstance from "../../utils/axiosInstance";
import { FaFilePdf, FaFileExcel, FaUsers, FaFileAlt, FaClipboardList, FaBullhorn } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminReports = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language, setLanguage, setDarkMode } = useSettings();
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Persist language and dark mode across sessions
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);

    const storedDark = localStorage.getItem("darkMode");
    if (storedDark) setDarkMode(storedDark === "true");
  }, [setLanguage, setDarkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Multilingual texts including table headers
  const texts = {
    en: {
      totalEmployees: "Total Employees",
      totalRequisitions: "Total Requisitions",
      totalLeaves: "Total Leaves",
      totalAnnouncements: "Total Announcements",
      employeesAdded: "Employees Added",
      employeeReports: "Employee Reports",
      downloadPDF: "Download PDF",
      downloadExcel: "Download Excel",
      resetCounters: "Reset 3-Month Counters",
      confirmReset: "Are you sure you want to reset the 3-month counters?",
      noEmployeeData: "No employee data available.",
      photo: "Photo",
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      email: "Email",
      empId: "Emp ID",
      department: "Department",
      position: "Position",
      term: "Term",
      sex: "Sex",
      maritalStatus: "Marital Status",
      phone: "Phone",
      address: "Address",
      contactPerson: "Contact Person",
      contactAddress: "Contact Address",
      salary: "Salary",
      experience: "Experience",
      qualification: "Qualification",
      dob: "DOB",
      status: "Status",
      absentDays: "Absent Days",
      leaveRequests: "Leave Requests"
    },
    am: {
      totalEmployees: "አጠቃላይ ሰራተኞች",
      totalRequisitions: "አጠቃላይ ጥያቄዎች",
      totalLeaves: "አጠቃላይ ፈቃዶች",
      totalAnnouncements: "አጠቃላይ ማስታወቂያዎች",
      employeesAdded: "ተጨማሪ ሰራተኞች",
      employeeReports: "የሰራተኞች ሪፖርት",
      downloadPDF: "PDF አውርድ",
      downloadExcel: "Excel አውርድ",
      resetCounters: "የ3 ወር ቆጣሪ ዳግም ማስተካከያ",
      confirmReset: "3 ወር ቆጣሪዎችን ማስወገድ እርግጠኛ ነህ?",
      noEmployeeData: "ምንም የሰራተኞች መረጃ የለም።",
      photo: "ፎቶ",
      firstName: "ስም",
      middleName: "የአባት ስም",
      lastName: "የአያት ስም",
      email: "ኢሜል",
      empId: "ሰራተኛ መታወቂያ",
      department: "የጽ/ቤት ስም",
      position: "የስራ አይነት",
      term: "የስራ ወቅት",
      sex: "ፆታ",
      maritalStatus: "የጋብቻ ሁኔታ",
      phone: "ስልክ",
      address: "አድራሻ",
      contactPerson: "የእውቀት ሰው",
      contactAddress: "የእውቀት አድራሻ",
      salary: "ደመወዝ",
      experience: "ልምድ",
      qualification: "ትምህርት ዝግጅት",
      dob: "የትውልድ ቀን",
      status: "ሁኔታ",
      absentDays: "የአመራር ቀናት",
      leaveRequests: "የፈቃድ ጥያቄዎች"
    },
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    const fetchReport = async () => {
      if (authLoading) return;
      if (!user) {
        setErrorMsg("No user logged in.");
        setLoading(false);
        return;
      }
      if (user.role.toLowerCase() !== "admin") {
        setErrorMsg(`Access denied. Your role: ${user.role}`);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosInstance.get("/reports/admin");
        setReport(Array.isArray(data.employees) ? data.employees : []);
        setSummary(data.summary || {
          totalEmployees: data.employees?.length || 0,
          totalLeaves: 0,
          totalRequisitions: 0,
          totalAnnouncements: 0,
          totalEmployeesAdded: 0,
        });
      } catch (err) {
        console.error("Report fetch error:", err);
        setErrorMsg(err.response?.data?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [user, authLoading]);

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    const tableColumn = [
      t.firstName, t.middleName, t.lastName, t.email, t.empId,
      t.department, t.position, t.term, t.sex, t.maritalStatus,
      t.phone, t.address, t.contactPerson, t.contactAddress,
      t.salary, t.experience, t.qualification, t.dob, t.status,
      t.absentDays, t.leaveRequests
    ];

    const tableRows = report.map(emp => [
      emp.firstName || "-", emp.middleName || "-", emp.lastName || "-", emp.email || "-", emp.empId || "-",
      typeof emp.department === "object" ? emp.department?.name || "-" : emp.department || "-",
      emp.typeOfPosition || "-", emp.termOfEmployment || "-", emp.sex || "-", emp.maritalStatus || "-",
      emp.phoneNumber || "-", emp.address || "-", emp.contactPerson || "-", emp.contactPersonAddress || "-",
      emp.salary || "-", emp.experience || "-", emp.qualification || "-", emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "-",
      emp.employeeStatus || "-", emp.absentDays ?? 0, emp.leaveRequests ?? 0
    ]);

    doc.setFontSize(14);
    doc.text("DTU HRMS Employee Report", 40, 40);
    doc.setFontSize(12);
    doc.text(`${t.totalEmployees}: ${summary.totalEmployees || 0}`, 40, 70);
    doc.text(`${t.totalRequisitions}: ${summary.totalRequisitions || 0}`, 200, 70);
    doc.text(`${t.totalLeaves}: ${summary.totalLeaves || 0}`, 400, 70);
    doc.text(`${t.totalAnnouncements}: ${summary.totalAnnouncements || 0}`, 600, 70);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: "striped",
      headStyles: { fillColor: darkMode ? [75, 85, 99] : [34, 197, 94] },
      styles: { fontSize: 9, textColor: darkMode ? [255,255,255] : [0,0,0] },
      margin: { left: 20, right: 20 },
    });

    doc.save("employee_report.pdf");
  };

  const exportExcel = () => {
    const totalsRow = [{
      [t.firstName]: `${t.totalEmployees}: ${summary.totalEmployees || 0}`,
      [t.middleName]: `${t.totalRequisitions}: ${summary.totalRequisitions || 0}`,
      [t.lastName]: `${t.totalLeaves}: ${summary.totalLeaves || 0}`,
      [t.email]: `${t.totalAnnouncements}: ${summary.totalAnnouncements || 0}`,
    }];

    const worksheet = XLSX.utils.json_to_sheet([
      ...totalsRow,
      ...report.map(emp => ({
        [t.firstName]: emp.firstName,
        [t.middleName]: emp.middleName,
        [t.lastName]: emp.lastName,
        [t.email]: emp.email,
        [t.empId]: emp.empId,
        [t.department]: typeof emp.department === "object" ? emp.department?.name || "-" : emp.department || "-",
        [t.position]: emp.typeOfPosition,
        [t.term]: emp.termOfEmployment,
        [t.sex]: emp.sex,
        [t.maritalStatus]: emp.maritalStatus,
        [t.phone]: emp.phoneNumber,
        [t.address]: emp.address,
        [t.contactPerson]: emp.contactPerson,
        [t.contactAddress]: emp.contactPersonAddress,
        [t.salary]: emp.salary,
        [t.experience]: emp.experience,
        [t.qualification]: emp.qualification,
        [t.dob]: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "-",
        [t.status]: emp.employeeStatus,
        [t.absentDays]: emp.absentDays ?? 0,
        [t.leaveRequests]: emp.leaveRequests ?? 0,
      })),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employee_report.xlsx");
  };

  if (authLoading || loading) return <p className="p-6 text-gray-700">Loading report...</p>;
  if (errorMsg) return <p className="p-6 text-red-600">{errorMsg}</p>;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} p-6 min-h-screen transition-colors duration-300`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center">
          <FaUsers className="text-4xl text-indigo-500 mb-2" />
          <span>{t.totalEmployees}</span>
          <span className="text-2xl font-bold">{summary.totalEmployees || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center">
          <FaClipboardList className="text-4xl text-green-500 mb-2" />
          <span>{t.totalRequisitions}</span>
          <span className="text-2xl font-bold">{summary.totalRequisitions || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center">
          <FaFileAlt className="text-4xl text-yellow-500 mb-2" />
          <span>{t.totalLeaves}</span>
          <span className="text-2xl font-bold">{summary.totalLeaves || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center">
          <FaBullhorn className="text-4xl text-red-500 mb-2" />
          <span>{t.totalAnnouncements}</span>
          <span className="text-2xl font-bold">{summary.totalAnnouncements || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center">
          <FaUsers className="text-4xl text-purple-500 mb-2" />
          <span>{t.employeesAdded}</span>
          <span className="text-2xl font-bold">{summary.totalEmployeesAdded || 0}</span>
        </div>
      </div>

      {/* Report Title & Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">{t.employeeReports}</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition">
            <FaFilePdf /> {t.downloadPDF}
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
            <FaFileExcel /> {t.downloadExcel}
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded p-4">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 sticky top-0">
            <tr>
              <th className="p-2 border">{t.photo}</th>
              <th className="p-2 border">{t.firstName}</th>
              <th className="p-2 border">{t.middleName}</th>
              <th className="p-2 border">{t.lastName}</th>
              <th className="p-2 border">{t.email}</th>
              <th className="p-2 border">{t.empId}</th>
              <th className="p-2 border">{t.department}</th>
              <th className="p-2 border">{t.position}</th>
              <th className="p-2 border">{t.term}</th>
              <th className="p-2 border">{t.sex}</th>
              <th className="p-2 border">{t.maritalStatus}</th>
              <th className="p-2 border">{t.phone}</th>
              <th className="p-2 border">{t.address}</th>
              <th className="p-2 border">{t.contactPerson}</th>
              <th className="p-2 border">{t.contactAddress}</th>
              <th className="p-2 border">{t.salary}</th>
              <th className="p-2 border">{t.experience}</th>
              <th className="p-2 border">{t.qualification}</th>
              <th className="p-2 border">{t.dob}</th>
              <th className="p-2 border">{t.status}</th>
              <th className="p-2 border">{t.absentDays}</th>
              <th className="p-2 border">{t.leaveRequests}</th>
            </tr>
          </thead>
          <tbody>
            {report.length > 0 ? (
              report.map(emp => (
                <tr key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b">
                  <td className="p-2 border text-center">
                    {emp.photo ? (
                      <img
                        src={`http://localhost:5000${emp.photo}`}
                        alt="Employee"
                        className="w-12 h-12 rounded-full object-cover mx-auto"
                      />
                    ) : "No Photo"}
                  </td>
                  <td className="p-2 border">{emp.firstName || "-"}</td>
                  <td className="p-2 border">{emp.middleName || "-"}</td>
                  <td className="p-2 border">{emp.lastName || "-"}</td>
                  <td className="p-2 border">{emp.email || "-"}</td>
                  <td className="p-2 border">{emp.empId || "-"}</td>
                  <td className="p-2 border">{typeof emp.department === "object" ? emp.department?.name || "-" : emp.department || "-"}</td>
                  <td className="p-2 border">{emp.typeOfPosition || "-"}</td>
                  <td className="p-2 border">{emp.termOfEmployment || "-"}</td>
                  <td className="p-2 border">{emp.sex || "-"}</td>
                  <td className="p-2 border">{emp.maritalStatus || "-"}</td>
                  <td className="p-2 border">{emp.phoneNumber || "-"}</td>
                  <td className="p-2 border">{emp.address || "-"}</td>
                  <td className="p-2 border">{emp.contactPerson || "-"}</td>
                  <td className="p-2 border">{emp.contactPersonAddress || "-"}</td>
                  <td className="p-2 border">{emp.salary || "-"}</td>
                  <td className="p-2 border">{emp.experience || "-"}</td>
                  <td className="p-2 border">{emp.qualification || "-"}</td>
                  <td className="p-2 border">{emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "-"}</td>
                  <td className="p-2 border">{emp.employeeStatus || "-"}</td>
                  <td className="p-2 border">{emp.absentDays ?? 0}</td>
                  <td className="p-2 border">{emp.leaveRequests ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="22" className="text-center p-4 text-gray-500 dark:text-gray-400">
                  {t.noEmployeeData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
