import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreateEmployeeForm = () => {
  const [departments, setDepartments] = useState([]);
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
    role: "employee",
    photo: null, // ✅ ensure this is included in initial state
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/departments");

        const deptArray = data.departments || data;
        setDepartments(deptArray);

        if (deptArray.length > 0 && !formData.department) {
          setFormData((prev) => ({
            ...prev,
            department: deptArray[0]._id || deptArray[0].id,
          }));
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle file change properly
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // ✅ use correct endpoint and headers
      await axiosInstance.post("/admin/employees", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee account created successfully!");
      navigate("/admin/manage-employees");
    } catch (err) {
      console.error("Error creating employee:", err);
      alert(err.response?.data?.message || "Failed to create employee. Check required fields.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-xl w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
        encType="multipart/form-data" // ✅ important for file uploads
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-6 col-span-2 text-center">
          Create Employee Account
        </h2>

        {/* All your existing input fields remain unchanged */}
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          placeholder="Middle Name"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          placeholder="Employee ID"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />

        {/* Department Dropdown */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Department</option>
          {departments.length > 0 ? (
            departments.map((dept) => {
              const id = dept._id || dept.id;
              const name = dept.name || dept.departmentName;
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })
          ) : (
            <option disabled>Loading departments...</option>
          )}
        </select>

        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="typeOfPosition"
          value={formData.typeOfPosition}
          onChange={handleChange}
          placeholder="Type of Position"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="termOfEmployment"
          value={formData.termOfEmployment}
          onChange={handleChange}
          placeholder="Term of Employment"
          required
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Contact Person"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contactPersonAddress"
          value={formData.contactPersonAddress}
          onChange={handleChange}
          placeholder="Contact Person Address"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="employeeStatus"
          value={formData.employeeStatus}
          onChange={handleChange}
          placeholder="Employee Status"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ Photo upload field */}
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="employee">Employee</option>
          <option value="departmentHead">Department Head</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-2 mt-4"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
