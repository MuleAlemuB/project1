import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaIdBadge,
  FaDollarSign,
  FaUsers,
  FaSearch,
  FaVenusMars,
  FaGraduationCap,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaEye,
  FaBirthdayCake,
  FaAddressCard,
  FaUser,
  FaClock,
  FaFileContract,
  FaHome,
  FaRing,
  FaLock,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Translations
const translations = {
  en: {
    employeesIn: "Employees in",
    searchPlaceholder: "Search employees...",
    loading: "Loading employees...",
    notAuthorized: "Not authorized",
    deleteConfirm: "Delete this employee?",
    deleteSuccess: "Employee deleted",
    deleteFailed: "Delete failed",
    updateFailed: "Update failed",
    updateSuccess: "Employee updated successfully",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    noEmployees: "No employees found",
    email: "Email",
    phoneNumber: "Phone Number",
    gender: "Gender",
    qualification: "Qualification",
    department: "Department",
    address: "Address",
    dateOfBirth: "Date of Birth",
    empId: "Employee ID",
    salary: "Salary",
    experience: "Experience",
    contactPerson: "Emergency Contact",
    contactPersonAddress: "Contact Person Address",
    saveChanges: "Save Changes",
    position: "Position",
    employeeStatus: "Employee Status",
    firstName: "First Name",
    lastName: "Last Name",
    middleName: "Middle Name",
    sex: "Gender",
    typeOfPosition: "Position Type",
    termOfEmployment: "Term of Employment",
    maritalStatus: "Marital Status",
    photo: "Photo",
    personalInfo: "Personal Information",
    employmentInfo: "Employment Information",
    contactInfo: "Contact Information",
    fullName: "Full Name",
    readOnly: "Read Only (Admin Only)",
    adminOnlyField: "This field can only be edited by Admin",
    saving: "Saving...",
    cancel: "Cancel",
    updateRestricted: "You can only update employees in your department",
  },
  am: {
    employeesIn: "በዚህ ክፍል ያሉ ሰራተኞች",
    searchPlaceholder: "ሰራተኞችን ይፈልጉ...",
    loading: "ሰራተኞች በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    deleteConfirm: "ይህን ሰራተኛ ማጥፋት ትፈልጋለዎት?",
    deleteSuccess: "ሰራተኛ ተሰርዟል",
    deleteFailed: "ማጥፋት አልተቻለም",
    updateFailed: "ማዘምን አልተቻለም",
    updateSuccess: "ሰራተኛ በተሳካ ሁኔታ ተዘምኗል",
    view: "እይ",
    edit: "አርትዕ",
    delete: "አጥፋ",
    noEmployees: "ሰራተኞች አልተገኙም",
    email: "ኢሜይል",
    phoneNumber: "ስልክ ቁጥር",
    gender: "ፆታ",
    qualification: "ትምህርት",
    department: "ክፍል",
    address: "አድራሻ",
    dateOfBirth: "የልደት ቀን",
    empId: "የሰራተኛ መለያ",
    salary: "ደሞዝ",
    experience: "ልምድ",
    contactPerson: "የአደጋ አደጋ",
    contactPersonAddress: "የመገናኛ ሰው አድራሻ",
    saveChanges: "ለውጦችን አስቀምጥ",
    position: "ሥራ",
    employeeStatus: "የሰራተኛ ሁኔታ",
    firstName: "የመጀመሪያ ስም",
    lastName: "የአባት ስም",
    middleName: "የአያት ስም",
    sex: "ፆታ",
    typeOfPosition: "የስራ አይነት",
    termOfEmployment: "የስራ ጊዜ",
    maritalStatus: "የትዳር ሁኔታ",
    photo: "ፎቶ",
    personalInfo: "ግላዊ መረጃ",
    employmentInfo: "የስራ መረጃ",
    contactInfo: "የመገናኛ መረጃ",
    fullName: "ሙሉ ስም",
    readOnly: "ለማንበብ ብቻ (ለአስተዳዳሪ ብቻ)",
    adminOnlyField: "ይህ መስክ በአስተዳዳሪ ብቻ ሊለወጥ ይችላል",
    saving: "በማስቀመጥ ላይ...",
    cancel: "አቋርጥ",
    updateRestricted: "በክፍልዎ ውስጥ ያሉ ሰራተኞችን ብቻ ማዘምን ይችላሉ",
  },
};

