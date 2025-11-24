import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useSettings } from "../../contexts/SettingsContext";

const EditEmployeeForm = () => {
  const { darkMode } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    empId: "",
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
    role: "employee",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axiosInstance.get(`/admin/employees/${id}`);
        setFormData(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch employee");
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/employees/${id}`, formData);
      alert("Employee updated successfully");
      navigate("/admin/manage-employees");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update employee");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-xl shadow
        ${darkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-gray-100 text-gray-900"}`}
    >
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="middleName"
        value={formData.middleName}
        onChange={handleChange}
        placeholder="Middle Name"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="empId"
        value={formData.empId}
        onChange={handleChange}
        placeholder="Employee ID"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="Department"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      >
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
        name="typeOfPosition"
        value={formData.typeOfPosition}
        onChange={handleChange}
        placeholder="Type of Position"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="termOfEmployment"
        value={formData.termOfEmployment}
        onChange={handleChange}
        placeholder="Term of Employment"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
        required
      />
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        name="contactPerson"
        value={formData.contactPerson}
        onChange={handleChange}
        placeholder="Contact Person"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        name="contactPersonAddress"
        value={formData.contactPersonAddress}
        onChange={handleChange}
        placeholder="Contact Person Address"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        name="employeeStatus"
        value={formData.employeeStatus}
        onChange={handleChange}
        placeholder="Employee Status"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        type="number"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="Salary"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <input
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        placeholder="Experience"
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
      >
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
        <option value="departmentHead">Department Head</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 md:mt-0"
      >
        Update
      </button>
    </form>
  );
};

export default EditEmployeeForm;
