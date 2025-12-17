// src/pages/admin/ManageDepartments.jsx
import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaEye, FaEdit, FaTrash, FaPlus, FaUsers, FaUserTie, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    title: "Department Management",
    create: "Create New Department",
    search: "Search departments...",
    actions: "Actions",
    name: "Department Name",
    faculty: "Faculty",
    totalEmployees: "Employees",
    head: "Department Head",
    view: "View Details",
    edit: "Edit",
    delete: "Delete",
    noDepartments: "No departments found",
    confirmDelete: "Are you sure you want to delete this department?",
    update: "Update Department",
    createButton: "Create Department",
    departmentDetails: "Department Details",
    editDepartment: "Edit Department",
    createDepartment: "Create New Department",
    code: "Department Code",
    description: "Description",
    save: "Save Changes",
    cancel: "Cancel",
    loading: "Loading...",
    success: "Success!",
    error: "Error!",
    deleteSuccess: "Department deleted successfully",
    updateSuccess: "Department updated successfully",
    createSuccess: "Department created successfully",
    validation: {
      nameRequired: "Department name is required",
      facultyRequired: "Faculty is required",
      codeRequired: "Department code is required",
      codeUnique: "Department code must be unique",
      headRequired: "Department head is required"
    }
  },
  am: {
    title: "የክፍል አስተዳደር",
    create: "አዲስ ክፍል ፍጠር",
    search: "ክፍሎችን ፈልግ...",
    actions: "እርምጃዎች",
    name: "የክፍል ስም",
    faculty: "ፋከልቲ",
    totalEmployees: "ሰራተኞች",
    head: "የክፍል አለቃ",
    view: "ዝርዝር ይመልከቱ",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    noDepartments: "ምንም ክፍሎች አልተገኙም",
    confirmDelete: "ይህን ክፍል ለማጥፋት እርግጠኛ ነዎት?",
    update: "ክፍል አስተካክል",
    createButton: "ክፍል ፍጠር",
    departmentDetails: "የክፍል ዝርዝር",
    editDepartment: "ክፍል አስተካክል",
    createDepartment: "አዲስ ክፍል ፍጠር",
    code: "የክፍል ኮድ",
    description: "መግለጫ",
    save: "ለውጦችን አስቀምጥ",
    cancel: "ይቅር",
    loading: "በመጫን ላይ...",
    success: "ተሳክቷል!",
    error: "ስህተት!",
    deleteSuccess: "ክፍሉ በተሳካ ሁኔታ ተሰርዟል",
    updateSuccess: "ክፍሉ በተሳካ ሁኔታ ተስተካክሏል",
    createSuccess: "ክፍሉ በተሳካ ሁኔታ ተፈጥሯል",
    validation: {
      nameRequired: "የክፍል ስም ያስፈልጋል",
      facultyRequired: "ፋከልቲ ያስፈልጋል",
      codeRequired: "የክፍል ኮድ ያስፈልጋል",
      codeUnique: "የክፍል ኮድ ልዩ መሆን አለበት",
      headRequired: "የክፍል አለቃ ያስፈልጋል"
    }
  }
};

// Custom Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <FaCheck /> : type === 'error' ? <FaExclamationTriangle /> : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-xl shadow-xl z-[100] flex items-center gap-3 min-w-[300px]`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <FaTimes />
      </button>
    </motion.div>
  );
};

