import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/employees/${id}`);
        setEmployee(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch employee data");
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!employee) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Details</h2>

        {/* Employee Photo */}
        <div className="flex justify-center mb-6">
          {employee.photo ? (
            <img
              src={`http://localhost:5000/${employee.photo}`} // adjust server URL if needed
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-32 h-32 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>First Name:</strong> {employee.firstName}</p>
          <p><strong>Middle Name:</strong> {employee.middleName || "-"}</p>
          <p><strong>Last Name:</strong> {employee.lastName}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Employee ID:</strong> {employee.empId}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Sex:</strong> {employee.sex}</p>
          <p><strong>Position:</strong> {employee.typeOfPosition}</p>
          <p><strong>Term of Employment:</strong> {employee.termOfEmployment}</p>
          <p><strong>Phone Number:</strong> {employee.phoneNumber || "-"}</p>
          <p><strong>Contact Person:</strong> {employee.contactPerson || "-"}</p>
          <p><strong>Contact Address:</strong> {employee.contactPersonAddress || "-"}</p>
          <p><strong>Employee Status:</strong> {employee.employeeStatus || "-"}</p>
          <p><strong>Salary:</strong> {employee.salary || "-"}</p>
          <p><strong>Experience:</strong> {employee.experience || "-"}</p>
          <p><strong>Role:</strong> {employee.role}</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewEmployee;