const DeptHeadEmployees = () => {
  const { user } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [employees, setEmployees] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch department name
  useEffect(() => {
    if (!user || !user.department) return;
    const fetchDeptName = async () => {
      try {
        const res = await axiosInstance.get(`/departments/${user.department}`);
        setDeptName(res.data.name || "N/A");
      } catch (err) {
        console.error(err);
        setDeptName("N/A");
      }
    };
    fetchDeptName();
  }, [user]);

  // Fetch employees
  useEffect(() => {
    if (!user?.department) return;

    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get(
          `/employees/department?department=${encodeURIComponent(user.department)}`
        );

        const employeesWithDetails = res.data.map((emp) => ({
          ...emp,
          departmentName: emp.department?.name || "N/A",
          phoneNumber: emp.phoneNumber || "N/A",
          photo: emp.photo
            ? `${BACKEND_URL}${emp.photo.startsWith('/') ? '' : '/'}${emp.photo}`
            : '/fallback-avatar.png'
        }));
        setEmployees(employeesWithDetails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user]);

  // Search filter
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEditData({ 
      ...editData, 
      [name]: type === 'number' ? parseFloat(value) : value 
    });
  };

  const handleSave = async () => {
  if (!selectedEmployee) return;
  
  setIsSaving(true);
  try {
    // Debug: Log current user and selected employee info
    console.log("Current user (dept head):", user);
    console.log("Selected employee:", selectedEmployee);
    console.log("Department head's department ID:", user.department);
    console.log("Employee's department:", selectedEmployee.department);
    
    // Create data with only allowed fields for department head
    const allowedFields = {
      firstName: editData.firstName,
      middleName: editData.middleName,
      lastName: editData.lastName,
      phoneNumber: editData.phoneNumber,
      sex: editData.sex,
      typeOfPosition: editData.typeOfPosition,
      termOfEmployment: editData.termOfEmployment,
      contactPerson: editData.contactPerson,
      contactPersonAddress: editData.contactPersonAddress,
      employeeStatus: editData.employeeStatus,
      dateOfBirth: editData.dateOfBirth,
      address: editData.address,
      maritalStatus: editData.maritalStatus,
    };
    
    console.log("Updating employee ID:", selectedEmployee._id);
    console.log("Update data:", allowedFields);
    
    // OPTION 1: Try department-specific update endpoint
    try {
      const response = await axiosInstance.put(
        `/depthead/employee/${selectedEmployee._id}`,
        allowedFields
      );
      
      if (response.data.success || response.data._id) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp._id === selectedEmployee._id 
            ? { ...emp, ...allowedFields } 
            : emp
        ));
        
        alert(t.updateSuccess);
        closeModal();
        return;
      }
    } catch (deptError) {
      console.log("Department endpoint failed:", {
        status: deptError.response?.status,
        message: deptError.response?.data?.message,
        data: deptError.response?.data
      });
      
      // Check if it's a department mismatch error
      if (deptError.response?.data?.message?.includes("department")) {
        // Show specific department error
        alert(`Error: ${deptError.response.data.message}\n\nYour department: ${user.department}\nEmployee's department: ${selectedEmployee.department}`);
        setIsSaving(false);
        return;
      }
      
      // OPTION 2: Try standard employee update with limited fields
      const limitedFields = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phoneNumber: editData.phoneNumber,
        employeeStatus: editData.employeeStatus,
        typeOfPosition: editData.typeOfPosition,
      };
      
      const response = await axiosInstance.put(
        `/employees/${selectedEmployee._id}`,
        limitedFields
      );
      
      if (response.data.success || response.data._id) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp._id === selectedEmployee._id 
            ? { ...emp, ...limitedFields } 
            : emp
        ));
        
        alert(t.updateSuccess);
        closeModal();
        return;
      }
    }
    
    throw new Error(t.updateFailed);
    
  } catch (err) {
    console.error("Update error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });
    
    // Show user-friendly error message
    let errorMessage = t.updateFailed;
    if (err.response?.status === 403) {
      errorMessage = t.updateRestricted;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    alert(`${language === "en" ? "Error" : "ስህተት"}: ${errorMessage}`);
  } finally {
    setIsSaving(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      // Try department head delete endpoint first
      try {
        await axiosInstance.delete(`/depthead/employee/${id}`);
      } catch (deptError) {
        // Fallback to standard endpoint
        await axiosInstance.delete(`/employees/${id}`);
      }
      
      setEmployees(employees.filter((emp) => emp._id !== id));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || t.deleteFailed);
    }
  };

  const openModal = (emp, edit = false) => {
    setSelectedEmployee(emp);
    setIsEditing(edit);
    setEditData({
      firstName: emp.firstName || "",
      middleName: emp.middleName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      empId: emp.empId || "",
      phoneNumber: emp.phoneNumber || "",
      sex: emp.sex || "",
      typeOfPosition: emp.typeOfPosition || "",
      termOfEmployment: emp.termOfEmployment || "",
      contactPerson: emp.contactPerson || "",
      contactPersonAddress: emp.contactPersonAddress || "",
      employeeStatus: emp.employeeStatus || "",
      salary: emp.salary || "",
      experience: emp.experience || "",
      qualification: emp.qualification || "",
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : "",
      address: emp.address || "",
      maritalStatus: emp.maritalStatus || "",
      department: emp.department || "",
    });
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setEditData({});
    setIsSaving(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? "en-US" : "am-ET", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Test function to check available endpoints
  const testEndpoints = async () => {
    try {
      console.log("Testing available endpoints...");
      
      // Check standard employee endpoint
      try {
        const testRes = await axiosInstance.get(`/employees`);
        console.log("Employees endpoint exists, count:", testRes.data.length || testRes.data.count);
      } catch (error) {
        console.log("Employees endpoint error:", error.response?.status);
      }
      
      // Check department head endpoints
      try {
        const testRes = await axiosInstance.get(`/depthead/profile`);
        console.log("Depthead profile endpoint exists");
      } catch (error) {
        console.log("Depthead profile endpoint error:", error.response?.status);
      }
      
    } catch (error) {
      console.log("Test error:", error);
    }
  };

  // Run test on component mount
  useEffect(() => {
    testEndpoints();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
            darkMode ? "border-blue-500 border-t-transparent" : "border-blue-600 border-t-transparent"
          }`}></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role.toLowerCase() !== "departmenthead") {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          {t.notAuthorized}
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors ${
      darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {t.employeesIn} <span className="text-blue-600 dark:text-blue-400">{deptName}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {employees.length} {language === "en" ? "employees in your department" : "ሰራተኞች በክፍልዎ ውስጥ"}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? "bg-gray-800 border-gray-700 text-gray-100" 
                : "bg-white border-gray-300 text-gray-900"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${
          darkMode ? "bg-gray-800/50" : "bg-white"
        }`}>
          <p className="text-gray-500 dark:text-gray-400">{t.noEmployees}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp._id}
              className={`rounded-xl border transition-all hover:shadow-lg ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={emp.photo || '/fallback-avatar.png'}
                    alt="Employee"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {emp.typeOfPosition || t.position}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                      {emp.empId}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    emp.employeeStatus?.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {emp.employeeStatus || "Active"}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4 text-gray-400" />
                    <span>{emp.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-gray-400" />
                    <span>{emp.departmentName}</span>
                  </div>
                </div>
              </div>

              <div className={`px-5 py-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(emp, false)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                      darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <FaEye className="w-4 h-4" />
                    {t.view}
                  </button>
                  <button
                    onClick={() => openModal(emp, true)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                      darkMode 
                        ? "bg-blue-900/30 hover:bg-blue-900/50 text-blue-400" 
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                    }`}
                  >
                    <FaEdit className="w-4 h-4" />
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                      darkMode 
                        ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" 
                        : "bg-red-50 hover:bg-red-100 text-red-600"
                    }`}
                  >
                    <FaTrash className="w-4 h-4" />
                    {t.delete}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    {isEditing ? t.edit : t.view} Employee
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {selectedEmployee.empId}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl disabled:opacity-50"
                >
                  ✕
                </button>
              </div>

              {/* Employee Info */}
              <div className="flex items-center gap-6 mb-8">
                <img
                  src={selectedEmployee.photo || "/fallback-avatar.png"}
                  alt="Employee"
                  className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                />
                <div>
                  <h3 className="font-bold text-2xl">
                    {selectedEmployee.firstName} {selectedEmployee.middleName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {selectedEmployee.typeOfPosition}
                  </p>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    selectedEmployee.employeeStatus?.toLowerCase() === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}>
                    {selectedEmployee.employeeStatus || "Active"}
                  </div>
                </div>
              </div>

              {isEditing ? (
                // EDIT FORM - Department Head limited fields
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Column 1 - Editable fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.firstName} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName || ""}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.middleName}
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={editData.middleName || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.lastName} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName || ""}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.phoneNumber}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editData.phoneNumber || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Column 2 - More editable fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.sex} *
                      </label>
                      <select
                        name="sex"
                        value={editData.sex || ""}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="">{language === "en" ? "Select Gender" : "ፆታ ይምረጡ"}</option>
                        <option value="Male">{language === "en" ? "Male" : "ወንድ"}</option>
                        <option value="Female">{language === "en" ? "Female" : "ሴት"}</option>
                        <option value="Other">{language === "en" ? "Other" : "ሌላ"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.typeOfPosition} *
                      </label>
                      <input
                        type="text"
                        name="typeOfPosition"
                        value={editData.typeOfPosition || ""}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.termOfEmployment} *
                      </label>
                      <input
                        type="text"
                        name="termOfEmployment"
                        value={editData.termOfEmployment || ""}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.employeeStatus}
                      </label>
                      <select
                        name="employeeStatus"
                        value={editData.employeeStatus || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="">{language === "en" ? "Select Status" : "ሁኔታ ይምረጡ"}</option>
                        <option value="Active">{language === "en" ? "Active" : "ንቁ"}</option>
                        <option value="Inactive">{language === "en" ? "Inactive" : "ንቁ ያልሆነ"}</option>
                        <option value="On Leave">{language === "en" ? "On Leave" : "በቀድሞ"}</option>
                        <option value="Terminated">{language === "en" ? "Terminated" : "ተቋርጧል"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Column 3 - Read-only fields and remaining editable fields */}
                  <div className="space-y-4 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          {t.dateOfBirth}
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editData.dateOfBirth || ""}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600 text-gray-100" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          {t.maritalStatus}
                        </label>
                        <select
                          name="maritalStatus"
                          value={editData.maritalStatus || ""}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600 text-gray-100" 
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="">{language === "en" ? "Select Status" : "ሁኔታ ይምረጡ"}</option>
                          <option value="Single">{language === "en" ? "Single" : "ያላገባ"}</option>
                          <option value="Married">{language === "en" ? "Married" : "ያገባ"}</option>
                          <option value="Divorced">{language === "en" ? "Divorced" : "የፈታ"}</option>
                          <option value="Widowed">{language === "en" ? "Widowed" : "የተቀበረ"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.address}
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={editData.address || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.contactPerson}
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={editData.contactPerson || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {t.contactPersonAddress}
                      </label>
                      <input
                        type="text"
                        name="contactPersonAddress"
                        value={editData.contactPersonAddress || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600 text-gray-100" 
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    {/* Read-only fields (Admin only) */}
                    <div className="space-y-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FaLock className="text-gray-500 dark:text-gray-400" />
                        {t.readOnly}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                            {t.email}
                          </label>
                          <input
                            type="email"
                            value={editData.email || ""}
                            readOnly
                            disabled
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? "bg-gray-800 border-gray-700 text-gray-400" 
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.adminOnlyField}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                            {t.empId}
                          </label>
                          <input
                            type="text"
                            value={editData.empId || ""}
                            readOnly
                            disabled
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? "bg-gray-800 border-gray-700 text-gray-400" 
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.adminOnlyField}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                            {t.salary}
                          </label>
                          <input
                            type="number"
                            value={editData.salary || ""}
                            readOnly
                            disabled
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? "bg-gray-800 border-gray-700 text-gray-400" 
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.adminOnlyField}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                            {t.experience}
                          </label>
                          <input
                            type="text"
                            value={editData.experience || ""}
                            readOnly
                            disabled
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? "bg-gray-800 border-gray-700 text-gray-400" 
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.adminOnlyField}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                            {t.qualification}
                          </label>
                          <input
                            type="text"
                            value={editData.qualification || ""}
                            readOnly
                            disabled
                            className={`w-full px-3 py-2 rounded-lg border ${
                              darkMode 
                                ? "bg-gray-800 border-gray-700 text-gray-400" 
                                : "bg-gray-100 border-gray-300 text-gray-500"
                            }`}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.adminOnlyField}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t.saving}
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4" />
                          {t.saveChanges}
                        </>
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      disabled={isSaving}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                // VIEW DETAILS - ALL FIELDS
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700/30" : "bg-gray-50"
                  }`}>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      {t.personalInfo}
                    </h4>
                    <div className="space-y-3">
                      <DetailItem 
                        icon={<FaUser />} 
                        label={t.fullName} 
                        value={`${selectedEmployee.firstName || ''} ${selectedEmployee.middleName || ''} ${selectedEmployee.lastName || ''}`.trim()} 
                      />
                      <DetailItem 
                        icon={<FaIdBadge />} 
                        label={t.empId} 
                        value={selectedEmployee.empId} 
                      />
                      <DetailItem 
                        icon={<FaBirthdayCake />} 
                        label={t.dateOfBirth} 
                        value={formatDate(selectedEmployee.dateOfBirth)} 
                      />
                      <DetailItem 
                        icon={<FaVenusMars />} 
                        label={t.sex} 
                        value={selectedEmployee.sex} 
                      />
                      <DetailItem 
                        icon={<FaRing />} 
                        label={t.maritalStatus} 
                        value={selectedEmployee.maritalStatus} 
                      />
                      <DetailItem 
                        icon={<FaGraduationCap />} 
                        label={t.qualification} 
                        value={selectedEmployee.qualification} 
                      />
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700/30" : "bg-gray-50"
                  }`}>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <FaUserTie className="text-green-500" />
                      {t.employmentInfo}
                    </h4>
                    <div className="space-y-3">
                      <DetailItem 
                        icon={<FaBuilding />} 
                        label={t.department} 
                        value={selectedEmployee.departmentName} 
                      />
                      <DetailItem 
                        icon={<FaUserTie />} 
                        label={t.typeOfPosition} 
                        value={selectedEmployee.typeOfPosition} 
                      />
                      <DetailItem 
                        icon={<FaClock />} 
                        label={t.termOfEmployment} 
                        value={selectedEmployee.termOfEmployment} 
                      />
                      <DetailItem 
                        icon={<FaDollarSign />} 
                        label={t.salary} 
                        value={selectedEmployee.salary} 
                      />
                      <DetailItem 
                        icon={<FaUsers />} 
                        label={t.experience} 
                        value={selectedEmployee.experience} 
                      />
                      <DetailItem 
                        icon={<FaFileContract />} 
                        label={t.employeeStatus} 
                        value={selectedEmployee.employeeStatus} 
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={`p-4 rounded-lg md:col-span-2 ${
                    darkMode ? "bg-gray-700/30" : "bg-gray-50"
                  }`}>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <FaAddressCard className="text-purple-500" />
                      {t.contactInfo}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem 
                        icon={<FaEnvelope />} 
                        label={t.email} 
                        value={selectedEmployee.email} 
                      />
                      <DetailItem 
                        icon={<FaPhone />} 
                        label={t.phoneNumber} 
                        value={selectedEmployee.phoneNumber} 
                      />
                      <DetailItem 
                        icon={<FaMapMarkerAlt />} 
                        label={t.address} 
                        value={selectedEmployee.address} 
                      />
                      <DetailItem 
                        icon={<FaHome />} 
                        label={t.contactPerson} 
                        value={selectedEmployee.contactPerson} 
                      />
                      <DetailItem 
                        icon={<FaMapMarkerAlt />} 
                        label={t.contactPersonAddress} 
                        value={selectedEmployee.contactPersonAddress} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="text-gray-500 dark:text-gray-400 mt-1">{icon}</div>}
    <div className="flex-1">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-medium break-words">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    </div>
  </div>
);

export default DeptHeadEmployees;