const ManageDepartments = () => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    faculty: "", 
    head: "", 
    code: "",
    description: "",
    status: "active" 
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [notification, setNotification] = useState(null);

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch departments and employees
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        axiosInstance.get("/admin/departments"),
        axiosInstance.get("/employees")
      ]);
      
      // Security: Validate and sanitize data
      const sanitizedDepartments = deptRes.data.map(dept => ({
        ...dept,
        name: dept.name || '',
        faculty: dept.faculty || '',
        code: dept.code || '',
        head: dept.head || '',
        status: dept.status || 'active'
      }));
      
      setDepartments(sanitizedDepartments);
      setEmployees(empRes.data);
      setError("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch data";
      setError(errorMessage);
      showNotification('error', `${t.error} ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get unique faculties for filter
  const faculties = [...new Set(departments.map(dept => dept.faculty).filter(Boolean))];

  // Get total employees in a department (automatically counted)
  const getTotalEmployees = useCallback((deptId) => {
    return employees.filter((emp) => emp.department?._id === deptId).length;
  }, [employees]);

  // Handle form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = t.validation.nameRequired;
    if (!formData.faculty.trim()) errors.faculty = t.validation.facultyRequired;
    if (!formData.code.trim()) errors.code = t.validation.codeRequired;
    if (!formData.head.trim()) errors.head = t.validation.headRequired;
    
    // Check if department code is unique (for create)
    if (!isEditOpen && departments.some(d => d.code === formData.code)) {
      errors.code = t.validation.codeUnique;
    }
    
    return errors;
  };

  const handleDeleteClick = (dept) => {
    setDeptToDelete(dept);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deptToDelete) return;
    
    try {
      // Security: Check if department has employees
      const employeeCount = getTotalEmployees(deptToDelete._id);
      if (employeeCount > 0) {
        showNotification('error', "Cannot delete department with assigned employees");
        setIsDeleteConfirmOpen(false);
        return;
      }
      
      await axiosInstance.delete(`/admin/departments/${deptToDelete._id}`);
      setDepartments(departments.filter((d) => d._id !== deptToDelete._id));
      showNotification('success', t.deleteSuccess);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete department";
      showNotification('error', `${t.error} ${errorMessage}`);
    } finally {
      setIsDeleteConfirmOpen(false);
      setDeptToDelete(null);
    }
  };

  const handleView = (dept) => {
    setSelectedDept(dept);
    setIsViewOpen(true);
  };

  const handleEditOpen = (dept) => {
    setSelectedDept(dept);
    setFormData({ 
      name: dept.name, 
      faculty: dept.faculty, 
      head: dept.head, 
      code: dept.code,
      description: dept.description || "",
      status: dept.status || "active"
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.put(`/admin/departments/${selectedDept._id}`, formData);
      setDepartments(departments.map((d) => (d._id === res.data._id ? res.data : d)));
      setIsEditOpen(false);
      showNotification('success', t.updateSuccess);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update department";
      showNotification('error', `${t.error} ${errorMessage}`);
    }
  };

  const handleCreateOpen = () => {
    setFormData({ 
      name: "", 
      faculty: "", 
      head: "", 
      code: "",
      description: "",
      status: "active" 
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const res = await axiosInstance.post("/admin/departments", formData);
      setDepartments([...departments, res.data]);
      setIsCreateOpen(false);
      showNotification('success', t.createSuccess);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create department";
      showNotification('error', `${t.error} ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Filter departments based on search and faculty
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch = searchTerm === "" || 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.head.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaculty = selectedFaculty === "all" || d.faculty === selectedFaculty;
    
    return matchesSearch && matchesFaculty;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"}`}>
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
            <h1 className="text-3xl font-bold text-purple-800 dark:text-white mb-2">{t.title}</h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage departments, assign heads, and track employee distribution
            </p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <FaPlus /> {t.create}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-4 pl-12 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                darkMode 
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" 
                  : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className={`w-full p-4 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
              darkMode 
                ? "bg-gray-800 border-gray-700 text-white" 
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            <option value="all">All Faculties</option>
            {faculties.map((faculty, index) => (
              <option key={index} value={faculty}>{faculty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Table */}
      <div className={`rounded-3xl shadow-2xl overflow-hidden border ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={`font-semibold ${
              darkMode 
                ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white" 
                : "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-900"
            }`}>
              <tr>
                <th className="p-6 text-left">#</th>
                <th className="p-6 text-left">{t.name}</th>
                <th className="p-6 text-left">{t.code}</th>
                <th className="p-6 text-left">{t.faculty}</th>
                <th className="p-6 text-left">{t.totalEmployees}</th>
                <th className="p-6 text-left">{t.head}</th>
                <th className="p-6 text-left">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((d, index) => (
                  <motion.tr 
                    key={d._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b transition-all duration-300 ${
                      darkMode 
                        ? "hover:bg-gray-750 border-gray-700" 
                        : "hover:bg-purple-50/50 border-gray-100"
                    }`}
                  >
                    <td className="p-6 font-medium">{index + 1}</td>
                    <td className="p-6">
                      <div className="font-semibold">{d.name}</div>
                      {d.description && (
                        <div className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {d.description.length > 50 ? `${d.description.substring(0, 50)}...` : d.description}
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode 
                          ? "bg-gray-700 text-gray-300" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {d.code}
                      </span>
                    </td>
                    <td className="p-6">{d.faculty}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <FaUsers className={`${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                        <span className="font-semibold">{getTotalEmployees(d._id)}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <FaUserTie className={`${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                        <span>{d.head}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleView(d)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                        >
                          <FaEye />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditOpen(d)}
                          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(d)}
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-md flex items-center gap-2 transition-all duration-300"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className={`text-6xl mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`}>🏢</div>
                    <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{t.noDepartments}</p>
                    <p className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                      {searchTerm ? "Try a different search term" : "Create your first department"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* View Modal */}
        {isViewOpen && selectedDept && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-white">{t.departmentDetails}</h2>
                <button 
                  onClick={() => setIsViewOpen(false)}
                  className="text-gray-500 hover:text-red-500 text-3xl transition-colors duration-300"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.name}</label>
                    <p className="text-lg font-semibold">{selectedDept.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.code}</label>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{selectedDept.code}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.faculty}</label>
                    <p className="text-lg font-semibold">{selectedDept.faculty}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.head}</label>
                    <p className="text-lg font-semibold">{selectedDept.head}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.totalEmployees}</label>
                    <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {getTotalEmployees(selectedDept._id)} employees
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedDept.description && (
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">{t.description}</label>
                  <div className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-700"
                  }`}>
                    {selectedDept.description}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    setIsViewOpen(false);
                    handleEditOpen(selectedDept);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {t.edit}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit/Create Modal */}
        {(isEditOpen || isCreateOpen) && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-white">
                  {isEditOpen ? t.editDepartment : t.createDepartment}
                </h2>
                <button 
                  onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }}
                  className="text-gray-500 hover:text-red-500 text-3xl transition-colors duration-300"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.name} *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter department name"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.code} *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.code ? 'border-red-500' : ''}`}
                      placeholder="e.g., CS, EE, ME"
                    />
                    {formErrors.code && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.code}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.faculty} *</label>
                    <input
                      type="text"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.faculty ? 'border-red-500' : ''}`}
                      placeholder="Enter faculty name"
                    />
                    {formErrors.faculty && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.faculty}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.head} *</label>
                    <input
                      type="text"
                      name="head"
                      value={formData.head}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      } ${formErrors.head ? 'border-red-500' : ''}`}
                      placeholder="Enter department head name"
                    />
                    {formErrors.head && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.head}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">{t.description}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700 text-white" 
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                      placeholder="Enter department description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      darkMode 
                        ? "bg-gray-800 hover:bg-gray-700 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    {isEditOpen ? t.update : t.createButton}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && deptToDelete && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-3xl shadow-2xl p-8 w-full max-w-md ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <FaTrash className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.confirmDelete}</h3>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Department: <span className="font-semibold">{deptToDelete.name}</span>
                  <br />
                  Code: <span className="font-semibold">{deptToDelete.code}</span>
                </p>
                <p className={`mt-4 ${darkMode ? "text-red-400" : "text-red-500"}`}>
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDepartments;