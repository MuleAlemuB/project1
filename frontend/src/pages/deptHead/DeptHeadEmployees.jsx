import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaIdBadge,
  FaDollarSign,
  FaUsers,
  FaSearch,
  FaVenusMars,
  FaGraduationCap,
  FaClock,
  FaAddressBook,
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Translations
const translations = {
  en: {
    employeesIn: "Employees in",
    searchPlaceholder: "Search by name...",
    loading: "Loading...",
    notAuthorized: "Not authorized",
    deleteConfirm: "Are you sure you want to delete this employee?",
    deleteSuccess: "Employee deleted successfully",
    deleteFailed: "Failed to delete employee",
    updateFailed: "Failed to update employee",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    noEmployees: "No employees found.",
    email: "Email",
    phone: "Phone",
    gender: "Gender",
    qualification: "Qualification",
    term: "Term",
    department: "Department",
    address: "Address",
    dob: "DOB",
    empId: "Employee ID",
    salary: "Salary",
    experience: "Experience",
    contactPerson: "Contact Person",
    contactAddress: "Contact Address",
    saveChanges: "Save Changes",
  },
  am: {
    employeesIn: "በዚህ ክፍል ያሉ ሰራተኞች",
    searchPlaceholder: "በስም ይፈልጉ...",
    loading: "በመጫን ላይ...",
    notAuthorized: "ፈቃድ የለዎትም",
    deleteConfirm: "ይህን ሰራተኛ ማጥፋት ትፈልጋለዎት?",
    deleteSuccess: "ሰራተኛ በትክክል ተሰርዟል",
    deleteFailed: "ሰራተኛን ማጥፋት አልተቻለም",
    updateFailed: "ሰራተኛን ማዘምን አልተቻለም",
    view: "እይ",
    edit: "አርትዕ",
    delete: "አጥፋ",
    noEmployees: "ሰራተኞች አልተገኙም",
    email: "ኢሜይል",
    phone: "ስልክ",
    gender: "ፆታ",
    qualification: "ትምህርት ዝግጅት",
    term: "የሥራ ጊዜ",
    department: "ክፍል",
    address: "አድራሻ",
    dob: "የልደት ቀን",
    empId: "የሰራተኛ መለያ",
    salary: "ደሞዝ",
    experience: "ልምድ",
    contactPerson: "የግንኙነት ሰው",
    contactAddress: "የግንኙነት አድራሻ",
    saveChanges: "ለውጦችን አስቀምጥ",
  },
};

const DeptHeadEmployees = () => {
  const { user, loading: authLoading } = useAuth();
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [employees, setEmployees] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

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

  // Fetch employees in department
  useEffect(() => {
    if (!user?.department) return;

    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get(
          `/employees/department?department=${encodeURIComponent(
            user.department
          )}`
        );

        const employeesWithDetails = res.data.map((emp) => ({
  ...emp,
  departmentName: emp.department?.name || "N/A",
  phone: emp.phone || emp.phoneNumber || "N/A",
  photo: emp.photo ? `${BACKEND_URL}/${emp.photo}` : null, // full URL
}));

        setEmployees(employeesWithDetails);
      } catch (err) {
        console.error(err.response?.data || err);
        setError(t.deleteFailed);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [user, language]);

  // Search filter
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/employees/${selectedEmployee._id}`, editData);

      // Refresh list
      const res = await axiosInstance.get(
        `/employees/department?department=${encodeURIComponent(
          user.department
        )}`
      );

      setEmployees(
        res.data.map((emp) => ({
          ...emp,
           departmentName: emp.department?.name || "N/A",
  phone: emp.phone || emp.phoneNumber || "N/A",
  photo: emp.photo ? `/${emp.photo}` : null,
        }))
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert(t.updateFailed);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await axiosInstance.delete(`/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error(err);
      alert(t.deleteFailed);
    }
  };

  const openModal = (emp, edit = false) => {
    setSelectedEmployee(emp);
    setIsEditing(edit);
    setEditData({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      phone: emp.phone || "",
      typeOfPosition: emp.typeOfPosition || "",
      department: emp.departmentName || "",
      address: emp.address || "",
      email: emp.email || "",
      dateOfBirth: emp.dateOfBirth?.split("T")[0] || "",
      empId: emp.empId || "",
      salary: emp.salary || "",
      experience: emp.experience || "",
      contactPerson: emp.contactPerson || "",
      contactPersonAddress: emp.contactPersonAddress || "",
      gender: emp.gender || "",
      qualification: emp.qualification || "",
      termOfEmployment: emp.termOfEmployment || "",
      photo: emp.photo || "",
    });
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setEditData({});
  };

  if (authLoading || loading)
    return <div className="p-6 text-center">{t.loading}</div>;

  if (!user || user.role.toLowerCase() !== "departmenthead")
    return <div>{t.notAuthorized}</div>;

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-700 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">
        {t.employeesIn} {deptName}
      </h1>

      <div className="mb-4 flex items-center gap-2 max-w-sm">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="p-2 rounded border w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredEmployees.length === 0 ? (
        <p>{t.noEmployees}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl"
            >
              <img
  src={emp.photo || "/fallback-avatar.png"}
  alt="Employee"
  className="w-12 h-12 rounded-full object-cover"
/>


              <h2 className="text-xl font-semibold mb-1">
                {emp.firstName} {emp.lastName}
              </h2>
              <p className="mb-2">{emp.typeOfPosition || "N/A"}</p>
              <p className="text-sm mb-3">{emp.departmentName}</p>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  onClick={() => openModal(emp, false)}
                >
                  {t.view}
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  onClick={() => openModal(emp, true)}
                >
                  {t.edit}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  onClick={() => handleDelete(emp._id)}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-y-auto max-h-[90vh]"
          >
            <button
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <img
  src={selectedEmployee.photo || "/fallback-avatar.png"}
  className="w-16 h-16 rounded-full object-cover"
/>


              <h2 className="text-3xl font-bold text-indigo-600 mb-1">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h2>
              <p className="mb-4">
                {selectedEmployee.typeOfPosition || "N/A"}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200 mb-4">
              <p className="flex items-center gap-2">
                <FaEnvelope /> {t.email}: {selectedEmployee.email || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone /> {t.phone}: {selectedEmployee.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaVenusMars /> {t.gender}: {selectedEmployee.gender || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaGraduationCap /> {t.qualification}:{" "}
                {selectedEmployee.qualification || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaClock /> {t.term}: {selectedEmployee.termOfEmployment || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaBuilding /> {t.department}: {selectedEmployee.departmentName}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt /> {t.address}: {selectedEmployee.address || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaBirthdayCake /> {t.dob}: {selectedEmployee.dateOfBirth || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaIdBadge /> {t.empId}: {selectedEmployee.empId || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaDollarSign /> {t.salary}: {selectedEmployee.salary || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaUsers /> {t.experience}: {selectedEmployee.experience || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaAddressBook /> {t.contactPerson}:{" "}
                {selectedEmployee.contactPerson || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt /> {t.contactAddress}:{" "}
                {selectedEmployee.contactPersonAddress || "N/A"}
              </p>
            </div>

            {/* Editing area */}
            {isEditing && (
              <>
                <div className="mt-4 space-y-2">
                  {Object.keys(editData).map((key) => (
                    <input
                      key={key}
                      type={key === "dateOfBirth" ? "date" : "text"}
                      name={key}
                      value={editData[key] || ""}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                    />
                  ))}
                </div>

                <button
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                  onClick={handleSave}
                >
                  {t.saveChanges}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DeptHeadEmployees;
