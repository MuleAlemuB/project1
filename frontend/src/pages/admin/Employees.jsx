import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/axios';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/admin/employees');
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{emp.firstName} {emp.lastName}</td>
                <td className="border px-4 py-2">{emp.email}</td>
                <td className="border px-4 py-2">{emp.department?.name || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
