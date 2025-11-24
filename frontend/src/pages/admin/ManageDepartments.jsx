// src/pages/admin/ManageDepartments.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";

const translations = {
  en: {
    title: "Manage Departments",
    create: "Create Department",
    search: "Search by Name or Faculty",
    actions: "Actions",
    name: "Name",
    faculty: "Faculty",
    totalEmployees: "Total Employees",
    head: "Head",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    noDepartments: "No departments found",
    confirmDelete: "Are you sure?",
    update: "Update",
    createButton: "Create",
    departmentDetails: "Department Details",
    editDepartment: "Edit Department",
    createDepartment: "Create Department",
  },
  am: {
    title: "የክፍል አስተዳደር",
    create: "አዲስ ክፍል ፍጠር",
    search: "በስም ወይም ፋከልቲ ፈልግ",
    actions: "እርምጃዎች",
    name: "ስም",
    faculty: "ፋከልቲ",
    totalEmployees: "አጠቃላይ ሰራተኞች",
    head: "አለቃ",
    view: "እይ",
    edit: "አስተካክል",
    delete: "አጥፋ",
    noDepartments: "ምንም ክፍሎች አልተገኙም",
    confirmDelete: "እርግጠኛ ነህ?",
    update: "አስተካክል",
    createButton: "ፍጠር",
    departmentDetails: "የክፍል ዝርዝር",
    editDepartment: "ክፍል አስተካክል",
    createDepartment: "አዲስ ክፍል ፍጠር",
  },
};

const ManageDepartments = () => {
  const { darkMode, language } = useSettings();
  const t = translations[language];

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", faculty: "", head: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch departments and employees
  const fetchData = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        axiosInstance.get("/admin/departments"),
        axiosInstance.get("/employees"),
      ]);
      setDepartments(deptRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTotalEmployees = (dept) =>
    employees.filter((emp) => emp.department?._id === dept._id).length;

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await axiosInstance.delete(`/admin/departments/${id}`);
      setDepartments(departments.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleView = (dept) => {
    setSelectedDept(dept);
    setIsViewOpen(true);
  };

  const handleEditOpen = (dept) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name, faculty: dept.faculty, head: dept.head });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/admin/departments/${selectedDept._id}`, formData);
      setDepartments(departments.map((d) => (d._id === res.data._id ? res.data : d)));
      setIsEditOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  const handleCreateOpen = () => {
    setFormData({ name: "", faculty: "", head: "" });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/admin/departments", formData);
      setDepartments([...departments, res.data]);
      setIsCreateOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredDepartments = departments.filter((d) => {
    const term = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(term) || d.faculty.toLowerCase().includes(term);
  });

  if (error)
    return (
      <p className={`p-6 ${darkMode ? "text-red-400" : "text-red-500"} font-semibold`}>
        {error}
      </p>
    );

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-900 dark:text-white mb-3 md:mb-0">{t.title}</h1>
        <button
          onClick={handleCreateOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition transform hover:scale-105"
        >
          <FaPlus /> {t.create}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`}
        />
      </div>

      {/* Department Table */}
      <div className={`overflow-x-auto rounded-3xl shadow-2xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-purple-200 bg-white"}`}>
        <table className="min-w-full border-collapse">
          <thead className={`font-semibold ${darkMode ? "bg-gray-700 text-white" : "bg-purple-100 text-purple-900"}`}>
            <tr>
              <th className="p-3 text-left">{t.name}</th>
              <th className="p-3 text-left">{t.faculty}</th>
              <th className="p-3 text-left">{t.totalEmployees}</th>
              <th className="p-3 text-left">{t.head}</th>
              <th className="p-3 text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((d) => (
                <tr key={d._id} className={`border-b transition transform hover:scale-[1.01] ${darkMode ? "hover:bg-gray-700" : "hover:shadow-lg"}`}>
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.faculty}</td>
                  <td className="p-3">{getTotalEmployees(d)}</td>
                  <td className="p-3">{d.head}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleView(d)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 transition"><FaEye /> {t.view}</button>
                    <button onClick={() => handleEditOpen(d)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 transition"><FaEdit /> {t.edit}</button>
                    <button onClick={() => handleDelete(d._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow flex items-center gap-1 transition"><FaTrash /> {t.delete}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={`text-center p-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{t.noDepartments}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View/Edit/Create Modals */}
      {(isViewOpen || isEditOpen || isCreateOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`rounded-3xl shadow-2xl p-6 w-80 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            {isViewOpen && selectedDept ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-700 dark:text-white">{t.departmentDetails}</h2>
                  <button onClick={() => setIsViewOpen(false)} className="text-red-600 text-2xl font-bold">&times;</button>
                </div>
                <div className="space-y-2">
                  <p><strong>{t.name}:</strong> {selectedDept.name}</p>
                  <p><strong>{t.faculty}:</strong> {selectedDept.faculty}</p>
                  <p><strong>{t.totalEmployees}:</strong> {getTotalEmployees(selectedDept)}</p>
                  <p><strong>{t.head}:</strong> {selectedDept.head}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-purple-700 dark:text-white">
                    {isEditOpen ? t.editDepartment : t.createDepartment}
                  </h2>
                  <button onClick={() => { setIsEditOpen(false); setIsCreateOpen(false); }} className="text-red-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={isEditOpen ? handleEditSubmit : handleCreateSubmit} className="space-y-3">
                  <input type="text" name="name" placeholder={t.name} value={formData.name} onChange={handleChange} required className={`border p-2 rounded w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`} />
                  <input type="text" name="faculty" placeholder={t.faculty} value={formData.faculty} onChange={handleChange} required className={`border p-2 rounded w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`} />
                  <input type="text" name="head" placeholder={t.head} value={formData.head} onChange={handleChange} required className={`border p-2 rounded w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"}`} />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl w-full shadow-md transition transform hover:scale-105">
                    {isEditOpen ? t.update : t.createButton}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;
