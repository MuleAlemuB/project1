import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmployeeForm from './EmployeeForm'; // Reuse your form for adding/updating

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch employees');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.delete(`/admin/employees/${id}`);
      setMessage('Employee deleted successfully');
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete employee');
    }
  };

  // Handle edit click
  const handleEdit = (employee) => {
    setEditEmployee(employee);
  };

  // Handle successful add/update
  const handleSuccess = () => {
    setEditEmployee(null);
    fetchEmployees();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Employees</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* Employee Form (Add or Edit) */}
      <EmployeeForm
        editEmployee={editEmployee}
        onSuccess={handleSuccess}
      />

      {/* Employee Table */}
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="w-full border mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{emp.department}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(emp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
