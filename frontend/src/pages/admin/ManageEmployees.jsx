import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaIdCard,
  FaKey, FaEnvelope, FaPhone, FaBuilding, FaVenusMars,
  FaRing, FaBriefcase, FaCalendarAlt, FaGraduationCap,
  FaDollarSign, FaMapMarkerAlt, FaShieldAlt, FaSync,
  FaTimes, FaCheck, FaUserTie, FaLock, FaUserCircle
} from "react-icons/fa";
import { IoMdPerson, IoIosBusiness } from "react-icons/io";
import { MdWork, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const ManageEmployee = () => {
  const { darkMode, setDarkMode } = useSettings();
  const { user, token } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    empId: "",
    password: "",
    department: "",
    sex: "",
    typeOfPosition: "",
    termOfEmployment: "",
    phoneNumber: "",
    contactPerson: "",
    contactPersonAddress: "",
    employeeStatus: "",
    salary: "",
    experience: "",
    qualification: "",
    dateOfBirth: "",
    address: "",
    maritalStatus: "",
    photo: null,
    role: "employee",
  });
  const [editingId, setEditingId] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState({
    empId: "",
    password: ""
  });
  const [usedEmpIds, setUsedEmpIds] = useState(new Set());
  const [sessionPasswords, setSessionPasswords] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // persist dark mode
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) setDarkMode(storedMode === "true");
  }, [setDarkMode]);

  useEffect(() => localStorage.setItem("darkMode", darkMode), [darkMode]);

  // fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/admin/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
      if (!formData.department && res.data.length > 0)
        setFormData((prev) => ({ ...prev, department: res.data[0]._id }));
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // fetch employees and track used IDs
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      
      // Extract all used Employee IDs only
      const empIds = new Set();
      res.data.forEach(emp => {
        if (emp.empId) empIds.add(emp.empId);
      });
      
      setUsedEmpIds(empIds);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [token]);

  // Generate 6-digit password (only check against session passwords)
  const generateUniquePassword = () => {
    let password;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      // Generate 6-digit password
      password = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
      
      // If we can't find a unique password after many attempts, add timestamp
      if (attempts >= maxAttempts) {
        const timestamp = Date.now().toString().slice(-4);
        password = Math.floor(10 + Math.random() * 90).toString() + timestamp;
        while (password.length < 6) {
          password = "0" + password;
        }
        password = password.slice(0, 6);
      }
    } while (sessionPasswords.has(password) && attempts < maxAttempts * 2);
    
    // Add to session passwords set (current session only)
    setSessionPasswords(prev => new Set([...prev, password]));
    setGeneratedCredentials(prev => ({ ...prev, password }));
    return password;
  };

  // Generate UNIQUE Employee ID
  const generateUniqueEmpId = () => {
    let empId;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      // Generate ID with prefix and 4 digits
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      empId = `DTU${randomNum}`;
      attempts++;
      
      // If can't find unique ID, try different pattern
      if (attempts >= maxAttempts) {
        const timestamp = Date.now().toString().slice(-4);
        empId = `EMP${timestamp}`;
      }
    } while (usedEmpIds.has(empId) && attempts < maxAttempts * 2);
    
    // Add to used IDs set
    setUsedEmpIds(prev => new Set([...prev, empId]));
    setGeneratedCredentials(prev => ({ ...prev, empId }));
    return empId;
  };

  // Generate credentials for editing form too
  const generateCredentialsForEdit = () => {
    const newEmpId = generateUniqueEmpId();
    const newPassword = generateUniquePassword();
    setFormData(prev => ({ ...prev, empId: newEmpId }));
    setSuccessMessage(`New credentials generated! ID: ${newEmpId}, Password: ${newPassword}`);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Validate if Employee ID is unique
  const isEmpIdUnique = (id) => {
    if (!id) return true;
    
    // Check against existing employees (excluding current editing employee)
    const existingEmployees = employees.filter(emp => 
      editingId ? emp._id !== editingId : true
    );
    
    return !existingEmployees.some(emp => emp.empId === id);
  };

  // Validate if password is valid (6 digits)
  const isValidPassword = (password) => {
    return /^\d{6}$/.test(password);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else setPhotoPreview(null);
      return;
    }

    // Validation
    if (["firstName", "middleName", "lastName", "contactPerson"].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }
    
    if (name === "phoneNumber" && !/^\d{0,10}$/.test(value)) return;
    
    if (["salary", "experience"].includes(name) && !/^\d*$/.test(value)) return;
    
    // Password validation (must be 6 digits)
    if (name === "password" && value !== "" && !/^\d{0,6}$/.test(value)) return;
    
    // Employee ID validation (check uniqueness if editing)
    if (name === "empId" && editingId) {
      if (!isEmpIdUnique(value)) {
        alert(`Employee ID "${value}" is already in use. Please use a different ID.`);
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      empId: "",
      password: "",
      department: departments.length > 0 ? departments[0]._id : "",
      sex: "",
      typeOfPosition: "",
      termOfEmployment: "",
      phoneNumber: "",
      contactPerson: "",
      contactPersonAddress: "",
      employeeStatus: "",
      salary: "",
      experience: "",
      qualification: "",
      dateOfBirth: "",
      address: "",
      maritalStatus: "",
      photo: null,
      role: "employee",
    });
    setGeneratedCredentials({
      empId: "",
      password: ""
    });
    setPhotoPreview(null);
    setShowForm(false);
    setEditingId(null);
    setSuccessMessage("");
    setShowPassword(false);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setIsLoading(false);
      return alert("Phone number must be exactly 10 digits.");
    }

    // For new employees, validate password is 6 digits
    if (!editingId && !isValidPassword(formData.password)) {
      setIsLoading(false);
      return alert("Password must be exactly 6 digits.");
    }
    
    // Check against session passwords only (passwords generated in current session)
    if (!editingId && sessionPasswords.has(formData.password)) {
      setIsLoading(false);
      return alert("This password was recently generated. Please generate a new one or use a different password.");
    }

    // Check if Employee ID is unique
    if (!isEmpIdUnique(formData.empId)) {
      setIsLoading(false);
      return alert(`Employee ID "${formData.empId}" is already in use. Please use a different ID.`);
    }

    // Prepare data for submission
    const submitData = { ...formData };

    if (!editingId) {
      // Ensure empId and password are set and unique
      if (!submitData.empId) {
        submitData.empId = generateUniqueEmpId();
      }
      if (!submitData.password || !isValidPassword(submitData.password)) {
        submitData.password = generateUniquePassword();
      }
      
      // Add to session passwords
      setSessionPasswords(prev => new Set([...prev, submitData.password]));
    }

    try {
      const data = new FormData();
      Object.keys(submitData).forEach((key) => {
        if (key === "photo" && submitData.photo) data.append("photo", submitData.photo);
        else if (submitData[key] !== "" && (key !== "password" || !editingId))
          data.append(key, submitData[key]);
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      };

      if (editingId) {
        await axiosInstance.put(`/employees/${editingId}`, data, config);
        setSuccessMessage("Employee updated successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        await axiosInstance.post("/employees", data, config);
        
        // Update used IDs set
        setUsedEmpIds(prev => new Set([...prev, submitData.empId]));
        
        // Show credentials to user after successful creation
        setSuccessMessage(`Employee created successfully! Employee ID: ${submitData.empId}, Password: ${submitData.password}`);
      }

      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("Error adding/updating employee:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setShowForm(true);
    setFormData({
      firstName: emp.firstName || "",
      middleName: emp.middleName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      empId: emp.empId || "",
      password: "",
      department: emp.department?._id || (departments[0]?._id || ""),
      sex: emp.sex || "",
      typeOfPosition: emp.typeOfPosition || "",
      termOfEmployment: emp.termOfEmployment || "",
      phoneNumber: emp.phoneNumber || "",
      contactPerson: emp.contactPerson || "",
      contactPersonAddress: emp.contactPersonAddress || "",
      employeeStatus: emp.employeeStatus || "",
      salary: emp.salary || "",
      experience: emp.experience || "",
      qualification: emp.qualification || "",
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "",
      address: emp.address || "",
      maritalStatus: emp.maritalStatus || "",
      photo: null,
      role: emp.role || "employee",
    });
    setGeneratedCredentials({
      empId: "",
      password: ""
    });
    setPhotoPreview(emp.photo ? `http://localhost:5000${emp.photo}` : null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchEmployees();
      setSuccessMessage("Employee deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) { 
      console.error(err);
      alert("Failed to delete employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm("Reset this employee's password to a new 6-digit code?")) return;
    try {
      setIsLoading(true);
      const newPassword = generateUniquePassword();
      await axiosInstance.put(`/employees/reset-password/${editingId}`, 
        { newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add to session passwords
      setSessionPasswords(prev => new Set([...prev, newPassword]));
      
      setSuccessMessage(`Password reset successfully! New password: ${newPassword}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (emp) => setViewEmployee(emp);
  
  const handleAddNew = () => { 
    resetForm(); 
    setShowForm(true);
    
    // Auto-generate unique credentials for new employees
    setTimeout(() => {
      const empId = generateUniqueEmpId();
      const password = generateUniquePassword();
      setFormData(prev => ({ 
        ...prev, 
        empId: empId,
        password: password,
        department: departments.length > 0 ? departments[0]._id : "" 
      }));
    }, 100);
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.middleName} ${emp.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    
    if (activeTab === "active") return (emp.employeeStatus === "Active" || !emp.employeeStatus) && 
      (emp.empId.toLowerCase().includes(term) || fullName.includes(term));
    if (activeTab === "inactive") return emp.employeeStatus === "Inactive" && 
      (emp.empId.toLowerCase().includes(term) || fullName.includes(term));
    
    return emp.empId.toLowerCase().includes(term) || fullName.includes(term);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inactive": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "departmenthead": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"} min-h-screen p-4 md:p-6`}>
      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FaCheck />
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage("")} className="ml-4">
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Employee Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage employee accounts, roles, and information in your organization
            </p>
          </div>
          <button 
            onClick={handleAddNew} 
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
          >
            <FaUserPlus />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{employees.length}</p>
              </div>
              <IoMdPerson className="text-3xl text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {employees.filter(e => e.employeeStatus === "Active" || !e.employeeStatus).length}
                </p>
              </div>
              <FaCheck className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Departments</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{departments.length}</p>
              </div>
              <IoIosBusiness className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Inactive</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {employees.filter(e => e.employeeStatus === "Inactive").length}
                </p>
              </div>
              <FaTimes className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
            {/* Form Header */}
            <div className={`px-6 py-4 ${darkMode ? "bg-gray-900" : "bg-gradient-to-r from-purple-50 to-blue-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${editingId ? "bg-yellow-100 dark:bg-yellow-900" : "bg-purple-100 dark:bg-purple-900"}`}>
                    {editingId ? <FaEdit className="text-yellow-600 dark:text-yellow-400" /> : <FaUserPlus className="text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {editingId ? "Edit Employee" : "Add New Employee"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {editingId ? "Update employee information" : "Create new employee account"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FaTimes className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information Section */}
                <div className="lg:col-span-3">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <IoMdPerson className="mr-2 text-purple-500" />
                    Personal Information
                  </h4>
                </div>

                {["firstName", "middleName", "lastName"].map((name, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")} *
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      required={["firstName", "lastName"].includes(name)}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MdEmail className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MdPhone className="inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                    placeholder="10-digit number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaCalendarAlt className="inline mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                {/* Credentials Section */}
                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <FaLock className="mr-2 text-blue-500" />
                    Account Credentials
                  </h4>
                </div>

                {/* Employee ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaIdCard className="inline mr-1" />
                    Employee ID *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="empId"
                      value={editingId ? formData.empId : generatedCredentials.empId || formData.empId}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : editingId
                          ? "bg-white border-gray-300"
                          : "bg-gray-50 border-gray-300"
                      } ${!isEmpIdUnique(formData.empId) && editingId ? "border-red-500" : ""}`}
                      readOnly={!editingId}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newId = generateUniqueEmpId();
                        setFormData(prev => ({ ...prev, empId: newId }));
                      }}
                      className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center"
                      title="Generate new unique ID"
                    >
                      <FaSync />
                    </button>
                  </div>
                  {editingId && !isEmpIdUnique(formData.empId) && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <FaTimes className="mr-1" /> This ID is already in use!
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaKey className="inline mr-1" />
                    Password {!editingId && "*"}
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={editingId ? "••••••" : generatedCredentials.password || formData.password}
                        onChange={handleChange}
                        maxLength="6"
                        className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : editingId
                            ? "bg-white border-gray-300"
                            : "bg-gray-50 border-gray-300"
                        } ${!editingId && formData.password && !isValidPassword(formData.password) ? "border-red-500" : ""}`}
                        readOnly={!editingId}
                        required={!editingId}
                        placeholder="6-digit password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEye /> : <FaLock />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPwd = generateUniquePassword();
                        setFormData(prev => ({ ...prev, password: newPwd }));
                      }}
                      className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center"
                      title="Generate new 6-digit password"
                    >
                      <FaSync />
                    </button>
                  </div>
                  {!editingId && formData.password && !isValidPassword(formData.password) && (
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <FaTimes className="mr-1" /> Password must be exactly 6 digits!
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaShieldAlt className="inline mr-1" />
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="departmenthead">Department Head</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {/* Employment Information Section */}
                <div className="lg:col-span-3 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <MdWork className="mr-2 text-green-500" />
                    Employment Information
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaBuilding className="inline mr-1" />
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaVenusMars className="inline mr-1" />
                    Sex
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaRing className="inline mr-1" />
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaBriefcase className="inline mr-1" />
                    Position Type
                  </label>
                  <select
                    name="typeOfPosition"
                    value={formData.typeOfPosition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Type of Position</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Employment Term
                  </label>
                  <select
                    name="termOfEmployment"
                    value={formData.termOfEmployment}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Term of Employment</option>
                    <option value="FullTime">Full Time</option>
                    <option value="PartTime">Part Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="employeeStatus"
                    value={formData.employeeStatus}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="">Employee Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Photo Upload */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-800 overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                            <FaUserCircle className="text-5xl text-purple-300 dark:text-purple-700" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                        className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Upload a professional headshot (JPG, PNG, max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                  <p className="flex items-center">
                    <FaKey className="mr-2" /> Password must be 6 digits
                  </p>
                  <p className="flex items-center">
                    <FaIdCard className="mr-2" /> Employee ID is unique and auto-generated
                  </p>
                </div>
                <div className="flex space-x-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition flex items-center space-x-2"
                    >
                      <FaKey />
                      <span>Reset Password</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : editingId ? (
                      <>
                        <FaEdit />
                        <span>Update Employee</span>
                      </>
                    ) : (
                      <>
                        <FaUserPlus />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Employee Directory</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              {/* Status Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                {["all", "active", "inactive"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-white shadow"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800"
                            src={
                              emp.photo
                                ? `http://localhost:5000${emp.photo}`
                                : "/fallback-avatar.png"
                            }
                            alt={emp.firstName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {emp.firstName} {emp.middleName} {emp.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(emp.role)}`}>
                              {emp.role === "departmenthead" ? "Dept. Head" : emp.role}
                            </span>
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                            <FaIdCard className="inline mr-1" /> {emp.empId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{emp.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <FaPhone className="inline mr-1" /> {emp.phoneNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {emp.department?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {emp.typeOfPosition || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(emp.employeeStatus)}`}>
                        {emp.employeeStatus || "Active"}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {emp.maritalStatus || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(emp)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <FaUserCircle className="mx-auto h-12 w-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm">
                        {searchTerm ? "Try a different search term" : "Add your first employee"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={() => setViewEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                darkMode ? "bg-gray-900" : "bg-white"
              } rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-purple-50 to-blue-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <FaUserTie className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Employee Details
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete profile information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewEmployee(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column - Profile */}
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={
                            viewEmployee.photo
                              ? `http://localhost:5000${viewEmployee.photo}`
                              : "/fallback-avatar.png"
                          }
                          alt="Employee"
                          className="w-48 h-48 rounded-full border-4 border-purple-200 dark:border-purple-800 object-cover mx-auto"
                        />
                        <div className="absolute bottom-4 right-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewEmployee.employeeStatus)}`}>
                            {viewEmployee.employeeStatus || "Active"}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
                        {viewEmployee.firstName} {viewEmployee.middleName} {viewEmployee.lastName}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(viewEmployee.role)}`}>
                          {viewEmployee.role === "departmenthead" ? "Department Head" : viewEmployee.role}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <FaIdCard className="mr-1" /> {viewEmployee.empId}
                        </span>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaEnvelope className="mr-3 text-purple-500" />
                        <span className="truncate">{viewEmployee.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaPhone className="mr-3 text-green-500" />
                        <span>{viewEmployee.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="mr-3 text-blue-500" />
                        <span>
                          {viewEmployee.dateOfBirth
                            ? new Date(viewEmployee.dateOfBirth).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FaBuilding className="mr-3 text-orange-500" />
                        <span>{viewEmployee.department?.name || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Personal Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          Personal Information
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                          <p className="font-medium">
                            {viewEmployee.firstName} {viewEmployee.middleName} {viewEmployee.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                          <p className="font-medium">{viewEmployee.sex || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Marital Status</p>
                          <p className="font-medium">{viewEmployee.maritalStatus || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                          <p className="font-medium">
                            {viewEmployee.dateOfBirth
                              ? new Date(viewEmployee.dateOfBirth).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Employment Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          Employment Details
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID</p>
                          <p className="font-medium font-mono">{viewEmployee.empId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Position Type</p>
                          <p className="font-medium">{viewEmployee.typeOfPosition || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Employment Term</p>
                          <p className="font-medium">{viewEmployee.termOfEmployment || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                          <p className="font-medium">{viewEmployee.experience ? `${viewEmployee.experience} years` : "N/A"}</p>
                        </div>
                      </div>

                      {/* Qualifications */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          Qualifications
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Qualification</p>
                          <p className="font-medium">{viewEmployee.qualification || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                          <p className="font-medium">
                            {viewEmployee.salary ? `${viewEmployee.salary} Birr` : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                          Contact Information
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                          <p className="font-medium">{viewEmployee.address || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact</p>
                          <p className="font-medium">{viewEmployee.contactPerson || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Address</p>
                          <p className="font-medium">{viewEmployee.contactPersonAddress || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setViewEmployee(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageEmployee;