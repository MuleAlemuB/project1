import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api/axios"; // axios instance with token

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading)
    return <p className="p-6 text-gray-700 dark:text-gray-300">Loading employees...</p>;

  if (error)
    return <p className="p-6 text-red-600 dark:text-red-400">{error}</p>;

  if (employees.length === 0)
    return <p className="p-6 text-gray-700 dark:text-gray-300">No employees found.</p>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Employee List
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-600 rounded-lg shadow-sm">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              {/* ✅ Added photo column */}
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Photo</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Name</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Email</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {/* ✅ Added photo cell */}
                <td className="px-4 py-2">
                  <img
                    src={
                      emp.photo
                        ? `http://localhost:5000/${emp.photo.replace(/\\/g, "/")}`
                        : "/default-avatar.png"
                    }
                    alt={emp.firstName}
                    className="w-12 h-12 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-2">{emp.firstName} {emp.lastName}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.department?.name || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
