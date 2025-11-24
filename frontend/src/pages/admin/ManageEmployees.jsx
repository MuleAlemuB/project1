import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
  FaVenusMars,
  FaHeart,
  FaBriefcase,
  FaCalendarCheck,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaSchool,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";

const ManageEmployee = () => {
  const { darkMode, setDarkMode } = useSettings();
  const { user, token } = useAuth(); // ✅ Get user and token from AuthContext

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

  // persist dark mode
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) {
      setDarkMode(storedMode === "true");
    }
  }, [setDarkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/admin/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
      if (!formData.department && res.data.length > 0) {
        setFormData((prev) => ({ ...prev, department: res.data[0]._id }));
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  // fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [token]);

  // handle input change
  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "photo" && formData.photo) {
          data.append("photo", formData.photo);
        } else if (formData[key] !== "" && (key !== "password" || !editingId)) {
          data.append(key, formData[key]);
        }
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axiosInstance.put(`/employees/${editingId}`, data, config);
        setEditingId(null);
      } else {
        await axiosInstance.post("/employees", data, config);
      }

      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("Error adding/updating employee:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save employee.");
    }
  };

  // reset form
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
    setPhotoPreview(null);
    setShowForm(false);
    setEditingId(null);
  };

  // handle edit
  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setShowForm(true);

    const deptId = employee.department?._id || (departments[0]?._id || "");
    setFormData({
      firstName: employee.firstName || "",
      middleName: employee.middleName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      empId: employee.empId || "",
      password: "",
      department: deptId,
      sex: employee.sex || "",
      typeOfPosition: employee.typeOfPosition || "",
      termOfEmployment: employee.termOfEmployment || "",
      phoneNumber: employee.phoneNumber || "",
      contactPerson: employee.contactPerson || "",
      contactPersonAddress: employee.contactPersonAddress || "",
      employeeStatus: employee.employeeStatus || "",
      salary: employee.salary || "",
      experience: employee.experience || "",
      qualification: employee.qualification || "",
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : "",
      address: employee.address || "",
      maritalStatus: employee.maritalStatus || "",
      photo: null,
      role: employee.role || "employee",
    });
    setPhotoPreview(employee.photo ? `http://localhost:5000${employee.photo}` : null);
  };

  const handleResetPassword = async () => {
    if (!window.confirm("Reset this employee's password?")) return;
    try {
      await axiosInstance.put(`/employees/reset-password/${editingId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password reset successfully.");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axiosInstance.delete(`/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (employee) => setViewEmployee(employee);

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.middleName} ${emp.lastName}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return emp.empId.toLowerCase().includes(term) || fullName.includes(term);
  });

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      } min-h-screen p-6`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-900 dark:text-white mb-3 md:mb-0">
          Manage Employees
        </h2>
        <button
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:scale-105"
        >
          Add Employee / Create Account
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${
            darkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white border-purple-200"
          } p-6 rounded-3xl shadow-2xl mb-8 border`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-purple-700 dark:text-white">
              {editingId ? "Edit Employee" : "Add Employee"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-xl shadow transition"
            >
              Close ✖
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "firstName",
              "middleName",
              "lastName",
              "email",
              "empId",
              "password",
              "typeOfPosition",
              "termOfEmployment",
              "phoneNumber",
              "contactPerson",
              "contactPersonAddress",
              "employeeStatus",
              "salary",
              "experience",
              "qualification",
              "address",
            ].map(
              (name, i) =>
                (name !== "password" || !editingId) && (
                  <input
                    key={i}
                    type={
                      name === "email"
                        ? "email"
                        : name === "salary"
                        ? "number"
                        : name === "password"
                        ? "password"
                        : "text"
                    }
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={
                      name.charAt(0).toUpperCase() +
                      name.slice(1).replace(/([A-Z])/g, " $1")
                    }
                    className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
                    }`}
                    required={["firstName", "lastName", "email", "empId"].includes(name)}
                  />
                )
            )}

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
            >
              <option value="">Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
              required
            >
              <option value="admin">Admin</option>
              <option value="departmenthead">Department Head</option>
              <option value="employee">Employee</option>
            </select>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
            />

            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
              }`}
            />
          </div>

          {photoPreview && (
            <div className="mb-2 mt-4 flex flex-col items-center">
              <p className="font-semibold text-purple-700 dark:text-white mb-1">
                Photo Preview:
              </p>
              <img
                src={photoPreview}
                alt="Preview"
                className="w-28 h-28 rounded-full border object-cover"
              />
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow-md transition"
              >
                Reset Password
              </button>
            )}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl shadow-md transition"
            >
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search by Employee ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
          }`}
        />
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-purple-200 dark:border-gray-700">
        <table className="min-w-full border-collapse">
          <thead className="bg-purple-100 dark:bg-gray-700 text-purple-900 dark:text-white font-semibold">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Emp ID</th>
              <th className="p-3">Department</th>
              <th className="p-3">Marital Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b hover:shadow-lg transition transform hover:scale-[1.01]"
                >
                  <td className="p-3">
                    <img
                      src={
  emp.photo
    ? `http://localhost:5000${emp.photo}`
    : "/fallback-avatar.png"
}

                      alt="Employee"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3">
                    {emp.firstName} {emp.middleName} {emp.lastName}
                  </td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.empId}</td>
                  <td className="p-3">{emp.department?.name || "-"}</td>
                  <td className="p-3">{emp.maritalStatus || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleView(emp)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewEmployee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            className={`${
              darkMode ? "bg-gray-900 text-white" : "bg-white"
            } rounded-3xl p-6 w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl overflow-y-auto max-h-[90vh]`}
          >
            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  viewEmployee.photo
                    ? `http://localhost:5000${viewEmployee.photo}`
                    : "/fallback-avatar.png"
                }
                alt="Employee"
                className="w-32 h-32 rounded-full border-4 border-purple-400 object-cover mb-3"
              />
              <h3 className="text-2xl font-bold text-purple-700 dark:text-white">
                {viewEmployee.firstName} {viewEmployee.middleName}{" "}
                {viewEmployee.lastName}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                {viewEmployee.role?.toUpperCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <strong>Email:</strong> {viewEmployee.email}
              </p>
              <p>
                <strong>Employee ID:</strong> {viewEmployee.empId}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {viewEmployee.department?.name || "-"}
              </p>
              <p>
                <strong>Sex:</strong> {viewEmployee.sex || "-"}
              </p>
              <p>
                <strong>Marital Status:</strong>{" "}
                {viewEmployee.maritalStatus || "-"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {viewEmployee.dateOfBirth
                  ? new Date(viewEmployee.dateOfBirth).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>Type of Position:</strong>{" "}
                {viewEmployee.typeOfPosition || "-"}
              </p>
              <p>
                <strong>Term of Employment:</strong>{" "}
                {viewEmployee.termOfEmployment || "-"}
              </p>
              <p>
                <strong>Employee Status:</strong>{" "}
                {viewEmployee.employeeStatus || "-"}
              </p>
              <p>
                <strong>Qualification:</strong>{" "}
                {viewEmployee.qualification || "-"}
              </p>
              <p>
                <strong>Experience:</strong>{" "}
                {viewEmployee.experience || "-"}
              </p>
              <p>
                <strong>Salary:</strong>{" "}
                {viewEmployee.salary ? `${viewEmployee.salary} Birr` : "-"}
              </p>
              <p>
                <strong>Phone:</strong> {viewEmployee.phoneNumber || "-"}
              </p>
              <p>
                <strong>Address:</strong> {viewEmployee.address || "-"}
              </p>
              <p>
                <strong>Contact Person:</strong>{" "}
                {viewEmployee.contactPerson || "-"}
              </p>
              <p>
                <strong>Contact Address:</strong>{" "}
                {viewEmployee.contactPersonAddress || "-"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewEmployee(null)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl shadow-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ManageEmployee;
