import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";
import { 
  FaUsers, FaFilePdf, FaFileExcel, FaCalendarTimes, 
  FaClipboardList, FaBuilding, FaPaperPlane, FaUserSlash,
  FaChartLine, FaDownload, FaSync, FaFilter, FaSearch,
  FaEye, FaEyeSlash, FaSort, FaSortUp, FaSortDown,
  FaUser, FaEnvelope, FaIdCard, FaBriefcase, FaDollarSign,
  FaCalendarDay, FaPhone, FaMapMarkerAlt, FaVenusMars,
  FaBirthdayCake, FaGraduationCap, FaHistory, FaUserFriends,
  FaHeart, FaHome
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Custom Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-xl z-[100] flex items-center gap-3 min-w-[300px]`}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        ✕
      </button>
    </motion.div>
  );
};

const AdminReports = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true, firstName: true, lastName: true, email: true, empId: true,
    department: true, position: true, status: true, salary: true,
    phone: true, address: true, dob: true, sex: true, maritalStatus: true,
    qualification: true, experience: true, term: true,
    contactPerson: true, contactAddress: true,
    absentDays: true, leaveRequests: true
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Multilingual text
  const translations = {
    en: {
      dashboard: "Employee Management Dashboard",
      employeeReports: "All Employee Information",
      downloadPDF: "Download PDF",
      downloadExcel: "Download Excel",
      noEmployeeData: "No employee data available",
      photo: "Photo",
      firstName: "First Name",
      middleName: "Middle Name",
      lastName: "Last Name",
      email: "Email",
      empId: "Employee ID",
      department: "Department",
      position: "Position",
      term: "Contract Term",
      sex: "Gender",
      maritalStatus: "Marital Status",
      phone: "Phone",
      address: "Address",
      contactPerson: "Emergency Contact",
      contactAddress: "Emergency Address",
      salary: "Salary",
      experience: "Experience",
      qualification: "Qualification",
      dob: "Date of Birth",
      status: "Status",
      absentDays: "Absent Days",
      leaveRequests: "Leave Requests",
      totalEmployees: "Total Employees",
      totalAbsent: "Total Absent Days",
      totalLeave: "Total Leave Requests",
      totalVacancy: "Active Vacancies",
      totalRequisition: "Open Requisitions",
      totalLeft: "Employees Left",
      resetReport: "Reset Absence & Leave Records",
      search: "Search employees...",
      filter: "Filter by Status",
      columns: "Visible Columns",
      all: "All",
      active: "Active",
      inactive: "Inactive",
      onLeave: "On Leave",
      terminated: "Terminated",
      loading: "Loading employee data...",
      error: "Error loading data",
      success: "Success",
      reportReset: "Absence and leave records reset successfully",
      reportError: "Failed to reset records",
      exportSuccess: "Report exported successfully",
      exportError: "Failed to export report",
      statistics: "HR Statistics",
      analytics: "Analytics Overview",
      sortBy: "Sort by",
      clearFilters: "Clear Filters",
      customizeView: "Customize Columns",
      apply: "Apply",
      cancel: "Cancel",
      showAllInfo: "Show All Information",
      exportActions: "Export Options",
      employeeDetails: "Employee Details"
    },
    am: {
      dashboard: "የሰራተኞች አስተዳደር ዳሽቦርድ",
      employeeReports: "ሁሉም የሰራተኞች መረጃ",
      downloadPDF: "PDF አውርድ",
      downloadExcel: "Excel አውርድ",
      noEmployeeData: "ምንም የሰራተኞች መረጃ የለም",
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
      contactPerson: "አደጋ የግንኙነት ሰው",
      contactAddress: "አደጋ የግንኙነት አድራሻ",
      salary: "ደመወዝ",
      experience: "ልምድ",
      qualification: "ትምህርት ዝግጅት",
      dob: "የትውልድ ቀን",
      status: "ሁኔታ",
      absentDays: "የአመራር ቀናት",
      leaveRequests: "የፈቃድ ጥያቄዎች",
      totalEmployees: "አጠቃላይ ሰራተኞች",
      totalAbsent: "አጠቃላይ የአመራር ቀናት",
      totalLeave: "አጠቃላይ የፈቃድ ጥያቄዎች",
      totalVacancy: "ንቁ ቦታዎች",
      totalRequisition: "ክፍት ጥያቄዎች",
      totalLeft: "የተሰረዙ ሰራተኞች",
      resetReport: "የአመራር እና ፈቃድ መዛግብቶች አደስ",
      search: "ሰራተኞችን ፈልግ...",
      filter: "በሁኔታ አጣራ",
      columns: "የሚታዩ አምዶች",
      all: "ሁሉም",
      active: "ንቁ",
      inactive: "ንቁ ያልሆነ",
      onLeave: "በፈቃድ ላይ",
      terminated: "የተሰረዘ",
      loading: "የሰራተኞች መረጃ በመጫን ላይ...",
      error: "መረጃ ማምጣት አልተሳካም",
      success: "ተሳክቷል",
      reportReset: "የአመራር እና ፈቃድ መዛግብቶች በተሳካ ሁኔታ ተደስሷል",
      reportError: "መዛግብቶች መደሰስ አልተሳካም",
      exportSuccess: "ሪፖርት በተሳካ ሁኔታ ተላከ",
      exportError: "ሪፖርት መላክ አልተሳካም",
      statistics: "HR ስታቲስቲክስ",
      analytics: "የትንታኔ አጠቃላይ እይታ",
      sortBy: "በዚህ አደራጅ",
      clearFilters: "ማጣሪያዎችን አጽዳ",
      customizeView: "አምዶች አበጅ",
      apply: "ተግብር",
      cancel: "ይቅር",
      showAllInfo: "ሁሉንም መረጃ አሳይ",
      exportActions: "የማውጫ አማራጮች",
      employeeDetails: "የሰራተኛ ዝርዝሮች"
    }
  };

  const t = translations[language] || translations.en;

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get employee photo URL - FIXED VERSION
  const getEmployeePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // Check if it's already a full URL
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    
    // If it's a relative path, check if it starts with uploads/
    if (photoPath.startsWith('uploads/')) {
      // Direct URL to your uploads folder
      return `http://localhost:5000/${photoPath}`;
    }
    
    // If it's just a filename
    if (photoPath.includes('.')) {
      return `http://localhost:5000/uploads/${photoPath}`;
    }
    
    return null;
  };

  // Fetch report & summary
  const fetchReport = useCallback(async () => {
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
    
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/reports/admin");
      
      const employees = Array.isArray(data.employees) ? data.employees : [];
      const processedEmployees = employees.map(emp => ({
        ...emp,
        absentDays: emp.absentDays || 0,
        leaveRequests: emp.leaveRequests || 0,
        photoUrl: getEmployeePhotoUrl(emp.photo)
      }));
      
      setReport(processedEmployees);
      
      setSummary({
        totalEmployees: processedEmployees.length,
        totalAbsent: processedEmployees.reduce((acc, emp) => acc + (emp.absentDays || 0), 0),
        totalLeave: processedEmployees.reduce((acc, emp) => acc + (emp.leaveRequests || 0), 0),
        totalVacancy: data.totalVacancies || 0,
        totalRequisition: data.totalRequisitions || 0,
        totalLeft: data.totalLeftEmployees || 0,
        activeEmployees: processedEmployees.filter(emp => emp.employeeStatus === 'Active').length,
        averageSalary: processedEmployees.length > 0 
          ? Math.round(processedEmployees.reduce((acc, emp) => acc + (parseFloat(emp.salary) || 0), 0) / processedEmployees.length)
          : 0
      });
      
      setErrorMsg("");
    } catch (err) {
      console.error("Report fetch error:", err);
      const errorMessage = err.response?.data?.message || t.error;
      setErrorMsg(errorMessage);
      showNotification('error', errorMessage);
    } finally { 
      setLoading(false); 
    }
  }, [user, authLoading, t.error]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const resetReport = async () => {
    if (!window.confirm(language === 'am' 
      ? 'የአመራር እና ፈቃድ መዛግብቶችን ለማደስ እርግጠኛ ነዎት?' 
      : 'Are you sure you want to reset the absence and leave records?')) return;
    
    try {
      await axiosInstance.post("/reports/admin/reset");
      setReport(prev => prev.map(emp => ({ 
        ...emp, 
        absentDays: 0, 
        leaveRequests: 0 
      })));
      setSummary(prev => ({ 
        ...prev, 
        totalAbsent: 0, 
        totalLeave: 0 
      }));
      showNotification('success', t.reportReset);
    } catch (err) {
      console.error("Reset error:", err);
      showNotification('error', t.reportError);
    }
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key) return filteredReport;
    
    return [...filteredReport].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle nested objects
      if (sortConfig.key === 'department' && typeof a.department === 'object') {
        aValue = a.department?.name || '';
        bValue = b.department?.name || '';
      }
      
      // Handle numeric values
      if (['salary', 'absentDays', 'leaveRequests'].includes(sortConfig.key)) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      // Handle dates
      if (sortConfig.key === 'dob' || sortConfig.key === 'dateOfBirth') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter report based on search and status
  const filteredReport = report.filter((emp) => {
    const matchesSearch = searchTerm === "" || 
      (emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.empId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof emp.department === 'object' ? 
        emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) : 
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      emp.employeeStatus?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const sortedReport = getSortedData();

  // Export functions - IMPROVED VERSION
  const exportPDF = () => {
    try {
      const doc = new jsPDF("l", "pt", "a3"); // Using A3 for more space
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(44, 62, 80);
      doc.text("DTU HRMS - Complete Employee Report", 40, 40);
      
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 40, 65);
      doc.text(`Total Employees: ${summary.totalEmployees}`, 40, 85);
      
      // Summary Statistics
      doc.setFontSize(14);
      doc.setTextColor(75, 85, 99);
      doc.text("Summary Statistics:", 40, 115);
      
      doc.setFontSize(10);
      doc.text(`• Total Employees: ${summary.totalEmployees}`, 60, 140);
      doc.text(`• Active Employees: ${summary.activeEmployees || 0}`, 60, 160);
      doc.text(`• Average Salary: $${summary.averageSalary?.toLocaleString() || '0'}`, 60, 180);
      doc.text(`• Total Absent Days: ${summary.totalAbsent || 0}`, 60, 200);
      doc.text(`• Total Leave Requests: ${summary.totalLeave || 0}`, 60, 220);
      doc.text(`• Active Vacancies: ${summary.totalVacancy || 0}`, 60, 240);
      
      // Prepare table data based on visible columns
      const tableColumns = [];
      const columnHeaders = [];
      
      // Define all possible columns with their export labels
      const columnDefinitions = [
        { key: 'photo', label: t.photo },
        { key: 'firstName', label: t.firstName },
        { key: 'lastName', label: t.lastName },
        { key: 'email', label: t.email },
        { key: 'empId', label: t.empId },
        { key: 'department', label: t.department },
        { key: 'position', label: t.position },
        { key: 'status', label: t.status },
        { key: 'salary', label: t.salary },
        { key: 'phone', label: t.phone },
        { key: 'address', label: t.address },
        { key: 'dob', label: t.dob },
        { key: 'sex', label: t.sex },
        { key: 'maritalStatus', label: t.maritalStatus },
        { key: 'qualification', label: t.qualification },
        { key: 'experience', label: t.experience },
        { key: 'term', label: t.term },
        { key: 'absentDays', label: t.absentDays },
        { key: 'leaveRequests', label: t.leaveRequests },
        { key: 'contactPerson', label: t.contactPerson },
        { key: 'contactAddress', label: t.contactAddress }
      ];
      
      // Add visible columns
      columnDefinitions.forEach(col => {
        if (visibleColumns[col.key]) {
          tableColumns.push(col.key);
          columnHeaders.push(col.label);
        }
      });
      
      // Prepare table rows
      const tableRows = sortedReport.map(emp => {
        const row = [];
        tableColumns.forEach(col => {
          switch(col) {
            case 'photo':
              row.push('📷');
              break;
            case 'department':
              row.push(typeof emp.department === "object" ? emp.department?.name || '-' : emp.department || '-');
              break;
            case 'position':
              row.push(emp.typeOfPosition || '-');
              break;
            case 'status':
              row.push(emp.employeeStatus || '-');
              break;
            case 'salary':
              row.push(emp.salary ? `$${parseFloat(emp.salary).toLocaleString()}` : '-');
              break;
            case 'dob':
              row.push(emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '-');
              break;
            case 'address':
              row.push(emp.address || '-');
              break;
            case 'contactPerson':
              row.push(emp.contactPerson || '-');
              break;
            case 'contactAddress':
              row.push(emp.contactPersonAddress || '-');
              break;
            case 'absentDays':
              row.push(emp.absentDays || 0);
              break;
            case 'leaveRequests':
              row.push(emp.leaveRequests || 0);
              break;
            case 'sex':
              row.push(emp.sex || '-');
              break;
            case 'maritalStatus':
              row.push(emp.maritalStatus || '-');
              break;
            case 'qualification':
              row.push(emp.qualification || '-');
              break;
            case 'experience':
              row.push(emp.experience || '-');
              break;
            case 'term':
              row.push(emp.termOfEmployment || '-');
              break;
            default:
              row.push(emp[col] || '-');
          }
        });
        return row;
      });
      
      // Create table starting after summary
      autoTable(doc, {
        startY: 260,
        head: [columnHeaders],
        body: tableRows,
        theme: 'striped',
        headStyles: { 
          fillColor: [75, 85, 99],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Photo column
          1: { cellWidth: 60 }, // First Name
          2: { cellWidth: 60 }, // Last Name
          3: { cellWidth: 100 }, // Email
          4: { cellWidth: 60 }, // Emp ID
          // Adjust other columns as needed
        },
        margin: { left: 40, right: 40 },
        didDrawPage: function (data) {
          // Footer
          const pageCount = doc.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 20);
          doc.text("DTU HRMS - Confidential Employee Data", doc.internal.pageSize.width - 200, doc.internal.pageSize.height - 20);
        }
      });
      
      // Save the PDF
      doc.save(`employee_complete_report_${new Date().toISOString().split('T')[0]}.pdf`);
      showNotification('success', t.exportSuccess);
    } catch (error) {
      console.error("PDF export error:", error);
      showNotification('error', t.exportError);
    }
  };

  const exportExcel = () => {
    try {
      // Prepare main employee data
      const excelData = sortedReport.map(emp => {
        const row = {};
        
        // Add all visible columns
        if (visibleColumns.photo) row[t.photo] = '📷';
        if (visibleColumns.firstName) row[t.firstName] = emp.firstName || '-';
        if (visibleColumns.lastName) row[t.lastName] = emp.lastName || '-';
        if (visibleColumns.email) row[t.email] = emp.email || '-';
        if (visibleColumns.empId) row[t.empId] = emp.empId || '-';
        if (visibleColumns.department) row[t.department] = typeof emp.department === "object" ? emp.department?.name || '-' : emp.department || '-';
        if (visibleColumns.position) row[t.position] = emp.typeOfPosition || '-';
        if (visibleColumns.status) row[t.status] = emp.employeeStatus || '-';
        if (visibleColumns.salary) row[t.salary] = emp.salary ? `$${parseFloat(emp.salary).toLocaleString()}` : '-';
        if (visibleColumns.phone) row[t.phone] = emp.phoneNumber || '-';
        if (visibleColumns.address) row[t.address] = emp.address || '-';
        if (visibleColumns.dob) row[t.dob] = emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '-';
        if (visibleColumns.sex) row[t.sex] = emp.sex || '-';
        if (visibleColumns.maritalStatus) row[t.maritalStatus] = emp.maritalStatus || '-';
        if (visibleColumns.qualification) row[t.qualification] = emp.qualification || '-';
        if (visibleColumns.experience) row[t.experience] = emp.experience || '-';
        if (visibleColumns.term) row[t.term] = emp.termOfEmployment || '-';
        if (visibleColumns.absentDays) row[t.absentDays] = emp.absentDays || 0;
        if (visibleColumns.leaveRequests) row[t.leaveRequests] = emp.leaveRequests || 0;
        if (visibleColumns.contactPerson) row[t.contactPerson] = emp.contactPerson || '-';
        if (visibleColumns.contactAddress) row[t.contactAddress] = emp.contactPersonAddress || '-';
        
        return row;
      });
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Create Summary Sheet
      const summaryData = [
        ["DTU HRMS - Complete Employee Report"],
        [`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`],
        [""],
        ["HR Statistics Summary"],
        [""],
        ["Metric", "Value"],
        [t.totalEmployees, summary.totalEmployees],
        ["Active Employees", summary.activeEmployees || 0],
        ["Inactive Employees", (summary.totalEmployees - (summary.activeEmployees || 0))],
        ["Average Salary", summary.averageSalary ? `$${summary.averageSalary.toLocaleString()}` : '-'],
        [t.totalAbsent, summary.totalAbsent],
        [t.totalLeave, summary.totalLeave],
        [t.totalVacancy, summary.totalVacancy],
        [t.totalRequisition, summary.totalRequisition],
        [t.totalLeft, summary.totalLeft],
        [""],
        ["Report Filters"],
        ["Search Term", searchTerm || 'None'],
        ["Status Filter", statusFilter !== 'all' ? statusFilter : 'All'],
        ["Sort By", sortConfig.key ? t[sortConfig.key] || sortConfig.key : 'None'],
        ["Sort Direction", sortConfig.direction === 'ascending' ? 'Ascending' : 'Descending']
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Create Employee Data Sheet
      const employeeSheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, summarySheet, "Report Summary");
      XLSX.utils.book_append_sheet(wb, employeeSheet, "Employee Data");
      
      // Auto-size columns for employee sheet
      const wscols = [];
      const maxCols = Object.keys(excelData[0] || {}).length;
      
      for (let i = 0; i < maxCols; i++) {
        const colData = excelData.map(row => {
          const key = Object.keys(row)[i];
          return row[key] ? String(row[key]) : '';
        });
        const maxLength = Math.max(...colData.map(cell => cell.length));
        wscols.push({ wch: Math.min(Math.max(maxLength, 10), 50) });
      }
      employeeSheet['!cols'] = wscols;
      
      // Auto-size columns for summary sheet
      const summaryCols = [
        { wch: 30 },
        { wch: 30 }
      ];
      summarySheet['!cols'] = summaryCols;
      
      // Save file
      XLSX.writeFile(wb, `hrms_complete_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      showNotification('success', t.exportSuccess);
    } catch (error) {
      console.error("Excel export error:", error);
      showNotification('error', t.exportError);
    }
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1" /> : 
      <FaSortDown className="ml-1" />;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'on leave': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'terminated': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get column icon
  const getColumnIcon = (column) => {
    switch (column) {
      case 'photo': return <FaUser />;
      case 'firstName': return <FaUser />;
      case 'lastName': return <FaUser />;
      case 'email': return <FaEnvelope />;
      case 'empId': return <FaIdCard />;
      case 'department': return <FaBuilding />;
      case 'position': return <FaBriefcase />;
      case 'salary': return <FaDollarSign />;
      case 'phone': return <FaPhone />;
      case 'address': return <FaMapMarkerAlt />;
      case 'dob': return <FaBirthdayCake />;
      case 'sex': return <FaVenusMars />;
      case 'maritalStatus': return <FaHeart />;
      case 'qualification': return <FaGraduationCap />;
      case 'experience': return <FaHistory />;
      case 'term': return <FaCalendarDay />;
      case 'contactPerson': return <FaUserFriends />;
      case 'contactAddress': return <FaHome />;
      case 'absentDays': return <FaCalendarTimes />;
      case 'leaveRequests': return <FaClipboardList />;
      case 'status': return <FaChartLine />;
      default: return <FaUser />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"}`}>
        <div className={`p-8 rounded-2xl shadow-xl text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h3 className="text-xl font-bold mb-2">{t.error}</h3>
          <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{errorMsg}</p>
          <button
            onClick={fetchReport}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">{t.dashboard}</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t.employeeDetails}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-white" 
                : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
            }`}
          >
            <FaEye /> {t.customizeView}
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalEmployees}</p>
              <p className="text-3xl font-bold text-purple-600">{summary.totalEmployees || 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-xl">
              <FaUsers className="text-3xl text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalAbsent}</p>
              <p className="text-3xl font-bold text-red-600">{summary.totalAbsent || 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-red-500 bg-opacity-20 rounded-xl">
              <FaCalendarTimes className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalLeave}</p>
              <p className="text-3xl font-bold text-blue-600">{summary.totalLeave || 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-500 bg-opacity-20 rounded-xl">
              <FaClipboardList className="text-3xl text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 ${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-white to-gray-50"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{t.totalVacancy}</p>
              <p className="text-3xl font-bold text-green-600">{summary.totalVacancy || 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-xl">
              <FaBuilding className="text-3xl text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`rounded-2xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FaSearch className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`flex-1 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-gray-50 border border-gray-200 text-gray-900"
              }`}
            >
              <option value="all">{t.filter}: {t.all}</option>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
              <option value="on leave">{t.onLeave}</option>
              <option value="terminated">{t.terminated}</option>
            </select>
            
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Column Selector Modal */}
      <AnimatePresence>
        {showColumnSelector && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{t.columns}</h3>
                <button 
                  onClick={() => setShowColumnSelector(false)}
                  className="text-gray-500 hover:text-red-500 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.keys(visibleColumns).map((column) => (
                  <div key={column} className="flex items-center">
                    <input
                      type="checkbox"
                      id={column}
                      checked={visibleColumns[column]}
                      onChange={(e) => setVisibleColumns({
                        ...visibleColumns,
                        [column]: e.target.checked
                      })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor={column} className="ml-2 flex items-center gap-2">
                      <span className="text-gray-500">{getColumnIcon(column)}</span>
                      <span>{t[column] || column}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowColumnSelector(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => setShowColumnSelector(false)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  {t.apply}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Table */}
      <div className={`rounded-2xl shadow-xl overflow-hidden mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`font-semibold ${
              darkMode 
                ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white" 
                : "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-900"
            }`}>
              <tr>
                {visibleColumns.photo && (
                  <th className="p-4 text-left sticky left-0 bg-inherit">
                    <div className="flex items-center">
                      {getColumnIcon('photo')}
                      <span className="ml-2">{t.photo}</span>
                    </div>
                  </th>
                )}
                {visibleColumns.firstName && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('firstName')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('firstName')}
                      <span className="ml-2">{t.firstName}</span>
                      {getSortIcon('firstName')}
                    </div>
                  </th>
                )}
                {visibleColumns.lastName && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('lastName')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('lastName')}
                      <span className="ml-2">{t.lastName}</span>
                      {getSortIcon('lastName')}
                    </div>
                  </th>
                )}
                {visibleColumns.email && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('email')}
                      <span className="ml-2">{t.email}</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                )}
                {visibleColumns.empId && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('empId')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('empId')}
                      <span className="ml-2">{t.empId}</span>
                      {getSortIcon('empId')}
                    </div>
                  </th>
                )}
                {visibleColumns.department && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('department')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('department')}
                      <span className="ml-2">{t.department}</span>
                      {getSortIcon('department')}
                    </div>
                  </th>
                )}
                {visibleColumns.position && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('typeOfPosition')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('position')}
                      <span className="ml-2">{t.position}</span>
                      {getSortIcon('typeOfPosition')}
                    </div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('employeeStatus')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('status')}
                      <span className="ml-2">{t.status}</span>
                      {getSortIcon('employeeStatus')}
                    </div>
                  </th>
                )}
                {visibleColumns.salary && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('salary')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('salary')}
                      <span className="ml-2">{t.salary}</span>
                      {getSortIcon('salary')}
                    </div>
                  </th>
                )}
                {visibleColumns.phone && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('phoneNumber')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('phone')}
                      <span className="ml-2">{t.phone}</span>
                      {getSortIcon('phoneNumber')}
                    </div>
                  </th>
                )}
                {visibleColumns.address && (
                  <th className="p-4 text-left">
                    <div className="flex items-center">
                      {getColumnIcon('address')}
                      <span className="ml-2">{t.address}</span>
                    </div>
                  </th>
                )}
                {visibleColumns.dob && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('dateOfBirth')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('dob')}
                      <span className="ml-2">{t.dob}</span>
                      {getSortIcon('dateOfBirth')}
                    </div>
                  </th>
                )}
                {visibleColumns.sex && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('sex')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('sex')}
                      <span className="ml-2">{t.sex}</span>
                      {getSortIcon('sex')}
                    </div>
                  </th>
                )}
                {visibleColumns.maritalStatus && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('maritalStatus')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('maritalStatus')}
                      <span className="ml-2">{t.maritalStatus}</span>
                      {getSortIcon('maritalStatus')}
                    </div>
                  </th>
                )}
                {visibleColumns.qualification && (
                  <th className="p-4 text-left">
                    <div className="flex items-center">
                      {getColumnIcon('qualification')}
                      <span className="ml-2">{t.qualification}</span>
                    </div>
                  </th>
                )}
                {visibleColumns.experience && (
                  <th className="p-4 text-left">
                    <div className="flex items-center">
                      {getColumnIcon('experience')}
                      <span className="ml-2">{t.experience}</span>
                    </div>
                  </th>
                )}
                {visibleColumns.term && (
                  <th className="p-4 text-left">
                    <div className="flex items-center">
                      {getColumnIcon('term')}
                      <span className="ml-2">{t.term}</span>
                    </div>
                  </th>
                )}
                {visibleColumns.absentDays && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('absentDays')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('absentDays')}
                      <span className="ml-2">{t.absentDays}</span>
                      {getSortIcon('absentDays')}
                    </div>
                  </th>
                )}
                {visibleColumns.leaveRequests && (
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-opacity-80 transition-colors duration-300"
                    onClick={() => requestSort('leaveRequests')}
                  >
                    <div className="flex items-center">
                      {getColumnIcon('leaveRequests')}
                      <span className="ml-2">{t.leaveRequests}</span>
                      {getSortIcon('leaveRequests')}
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedReport.length > 0 ? (
                sortedReport.map((emp, index) => {
                  const photoUrl = getEmployeePhotoUrl(emp.photo);
                  return (
                    <tr 
                      key={emp._id}
                      className={`border-b transition-all duration-300 ${
                        darkMode 
                          ? "hover:bg-gray-750 border-gray-700" 
                          : "hover:bg-purple-50/50 border-gray-100"
                      } ${index % 2 === 0 ? (darkMode ? "bg-gray-800/50" : "bg-gray-50/50") : ""}`}
                    >
                      {visibleColumns.photo && (
                        <td className="p-4 sticky left-0 bg-inherit">
                          {photoUrl ? (
                            <img 
                              src={photoUrl} 
                              alt="Employee" 
                              className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                                e.target.className = "w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 p-2";
                              }}
                              onLoad={() => console.log('Photo loaded:', photoUrl)}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 flex items-center justify-center shadow-sm">
                              <FaUsers className="text-2xl text-purple-600 dark:text-purple-300" />
                            </div>
                          )}
                        </td>
                      )}
                      {visibleColumns.firstName && (
                        <td className="p-4 font-medium">
                          <div className="flex flex-col">
                            <span>{emp.firstName} {emp.middleName || ''}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{emp.lastName}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.lastName && (
                        <td className="p-4 font-medium">
                          {emp.lastName}
                        </td>
                      )}
                      {visibleColumns.email && (
                        <td className="p-4">
                          <a 
                            href={`mailto:${emp.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                          >
                            <FaEnvelope className="text-sm" />
                            {emp.email}
                          </a>
                        </td>
                      )}
                      {visibleColumns.empId && (
                        <td className="p-4 font-mono font-medium">
                          <div className="flex items-center gap-2">
                            <FaIdCard className="text-gray-500" />
                            {emp.empId}
                          </div>
                        </td>
                      )}
                      {visibleColumns.department && (
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FaBuilding className="text-gray-500" />
                            {typeof emp.department === "object" ? emp.department?.name : emp.department}
                          </div>
                        </td>
                      )}
                      {visibleColumns.position && (
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FaBriefcase className="text-gray-500" />
                            {emp.typeOfPosition}
                          </div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="p-4">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(emp.employeeStatus)}`}>
                            {emp.employeeStatus}
                          </span>
                        </td>
                      )}
                      {visibleColumns.salary && (
                        <td className="p-4 font-medium">
                          {emp.salary ? (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              
                              <span>{parseFloat(emp.salary).toLocaleString()}</span>
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.phone && (
                        <td className="p-4">
                          {emp.phoneNumber ? (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-500" />
                              <a href={`tel:${emp.phoneNumber}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                {emp.phoneNumber}
                              </a>
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.address && (
                        <td className="p-4 max-w-xs truncate">
                          {emp.address ? (
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-500 flex-shrink-0" />
                              <span className="truncate">{emp.address}</span>
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.dob && (
                        <td className="p-4">
                          {emp.dateOfBirth ? (
                            <div className="flex items-center gap-2">
                              <FaBirthdayCake className="text-gray-500" />
                              {emp.dateOfBirth.split('T')[0]}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.sex && (
                        <td className="p-4">
                          {emp.sex ? (
                            <div className="flex items-center gap-2">
                              <FaVenusMars className="text-gray-500" />
                              {emp.sex}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.maritalStatus && (
                        <td className="p-4">
                          {emp.maritalStatus ? (
                            <div className="flex items-center gap-2">
                              <FaHeart className="text-gray-500" />
                              {emp.maritalStatus}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.qualification && (
                        <td className="p-4">
                          {emp.qualification ? (
                            <div className="flex items-center gap-2">
                              <FaGraduationCap className="text-gray-500" />
                              {emp.qualification}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.experience && (
                        <td className="p-4">
                          {emp.experience ? (
                            <div className="flex items-center gap-2">
                              <FaHistory className="text-gray-500" />
                              {emp.experience}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.term && (
                        <td className="p-4">
                          {emp.termOfEmployment ? (
                            <div className="flex items-center gap-2">
                              <FaCalendarDay className="text-gray-500" />
                              {emp.termOfEmployment}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      {visibleColumns.absentDays && (
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            emp.absentDays > 10 
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : emp.absentDays > 5
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}>
                            {emp.absentDays || 0}
                          </span>
                        </td>
                      )}
                      {visibleColumns.leaveRequests && (
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            emp.leaveRequests > 5 
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : emp.leaveRequests > 2
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}>
                            {emp.leaveRequests || 0}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td 
                    colSpan={Object.values(visibleColumns).filter(v => v).length} 
                    className="text-center p-12"
                  >
                    <div className={`text-6xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>📊</div>
                    <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {t.noEmployeeData}
                    </p>
                    {searchTerm && (
                      <p className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                        No results found for "{searchTerm}"
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Export and Reset Buttons */}
        <div className={`p-6 border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex flex-col gap-6">
            {/* Export Options */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                {t.exportActions}
              </h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportPDF}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300"
                >
                  <FaFilePdf className="text-xl" />
                  <div className="text-left">
                    <div className="font-bold">{t.downloadPDF}</div>
                    <div className="text-sm opacity-90">Includes all employee data & statistics</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportExcel}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300"
                >
                  <FaFileExcel className="text-xl" />
                  <div className="text-left">
                    <div className="font-bold">{t.downloadExcel}</div>
                    <div className="text-sm opacity-90">Export all data to Excel spreadsheet</div>
                  </div>
                </motion.button>
              </div>
            </div>
            
            {/* Reset Records Section */}
            <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
                Reset Records
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <p className="mb-2">Reset all absence days and leave request counts to zero.</p>
                  <p className="text-sm">This action will reset the accumulated records for all employees.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetReport}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-8 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 whitespace-nowrap"
                >
                  <FaSync className="text-xl" />
                  <span>{t.resetReport}</span>
                </motion.button>
              </div>
            </div>
            
            {/* Summary Info */}
            <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Showing {sortedReport.length} of {report.length} employees
                  {searchTerm && ` matching "${searchTerm}"`}
                  {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {t.sortBy}: {sortConfig.key ? t[sortConfig.key] || sortConfig.key : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;